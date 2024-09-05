"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4288],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>p,MDXProvider:()=>m,mdx:()=>x,useMDXComponents:()=>d,withMDXComponents:()=>c});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i.apply(this,arguments)}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),c=function(e){return function(t){var n=d(t.components);return a.createElement(e,i({},t,{components:n}))}},d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},m=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},b=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),c=d(n),m=r,u=c["".concat(l,".").concat(m)]||c[m]||f[m]||i;return n?a.createElement(u,s(s({ref:t},p),{},{components:n})):a.createElement(u,s({ref:t},p))}));function x(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=b;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[u]="string"==typeof e?e:r,l[1]=s;for(var p=2;p<i;p++)l[p]=n[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},36857:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>p});var a=n(87462),r=(n(67294),n(3905));const i={id:"instant"},l="instant type",s={unversionedId:"api/bxl/instant",id:"api/bxl/instant",title:"instant type",description:"Instant methods, to aid in debugging/timing individual pieces of the bxl script.",source:"@site/../docs/api/bxl/instant.generated.md",sourceDirName:"api/bxl",slug:"/api/bxl/instant",permalink:"/docs/api/bxl/instant",draft:!1,tags:[],version:"current",frontMatter:{id:"instant"},sidebar:"apiSidebar",previous:{title:"file_set type",permalink:"/docs/api/bxl/file_set"},next:{title:"label type",permalink:"/docs/api/bxl/label"}},o={},p=[{value:"instant.elapsed_millis",id:"instantelapsed_millis",level:2},{value:"instant.elapsed_secs",id:"instantelapsed_secs",level:2}],c={toc:p};function d(e){let{components:t,...n}=e;return(0,r.mdx)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.mdx)("h1",{id:"instant-type"},(0,r.mdx)("inlineCode",{parentName:"h1"},"instant")," type"),(0,r.mdx)("p",null,"Instant methods, to aid in debugging/timing individual pieces of the bxl script."),(0,r.mdx)("h2",{id:"instantelapsed_millis"},"instant.elapsed","_","millis"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def instant.elapsed_millis() -> float\n")),(0,r.mdx)("p",null,"Elapsed time in millis as a float"),(0,r.mdx)("p",null,"Sample usage:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-text"},"def _impl_elapsed_millis(ctx):\n    now = now()\n    time_a = now.elapsed_millis()\n    # do something that takes a long time\n    time_b = now.elapsed_millis()\n\n    ctx.output.print(time_a)\n    ctx.output.print(time_b)\n")),(0,r.mdx)("hr",null),(0,r.mdx)("h2",{id:"instantelapsed_secs"},"instant.elapsed","_","secs"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def instant.elapsed_secs() -> float\n")),(0,r.mdx)("p",null,"Elapsed time in secs as a float"),(0,r.mdx)("p",null,"Sample usage:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-text"},"def _impl_elapsed_secs(ctx):\n    now = now()\n    time_a = now.elapsed_secs()\n    # do something that takes a long time\n    time_b = now.elapsed_secs()\n\n    ctx.output.print(time_a)\n    ctx.output.print(time_b)\n")))}d.isMDXComponent=!0}}]);