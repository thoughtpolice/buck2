"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8074],{3905:(e,n,a)=>{a.r(n),a.d(n,{MDXContext:()=>p,MDXProvider:()=>u,mdx:()=>f,useMDXComponents:()=>s,withMDXComponents:()=>m});var t=a(67294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function l(){return l=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},l.apply(this,arguments)}function i(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function o(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?i(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function d(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},l=Object.keys(e);for(t=0;t<l.length;t++)a=l[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(t=0;t<l.length;t++)a=l[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=t.createContext({}),m=function(e){return function(n){var a=s(n.components);return t.createElement(e,l({},n,{components:a}))}},s=function(e){var n=t.useContext(p),a=n;return e&&(a="function"==typeof e?e(n):o(o({},n),e)),a},u=function(e){var n=s(e.components);return t.createElement(p.Provider,{value:n},e.children)},c="mdxType",h={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},x=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),m=s(a),u=r,c=m["".concat(i,".").concat(u)]||m[u]||h[u]||l;return a?t.createElement(c,o(o({ref:n},p),{},{components:a})):t.createElement(c,o({ref:n},p))}));function f(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=x;var o={};for(var d in n)hasOwnProperty.call(n,d)&&(o[d]=n[d]);o.originalType=e,o[c]="string"==typeof e?e:r,i[1]=o;for(var p=2;p<l;p++)i[p]=a[p];return t.createElement.apply(null,i)}return t.createElement.apply(null,a)}x.displayName="MDXCreateElement"},13433:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>s,frontMatter:()=>l,metadata:()=>o,toc:()=>p});var t=a(87462),r=(a(67294),a(3905));const l={id:"heaps"},i="Heaps and Heap References",o={unversionedId:"developers/starlark/heaps",id:"developers/starlark/heaps",title:"Heaps and Heap References",description:"Heaps",source:"@site/../docs/developers/starlark/heaps.generated.md",sourceDirName:"developers/starlark",slug:"/developers/starlark/heaps",permalink:"/docs/developers/starlark/heaps",draft:!1,tags:[],version:"current",frontMatter:{id:"heaps"},sidebar:"mainSidebar",previous:{title:"A Moving Garbage Collector",permalink:"/docs/developers/starlark/gc"},next:{title:"Starlark Language Specification",permalink:"/docs/developers/starlark/spec"}},d={},p=[{value:"Heaps",id:"heaps",level:2},{value:"Heap Containers",id:"heap-containers",level:2},{value:"Heap References",id:"heap-references",level:2},{value:"<code>OwnedFrozenValue</code>",id:"ownedfrozenvalue",level:2}],m={toc:p};function s(e){let{components:n,...a}=e;return(0,r.mdx)("wrapper",(0,t.Z)({},m,a,{components:n,mdxType:"MDXLayout"}),(0,r.mdx)("h1",{id:"heaps-and-heap-references"},"Heaps and Heap References"),(0,r.mdx)("h2",{id:"heaps"},"Heaps"),(0,r.mdx)("p",null,"In Starlark, there are three interesting heap-related points of interest:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"Heap")," has ",(0,r.mdx)("inlineCode",{parentName:"li"},"Value"),"'s allocated on it and cannot be cloned or shared."),(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," has ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue"),"'s allocated on it and cannot be cloned or\nshared."),(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeapRef")," is a ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," that is now read-only and can now be\ncloned and shared.")),(0,r.mdx)("p",null,"A ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeapRef")," keeps a heap alive. While you have a ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenValue"),", it is\nimportant that you have either the ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeap")," itself, or more usually, a\n",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeapRef")," to it. A ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeap")," may contains a set of ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeapRef"),"'s to\nkeep the ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeap"),"s it references alive."),(0,r.mdx)("h2",{id:"heap-containers"},"Heap Containers"),(0,r.mdx)("p",null,"Heaps are included in other data types:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"Module")," contains a ",(0,r.mdx)("inlineCode",{parentName:"li"},"Heap")," (where normal values are allocated) and a\n",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," (stores references to other frozen heaps and has compilation\nconstants allocated on it). The ",(0,r.mdx)("inlineCode",{parentName:"li"},"Heap")," portion is garbage collected. At the\nend, when you call ",(0,r.mdx)("inlineCode",{parentName:"li"},"freeze"),", ",(0,r.mdx)("inlineCode",{parentName:"li"},"Value"),"'s referenced by name in the ",(0,r.mdx)("inlineCode",{parentName:"li"},"Module")," are\nmoved to the ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," and then then ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," is sealed to produce a\n",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeapRef"),"."),(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenModule")," contains a ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeapRef"),"."),(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"GlobalsBuilder")," contains a ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," onto which values are allocated."),(0,r.mdx)("li",{parentName:"ul"},"A ",(0,r.mdx)("inlineCode",{parentName:"li"},"Globals")," contains a ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeapRef"),".")),(0,r.mdx)("h2",{id:"heap-references"},"Heap References"),(0,r.mdx)("p",null,"It is important that when a ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenValue")," X is referenced by a ",(0,r.mdx)("inlineCode",{parentName:"p"},"Value")," or\n",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenValue")," (for example, included in a list), the heap where X originates is\nadded as a reference to the heap where the new value is being created."),(0,r.mdx)("p",null,"As a concrete example in pseudo-code:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-rust"},'let h1 = FrozenHeap::new();\nlet s = "test".alloc(h1);\nlet h1 : FrozenHeapRef = h1.into_ref();\n\nlet h2 = Heap::new();\nh2.add_reference(h1);\nvec![s].alloc(h2);\n')),(0,r.mdx)("p",null,"In the above code, the following steps are taken:"),(0,r.mdx)("ol",null,(0,r.mdx)("li",{parentName:"ol"},"Create a ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," then allocate something in it."),(0,r.mdx)("li",{parentName:"ol"},"Turn the heap into a reference."),(0,r.mdx)("li",{parentName:"ol"},"Use the allocated value ",(0,r.mdx)("inlineCode",{parentName:"li"},"s")," from ",(0,r.mdx)("inlineCode",{parentName:"li"},"h1")," when constructing a value in ",(0,r.mdx)("inlineCode",{parentName:"li"},"h2"),"."),(0,r.mdx)("li",{parentName:"ol"},"For that to be legal, and for the heap ",(0,r.mdx)("inlineCode",{parentName:"li"},"h1")," to not disappear while it is\nbeing allocated, it is important to call ",(0,r.mdx)("inlineCode",{parentName:"li"},"add_reference"),".")),(0,r.mdx)("p",null,"Note that this API can only point at a ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenValue")," from another heap, and only\nafter that heap has been turned into a reference, so it will not be allocated in\nanymore. These restrictions are deliberate and mean that most programs only have\none 'active heap' at a time."),(0,r.mdx)("p",null,"Following are some places where heap references are added by Starlark:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},"Before evaluation is started, a reference is added to the ",(0,r.mdx)("inlineCode",{parentName:"li"},"Globals")," from the\n",(0,r.mdx)("inlineCode",{parentName:"li"},"Module"),", so it can access the global functions."),(0,r.mdx)("li",{parentName:"ul"},"When evaluating a ",(0,r.mdx)("inlineCode",{parentName:"li"},"load")," statement, a reference is added to the ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenModule"),"\nthat is being loaded."),(0,r.mdx)("li",{parentName:"ul"},"When freezing a module, the ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap"),", in the ",(0,r.mdx)("inlineCode",{parentName:"li"},"Module"),", is moved to the\n",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenModule"),", preserving the references that were added.")),(0,r.mdx)("h2",{id:"ownedfrozenvalue"},(0,r.mdx)("inlineCode",{parentName:"h2"},"OwnedFrozenValue")),(0,r.mdx)("p",null,"When you get a value from a ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenModule"),", it will be a ",(0,r.mdx)("inlineCode",{parentName:"p"},"OwnedFrozenValue"),".\nThis structure is a pair of a ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenHeapRef")," and a ",(0,r.mdx)("inlineCode",{parentName:"p"},"FrozenValue"),", where the ref\nkeeps the value alive. You can move that ",(0,r.mdx)("inlineCode",{parentName:"p"},"OwnedFrozenValue")," into the value of a\nmodule with code such as:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-rust"},'fn move<\'v>(from: &FrozenModule, to: &\'v Module) {\n    let x : OwnedFrozenValue = from.get("value").unwrap();\n    let v : Value<\'v> = x.owned_value(&to);\n    to.set("value", v);\n}\n')),(0,r.mdx)("p",null,"In general, you can use the ",(0,r.mdx)("inlineCode",{parentName:"p"},"OwnedFrozenValue")," in one of three ways:"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("strong",{parentName:"li"},"Operate on it directly")," - with methods like ",(0,r.mdx)("inlineCode",{parentName:"li"},"unpack_i32")," or ",(0,r.mdx)("inlineCode",{parentName:"li"},"to_str"),"."),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("strong",{parentName:"li"},"Extract it safely")," - using methods like ",(0,r.mdx)("inlineCode",{parentName:"li"},"owned_frozen_value"),", which takes a\n",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," to which the heap reference is added and returns a naked\n",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue"),". After that, it is then safe for the ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenHeap")," you passed in\nto use the ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue"),".",(0,r.mdx)("ul",{parentName:"li"},(0,r.mdx)("li",{parentName:"ul"},"With ",(0,r.mdx)("inlineCode",{parentName:"li"},"owned_value"),", there is lifetime checking that the right heap is\npassed, but with ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue"),", there isn't."),(0,r.mdx)("li",{parentName:"ul"},"Be careful to pass the right heap, although given most programs only have\none active heap at a time, it should mostly work out."))),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("strong",{parentName:"li"},"Extract it unsafely")," - using methods ",(0,r.mdx)("inlineCode",{parentName:"li"},"unchecked_frozen_value"),", which gives\nyou the underlying ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue")," without adding any references.",(0,r.mdx)("ul",{parentName:"li"},(0,r.mdx)("li",{parentName:"ul"},"Be careful to make sure there is a good reason the ",(0,r.mdx)("inlineCode",{parentName:"li"},"FrozenValue")," remains\nvalid.")))))}s.isMDXComponent=!0}}]);