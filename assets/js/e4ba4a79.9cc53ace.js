"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5443],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>c,MDXProvider:()=>h,mdx:()=>g,useMDXComponents:()=>u,withMDXComponents:()=>d});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i.apply(this,arguments)}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),d=function(e){return function(t){var n=u(t.components);return a.createElement(e,i({},t,{components:n}))}},u=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},h=function(e){var t=u(e.components);return a.createElement(c.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=u(n),h=r,p=d["".concat(o,".").concat(h)]||d[h]||m[h]||i;return n?a.createElement(p,s(s({ref:t},c),{},{components:n})):a.createElement(p,s({ref:t},c))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=f;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:r,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},17716:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var a=n(87462),r=(n(67294),n(3905)),i=n(44996);const o={id:"buck2",title:"Architectural Model"},s=void 0,l={unversionedId:"developers/architecture/buck2",id:"developers/architecture/buck2",title:"Architectural Model",description:"High-level Overview",source:"@site/../docs/developers/architecture/buck2.md",sourceDirName:"developers/architecture",slug:"/developers/architecture/buck2",permalink:"/docs/developers/architecture/buck2",draft:!1,tags:[],version:"current",frontMatter:{id:"buck2",title:"Architectural Model"},sidebar:"mainSidebar",previous:{title:"FAQs",permalink:"/docs/developers/bxl_faqs"},next:{title:"Buck1 vs Buck2",permalink:"/docs/developers/architecture/buck1_vs_buck2"}},c={},d=[{value:"High-level Overview",id:"high-level-overview",level:2},{value:"Execution Model",id:"execution-model",level:2},{value:"State 0 - Build Files",id:"state-0---build-files",level:3},{value:"Phase A: Evaluation",id:"phase-a-evaluation",level:3},{value:"State 1 - Unconfigured Target Graph is generated",id:"state-1---unconfigured-target-graph-is-generated",level:3},{value:"Phase B: Configuration",id:"phase-b-configuration",level:3},{value:"State 2 - Configured Target Graph is generated",id:"state-2---configured-target-graph-is-generated",level:3},{value:"Phase C: Analysis",id:"phase-c-analysis",level:3},{value:"State 3 - Action Graph and Providers are generated",id:"state-3---action-graph-and-providers-are-generated",level:3},{value:"Phase D: Execute",id:"phase-d-execute",level:3},{value:"State 4 - Build outputs are generated",id:"state-4---build-outputs-are-generated",level:3},{value:"Phase E: Execute tests",id:"phase-e-execute-tests",level:3}],u={toc:d};function h(e){let{components:t,...n}=e;return(0,r.mdx)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.mdx)("h2",{id:"high-level-overview"},"High-level Overview"),(0,r.mdx)("p",null,"Buck2 is a build system whose core is written in Rust. Starlark, which is a\ndeterministic, immutable version of Python, is used to extend the Buck2 build\nsystem, enabling Buck2 to be language-agnostic."),(0,r.mdx)("p",null,"The high-level flow starts with a user creating a build file (a ",(0,r.mdx)("inlineCode",{parentName:"p"},"BUCK")," file)\ncontaining one or more targets, which is specified by the target label, its\ninputs (sources, attributes, configurations, and dependencies), and the type of\nmacro or rule to use."),(0,r.mdx)("p",null,"Briefly, a macro is a wrapper around a rule, which runs necessary commands to\ngenerate what\u2019s needed for a target (for example, for a ",(0,r.mdx)("inlineCode",{parentName:"p"},"cxx_binary")," target,\ngenerate the header map and run necessary ",(0,r.mdx)("inlineCode",{parentName:"p"},"clang")," commands). Macros can be used\nto reduce boilerplate code for users (such as to supply the same set of\nattributes for a rule for all targets). Macros and rules are both written in\nStarlark and are specified by input sources, attributes, and the implementation\nfunction."),(0,r.mdx)("p",null,"If the target type is a macro, then the macro will fill in some details (for\nexample, for a ",(0,r.mdx)("inlineCode",{parentName:"p"},"cxx_binary")," target, these are the compilation, debug flags to\nuse, this is the ",(0,r.mdx)("inlineCode",{parentName:"p"},"clang")," to use). If the target type is a rule, then the macro\nlayer is skipped altogether."),(0,r.mdx)("p",null,"This is all orchestrated by the core, which performs operations such as\nexecuting Buck2 CLI args, generating/updating the dependency graph (which\ncontains the configured target nodes, unconfigured target nodes, action nodes,\namong other types of nodes that all allow for incrementality and execution), and\nmaterializing the artifacts. The core is written in Rust."),(0,r.mdx)("p",null,"The following diagram shows the high-level overview."),(0,r.mdx)("img",{src:(0,i.default)("/img/buck2_rule_workflow.png"),alt:"justifyContent"}),(0,r.mdx)("p",null,"The Buck2 CLI runs in a client process, which sends commands to the Buck2 daemon\nvia gRPC. The daemon goes through several phases after receiving a request from\nthe client: ",(0,r.mdx)("strong",{parentName:"p"},"evaluation, configuration, analysis, execution, and\nmaterialization")," (see ",(0,r.mdx)("a",{parentName:"p",href:"#execution-model"},"Execution Model"),", below). When using\n",(0,r.mdx)("inlineCode",{parentName:"p"},"buck2 test"),", there is a final stage for ",(0,r.mdx)("strong",{parentName:"p"},"testing"),". Note that these are the\nphases that a build goes through, but they are not always sequential."),(0,r.mdx)("p",null,"After finishing all phases, the daemon will send the response back to the client\nvia gRPC."),(0,r.mdx)("h2",{id:"execution-model"},"Execution Model"),(0,r.mdx)("p",null,"The following diagram shows the Execution Model, which consists of 5 phases and\nstates."),(0,r.mdx)("img",{src:(0,i.default)("/img/buck2_architecture.png"),alt:"justifyContent"}),(0,r.mdx)("p",null,"Each of the phases and states shown in the Execution Model, are detailed in the\nfollowing sub-sections."),(0,r.mdx)("h3",{id:"state-0---build-files"},"State 0 - Build Files"),(0,r.mdx)("p",null,"Build files (commonly referred to as ",(0,r.mdx)("inlineCode",{parentName:"p"},"BUCK")," files, their default name) are the\nmain input to Buck2 and are syntactically Python."),(0,r.mdx)("p",null,"Each build file is uniquely identified by the directory in which it's located.\nSince all build files have the same name, there cannot be two build files in the\nsame directory. This is usually represented as the relative path from the root\nof the project (the directory where the .buckconfig file is)."),(0,r.mdx)("p",null,"Each build file has a set of targets. These describe the things the user wants\nBuck2 to know about. Each target has a type and a set of named attributes,\nincluding at least a name (also known as the label) identifying it. Additional\nattributes depend on the type of the target."),(0,r.mdx)("h3",{id:"phase-a-evaluation"},"Phase A: Evaluation"),(0,r.mdx)("p",null,"First, Buck2 evaluates a build file, and then constructs an unconfigured target\ngraph."),(0,r.mdx)("p",null,"Buck2 performs directory listings to discover packages, then evaluates the build\nfiles that were found, expands any macros detected into their underlying rules,\nand then will take rule attributes and convert them from Starlark to Rust types\nto construct a target node, and insert it into the unconfigured target graph,\nwhich is a smaller portion of Buck2\u2019s larger dependency graph. The target node\nconsists of a reference to rule implementation, and the set of attributes and\nsources."),(0,r.mdx)("p",null,"The result of evaluation is a list of targets read from the build file mapped to\na target node in Buck2 unconfigured target graph."),(0,r.mdx)("h3",{id:"state-1---unconfigured-target-graph-is-generated"},"State 1 - Unconfigured Target Graph is generated"),(0,r.mdx)("p",null,"At this point, the unconfigured target graph is available for the next stage of\ntransformation, which is to configure the target nodes within the graph."),(0,r.mdx)("h3",{id:"phase-b-configuration"},"Phase B: Configuration"),(0,r.mdx)("p",null,"At the end of evaluation, the target nodes are not yet configured. Configuration\nmeans applying a list of constraints (such as resolving selects to specify the\nright CPU) to make sure the target can be run where it needs to. This is also\nknown as target platform resolution, and can be configured within the target,\nthe buckconfig, propagated from dependencies, or passed into the CLI. After\napplying configurations, the target nodes are transformed into configured target\nnodes within the Buck2 configured target graph, which is a smaller portion of\nBuck2\u2019s larger dependency graph."),(0,r.mdx)("h3",{id:"state-2---configured-target-graph-is-generated"},"State 2 - Configured Target Graph is generated"),(0,r.mdx)("p",null,"At this point, the configured target graph is available for the analysis stage\nto generate the action graph."),(0,r.mdx)("h3",{id:"phase-c-analysis"},"Phase C: Analysis"),(0,r.mdx)("p",null,"In the analysis phase, Buck2 constructs a context object (ctx) which contains\nrelevant information (such as attributes pulled from the configuration stage),\nall converted into Starlark types and made available to the rule. For example,\nthe target\u2019s dependencies are turned into a ",(0,r.mdx)("inlineCode",{parentName:"p"},"ProviderCollection"),", source files\nare converted into ",(0,r.mdx)("inlineCode",{parentName:"p"},"StarlarkArtifacts"),", and String attributes are turned into a\n",(0,r.mdx)("inlineCode",{parentName:"p"},"StarlarkString"),". This ctx object is backed by Buck2\u2019s dependency graph for\ncomputation and rules use it to tell Buck2 to run actions, create dynamic\nactions, or create new files."),(0,r.mdx)("p",null,"The rule will return a list of providers, which is data that the rule wants to\nexpose to its dependents (that is, can flow through the dependency graph), such\nas output artifact information (such as file paths and file hashes). Providers\ncould be actions, source files, or attributes. Within the returned list,\nDefaultInfo always needs to be returned, which indicates what the default\noutputs are. Some other common built-in providers include RunInfo, TestInfo, and\nInstallInfo."),(0,r.mdx)("p",null,"The end result is a list of providers and actions (inserted into the action\ngraph) that Buck2 needs to execute to produce the desired outputs, known as\n'bound artifacts'."),(0,r.mdx)("h3",{id:"state-3---action-graph-and-providers-are-generated"},"State 3 - Action Graph and Providers are generated"),(0,r.mdx)("p",null,"At this point, the action graph and providers are available to be processed by\nthe execution stage."),(0,r.mdx)("h3",{id:"phase-d-execute"},"Phase D: Execute"),(0,r.mdx)("p",null,"Execution is where Buck2 takes all the providers (input files from the targets,\nargs from the command line), runs the actions, and then outputs the computed\nresults. The critical path is the theoretical lower bound for the duration of a\nbuild, which are the slowest set of actions."),(0,r.mdx)("p",null,"Buck2 can be run locally or on remote execution, or in a hybrid manner."),(0,r.mdx)("p",null,"For each action, a digest is created which is a hash of an action's command and\nall its inputs. Buck2 then checks if there is a result cached within RE for an\naction with a given digest."),(0,r.mdx)("p",null,"If there is a cache hit, Buck2 does not need to run the command for the action.\nInstead, the RE returns the output action digest. This digest can be used to\ndownload the actual output artifacts at a later time. This is known as the ",(0,r.mdx)("strong",{parentName:"p"},"RE\naction cache"),"."),(0,r.mdx)("p",null,"If there is a cache miss, the action needs to be run either remotely or locally.\nIf Buck2 decides to run the action remotely, it will first upload all of the\naction's inputs that are missing from the RE's content addressable storage. If\nBuck2 decides to run the action locally, it will first download and materialize\nin ",(0,r.mdx)("inlineCode",{parentName:"p"},"buck-out")," all of the action's inputs. These inputs might be outputs of other\nactions and are stored in RE's content addressable storage but are missing on\nthe local machine.Only after those steps will Buck2 schedule the action for\nactual execution."),(0,r.mdx)("p",null,"Buck2 can also decide to run local and remote execution simultaneously (a\nprocess known as racing), and use the result of whichever action finishes first\nto speed up performance. This strategy is known as ",(0,r.mdx)("strong",{parentName:"p"},"hybrid execution"),'."'),(0,r.mdx)("p",null,"Materialization of action outputs (which involves downloading and placing them\nin the correct location in ",(0,r.mdx)("inlineCode",{parentName:"p"},"buck-out"),") can be done immediately after the action\nhas finished executing. Alternatively, it can be deferred until it is actually\nneeded for the local execution of another action. There are various\nconfigurations that a user can set to control how this materialization is\nhandled."),(0,r.mdx)("h3",{id:"state-4---build-outputs-are-generated"},"State 4 - Build outputs are generated"),(0,r.mdx)("p",null,"At this point, the build is complete."),(0,r.mdx)("p",null,"If a user ran ",(0,r.mdx)("inlineCode",{parentName:"p"},"buck2 test"),", then there is a final transformation for Buck2 to\nconstruct a command for TPX to execute the actual test."),(0,r.mdx)("h3",{id:"phase-e-execute-tests"},"Phase E: Execute tests"),(0,r.mdx)("p",null,"For more detail on testing, review\n",(0,r.mdx)("a",{parentName:"p",href:"/docs/rule_authors/test_execution"},"Test Execution"),"."))}h.isMDXComponent=!0}}]);