"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8535],{3905:(e,n,t)=>{t.r(n),t.d(n,{MDXContext:()=>d,MDXProvider:()=>p,mdx:()=>x,useMDXComponents:()=>m,withMDXComponents:()=>s});var i=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(){return o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])}return e},o.apply(this,arguments)}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,i,a=function(e,n){if(null==e)return{};var t,i,a={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var d=i.createContext({}),s=function(e){return function(n){var t=m(n.components);return i.createElement(e,o({},n,{components:t}))}},m=function(e){var n=i.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},p=function(e){var n=m(e.components);return i.createElement(d.Provider,{value:n},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},h=i.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,r=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),s=m(t),p=a,u=s["".concat(r,".").concat(p)]||s[p]||f[p]||o;return t?i.createElement(u,l(l({ref:n},d),{},{components:t})):i.createElement(u,l({ref:n},d))}));function x(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,r=new Array(o);r[0]=h;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l[u]="string"==typeof e?e:a,r[1]=l;for(var d=2;d<o;d++)r[d]=t[d];return i.createElement.apply(null,r)}return i.createElement.apply(null,t)}h.displayName="MDXCreateElement"},60203:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var i=t(87462),a=(t(67294),t(3905));const o={id:"buckconfig",title:".buckconfig"},r=void 0,l={unversionedId:"concepts/buckconfig",id:"concepts/buckconfig",title:".buckconfig",description:"The root of your project must contain a configuration",source:"@site/../docs/concepts/buckconfig.md",sourceDirName:"concepts",slug:"/concepts/buckconfig",permalink:"/docs/concepts/buckconfig",draft:!1,tags:[],version:"current",frontMatter:{id:"buckconfig",title:".buckconfig"},sidebar:"mainSidebar",previous:{title:"Daemon (buckd)",permalink:"/docs/concepts/daemon"},next:{title:"Configurations",permalink:"/docs/concepts/configurations"}},c={},d=[{value:"Performance impact of Buck2 configuration changes",id:"performance-impact-of-buck2-configuration-changes",level:2},{value:"The .buckconfig file uses the INI file format",id:"the-buckconfig-file-uses-the-ini-file-format",level:2},{value:"Other INI file parsers",id:"other-ini-file-parsers",level:3},{value:"Dot character not supported in section names",id:"dot-character-not-supported-in-section-names",level:3},{value:"Character encoding",id:"character-encoding",level:2},{value:"Key values as lists",id:"key-values-as-lists",level:2},{value:"Transclusion of values from one key to another",id:"transclusion-of-values-from-one-key-to-another",level:2},{value:"Comments",id:"comments",level:2},{value:".buckconfig.local",id:"buckconfiglocal",level:2},{value:"Other initialization files",id:"other-initialization-files",level:2},{value:"Command-line control of configuration",id:"command-line-control-of-configuration",level:2},{value:"Precedence of Buck2 configuration specifications",id:"precedence-of-buck2-configuration-specifications",level:2},{value:"Configuration files can include other files",id:"configuration-files-can-include-other-files",level:2},{value:"Sections",id:"sections",level:2},{value:"alias",id:"alias",level:2},{value:"cells",id:"cells",level:2}],s={toc:d};function m(e){let{components:n,...t}=e;return(0,a.mdx)("wrapper",(0,i.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,a.mdx)("p",null,"The root of your ",(0,a.mdx)("a",{parentName:"p",href:"/docs/concepts/glossary#project"},"project")," must contain a configuration\nfile named ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig"),". Before executing, Buck2 reads this file to incorporate\nany customizations it specifies."),(0,a.mdx)("h2",{id:"performance-impact-of-buck2-configuration-changes"},"Performance impact of Buck2 configuration changes"),(0,a.mdx)("p",null,"Because configuration settings are sometimes included in the cache keys that\nBuck2 uses in its caching system, changes to Buck's configuration can invalidate\npreviously-built artifacts in Buck's caches. If this occurs, Buck2 rebuilds\nthose artifacts, which can impact your build time."),(0,a.mdx)("h2",{id:"the-buckconfig-file-uses-the-ini-file-format"},"The .buckconfig file uses the INI file format"),(0,a.mdx)("p",null,"The ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," file uses the\n",(0,a.mdx)("a",{parentName:"p",href:"http://en.wikipedia.org/wiki/INI_file"},"INI file format"),". That is, it is divided\ninto ",(0,a.mdx)("em",{parentName:"p"},"sections")," where each section contains a collection of key ",(0,a.mdx)("em",{parentName:"p"},"names")," and key\n",(0,a.mdx)("em",{parentName:"p"},"values"),". The ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," implementation supports some modifications to the\nINI file format; these are discussed below."),(0,a.mdx)("h3",{id:"other-ini-file-parsers"},"Other INI file parsers"),(0,a.mdx)("p",null,"As mentioned previously, we have extended the INI file parser that Buck2 uses to\nparse configuration files. As a result, ",(0,a.mdx)("em",{parentName:"p"},"INI file parsers provided by other\nlanguages or libraries are often not able to parse Buck's configuration files\nsuccessfully"),"."),(0,a.mdx)("h3",{id:"dot-character-not-supported-in-section-names"},"Dot character not supported in section names"),(0,a.mdx)("p",null,"We do not support the use of the ",(0,a.mdx)("em",{parentName:"p"},"dot")," character (",(0,a.mdx)("inlineCode",{parentName:"p"},"."),") in section names within\nBuck2 configuration files. For example, the following is ",(0,a.mdx)("strong",{parentName:"p"},"not"),"\nsupported\u2014",(0,a.mdx)("em",{parentName:"p"},"although Buck2 does not issue a warning or error"),"."),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-ini"},"[foo.bar]\n  baz=1\n")),(0,a.mdx)("p",null,"Note that sometimes you might need to define your own custom sections, such as\nfor platform flavors for C++ or Python. These scenarios are examples of when you\nshould be careful not to introduce the dot character in section names. This\nconstraint is because Buck2 uses the dot character to delimit section names and\nkey names in other contexts such as the ",(0,a.mdx)("inlineCode",{parentName:"p"},"--config")," command-line parameter."),(0,a.mdx)("h2",{id:"character-encoding"},"Character encoding"),(0,a.mdx)("p",null,"To ensure that any character can be encoded in a ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," key value, you\ncan use escape sequences to encode characters that would otherwise be\nproblematic. The following escape sequences are supported."),(0,a.mdx)("table",null,(0,a.mdx)("thead",{parentName:"table"},(0,a.mdx)("tr",{parentName:"thead"},(0,a.mdx)("th",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"th"},"\\\\")),(0,a.mdx)("th",{parentName:"tr",align:null},"backslash"))),(0,a.mdx)("tbody",{parentName:"table"},(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},'\\"')),(0,a.mdx)("td",{parentName:"tr",align:null},"double quote")),(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},"\\n")),(0,a.mdx)("td",{parentName:"tr",align:null},"newline")),(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},"\\r")),(0,a.mdx)("td",{parentName:"tr",align:null},"carriage return")),(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},"\\t")),(0,a.mdx)("td",{parentName:"tr",align:null},"tab")),(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},"\\x##")),(0,a.mdx)("td",{parentName:"tr",align:null},"Unicode character with code point ## (in hex)")),(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},"\\u####")),(0,a.mdx)("td",{parentName:"tr",align:null},"Unicode character with code point #### (in hex)")),(0,a.mdx)("tr",{parentName:"tbody"},(0,a.mdx)("td",{parentName:"tr",align:null},(0,a.mdx)("inlineCode",{parentName:"td"},"\\U########")),(0,a.mdx)("td",{parentName:"tr",align:null},"Unicode character with code point ######## (in hex)")))),(0,a.mdx)("h2",{id:"key-values-as-lists"},"Key values as lists"),(0,a.mdx)("p",null,"Although the standard INI format supports only key values that represent a\nsingle item, Buck2 supports key values that represent a list of items. The\nsyntax is to separate the items in the list using the space (",(0,a.mdx)("inlineCode",{parentName:"p"},"0x20"),") character.\nFor example, a key value for the list of command-line flags to be passed to a\ncompiler could be represented as a list of the flags separated by spaces:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"flags = -foo -bar -baz -qux\n")),(0,a.mdx)("p",null,"When a key value is parsed as a list instead of a single item, the separator\ncharacter is interpreted as a separator only when it occurs ",(0,a.mdx)("em",{parentName:"p"},"outside of double\nquotes"),". For example, if ",(0,a.mdx)("inlineCode",{parentName:"p"},"flags")," is a key value interpreted as a list of items\nseparated by spaces, then"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},'flags = -foo "-bar \\u0429"\n')),(0,a.mdx)("p",null,"results in the two strings: ",(0,a.mdx)("inlineCode",{parentName:"p"},"foo")," and ",(0,a.mdx)("inlineCode",{parentName:"p"},"-bar \u0429"),"; the space character between\n",(0,a.mdx)("inlineCode",{parentName:"p"},"-bar")," and ",(0,a.mdx)("inlineCode",{parentName:"p"},"\\u0429")," is not interpreted as a separator."),(0,a.mdx)("h2",{id:"transclusion-of-values-from-one-key-to-another"},"Transclusion of values from one key to another"),(0,a.mdx)("p",null,"Values from other keys can be transcluded into the current key using the\nfollowing syntax inside the current key value."),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"$(config <section>.<field>)\n")),(0,a.mdx)("p",null,"For example, to use the ",(0,a.mdx)("inlineCode",{parentName:"p"},"[go].vendor_path")," in a custom setting:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"[custom_section]custom_value = $(config go.vendor_path)\n")),(0,a.mdx)("h2",{id:"comments"},"Comments"),(0,a.mdx)("p",null,"In addition to the semicolon (",(0,a.mdx)("inlineCode",{parentName:"p"},";"),"), you can use the pound sign (",(0,a.mdx)("inlineCode",{parentName:"p"},"#"),"), as a\ncomment character in ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig"),"."),(0,a.mdx)("h2",{id:"buckconfiglocal"},".buckconfig.local"),(0,a.mdx)("p",null,"The root of your ",(0,a.mdx)("a",{parentName:"p",href:"/docs/concepts/glossary#project"},"project")," may contain a second\nconfiguration file named ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.local"),". Its format is the same as that of\n",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig"),", but settings in ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.local")," override those in\n",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig"),". In practice, ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," is a version-controlled file that\ncontains settings that are applicable to all team members, whereas\n",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.local")," is excluded from version control to allow users to define\npersonal settings, such as personal aliases."),(0,a.mdx)("h2",{id:"other-initialization-files"},"Other initialization files"),(0,a.mdx)("p",null,"In addition to the ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," and ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.local")," files in the project\nroot, Buck2 reads configuration settings from the following additional\nlocations, some of which are actually directories:"),(0,a.mdx)("ol",null,(0,a.mdx)("li",{parentName:"ol"},"Directory ",(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig.d")," located in the project root directory."),(0,a.mdx)("li",{parentName:"ol"},"File ",(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig")," and directory ",(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig.d")," located in the current\nuser's home directory which, on Unix-like systems, is available from the\n",(0,a.mdx)("inlineCode",{parentName:"li"},"HOME")," environment variable or through the ",(0,a.mdx)("inlineCode",{parentName:"li"},"~")," symbol."),(0,a.mdx)("li",{parentName:"ol"},"File ",(0,a.mdx)("inlineCode",{parentName:"li"},"buckconfig")," and directory ",(0,a.mdx)("inlineCode",{parentName:"li"},"buckconfig.d")," located in system directory\n",(0,a.mdx)("inlineCode",{parentName:"li"},"/etc/"),".")),(0,a.mdx)("p",null,"Buck2 treats ",(0,a.mdx)("em",{parentName:"p"},"any")," file\u2014irrespective of name\u2014in a\n",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.d"),"(",(0,a.mdx)("inlineCode",{parentName:"p"},"buckconfig.d"),") directory (excluding files found in\nsubdirectories) as a Buck2 configuration file, provided that it adheres to\n",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," syntax. Note that a ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.d")," directory is distinct from the\nsimilarly-named ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckd")," directory which is used by the\n",(0,a.mdx)("a",{parentName:"p",href:"/docs/concepts/daemon"},"Buck2 Daemon (",(0,a.mdx)("inlineCode",{parentName:"a"},"buckd"),")")," . For a description of how Buck2 resolves\ncollisions between settings in these configuration files, see the section\n",(0,a.mdx)("a",{parentName:"p",href:"#precedence-of-buck2-configuration-specifications"},(0,a.mdx)("strong",{parentName:"a"},"Precedence of Buck2 configuration specifications")),"\nbelow."),(0,a.mdx)("h2",{id:"command-line-control-of-configuration"},"Command-line control of configuration"),(0,a.mdx)("p",null,"In addition to the above configuration files, Buck2 supports specifying\nadditional configuration files from the Buck2 command line using the\n",(0,a.mdx)("inlineCode",{parentName:"p"},"--config-file")," parameter. You can also specify configuration settings\n",(0,a.mdx)("em",{parentName:"p"},"individually")," on the Buck2 command line using the ",(0,a.mdx)("inlineCode",{parentName:"p"},"--config")," (",(0,a.mdx)("inlineCode",{parentName:"p"},"-c"),") parameter.\nFurthermore, you can aggregate these settings into ",(0,a.mdx)("em",{parentName:"p"},"flag files")," using the\n",(0,a.mdx)("inlineCode",{parentName:"p"},"--flagfile")," parameter. A flag file provides similar functionality to a\nconfiguration file but uses a different syntax. Flag files are sometimes called\n",(0,a.mdx)("em",{parentName:"p"},"mode files")," or ",(0,a.mdx)("em",{parentName:"p"},"at")," (",(0,a.mdx)("inlineCode",{parentName:"p"},"@"),") files."),(0,a.mdx)("h2",{id:"precedence-of-buck2-configuration-specifications"},"Precedence of Buck2 configuration specifications"),(0,a.mdx)("p",null,"The following list shows the order of precedence for how Buck2 interprets its\nconfiguration specifications. Settings specified using a method closer to the\ntop of the list have higher precedence and will override those lower on the\nlist. For example, the ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," file in the repo overrides a ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig"),"\nfile in the user's ",(0,a.mdx)("inlineCode",{parentName:"p"},"HOME")," directory."),(0,a.mdx)("ol",null,(0,a.mdx)("li",{parentName:"ol"},"Configuration specified on the command line using ",(0,a.mdx)("inlineCode",{parentName:"li"},"--config")," (",(0,a.mdx)("inlineCode",{parentName:"li"},"-c"),"),\n",(0,a.mdx)("inlineCode",{parentName:"li"},"--config-file")," and ",(0,a.mdx)("inlineCode",{parentName:"li"},"--flagfile"),". Configuration specified later on the\ncommand line overrides configuration specified earlier."),(0,a.mdx)("li",{parentName:"ol"},(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig.local")," in the repo."),(0,a.mdx)("li",{parentName:"ol"},(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig")," in the repo."),(0,a.mdx)("li",{parentName:"ol"},"Files in a ",(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig.d")," folder of the repo."),(0,a.mdx)("li",{parentName:"ol"},(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig.local")," in user's ",(0,a.mdx)("inlineCode",{parentName:"li"},"HOME")," directory."),(0,a.mdx)("li",{parentName:"ol"},"Files in a ",(0,a.mdx)("inlineCode",{parentName:"li"},".buckconfig.d")," folder in user's ",(0,a.mdx)("inlineCode",{parentName:"li"},"HOME")," directory."),(0,a.mdx)("li",{parentName:"ol"},"The global file ",(0,a.mdx)("inlineCode",{parentName:"li"},"/etc/buckconfig")),(0,a.mdx)("li",{parentName:"ol"},"Files in the global directory ",(0,a.mdx)("inlineCode",{parentName:"li"},"/etc/buckconfig.d"))),(0,a.mdx)("p",null,"Files in a ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig.d")," (",(0,a.mdx)("inlineCode",{parentName:"p"},"buckconfig.d"),") directory have precedence according\nto the lexicographical order of their file names. Files ",(0,a.mdx)("em",{parentName:"p"},"later")," in the\nlexicographical order have precedence over files earlier in that order."),(0,a.mdx)("h2",{id:"configuration-files-can-include-other-files"},"Configuration files can include other files"),(0,a.mdx)("p",null,"Any of the configuration files that we've discussed so far can also include by\nreference other files that contain configuration information. These included\nfiles can contain complete ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," sections or they can contain a group of\nkey name/value pairs that constitute part of a section. In this second use case,\nyou'll need to ensure that the ",(0,a.mdx)("em",{parentName:"p"},"included")," file is referenced beneath the\nappropriate section in the ",(0,a.mdx)("em",{parentName:"p"},"including")," file. Because of this additional\ncomplexity, we recommend that you include only files that contain complete\nsections. ",(0,a.mdx)("strong",{parentName:"p"},"Note:")," Inclusion of files is a Buck-specific extension to the INI\nfile parser that Buck2 uses. Therefore, if you use this feature, your Buck2\nconfiguration files will probably not be parsable by other more-generic INI file\nparsers. The syntax to include a file is"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"<file:*path-to-included-file*>\n")),(0,a.mdx)("p",null,"where ",(0,a.mdx)("em",{parentName:"p"},"path-to-included-file")," is either a relative path from the including file\n(recommended) or an absolute path from the root of the file system. You can also\nspecify that the file should be included only if it exists by prefixing with a\nquestion mark (",(0,a.mdx)("inlineCode",{parentName:"p"},"?"),")."),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"<?file:*path-to-included-file*>\n")),(0,a.mdx)("p",null,"If you use this prefix, it is not an error condition if the file does not exist;\nBuck2 just silently continues to process the rest of the configuration file. In\nthe following example, the ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," file includes the file\n",(0,a.mdx)("inlineCode",{parentName:"p"},"cxx-other-platform.include")," which exists in the subdirectory\n",(0,a.mdx)("inlineCode",{parentName:"p"},"cxx-other-platform"),". The ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," file will also include the file\n",(0,a.mdx)("inlineCode",{parentName:"p"},"future-platform")," from the directory ",(0,a.mdx)("inlineCode",{parentName:"p"},"future-platform.include")," if that file\nexists."),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},'#\n# .buckconfig\n#\n[cxx]\n  cxxppflags="-D MYMACRO=\\"Buck\\""\n\n<file:cxx-other-platform/cxx-other-platform.include>\n\n<?file:future-platform/future-platform.include>\n#\n# cxx-other-platform.include\n#\n[cxx#other_platform]\n  cxxppflags="-D MYMACRO=\\"Watchman\\""\n')),(0,a.mdx)("h2",{id:"sections"},"Sections"),(0,a.mdx)("p",null,"Below is an incomplete list of supported buckconfigs."),(0,a.mdx)("h2",{id:"alias"},"[alias]"),(0,a.mdx)("p",null,"This section contains definitions of ",(0,a.mdx)("a",{parentName:"p",href:"/docs/concepts/build_target"},"build target")," aliases."),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"[alias]app     = //apps/myapp:app\n  apptest = //apps/myapp:test\n")),(0,a.mdx)("p",null,"These aliases can then be used from the command line:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"$ buck2 build app\n$ buck2 test apptest\n")),(0,a.mdx)("h2",{id:"cells"},"[cells]"),(0,a.mdx)("p",null,"Lists the cells that constitute the Buck2 project. Buck2 builds that are part of\nthis project\u2014that is, which use this ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig"),"\u2014can access the cells\nspecified in this section."),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"[cells]\n    buck = .\n    bazel_skylib = ./third-party/skylark/bazel-skylib\n")),(0,a.mdx)("p",null,"The string on the left-hand side of the equals sign is the ",(0,a.mdx)("em",{parentName:"p"},"alias")," for the cell.\nThe string on the right-hand side of the equals sign is the path to the cell\nfrom the directory that contains this ",(0,a.mdx)("inlineCode",{parentName:"p"},".buckconfig")," file. It is not necessary to\ninclude the current cell in this section, but we consider it a best practice to\ndo so:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"buck = .\n")),(0,a.mdx)("p",null,"You can view the contents of this section using the ",(0,a.mdx)("inlineCode",{parentName:"p"},"buck2 audit cell")," command."),(0,a.mdx)("p",null,(0,a.mdx)("inlineCode",{parentName:"p"},"[repositories]")," is additionally supported as a deprecated alternative name for\nthis section."))}m.isMDXComponent=!0}}]);