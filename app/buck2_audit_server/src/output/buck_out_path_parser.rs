/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under both the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree and the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree.
 */

use std::iter::Peekable;

use anyhow::Context;
use buck2_build_api::bxl::types::BxlFunctionLabel;
use buck2_core::bxl::BxlFilePath;
use buck2_core::cells::cell_path::CellPath;
use buck2_core::cells::name::CellName;
use buck2_core::cells::paths::CellRelativePath;
use buck2_core::cells::CellResolver;
use buck2_core::fs::paths::file_name::FileName;
use buck2_core::fs::paths::forward_rel_path::ForwardRelativePath;
use buck2_core::fs::paths::forward_rel_path::ForwardRelativePathBuf;
use buck2_core::package::PackageLabel;
use buck2_core::target::label::label::TargetLabel;
use buck2_core::target::name::TargetNameRef;
use buck2_core::target::name::EQ_SIGN_SUBST;
use dupe::Dupe;
use itertools::Itertools;

#[derive(Debug, buck2_error::Error)]
enum BuckOutPathParserError {
    #[error(
        "Malformed buck-out path. Expected format: `buck-out/<isolation_prefix>/<gen|tmp|test|gen-anon|gen-bxl>/<cell_name>/<cfg_hash>/<target_path?>/__<target_name>__/<__action__id__?>/<outputs>`. Actual path was: `{0}`"
    )]
    MalformedOutputPath(String),
    #[error(
        "Path does not start with `buck-out`. This is probably a buck-out generated by buck1: `{0}`"
    )]
    MaybeBuck1Path(String),
}

/// The common attributes of each `buck-out` path type,
pub(crate) struct BuckOutPathTypeCommon {
    /// Configuration hash within the `buck-out` path.
    pub(crate) config_hash: String,
    /// The path starting from cell to the artifact, without the configuration hash. For example, in
    /// `buck-out/v2/gen/cell/<CONFIG_HASH>/path/to/__target_name__/target`, it would be `cell/path/to/__target_name__/target`.
    pub(crate) raw_path_to_output: ForwardRelativePathBuf,
}

/// The types of the `buck-out` path.
pub(crate) enum BuckOutPathType {
    BxlOutput {
        // `BxlFunctionLabel` contains the `CellPath` to the bxl function.
        bxl_function_label: BxlFunctionLabel,
        common_attrs: BuckOutPathTypeCommon,
    },
    AnonOutput {
        path: CellPath,
        target_label: TargetLabel,
        // Rule attr hash is part of anonymous target buck-outs.
        attr_hash: String,
        common_attrs: BuckOutPathTypeCommon,
    },
    RuleOutput {
        path: CellPath,
        target_label: TargetLabel,
        // This is the part of the buck-out after target name. For example, it would `artifact` in  `gen/path/to/__target_name__/artifact`
        path_after_target_name: ForwardRelativePathBuf,
        common_attrs: BuckOutPathTypeCommon,
    },
    TestOutput {
        path: CellPath,
        common_attrs: BuckOutPathTypeCommon,
    },
    TmpOutput {
        path: CellPath,
        target_label: TargetLabel,
        common_attrs: BuckOutPathTypeCommon,
    },
}

pub(crate) struct BuckOutPathParser {
    cell_resolver: CellResolver,
}

fn validate_buck_out_and_isolation_prefix<'v>(
    iter: &mut Peekable<impl Iterator<Item = &'v FileName>>,
    output_path: &str,
) -> anyhow::Result<()> {
    // Validate path starts with buck-out.
    match iter.next() {
        Some(buck_out) => {
            if buck_out != "buck-out" {
                // In buck1, the isolation prefix is prepended to `buck-out` (ex: `.my-isolation-dir-buck-out`).
                // Let's emit a more specific error when this happens.
                if buck_out.as_str().ends_with("buck-out") {
                    return Err(
                        BuckOutPathParserError::MaybeBuck1Path(output_path.to_owned()).into(),
                    );
                } else {
                    return Err(anyhow::anyhow!("Path does not start with buck-out"));
                }
            }
        }
        None => return Err(anyhow::anyhow!("Path does not start with buck-out")),
    }

    // Advance the iterator to isolation dir.
    match iter.next() {
        Some(_) => Ok(()),
        None => Err(anyhow::anyhow!("Path does not have an isolation dir")),
    }
}

