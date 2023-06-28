# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under both the MIT license found in the
# LICENSE-MIT file in the root directory of this source tree and the Apache
# License, Version 2.0 found in the LICENSE-APACHE file in the root directory
# of this source tree.
{
  description = "Buck2 build system";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "flake-utils";
      };
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ (import rust-overlay) ];
      };

      rust-version = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain;
      my-rust-bin = rust-version.override {
        extensions = [ "rust-analyzer" "rust-src" ];
      };

      rustPlatform = pkgs.makeRustPlatform {
        rustc = my-rust-bin;
        cargo = my-rust-bin;
      };

      darwin-inputs = pkgs.lib.optionals pkgs.stdenv.isDarwin (with pkgs.darwin.apple_sdk.frameworks; [
        CoreFoundation
        CoreServices
        IOKit
        Security
      ]);

      filterSrc = src: regexes:
        # https://github.com/martinvonz/jj/blob/d047a8fbd49587a03a00fd2c9f1087280caa7157/flake.nix#L27-L35
        pkgs.lib.cleanSourceWith {
          inherit src;
          filter = path: type:
            let relPath = pkgs.lib.removePrefix (toString src + "/") (toString path);
            in pkgs.lib.all (re: builtins.match re relPath == null) regexes;
        };

      version = with builtins;
        # get a version that includes a mod date as well as a git revision. pull the
        # base version number from Cargo.toml directly, too
        let t = fromTOML (readFile ./app/buck2/Cargo.toml);
            date = substring 0 8 (self.lastModifiedDate or self.lastModified or "19700101");
            rev = self.shortRev or "dirty";
        in "${t.package.version}-${date}r${rev}";

    in rec {
      packages = rec {
        buck2 = rustPlatform.buildRustPackage rec {
          pname = "buck2";
          inherit version;

          src = filterSrc ./. [
            ".*\\.nix$"
            "^.sl/"
            "^.jj/"
            "^flake\\.lock$"
            "^target/"
          ];

          cargoLock = {
            lockFile = ./nix/Cargo-lock-do-not-use;
            outputHashes = {
              "perf-event-0.4.8" = "sha256-4OSGmbrL5y1g+wdA+W9DrhWlHQGeVCsMLz87pJNckvw=";
              "hyper-proxy-0.10.1" = "sha256-qxOJntADYGuBr9jnzWJjiC7ApnkmF2R+OdXBGL3jIw8=";
            };
          };

          BUCK2_BUILD_PROTOC = "${pkgs.protobuf}/bin/protoc";
          BUCK2_BUILD_PROTOC_INCLUDE = "${pkgs.protobuf}/include";

          nativeBuildInputs = [ pkgs.pkg-config ];
          buildInputs = [ pkgs.openssl pkgs.sqlite ] ++ darwin-inputs;

          doCheck = false;
          dontStrip = true; # XXX (aseipp): cargo will delete dwarf info, but leave symbols for backtraces
          cargoBuildFlags = [ "--bin=buck2" ];

          # Put the Cargo.lock file in the build.
          postPatch = "cp ${./nix/Cargo-lock-do-not-use} Cargo.lock";
        };

        default = buck2;
      };

      apps.default = {
        type = "app";
        program = "${packages.buck2}/bin/buck2";
      };

      formatter = pkgs.nixpkgs-fmt;

      devShells.default = pkgs.mkShell {
        buildInputs = darwin-inputs;
        packages = [ pkgs.cargo-bloat my-rust-bin pkgs.mold pkgs.reindeer pkgs.lld_16 pkgs.clang_16 ];
        shellHook = ''
          export BUCK2_BUILD_PROTOC=${pkgs.protobuf}/bin/protoc
          export BUCK2_BUILD_PROTOC_INCLUDE=${pkgs.protobuf}/include
        '';
      };
    });
}
