"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1623],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>c,MDXProvider:()=>p,mdx:()=>y,useMDXComponents:()=>m,withMDXComponents:()=>s});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(){return o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},o.apply(this,arguments)}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?d(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),s=function(e){return function(t){var n=m(t.components);return a.createElement(e,o({},t,{components:n}))}},m=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(c.Provider,{value:t},e.children)},u="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,d=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=m(n),p=r,u=s["".concat(d,".").concat(p)]||s[p]||g[p]||o;return n?a.createElement(u,i(i({ref:t},c),{},{components:n})):a.createElement(u,i({ref:t},c))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,d=new Array(o);d[0]=h;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:r,d[1]=i;for(var c=2;c<o;c++)d[c]=n[c];return a.createElement.apply(null,d)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},1673:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>d,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var a=n(87462),r=(n(67294),n(3905));const o={id:"cmd_args"},d="cmd_args type",i={unversionedId:"api/bxl/cmd_args",id:"api/bxl/cmd_args",title:"cmd_args type",description:"The cmdargs type is created by cmdargs() and is consumed by ctx.actions.run. The type is a mutable collection of strings and artifact values. In general, command lines, artifacts, strings, RunInfo and lists thereof can be added to or used to construct a cmd_args value. All these methods operate mutably on cmd and return that value too.",source:"@site/../docs/api/bxl/cmd_args.generated.md",sourceDirName:"api/bxl",slug:"/api/bxl/cmd_args",permalink:"/docs/api/bxl/cmd_args",draft:!1,tags:[],version:"current",frontMatter:{id:"cmd_args"},sidebar:"apiSidebar",previous:{title:"bxl.UqueryContext type",permalink:"/docs/api/bxl/bxl.UqueryContext"},next:{title:"coerced_attr type",permalink:"/docs/api/bxl/coerced_attr"}},l={},c=[{value:"cmd_args.add",id:"cmd_argsadd",level:2},{value:"cmd_args.copy",id:"cmd_argscopy",level:2},{value:"cmd_args.inputs",id:"cmd_argsinputs",level:2},{value:"cmd_args.outputs",id:"cmd_argsoutputs",level:2},{value:"cmd_args.relative_to",id:"cmd_argsrelative_to",level:2}],s={toc:c};function m(e){let{components:t,...n}=e;return(0,r.mdx)("wrapper",(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.mdx)("h1",{id:"cmd_args-type"},(0,r.mdx)("inlineCode",{parentName:"h1"},"cmd_args")," type"),(0,r.mdx)("p",null,"The ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args")," type is created by ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args()")," and is consumed by ",(0,r.mdx)("inlineCode",{parentName:"p"},"ctx.actions.run"),". The type is a mutable collection of strings and ",(0,r.mdx)("inlineCode",{parentName:"p"},"artifact")," values. In general, command lines, artifacts, strings, ",(0,r.mdx)("inlineCode",{parentName:"p"},"RunInfo")," and lists thereof can be added to or used to construct a ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args")," value. All these methods operate mutably on ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd")," and return that value too."),(0,r.mdx)("h2",{id:"cmd_argsadd"},"cmd","_","args.add"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def cmd_args.add(*args) -> cmd_args\n")),(0,r.mdx)("p",null,"A list of arguments to be added to the command line, which may including ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args"),", artifacts, strings, ",(0,r.mdx)("inlineCode",{parentName:"p"},"RunInfo")," or lists thereof. Note that this operation mutates the input ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args"),"."),(0,r.mdx)("hr",null),(0,r.mdx)("h2",{id:"cmd_argscopy"},"cmd","_","args.copy"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def cmd_args.copy() -> cmd_args\n")),(0,r.mdx)("p",null,"Returns a copy of the ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args")," such that any modifications to the original or the returned value will not impact each other. Note that this is a shallow copy, so any inner ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args")," can still be modified."),(0,r.mdx)("hr",null),(0,r.mdx)("h2",{id:"cmd_argsinputs"},"cmd","_","args.inputs"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"cmd_args.inputs: command_line_inputs\n")),(0,r.mdx)("p",null,"Collect all the inputs (including hidden) referenced by this command line. The output can be compared for equality and have its ",(0,r.mdx)("inlineCode",{parentName:"p"},"len")," requested to see whether there are any inputs, but is otherwise mostly opaque."),(0,r.mdx)("hr",null),(0,r.mdx)("h2",{id:"cmd_argsoutputs"},"cmd","_","args.outputs"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"cmd_args.outputs: list[output_artifact]\n")),(0,r.mdx)("p",null,"Collect all the outputs (including hidden) referenced by this command line."),(0,r.mdx)("hr",null),(0,r.mdx)("h2",{id:"cmd_argsrelative_to"},"cmd","_","args.relative","_","to"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def cmd_args.relative_to(\n    directory: artifact | cell_root | project_root,\n    /,\n    *,\n    parent: int = _\n) -> cmd_args\n")),(0,r.mdx)("p",null,"Make all artifact paths relative to a given location. Typically used when the command you are running changes directory."),(0,r.mdx)("p",null,"By default, the paths are relative to the artifacts themselves (equivalent to\n",(0,r.mdx)("inlineCode",{parentName:"p"},"parent = 0"),"). Use ",(0,r.mdx)("inlineCode",{parentName:"p"},"parent")," to make the paths relative to an ancestor directory.\nFor example ",(0,r.mdx)("inlineCode",{parentName:"p"},"parent = 1")," would make all paths relative to the containing dirs\nof any artifacts in the ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args"),"."),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},'dir = symlinked_dir(...)\nscript = [\n    cmd_args(cmd_args(dir, format = "cd {}"),\n    original_script.relative_to(dir)\n]\n')))}m.isMDXComponent=!0}}]);