struct BuckOutPathData {
    // Cell path of the target label that created the artifact.
    cell_path: CellPath,
    config_hash: String,
    anon_hash: Option<String>,
    /// The path starting from cell to the artifact, without the configuration hash. For example, in
    /// `buck-out/v2/gen/cell/<CONFIG_HASH>/path/to/__target_name__/target`, it would be `cell/path/to/__target_name__/target`.
    raw_path_to_output: ForwardRelativePathBuf,
}

fn get_cell_path<'v>(
    iter: &mut Peekable<impl Iterator<Item = &'v FileName> + Clone>,
    cell_resolver: &'v CellResolver,
    generated_prefix: &'v str,
) -> anyhow::Result<BuckOutPathData> {
    let is_anon = generated_prefix == "gen-anon";
    let is_test = generated_prefix == "test";
    // Get cell name and validate it exists
    let Some(cell_name) = iter.next() else {
        return Err(anyhow::anyhow!("Invalid cell name"));
    };

    let cell_name = CellName::unchecked_new(cell_name.as_str())?;
    let mut raw_path_to_output = ForwardRelativePath::new(cell_name.as_str())?.to_buf();

    cell_resolver.get(cell_name)?;

    // Advance iterator to the config hash
    let Some(config_hash) = iter.next() else {
        return Err(anyhow::anyhow!(
            "Path does not have a platform configuration"
        ));
    };

    iter.clone().for_each(|f| {
        raw_path_to_output.push(f);
    });

    // Get cell relative path and construct the cell path
    let mut cell_relative_path = CellRelativePath::unchecked_new("").to_owned();

    while let Some(maybe_target_name) = iter.peek() {
        if !maybe_target_name.as_str().starts_with("__") {
            cell_relative_path.push(maybe_target_name);
            iter.next();
            continue;
        }
        // Intentionally leave the target label on the iterator

        // If it's an anonymous target, then the last part before the target name is actually the
        // hash, and not part of the cell relative path.
        let (cell_relative_path, anon_hash) = if is_anon {
            let path = cell_relative_path
                .parent()
                .with_context(|| "Invalid path for anonymous target")?
                .to_buf();
            let anon_hash = cell_relative_path.file_name().unwrap().as_str().to_owned();
            (path, Some(anon_hash))
        } else {
            (cell_relative_path.to_buf(), None)
        };
        let cell_path = CellPath::new(cell_name, cell_relative_path);

        let buck_out_path_data = BuckOutPathData {
            cell_path,
            config_hash: config_hash.to_string(),
            anon_hash,
            raw_path_to_output: raw_path_to_output.to_buf(),
        };

        return Ok(buck_out_path_data);
    }

    if is_test {
        let buck_out_path_data = BuckOutPathData {
            cell_path: CellPath::new(cell_name, cell_relative_path.to_buf()),
            config_hash: config_hash.to_string(),
            anon_hash: None,
            raw_path_to_output: raw_path_to_output.to_buf(),
        };
        Ok(buck_out_path_data)
    } else {
        Err(anyhow::anyhow!("Invalid target name"))
    }
}

fn get_target_name<'v>(
    iter: &mut Peekable<impl Iterator<Item = &'v FileName>>,
) -> anyhow::Result<String> {
    // Get target name, which is prefixed and suffixed with "__"
    match iter.next() {
        Some(raw_target_name) => {
            let mut target_name_with_underscores =
                <&ForwardRelativePath>::from(raw_target_name).to_owned();

            while !target_name_with_underscores.as_str().ends_with("__") {
                match iter.next() {
                    Some(next) => {
                        target_name_with_underscores = target_name_with_underscores.join(next);
                    }
                    None => return Err(anyhow::anyhow!("Invalid target name")),
                }
            }

            let target_name_with_underscores = target_name_with_underscores.as_str();
            let target_name =
                &target_name_with_underscores[2..(target_name_with_underscores.len() - 2)];
            Ok(target_name.replace(EQ_SIGN_SUBST, "="))
        }
        None => Err(anyhow::anyhow!("Invalid target name")),
    }
}

