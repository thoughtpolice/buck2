"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5357],{3905:(e,n,t)=>{t.r(n),t.d(n,{MDXContext:()=>c,MDXProvider:()=>h,mdx:()=>b,useMDXComponents:()=>u,withMDXComponents:()=>d});var o=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(){return a=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},a.apply(this,arguments)}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,o,i=function(e,n){if(null==e)return{};var t,o,i={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=o.createContext({}),d=function(e){return function(n){var t=u(n.components);return o.createElement(e,a({},n,{components:t}))}},u=function(e){var n=o.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},h=function(e){var n=u(e.components);return o.createElement(c.Provider,{value:n},e.children)},f="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},m=o.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,r=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(t),h=i,f=d["".concat(r,".").concat(h)]||d[h]||p[h]||a;return t?o.createElement(f,s(s({ref:n},c),{},{components:t})):o.createElement(f,s({ref:n},c))}));function b(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,r=new Array(a);r[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[f]="string"==typeof e?e:i,r[1]=s;for(var c=2;c<a;c++)r[c]=t[c];return o.createElement.apply(null,r)}return o.createElement.apply(null,t)}m.displayName="MDXCreateElement"},8270:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var o=t(87462),i=(t(67294),t(3905));const a={id:"install",title:"install"},r=void 0,s={unversionedId:"users/commands/install",id:"users/commands/install",title:"install",description:"These are the flags/commands under buck2 install and their --help output:",source:"@site/../docs/users/commands/install.generated.md",sourceDirName:"users/commands",slug:"/users/commands/install",permalink:"/docs/users/commands/install",draft:!1,tags:[],version:"current",frontMatter:{id:"install",title:"install"},sidebar:"mainSidebar",previous:{title:"init",permalink:"/docs/users/commands/init"},next:{title:"kill",permalink:"/docs/users/commands/kill"}},l={},c=[{value:"buck install",id:"buck-install",level:2}],d={toc:c};function u(e){let{components:n,...t}=e;return(0,i.mdx)("wrapper",(0,o.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.mdx)("p",null,"These are the flags/commands under ",(0,i.mdx)("inlineCode",{parentName:"p"},"buck2 install")," and their ",(0,i.mdx)("inlineCode",{parentName:"p"},"--help")," output:"),(0,i.mdx)("h2",{id:"buck-install"},"buck install"),(0,i.mdx)("pre",null,(0,i.mdx)("code",{parentName:"pre",className:"language-text"},"Build and install an application\n\nUsage: buck2-release install [OPTIONS] [TARGET]... [-- <INSTALL_ARGS>...]\n\nArguments:\n  [TARGET]...\n          Target to build and install\n\n  [INSTALL_ARGS]...\n          Additional arguments passed to the install when running it\n\nOptions:\n      --installer-debug\n          Prints installer output to stderr. It might break superconsole\n\n  -r, --run\n          Run an Android activity. Here for compatibility with buck1 - it is automatically forwarded\n          to the installer\n\n  -e, --emulator\n          Use this option to use emulators only on Android. Here for compatibility with buck1 - it\n          is automatically forwarded to the installer\n\n  -d, --device\n          Use this option to use real devices only on Android. Here for compatibility with buck1 -\n          it is automatically forwarded to the installer\n\n  -s, --serial <SERIAL>\n          Use Android device or emulator with specific serial or UDID number. Here for compatibility\n          with buck1 - it is automatically forwarded to the installer\n\n  -x, --all-devices\n          Use all connected Android devices and/or emulators (multi-install mode). Here for\n          compatibility with buck1 - it is automatically forwarded to the installer\n\n  -a, --activity <ACTIVITY>\n          Android activity to launch e.g. com.facebook/.LoginActivity. Implies -r. Here for\n          compatibility with buck1 - it is automatically forwarded to the installer\n\n  -i, --intent-uri <INTENT_URI>\n          Android Intent URI to launch e.g. fb://profile. Implies -r. Here for compatibility with\n          buck1 - it is automatically forwarded to the installer\n\n  -w, --wait-for-debugger\n          Have the launched Android process wait for the debugger. Here for compatibility with buck1\n          - it is automatically forwarded to the installer\n\n  -u, --uninstall\n          Use this option to uninstall an installed app before installing again. Here for\n          compatibility with buck1 - it is automatically forwarded to the installer\n\n  -k, --keep\n          Use this option to Keep user data when uninstalling. Here for compatibility with buck1 -\n          it is automatically forwarded to the installer\n\n      --build-report <PATH>\n          Print a build report\n          \n          `--build-report=-` will print the build report to stdout `--build-report=<filepath>` will\n          write the build report to the file\n\n      --enable-optional-validations <VALIDATION_NAMES>\n          Comma separated list of validation names to run that are marked optional.\n          \n          By default, validations marked as optional are skipped. This option overrides the\n          behaviour and executes those validations.\n\n      --build-report-options <BUILD_REPORT_OPTIONS>\n          Comma separated list of build report options.\n          \n          The following options are supported:\n          \n          `fill-out-failures`: fill out failures the same way Buck1 would.\n          \n          `package-project-relative-paths`: emit the project-relative path of packages for the\n          targets that were built.\n\n  -j, --num-threads <THREADS>\n          Number of threads to use during execution (default is # cores)\n\n      --local-only\n          Enable only local execution. Will reject actions that cannot execute locally\n          \n          [env: BUCK_OFFLINE_BUILD=]\n\n      --remote-only\n          Enable only remote execution. Will reject actions that cannot execute remotely\n\n      --prefer-local\n          Enable hybrid execution. Will prefer executing actions that can execute locally on the\n          local host\n\n      --prefer-remote\n          Enable hybrid execution. Will prefer executing actions that can execute remotely on RE and\n          will avoid racing local and remote execution\n\n      --unstable-no-execution\n          Experimental: Disable all execution\n\n      --no-remote-cache\n          Do not perform remote cache queries or cache writes. If remote execution is enabled, the\n          RE service might still deduplicate actions, so for e.g. benchmarking, using a random\n          isolation dir is preferred\n          \n          [env: BUCK_OFFLINE_BUILD=]\n\n      --write-to-cache-anyway\n          Could be used to enable the action cache writes on the RE worker when no_remote_cache is\n          specified\n\n      --eager-dep-files\n          Process dep files when they are generated (i.e. after running a command that produces dep\n          files), rather than when they are used (i.e. before re-running a command that previously\n          produced dep files). Use this when debugging commands that produce dep files. Note that\n          commands that previously produced dep files will not re-run: only dep files produced\n          during this command will be eagerly loaded\n\n      --upload-all-actions\n          Uploads every action to the RE service, regardless of whether the action needs to execute\n          on RE.\n          \n          This is useful when debugging builds and trying to inspect actions which executed\n          remotely. It's possible that the action result is cached but the action itself has\n          expired. In this case, downloading the action itself would fail. Enabling this option\n          would unconditionally upload all actions, thus you will not hit any expiration issues.\n\n      --fail-fast\n          If Buck hits an error, do as little work as possible before exiting.\n          \n          To illustrate the effect of this flag, consider an invocation of `build :foo :bar`. The\n          default behavior of buck is to do enough work to get a result for the builds of each of\n          `:foo` and `:bar`, and no more. This means that buck will continue to complete the build\n          of `:bar` after the build of `:foo` has failed; however, once one dependency of `:foo` has\n          failed, other dependencies will be cancelled unless they are needed by `:bar`.\n          \n          This flag changes the behavior of buck to not wait on `:bar` to complete once `:foo` has\n          failed. Generally, this flag only has an effect on builds that specify multiple targets.\n          \n          `--keep-going` changes the behavior of buck to not only wait on `:bar` once one dependency\n          of `:foo` has failed, but to additionally attempt to build other dependencies of `:foo` if\n          possible.\n\n      --keep-going\n          If Buck hits an error, continue doing as much work as possible before exiting.\n          \n          See `--fail-fast` for more details.\n\n      --skip-missing-targets\n          If target is missing, then skip building instead of throwing error\n\n      --skip-incompatible-targets\n          If target is incompatible with the specified configuration, skip building instead of\n          throwing error. This does not apply to targets specified with glob patterns `/...` or `:`\n          which are skipped unconditionally\n\n      --materialize-failed-inputs\n          Materializes inputs for failed actions which ran on RE\n\n  -h, --help\n          Print help (see a summary with '-h')\n\nTarget Configuration Options:\n      --target-platforms <PLATFORM>\n          Configuration target (one) to use to configure targets\n\n  -m, --modifier <VALUE>\n          A configuration modifier to configure all targets on the command line. This may be a\n          constraint value target.\n\nBuckconfig Options:\n  -c, --config <SECTION.OPTION=VALUE>\n          List of config options\n\n      --config-file <PATH>\n          List of config file paths\n\n      --fake-host <HOST>\n          [possible values: default, linux, macos, windows]\n\n      --fake-arch <ARCH>\n          [possible values: default, aarch64, x8664]\n\n      --fake-xcode-version <VERSION-BUILD>\n          Value must be formatted as: version-build (e.g., 14.3.0-14C18 or 14.1-14B47b)\n\n      --reuse-current-config\n          Re-uses any `--config` values (inline or via modefiles) if there's a previous command,\n          otherwise the flag is ignored.\n          \n          If there is a previous command and `--reuse-current-config` is set, then the old config is\n          used, ignoring any overrides.\n          \n          If there is no previous command but the flag was set, then the flag is ignored, the\n          command behaves as if the flag was not set at all.\n\n      --exit-when-different-state\n          Used for exiting a concurrent command when a different state is detected\n\n      --preemptible <PREEMPTIBLE>\n          Used to configure when this command could be preempted by another command for the same\n          isolation dir.\n          \n          Normally, when you run two commands - from different terminals, say - buck2 will attempt\n          to run them in parallel. However, if the two commands are based on different state, that\n          is they either have different configs or different filesystem states, buck2 cannot run\n          them in parallel. The default behavior in this case is to block the second command until\n          the first completes.\n\n          Possible values:\n          - never:            (default) When another command starts that cannot run in parallel with\n            this one, block that command\n          - always:           When another command starts, interrupt this command, *even if they\n            could run in parallel*. There is no good reason to use this other than that it provides\n            slightly nicer superconsole output\n          - ondifferentstate: When another command starts that cannot run in parallel with this one,\n            interrupt this command\n\nStarlark Options:\n      --disable-starlark-types\n          Disable runtime type checking in Starlark interpreter.\n          \n          This option is not stable, and can be used only locally to diagnose evaluation performance\n          problems.\n\n      --stack\n          Record or show target call stacks.\n          \n          Starlark call stacks will be included in duplicate targets error.\n          \n          If a command outputs targets (like `targets` command), starlark call stacks will be\n          printed after the targets.\n\nConsole Options:\n      --console <super|simple|...>\n          Which console to use for this command\n          \n          [env: BUCK_CONSOLE=]\n          [default: auto]\n          [possible values: simple, simplenotty, simpletty, super, auto, none]\n\n      --ui <UI>...\n          Configure additional superconsole ui components.\n          \n          Accepts a comma-separated list of superconsole components to add. Possible values are:\n          \n          dice - shows information about evaluated dice nodes debugevents - shows information about\n          the flow of events from buckd\n          \n          These components can be turned on/off interactively. Press 'h' for help when superconsole\n          is active.\n\n          Possible values:\n          - dice\n          - debugevents\n          - io:          I/O panel\n          - re:          RE panel\n\n      --no-interactive-console\n          Disable console interactions\n          \n          [env: BUCK_NO_INTERACTIVE_CONSOLE=]\n\nEvent Log Options:\n      --event-log <PATH>\n          Write events to this log file\n\n      --write-build-id <PATH>\n          Write command invocation id into this file\n\n      --unstable-write-invocation-record <PATH>\n          Write the invocation record (as JSON) to this path. No guarantees whatsoever are made\n          regarding the stability of the format\n\nUniversal Options:\n  -v, --verbose <VERBOSITY>\n          How verbose buck should be while logging.\n          \n          Values: 0 = Quiet, errors only; 1 = Show status. Default; 2 = more info about errors; 3 =\n          more info about everything; 4 = more info about everything + stderr;\n          \n          It can be combined with specific log items (stderr, full_failed_command, commands,\n          actions, status, stats, success) to fine-tune the verbosity of the log. Example usage\n          \"-v=1,stderr\"\n          \n          [default: 1]\n\n      --oncall <ONCALL>\n          The oncall executing this command\n\n      --client-metadata <CLIENT_METADATA>\n          Metadata key-value pairs to inject into Buck2's logging. Client metadata must be of the\n          form `key=value`, where `key` is a snake_case identifier, and will be sent to backend\n          datasets\n\n")))}u.isMDXComponent=!0}}]);