"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3907],{3905:(t,e,a)=>{a.r(e),a.d(e,{MDXContext:()=>s,MDXProvider:()=>f,mdx:()=>x,useMDXComponents:()=>d,withMDXComponents:()=>p});var r=a(67294);function n(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function i(){return i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(t[r]=a[r])}return t},i.apply(this,arguments)}function o(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function c(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?o(Object(a),!0).forEach((function(e){n(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function l(t,e){if(null==t)return{};var a,r,n=function(t,e){if(null==t)return{};var a,r,n={},i=Object.keys(t);for(r=0;r<i.length;r++)a=i[r],e.indexOf(a)>=0||(n[a]=t[a]);return n}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)a=i[r],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}var s=r.createContext({}),p=function(t){return function(e){var a=d(e.components);return r.createElement(t,i({},e,{components:a}))}},d=function(t){var e=r.useContext(s),a=e;return t&&(a="function"==typeof t?t(e):c(c({},e),t)),a},f=function(t){var e=d(t.components);return r.createElement(s.Provider,{value:e},t.children)},m="mdxType",u={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},h=r.forwardRef((function(t,e){var a=t.components,n=t.mdxType,i=t.originalType,o=t.parentName,s=l(t,["components","mdxType","originalType","parentName"]),p=d(a),f=n,m=p["".concat(o,".").concat(f)]||p[f]||u[f]||i;return a?r.createElement(m,c(c({ref:e},s),{},{components:a})):r.createElement(m,c({ref:e},s))}));function x(t,e){var a=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var i=a.length,o=new Array(i);o[0]=h;var c={};for(var l in e)hasOwnProperty.call(e,l)&&(c[l]=e[l]);c.originalType=t,c[m]="string"==typeof t?t:n,o[1]=c;for(var s=2;s<i;s++)o[s]=a[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}h.displayName="MDXCreateElement"},63561:(t,e,a)=>{a.r(e),a.d(e,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>s});var r=a(87462),n=(a(67294),a(3905));const i={id:"artifact"},o="artifact type",c={unversionedId:"api/bxl/artifact",id:"api/bxl/artifact",title:"artifact type",description:"A single input or output file for an action.",source:"@site/../docs/api/bxl/artifact.generated.md",sourceDirName:"api/bxl",slug:"/api/bxl/artifact",permalink:"/docs/api/bxl/artifact",draft:!1,tags:[],version:"current",frontMatter:{id:"artifact"},sidebar:"apiSidebar",previous:{title:"anon_targets type",permalink:"/docs/api/bxl/anon_targets"},next:{title:"attrs type",permalink:"/docs/api/bxl/attrs"}},l={},s=[{value:"artifact.as_output",id:"artifactas_output",level:2},{value:"artifact.basename",id:"artifactbasename",level:2},{value:"artifact.extension",id:"artifactextension",level:2},{value:"artifact.is_source",id:"artifactis_source",level:2},{value:"artifact.owner",id:"artifactowner",level:2},{value:"artifact.project",id:"artifactproject",level:2},{value:"artifact.short_path",id:"artifactshort_path",level:2},{value:"artifact.with_associated_artifacts",id:"artifactwith_associated_artifacts",level:2},{value:"artifact.without_associated_artifacts",id:"artifactwithout_associated_artifacts",level:2}],p={toc:s};function d(t){let{components:e,...a}=t;return(0,n.mdx)("wrapper",(0,r.Z)({},p,a,{components:e,mdxType:"MDXLayout"}),(0,n.mdx)("h1",{id:"artifact-type"},(0,n.mdx)("inlineCode",{parentName:"h1"},"artifact")," type"),(0,n.mdx)("p",null,"A single input or output file for an action."),(0,n.mdx)("p",null,"There is no ",(0,n.mdx)("inlineCode",{parentName:"p"},".parent")," method on ",(0,n.mdx)("inlineCode",{parentName:"p"},"artifact"),", but in most cases\n",(0,n.mdx)("inlineCode",{parentName:"p"},"cmd_args(my_artifact, parent = 1)")," can be used to similar effect."),(0,n.mdx)("h2",{id:"artifactas_output"},"artifact.as","_","output"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"def artifact.as_output() -> output_artifact\n")),(0,n.mdx)("p",null,"Returns a ",(0,n.mdx)("inlineCode",{parentName:"p"},"StarlarkOutputArtifact")," instance, or fails if the artifact is either an ",(0,n.mdx)("inlineCode",{parentName:"p"},"Artifact"),", or is a bound ",(0,n.mdx)("inlineCode",{parentName:"p"},"Artifact")," (You cannot bind twice)"),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactbasename"},"artifact.basename"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"artifact.basename: str\n")),(0,n.mdx)("p",null,"The base name of this artifact. e.g. for an artifact at ",(0,n.mdx)("inlineCode",{parentName:"p"},"foo/bar"),", this is ",(0,n.mdx)("inlineCode",{parentName:"p"},"bar")),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactextension"},"artifact.extension"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"artifact.extension: str\n")),(0,n.mdx)("p",null,"The file extension of this artifact. e.g. for an artifact at foo/bar.sh, this is ",(0,n.mdx)("inlineCode",{parentName:"p"},".sh"),". If no extension is present, ",(0,n.mdx)("inlineCode",{parentName:"p"},'""')," is returned."),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactis_source"},"artifact.is","_","source"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"artifact.is_source: bool\n")),(0,n.mdx)("p",null,"Whether the artifact represents a source file"),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactowner"},"artifact.owner"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"artifact.owner: None | label\n")),(0,n.mdx)("p",null,"The ",(0,n.mdx)("inlineCode",{parentName:"p"},"Label")," of the rule that originally created this artifact. May also be None in the case of source files, or if the artifact has not be used in an action, or if the action was not created by a rule."),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactproject"},"artifact.project"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"def artifact.project(\n    path: str,\n    /,\n    *,\n    hide_prefix: bool = False\n) -> artifact\n")),(0,n.mdx)("p",null,"Create an artifact that lives at path relative from this artifact."),(0,n.mdx)("p",null,"For example, if artifact foo is a directory containing a file bar, then ",(0,n.mdx)("inlineCode",{parentName:"p"},'foo.project("bar")'),"\nyields the file bar. It is possible for projected artifacts to hide the prefix in order to\nhave the short name of the resulting artifact only contain the projected path, by passing\n",(0,n.mdx)("inlineCode",{parentName:"p"},"hide_prefix = True")," to ",(0,n.mdx)("inlineCode",{parentName:"p"},"project()"),"."),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactshort_path"},"artifact.short","_","path"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"artifact.short_path: str\n")),(0,n.mdx)("p",null,"The interesting part of the path, relative to somewhere in the output directory. For an artifact declared as ",(0,n.mdx)("inlineCode",{parentName:"p"},"foo/bar"),", this is ",(0,n.mdx)("inlineCode",{parentName:"p"},"foo/bar"),"."),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactwith_associated_artifacts"},"artifact.with","_","associated","_","artifacts"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"def artifact.with_associated_artifacts(artifacts: list[artifact]) -> artifact\n")),(0,n.mdx)("p",null,"Returns a ",(0,n.mdx)("inlineCode",{parentName:"p"},"StarlarkArtifact")," instance which is identical to the original artifact, but with potentially additional artifacts. The artifacts must be bound."),(0,n.mdx)("hr",null),(0,n.mdx)("h2",{id:"artifactwithout_associated_artifacts"},"artifact.without","_","associated","_","artifacts"),(0,n.mdx)("pre",null,(0,n.mdx)("code",{parentName:"pre",className:"language-python"},"def artifact.without_associated_artifacts() -> artifact\n")),(0,n.mdx)("p",null,"Returns a ",(0,n.mdx)("inlineCode",{parentName:"p"},"StarlarkArtifact")," instance which is identical to the original artifact, except with no associated artifacts"))}d.isMDXComponent=!0}}]);