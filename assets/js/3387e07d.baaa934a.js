"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7318],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>p,MDXProvider:()=>d,mdx:()=>b,useMDXComponents:()=>s,withMDXComponents:()=>c});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(){return o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),c=function(e){return function(t){var n=s(t.components);return r.createElement(e,o({},t,{components:n}))}},s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},x="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),c=s(n),d=a,x=c["".concat(l,".").concat(d)]||c[d]||m[d]||o;return n?r.createElement(x,i(i({ref:t},p),{},{components:n})):r.createElement(x,i({ref:t},p))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=f;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i[x]="string"==typeof e?e:a,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},35618:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>s,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var r=n(87462),a=(n(67294),n(3905));const o={id:"bxl.AuditContext"},l="bxl.AuditContext type",i={unversionedId:"api/bxl/bxl.AuditContext",id:"api/bxl/bxl.AuditContext",title:"bxl.AuditContext type",description:"The context for performing audit operations in bxl. The functions offered on this ctx are the same behaviour as the audit functions available within audit command.",source:"@site/../docs/api/bxl/bxl.AuditContext.generated.md",sourceDirName:"api/bxl",slug:"/api/bxl/bxl.AuditContext",permalink:"/docs/api/bxl/bxl.AuditContext",draft:!1,tags:[],version:"current",frontMatter:{id:"bxl.AuditContext"},sidebar:"apiSidebar",previous:{title:"bxl.AqueryContext type",permalink:"/docs/api/bxl/bxl.AqueryContext"},next:{title:"bxl.BuildResult type",permalink:"/docs/api/bxl/bxl.BuildResult"}},u={},p=[{value:"bxl.AuditContext.cell",id:"bxlauditcontextcell",level:2},{value:"bxl.AuditContext.output",id:"bxlauditcontextoutput",level:2}],c={toc:p};function s(e){let{components:t,...n}=e;return(0,a.mdx)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.mdx)("h1",{id:"bxlauditcontext-type"},(0,a.mdx)("inlineCode",{parentName:"h1"},"bxl.AuditContext")," type"),(0,a.mdx)("p",null,"The context for performing ",(0,a.mdx)("inlineCode",{parentName:"p"},"audit")," operations in bxl. The functions offered on this ctx are the same behaviour as the audit functions available within audit command."),(0,a.mdx)("h2",{id:"bxlauditcontextcell"},"bxl.AuditContext.cell"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},"def bxl.AuditContext.cell(\n    aliases_to_resolve: list[str] | tuple[str, ...] = [],\n    *,\n    aliases: bool = False\n) -> dict[str, str]\n")),(0,a.mdx)("p",null,"Query information about the ","[cells]"," list in .buckconfig."),(0,a.mdx)("p",null,"Takes the following parameters:"),(0,a.mdx)("ul",null,(0,a.mdx)("li",{parentName:"ul"},(0,a.mdx)("inlineCode",{parentName:"li"},"aliases_to_resolve")," - list of cell aliases to query. These aliases will be resolved in the root cell of the BXL script."),(0,a.mdx)("li",{parentName:"ul"},"optional ",(0,a.mdx)("inlineCode",{parentName:"li"},"aliases")," flag - if enabled, and no explicit aliases are passed, will query for all aliases in the root cell of the BXL script.")),(0,a.mdx)("p",null,"Returns a dict of cell name to absolute path mappings."),(0,a.mdx)("p",null,"Sample usage:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-text"},"def _impl_audit_cell(ctx):\n    result = ctx.audit().cell(aliases = True)\n    ctx.output.print(result)\n")),(0,a.mdx)("hr",null),(0,a.mdx)("h2",{id:"bxlauditcontextoutput"},"bxl.AuditContext.output"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-python"},"def bxl.AuditContext.output(\n    output_path: str,\n    target_platform: None | str | target_label = _\n)\n")),(0,a.mdx)("p",null,"Returns either: - The ",(0,a.mdx)("inlineCode",{parentName:"p"},"action")," which created the buck-out path, if exists. - The ",(0,a.mdx)("inlineCode",{parentName:"p"},"unconfigured_target_label")," constructed from the buck-out path, if the configuration hashes do not match. - None, if the configuration hash of the buck-out path matches the one passed into this function, or the default target configuration, but no action could be found that generated the buck-out path."),(0,a.mdx)("p",null,"Takes in an optional target platform, otherwise will use the default target platform."),(0,a.mdx)("p",null,"Sample usage:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre",className:"language-text"},'def _impl_audit_output(ctx):\n    target_platform = "foo"\n    result = ctx.audit().output("buck-out/v2/gen/fbcode/some_cfg_hash/path/to/__target__/artifact", target_platform)\n    ctx.output.print(result)\n')))}s.isMDXComponent=!0}}]);