fn get_target_label<'v>(
    iter: &mut Peekable<impl Iterator<Item = &'v FileName>>,
    path: CellPath,
) -> anyhow::Result<TargetLabel> {
    let target_name = get_target_name(iter)?;
    let package = PackageLabel::from_cell_path(path.as_ref());
    let target = TargetNameRef::new(target_name.as_str())?;
    let target_label = TargetLabel::new(package.dupe(), target);
    Ok(target_label)
}

fn get_bxl_function_label<'v>(
    iter: &mut Peekable<impl Iterator<Item = &'v FileName>>,
    path: CellPath,
) -> anyhow::Result<BxlFunctionLabel> {
    let target_name = get_target_name(iter)?;
    let bxl_path = BxlFilePath::new(path)?;
    let bxl_function_label = BxlFunctionLabel {
        bxl_path,
        name: target_name,
    };

    Ok(bxl_function_label)
}

impl BuckOutPathParser {
    pub(crate) fn new(cell_resolver: CellResolver) -> BuckOutPathParser {
        BuckOutPathParser { cell_resolver }
    }

    // Validates and parses the buck-out path, returning the `BuckOutPathType`. Assumes
    // that the inputted path is not a symlink.
    pub(crate) fn parse(&self, output_path: &str) -> anyhow::Result<BuckOutPathType> {
        let path_as_forward_rel_path = ForwardRelativePathBuf::new(output_path.to_owned())?;
        let mut iter = path_as_forward_rel_path.iter().peekable();

        validate_buck_out_and_isolation_prefix(&mut iter, output_path)?;

        self.parse_after_isolation_dir(iter)
            .context(BuckOutPathParserError::MalformedOutputPath(
                output_path.to_owned(),
            ))
    }

