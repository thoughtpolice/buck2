"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1821],{3905:(e,n,t)=>{t.r(n),t.d(n,{MDXContext:()=>c,MDXProvider:()=>d,mdx:()=>b,useMDXComponents:()=>p,withMDXComponents:()=>u});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(){return i=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},i.apply(this,arguments)}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),u=function(e){return function(n){var t=p(n.components);return r.createElement(e,i({},n,{components:t}))}},p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},d=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},m="mdxType",f={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},h=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,a=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(t),d=o,m=u["".concat(a,".").concat(d)]||u[d]||f[d]||i;return t?r.createElement(m,s(s({ref:n},c),{},{components:t})):r.createElement(m,s({ref:n},c))}));function b(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,a=new Array(i);a[0]=h;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[m]="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}h.displayName="MDXCreateElement"},85137:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=t(87462),o=(t(67294),t(3905));const i={id:"init",title:"init"},a=void 0,s={unversionedId:"users/commands/init",id:"users/commands/init",title:"init",description:"These are the flags/commands under buck2 init and their --help output:",source:"@site/../docs/users/commands/init.generated.md",sourceDirName:"users/commands",slug:"/users/commands/init",permalink:"/docs/users/commands/init",draft:!1,tags:[],version:"current",frontMatter:{id:"init",title:"init"},sidebar:"mainSidebar",previous:{title:"help-env",permalink:"/docs/users/commands/help-env"},next:{title:"install",permalink:"/docs/users/commands/install"}},l={},c=[{value:"buck init",id:"buck-init",level:2}],u={toc:c};function p(e){let{components:n,...t}=e;return(0,o.mdx)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.mdx)("p",null,"These are the flags/commands under ",(0,o.mdx)("inlineCode",{parentName:"p"},"buck2 init")," and their ",(0,o.mdx)("inlineCode",{parentName:"p"},"--help")," output:"),(0,o.mdx)("h2",{id:"buck-init"},"buck init"),(0,o.mdx)("pre",null,(0,o.mdx)("code",{parentName:"pre",className:"language-text"},"Initialize a buck2 project\n\nUsage: buck2-release init [OPTIONS] [PATH]\n\nArguments:\n  [PATH]\n          The path to initialize the project in. The folder does not need to exist\n          \n          [default: .]\n\nOptions:\n      --no-prelude\n          Don't include the standard prelude or generate toolchain definitions\n\n      --allow-dirty\n          Initialize the project even if the git repo at \\[PATH\\] has uncommitted changes\n\n      --git\n          Also initialize a git repository at the given path, and set up an appropriate `.gitignore`\n          file\n\n  -h, --help\n          Print help (see a summary with '-h')\n\nConsole Options:\n      --console <super|simple|...>\n          Which console to use for this command\n          \n          [env: BUCK_CONSOLE=]\n          [default: auto]\n          [possible values: simple, simplenotty, simpletty, super, auto, none]\n\n      --ui <UI>...\n          Configure additional superconsole ui components.\n          \n          Accepts a comma-separated list of superconsole components to add. Possible values are:\n          \n          dice - shows information about evaluated dice nodes debugevents - shows information about\n          the flow of events from buckd\n          \n          These components can be turned on/off interactively. Press 'h' for help when superconsole\n          is active.\n\n          Possible values:\n          - dice\n          - debugevents\n          - io:          I/O panel\n          - re:          RE panel\n\n      --no-interactive-console\n          Disable console interactions\n          \n          [env: BUCK_NO_INTERACTIVE_CONSOLE=]\n\nUniversal Options:\n  -v, --verbose <VERBOSITY>\n          How verbose buck should be while logging.\n          \n          Values: 0 = Quiet, errors only; 1 = Show status. Default; 2 = more info about errors; 3 =\n          more info about everything; 4 = more info about everything + stderr;\n          \n          It can be combined with specific log items (stderr, full_failed_command, commands,\n          actions, status, stats, success) to fine-tune the verbosity of the log. Example usage\n          \"-v=1,stderr\"\n          \n          [default: 1]\n\n      --oncall <ONCALL>\n          The oncall executing this command\n\n      --client-metadata <CLIENT_METADATA>\n          Metadata key-value pairs to inject into Buck2's logging. Client metadata must be of the\n          form `key=value`, where `key` is a snake_case identifier, and will be sent to backend\n          datasets\n\n")))}p.isMDXComponent=!0}}]);