    fn parse_after_isolation_dir<'v>(
        &'v self,
        mut iter: Peekable<impl Iterator<Item = &'v FileName> + Clone>,
    ) -> anyhow::Result<BuckOutPathType> {
        // Advance the iterator to the prefix (tmp, test, gen, gen-anon, or gen-bxl)
        match iter.next() {
            Some(part) => {
                let result = match part.as_str() {
                    "tmp" => {
                        let buck_out_path_data =
                            get_cell_path(&mut iter, &self.cell_resolver, "tmp")?;
                        let target_label =
                            get_target_label(&mut iter, buck_out_path_data.cell_path.clone())?;

                        let common_attrs = BuckOutPathTypeCommon {
                            config_hash: buck_out_path_data.config_hash,
                            raw_path_to_output: buck_out_path_data.raw_path_to_output,
                        };

                        Ok(BuckOutPathType::TmpOutput {
                            path: buck_out_path_data.cell_path,
                            target_label,
                            common_attrs,
                        })
                    }
                    "test" => {
                        let buck_out_path_data =
                            get_cell_path(&mut iter, &self.cell_resolver, "test")?;

                        let common_attrs = BuckOutPathTypeCommon {
                            config_hash: buck_out_path_data.config_hash,
                            raw_path_to_output: buck_out_path_data.raw_path_to_output,
                        };

                        Ok(BuckOutPathType::TestOutput {
                            path: buck_out_path_data.cell_path,
                            common_attrs,
                        })
                    }
                    "gen" => {
                        let buck_out_path_data =
                            get_cell_path(&mut iter, &self.cell_resolver, "gen")?;
                        let target_label =
                            get_target_label(&mut iter, buck_out_path_data.cell_path.clone())?;
                        let path_after_target_name =
                            ForwardRelativePathBuf::new(iter.clone().join("/"))?;
                        let common_attrs = BuckOutPathTypeCommon {
                            config_hash: buck_out_path_data.config_hash,
                            raw_path_to_output: buck_out_path_data.raw_path_to_output,
                        };

                        Ok(BuckOutPathType::RuleOutput {
                            path: buck_out_path_data.cell_path,
                            target_label,
                            path_after_target_name,
                            common_attrs,
                        })
                    }
                    "gen-anon" => {
                        let buck_out_path_data =
                            get_cell_path(&mut iter, &self.cell_resolver, "gen-anon")?;
                        let target_label =
                            get_target_label(&mut iter, buck_out_path_data.cell_path.clone())?;
                        let common_attrs = BuckOutPathTypeCommon {
                            config_hash: buck_out_path_data.config_hash,
                            raw_path_to_output: buck_out_path_data.raw_path_to_output,
                        };

                        Ok(BuckOutPathType::AnonOutput {
                            path: buck_out_path_data.cell_path,
                            target_label,
                            attr_hash: buck_out_path_data
                                .anon_hash
                                .expect("No hash found in anonymous artifact buck-out"),
                            common_attrs,
                        })
                    }
                    "gen-bxl" => {
                        let buck_out_path_data =
                            get_cell_path(&mut iter, &self.cell_resolver, "gen-bxl")?;
                        let bxl_function_label =
                            get_bxl_function_label(&mut iter, buck_out_path_data.cell_path)?;
                        let common_attrs = BuckOutPathTypeCommon {
                            config_hash: buck_out_path_data.config_hash,
                            raw_path_to_output: buck_out_path_data.raw_path_to_output,
                        };

                        Ok(BuckOutPathType::BxlOutput {
                            bxl_function_label,
                            common_attrs,
                        })
                    }
                    _ => Err(anyhow::anyhow!(
                        "Directory after isolation dir is invalid (should be gen, gen-bxl, gen-anon, tmp, or test)"
                    )),
                };

                // Validate for non-test outputs that the target name is not the last element in the path
                if part != "test" && iter.peek().is_none() {
                    Err(anyhow::anyhow!("No output artifacts found"))
                } else {
                    result
                }
            }
            None => Err(anyhow::anyhow!("Path is empty")),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::collections::BTreeMap;

    use buck2_build_api::bxl::types::BxlFunctionLabel;
    use buck2_core::bxl::BxlFilePath;
    use buck2_core::cells::cell_path::CellPath;
    use buck2_core::cells::cell_root_path::CellRootPath;
    use buck2_core::cells::name::CellName;
    use buck2_core::cells::paths::CellRelativePath;
    use buck2_core::cells::CellResolver;
    use buck2_core::configuration::data::ConfigurationData;
    use buck2_core::configuration::data::ConfigurationDataData;
    use buck2_core::fs::paths::forward_rel_path::ForwardRelativePathBuf;
    use buck2_core::fs::project_rel_path::ProjectRelativePath;
    use buck2_core::package::PackageLabel;
    use buck2_core::target::label::label::TargetLabel;
    use buck2_core::target::name::TargetNameRef;
    use dupe::Dupe;

    use crate::output::buck_out_path_parser::BuckOutPathParser;
    use crate::output::buck_out_path_parser::BuckOutPathType;

    fn get_test_data() -> (BuckOutPathParser, String, TargetLabel, CellPath) {
        let cell_path = CellRootPath::new(ProjectRelativePath::new("foo/bar").unwrap());
        let cell_resolver = CellResolver::testing_with_name_and_path(
            CellName::testing_new("bar"),
            cell_path.to_buf(),
        );
        let parser = BuckOutPathParser::new(cell_resolver);

        let configuration = ConfigurationData::from_platform(
            "cfg_for//:testing_exec".to_owned(),
            ConfigurationDataData {
                constraints: BTreeMap::new(),
            },
        )
        .unwrap();
        let config_hash = configuration.output_hash().to_string();

        let pkg = PackageLabel::new(
            CellName::testing_new("bar"),
            CellRelativePath::unchecked_new("path/to/target"),
        );
        let expected_target_label =
            TargetLabel::new(pkg, TargetNameRef::new("target_name").unwrap());
        let expected_cell_path = CellPath::new(
            CellName::testing_new("bar"),
            CellRelativePath::unchecked_new("path/to/target").to_owned(),
        );

        (
            parser,
            config_hash,
            expected_target_label,
            expected_cell_path,
        )
    }

    #[test]
    fn test_validation() -> anyhow::Result<()> {
        let (buck_out_parser, config_hash, _, _) = get_test_data();

        let malformed_path1 = "does/not/start/with/buck-out/blah/blah";
        let malformed_path2 = "buck-out/v2/invalid_buck_prefix/blah/blah/blah/blah";
        let malformed_path3 = "buck-out/v2/gen/bar/no/target/name/found";
        let malformed_path4 = "buck-out/v2/gen/bar/path/to/target/__but_no_artifacts__";
        let buck1_path = ".some-isolation-buck-out/gen/bar/path/to/target/__foo__/bar";

        let res = buck_out_parser.parse(malformed_path1);
        assert!(
            res.err()
                .unwrap()
                .to_string()
                .contains("Path does not start with")
        );

        let res = buck_out_parser.parse(malformed_path2);
        assert!(res.err().unwrap().to_string().contains("Malformed"));

        let res = buck_out_parser.parse(malformed_path3);
        assert!(res.err().unwrap().to_string().contains("Malformed"));

        let res = buck_out_parser.parse(malformed_path4);
        assert!(res.err().unwrap().to_string().contains("Malformed"));

        let res = buck_out_parser.parse(buck1_path);
        assert!(res.err().unwrap().to_string().contains("buck1"));

        let cell_does_not_exist =
            "buck-out/v2/gen/nonexistent_cell/cfg_hash/path/to/target/__target_name__/output";

        let res = buck_out_parser.parse(cell_does_not_exist);
        assert!(res.err().unwrap().to_string().contains("Malformed"));

        let no_artifacts_after_target_name = &format!(
            "buck-out/v2/gen/bar/{}/path/to/target/__target_name__",
            config_hash
        );
        let res = buck_out_parser.parse(no_artifacts_after_target_name);
        assert!(res.err().unwrap().to_string().contains("Malformed"));

        Ok(())
    }

    #[test]
    fn test_target_output() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, expected_target_label, expected_cell_path) =
            get_test_data();

        let rule_path = format!(
            "buck-out/v2/gen/bar/{}/path/to/target/__target_name__/output",
            expected_config_hash
        );

        let res = buck_out_parser.parse(&rule_path)?;

        match res {
            BuckOutPathType::RuleOutput {
                path,
                target_label,
                path_after_target_name,
                common_attrs,
            } => {
                assert_eq!(
                    path_after_target_name,
                    ForwardRelativePathBuf::new("output".to_owned())?,
                );
                assert_eq!(target_label, expected_target_label);
                assert_eq!(path, expected_cell_path);
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/target/__target_name__/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_target_output_with_slashes() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, expected_target_label, expected_cell_path) =
            get_test_data();

        let rule_path_target_label_with_slashes = format!(
            "buck-out/v2/gen/bar/{}/path/to/target/__target_name_start/target_name_end__/output",
            expected_config_hash
        );

        let res = buck_out_parser.parse(&rule_path_target_label_with_slashes)?;

        let expected_target_label_with_slashes = TargetLabel::new(
            expected_target_label.pkg().dupe(),
            TargetNameRef::new("target_name_start/target_name_end")?,
        );

        match res {
            BuckOutPathType::RuleOutput {
                path,
                target_label,
                path_after_target_name,
                common_attrs,
            } => {
                assert_eq!(
                    path_after_target_name,
                    ForwardRelativePathBuf::new("output".to_owned())?,
                );
                assert_eq!(target_label, expected_target_label_with_slashes);
                assert_eq!(path, expected_cell_path);
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/target/__target_name_start/target_name_end__/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_target_output_with_eq_sign() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, expected_target_label, expected_cell_path) =
            get_test_data();

        let rule_path_with_equal_sign = format!(
            "buck-out/v2/gen/bar/{}/path/to/target/__target_name_eqsb_out__/output",
            expected_config_hash
        );

        let res = buck_out_parser.parse(&rule_path_with_equal_sign)?;

        let expected_target_label_with_equal_sign = TargetLabel::new(
            expected_target_label.pkg(),
            TargetNameRef::new("target_name=out")?,
        );

        match res {
            BuckOutPathType::RuleOutput {
                path,
                target_label,
                path_after_target_name,
                common_attrs,
            } => {
                assert_eq!(
                    path_after_target_name,
                    ForwardRelativePathBuf::new("output".to_owned())?,
                );
                assert_eq!(target_label, expected_target_label_with_equal_sign);
                assert_eq!(path, expected_cell_path);
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/target/__target_name_eqsb_out__/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_tmp_output() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, expected_target_label, expected_cell_path) =
            get_test_data();

        let tmp_path = format!(
            "buck-out/v2/tmp/bar/{}/path/to/target/__target_name__/output",
            expected_config_hash
        );

        let res = buck_out_parser.parse(&tmp_path)?;

        match res {
            BuckOutPathType::TmpOutput {
                path,
                target_label,
                common_attrs,
            } => {
                assert_eq!(path, expected_cell_path);
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(target_label, expected_target_label);
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/target/__target_name__/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_test_output() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, _, _) = get_test_data();

        let test_path = format!(
            "buck-out/v2/test/bar/{}/path/to/target/test/output",
            expected_config_hash
        );

        let expected_test_cell_path = CellPath::new(
            CellName::testing_new("bar"),
            CellRelativePath::unchecked_new("path/to/target/test/output").to_owned(),
        );

        let res = buck_out_parser.parse(&test_path)?;

        match res {
            BuckOutPathType::TestOutput { path, common_attrs } => {
                assert_eq!(path, expected_test_cell_path);
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/target/test/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_anon_output() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, expected_target_label, expected_cell_path) =
            get_test_data();

        let anon_path = format!(
            "buck-out/v2/gen-anon/bar/{}/path/to/target/anon_hash/__target_name__/output",
            expected_config_hash
        );

        let res = buck_out_parser.parse(&anon_path)?;

        match res {
            BuckOutPathType::AnonOutput {
                path,
                target_label,
                attr_hash,
                common_attrs,
            } => {
                assert_eq!(target_label, expected_target_label);
                assert_eq!(path, expected_cell_path);
                assert_eq!(attr_hash, "anon_hash");
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/target/anon_hash/__target_name__/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_bxl_output() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, _, _) = get_test_data();

        let path = format!(
            "buck-out/v2/gen-bxl/bar/{}/path/to/function.bxl/__function_name__/output",
            expected_config_hash
        );

        let res = buck_out_parser.parse(&path)?;

        match res {
            BuckOutPathType::BxlOutput {
                bxl_function_label,
                common_attrs,
            } => {
                let path = CellPath::new(
                    CellName::testing_new("bar"),
                    CellRelativePath::unchecked_new("path/to/function.bxl").to_owned(),
                );

                let bxl_path = BxlFilePath::new(path)?;
                let expected_bxl_function_label = BxlFunctionLabel {
                    bxl_path,
                    name: "function_name".to_owned(),
                };

                assert_eq!(bxl_function_label, expected_bxl_function_label);
                assert_eq!(common_attrs.config_hash, expected_config_hash.as_str());
                assert_eq!(
                    common_attrs.raw_path_to_output.as_str(),
                    "bar/path/to/function.bxl/__function_name__/output"
                )
            }
            _ => panic!("Should have parsed buck-out path successfully"),
        }

        Ok(())
    }

    #[test]
    fn test_empty_package_path() -> anyhow::Result<()> {
        let (buck_out_parser, expected_config_hash, _, _) = get_test_data();

        let target_path = format!(
            "buck-out/v2/gen/bar/{}/__target_name__/output",
            expected_config_hash
        );

        let BuckOutPathType::RuleOutput {
            path, target_label, ..
        } = buck_out_parser.parse(&target_path)?
        else {
            panic!("Should have parsed buck-out path successfully")
        };

        assert!(path.path().is_empty());
        assert_eq!(target_label.name().as_str(), "target_name");

        Ok(())
    }
}
