"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2417],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>d,MDXProvider:()=>u,mdx:()=>h,useMDXComponents:()=>c,withMDXComponents:()=>p});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i.apply(this,arguments)}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var d=a.createContext({}),p=function(e){return function(t){var n=c(t.components);return a.createElement(e,i({},t,{components:n}))}},c=function(e){var t=a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(d.Provider,{value:t},e.children)},m="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},x=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(n),u=r,m=p["".concat(o,".").concat(u)]||p[u]||g[u]||i;return n?a.createElement(m,l(l({ref:t},d),{},{components:n})):a.createElement(m,l({ref:t},d))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=x;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[m]="string"==typeof e?e:r,o[1]=l;for(var d=2;d<i;d++)o[d]=n[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}x.displayName="MDXCreateElement"},61708:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>d});var a=n(87462),r=(n(67294),n(3905));const i={id:"bxl_how_tos",title:"Common How-Tos"},o=void 0,l={unversionedId:"developers/bxl_how_tos",id:"developers/bxl_how_tos",title:"Common How-Tos",description:"Passing in and using CLI args",source:"@site/../docs/developers/bxl_common_how_tos.md",sourceDirName:"developers",slug:"/developers/bxl_how_tos",permalink:"/docs/developers/bxl_how_tos",draft:!1,tags:[],version:"current",frontMatter:{id:"bxl_how_tos",title:"Common How-Tos"},sidebar:"mainSidebar",previous:{title:"BXL Basics",permalink:"/docs/developers/bxl_basics"},next:{title:"Target Universe in BXL",permalink:"/docs/developers/target_universe"}},s={},d=[{value:"Passing in and using CLI args",id:"passing-in-and-using-cli-args",level:2},{value:"Running actions",id:"running-actions",level:2},{value:"Getting providers from an analysis",id:"getting-providers-from-an-analysis",level:2},{value:"Get a specific provider from an analysis",id:"get-a-specific-provider-from-an-analysis",level:2},{value:"Get a specific subtarget from an analysis",id:"get-a-specific-subtarget-from-an-analysis",level:2},{value:"Building a target/subtarget without blocking",id:"building-a-targetsubtarget-without-blocking",level:2},{value:"Getting attributes or resolved attributes efficiently on a configured target node",id:"getting-attributes-or-resolved-attributes-efficiently-on-a-configured-target-node",level:2},{value:"Inspecting a struct",id:"inspecting-a-struct",level:2},{value:"Set addition/subtraction on a <code>target_set</code>",id:"set-additionsubtraction-on-a-target_set",level:2},{value:"Initializing configured/unconfigured <code>target_set</code>",id:"initializing-configuredunconfigured-target_set",level:2},{value:"Profiling, Testing, and Debugging a BXL script",id:"profiling-testing-and-debugging-a-bxl-script",level:2},{value:"Getting the path of an artifact as a string",id:"getting-the-path-of-an-artifact-as-a-string",level:2}],p=(c="FbInternalOnly",function(e){return console.warn("Component "+c+" was not imported, exported, or provided by MDXProvider as global scope"),(0,r.mdx)("div",e)});var c;const u={toc:d};function m(e){let{components:t,...n}=e;return(0,r.mdx)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.mdx)("h2",{id:"passing-in-and-using-cli-args"},"Passing in and using CLI args"),(0,r.mdx)("p",null,"A BXL function can accept a ",(0,r.mdx)("inlineCode",{parentName:"p"},"cli_args")," attribute where args names and types are\nspecified to use within your script, as shown in the following example:"),(0,r.mdx)("p",null,"Example:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},'def _impl_example(ctx):\n    # ...\n    pass\n\nexample = bxl_main(\n    impl = _impl_example,\n    cli_args = {\n        # cli args that you want to receive from the command line\n        "bool_arg": cli_args.bool(),\n        "list_type": cli_args.list(cli_args.int()),\n        "optional": cli_args.option(cli_args.string()),\n        "target": cli_args.target_label(),\n    },\n)\n')),(0,r.mdx)("p",null,"On the command line, you can invoke the arguments as follows:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-sh"},"buck2 bxl //myscript.bxl:example -- --bool_arg true --list_type 1 --list_type 2 --target //foo:bar\n")),(0,r.mdx)("p",null,"For BXL functions, to read the arguments, use them as attributes from the\n",(0,r.mdx)("inlineCode",{parentName:"p"},"cli_args")," attribute on the BXL ",(0,r.mdx)("inlineCode",{parentName:"p"},"ctx")," object, as follows:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def _impl_example(ctx):\n    my_bool_arg = ctx.cli_args.bool_arg\n")),(0,r.mdx)("h2",{id:"running-actions"},"Running actions"),(0,r.mdx)("p",null,"You can create actions within BXL via the ",(0,r.mdx)("inlineCode",{parentName:"p"},"actions_factory"),". This is called once\nglobally then used on demand:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},'def _impl_example(ctx):\n    actions = ctx.bxl_actions().actions # call once, reuse wherever needed\n    output = actions.write("my_output", "out")\n')),(0,r.mdx)("p",null,"You will need to have\n",(0,r.mdx)("a",{parentName:"p",href:"/docs/rule_authors/configurations#execution-platforms"},"execution platforms"),"\nenabled for your project, or else you will get an error. You can specify the\nexecution platform resolution by setting named parameters when instantiating\n",(0,r.mdx)("inlineCode",{parentName:"p"},"bxl_actions"),":"),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"exec_deps")," - These are dependencies you wish to access as executables for\ncreating the action. This is usually the same set of targets one would pass to\nrule's ",(0,r.mdx)("inlineCode",{parentName:"li"},"attr.exec_dep"),". Accepts a list of strings, subtarget labels, target\nlabels, or target nodes."),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"toolchains")," - The set of toolchains needed for the actions you intend to\ncreate. Accepts a list of strings, subtarget labels, target labels, or target\nnodes."),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"target_platform")," - The intended target platform for your toolchains. Accepts\na string or target label."),(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("inlineCode",{parentName:"li"},"exec_compatible_with")," - Explicit list of configuration nodes (like platforms\nor constraints) that these actions are compatible with. This is the\n",(0,r.mdx)("inlineCode",{parentName:"li"},"exec_compatible_with")," attribute of a target. Accepts a list of strings,\ntarget labels, or target nodes.")),(0,r.mdx)("p",null,"If you specify ",(0,r.mdx)("inlineCode",{parentName:"p"},"exec_deps")," or ",(0,r.mdx)("inlineCode",{parentName:"p"},"toolchains"),", you can access the resolved\n",(0,r.mdx)("inlineCode",{parentName:"p"},"dependency")," objects on the ",(0,r.mdx)("inlineCode",{parentName:"p"},"bxl_actions")," object. The ",(0,r.mdx)("inlineCode",{parentName:"p"},"bxl_actions")," object will\nhave ",(0,r.mdx)("inlineCode",{parentName:"p"},"exec_deps")," and ",(0,r.mdx)("inlineCode",{parentName:"p"},"toolchains")," attributes, which are ",(0,r.mdx)("inlineCode",{parentName:"p"},"dict"),"s where the keys\nare the unconfigured subtarget labels, and the values are the\nconfigured/resolved ",(0,r.mdx)("inlineCode",{parentName:"p"},"dependency")," objects."),(0,r.mdx)("p",null,"Note that the keys of ",(0,r.mdx)("inlineCode",{parentName:"p"},"exec_deps")," and ",(0,r.mdx)("inlineCode",{parentName:"p"},"toolchains")," must be unconfigured\nsubtarget labels (",(0,r.mdx)("inlineCode",{parentName:"p"},"StarlarkProvidersLabel"),"), and not unconfigured target labels.\nYou can use ",(0,r.mdx)("inlineCode",{parentName:"p"},"ctx.unconfigured_sub_targets(...)")," or ",(0,r.mdx)("inlineCode",{parentName:"p"},"with_sub_target()")," on\n",(0,r.mdx)("inlineCode",{parentName:"p"},"target_label")," to create the label."),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},'def _impl_example(ctx):\n    my_exec_dep = ctx.unconfigured_sub_targets("foo//bar:baz") # has some provider that you would use in the action\n    bxl_actions = ctx.bxl_actions(exec_deps = [my_exec_dep]) # call once, reuse wherever needed\n    output = bxl_actions.actions.run(\n        [\n            "python3",\n            bxl_actions.exec_deps[my_exec_dep][RunInfo], # access resolved exec_deps on the `bxl_actions`\n            out.as_output(),\n        ],\n        category = "command",\n        local_only = True,\n    )\n    ctx.output.ensure(output)\n')),(0,r.mdx)("h2",{id:"getting-providers-from-an-analysis"},"Getting providers from an analysis"),(0,r.mdx)("p",null,"After calling ",(0,r.mdx)("inlineCode",{parentName:"p"},"analysis()"),", you can get the providers collection from\n",(0,r.mdx)("inlineCode",{parentName:"p"},"providers()"),":"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def _impl_example(ctx):\n    my_providers = ctx.analysis(my_target).providers()\n")),(0,r.mdx)("h2",{id:"get-a-specific-provider-from-an-analysis"},"Get a specific provider from an analysis"),(0,r.mdx)("p",null,"After calling ",(0,r.mdx)("inlineCode",{parentName:"p"},"analysis()"),", you can also get the providers collection from\n",(0,r.mdx)("inlineCode",{parentName:"p"},"providers()")," then grab whatever specific provider you need:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def _impl_example(ctx):\n    default_info = ctx.analysis(my_target).providers()[DefaultInfo]\n    ctx.output.print(default_info)\n")),(0,r.mdx)("h2",{id:"get-a-specific-subtarget-from-an-analysis"},"Get a specific subtarget from an analysis"),(0,r.mdx)("p",null,"Once you have a provider, you can get its subtargets by using the ",(0,r.mdx)("inlineCode",{parentName:"p"},"sub_targets"),"\nattribute on the struct to get a dict of provider labels to provider\ncollections:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},'def _impl_example(ctx):\n    subtarget = ctx.analysis(my_target).providers()[DefaultInfo].sub_targets["my_subtarget"]\n    ctx.output.print(subtarget)\n')),(0,r.mdx)("h2",{id:"building-a-targetsubtarget-without-blocking"},"Building a target/subtarget without blocking"),(0,r.mdx)("p",null,(0,r.mdx)("inlineCode",{parentName:"p"},"ctx.build")," is synchronous and should only be used when the result of the build\nis needed inline during the bxl execution. To execute builds without blocking\nthe script, retrieve the ",(0,r.mdx)("inlineCode",{parentName:"p"},"DefaultInfo")," from the target's providers and use the\n",(0,r.mdx)("inlineCode",{parentName:"p"},"ctx.output.ensure_multiple")," api."),(0,r.mdx)("p",null,"Example:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"ctx.output.ensure_multiple(ctx.analysis(label).providers()[DefaultInfo])\n")),(0,r.mdx)("h2",{id:"getting-attributes-or-resolved-attributes-efficiently-on-a-configured-target-node"},"Getting attributes or resolved attributes efficiently on a configured target node"),(0,r.mdx)("p",null,"If you need to use all of the attrs/resolved_attrs, then initializing the eager\nvariant once would be best. If you only need a few of the attrs, then\ninitializing the lazy variant is better. There\u2019s not really a hard line, it\ndepends on the target node, and which attrs you are looking for. If performance\nis key to your BXL script, the best way to determine this is to use the BXL\nprofiler."),(0,r.mdx)("p",null,"Regardless, if you use eager or lazy versions of getting attributes, you should\ncache the attrs object:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},'def _impl_example(ctx):\n    my_configured_node = ctx.configured_targets(":foo")\n\n    # call once and resue, ideally when you need most/all attrs\n    eager = my_configured_node.attrs_eager()\n\n    # call once and reuse, ideally when you only need a few attrs\n    lazy = my_configured_node.attrs_lazy()\n\n    # call once and reuse, ideally when you need most/all resolved attrs\n    resolved_eager = my_configured_node.resolved_attrs_eager(ctx)\n\n    # call once and reuse, ideally when you only need a few resolved attrs\n    resolved_lazy = my_configured_node.resolved_attrs_lazy(ctx)\n')),(0,r.mdx)("h2",{id:"inspecting-a-struct"},"Inspecting a struct"),(0,r.mdx)("p",null,"You can use ",(0,r.mdx)("inlineCode",{parentName:"p"},"dir(my_struct)")," to inspect a struct. You can also use\n",(0,r.mdx)("inlineCode",{parentName:"p"},'getattr(my_struct, "my_attr")')," to grab individual attributes, which is\nequivalent to ",(0,r.mdx)("inlineCode",{parentName:"p"},"my_struct.my_attr"),"."),(0,r.mdx)("p",null,"These are available as part of the\n",(0,r.mdx)("a",{parentName:"p",href:"https://github.com/bazelbuild/starlark/blob/master/spec.md#dir"},"Starlark language spec"),"."),(0,r.mdx)("h2",{id:"set-additionsubtraction-on-a-target_set"},"Set addition/subtraction on a ",(0,r.mdx)("inlineCode",{parentName:"h2"},"target_set")),(0,r.mdx)("p",null,"There are a few BXL actions that return a ",(0,r.mdx)("inlineCode",{parentName:"p"},"target_set")," (such as a cquery\n",(0,r.mdx)("inlineCode",{parentName:"p"},"eval()"),"). The ",(0,r.mdx)("inlineCode",{parentName:"p"},"target_set")," supports set subtraction and addition (you can use\n",(0,r.mdx)("inlineCode",{parentName:"p"},"-")," and ",(0,r.mdx)("inlineCode",{parentName:"p"},"+")," directly in Starlark)."),(0,r.mdx)("h2",{id:"initializing-configuredunconfigured-target_set"},"Initializing configured/unconfigured ",(0,r.mdx)("inlineCode",{parentName:"h2"},"target_set")),(0,r.mdx)("p",null,"You can use following apis to initialize ",(0,r.mdx)("inlineCode",{parentName:"p"},"target_set")),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def bxl.utarget_set(nodes: None | list[bxl.UnconfiguredTargetNode]) -> bxl.UnconfiguredTargetSet\n")),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def bxl.ctarget_set(nodes: None | list[bxl.ConfiguredTargetNode]) -> bxl.ConfiguredTargetSet\n")),(0,r.mdx)("h2",{id:"profiling-testing-and-debugging-a-bxl-script"},"Profiling, Testing, and Debugging a BXL script"),(0,r.mdx)("p",null,"You can use ",(0,r.mdx)("inlineCode",{parentName:"p"},"buck2 bxl profiler"),", with various measurements, to determine where\nthe script is least efficient."),(0,r.mdx)("p",null,"To time individual pieces of the script, you can use BXL\u2019s timestamp methods:"),(0,r.mdx)("pre",null,(0,r.mdx)("code",{parentName:"pre",className:"language-python"},"def _impl_example(_ctx):\n    start = now() # call once and reuse wherever is necessary\n    # do something time intensive here\n    end1 = start.elapsed_millis()\n    # do something else time intensive here\n    end2 = start.elapsed_millis()\n")),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("strong",{parentName:"li"},"Debug")," - the common way to debug a BXL script is with print statements\n(",(0,r.mdx)("inlineCode",{parentName:"li"},"print()"),", ",(0,r.mdx)("inlineCode",{parentName:"li"},"pprint()")," and ",(0,r.mdx)("inlineCode",{parentName:"li"},"ctx.output.print()"),").")),(0,r.mdx)(p,{mdxType:"FbInternalOnly"},(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("p",{parentName:"li"},(0,r.mdx)("strong",{parentName:"p"},"Debugger")," - to use the debugger you can follow these instructions\n",(0,r.mdx)("a",{parentName:"p",href:"https://fb.workplace.com/groups/buck2eng/permalink/3562907607330619/"},"here"),"."),(0,r.mdx)("pre",{parentName:"li"},(0,r.mdx)("code",{parentName:"pre"},"1. `fdb --starlark-kill-buck attach buck`\n2. place a breakpoint to the bxl file\n3. run the buck2 bxl command\n"))))),(0,r.mdx)("ul",null,(0,r.mdx)("li",{parentName:"ul"},(0,r.mdx)("strong",{parentName:"li"},"Test")," - BXL does not have a robust testing framework for mocking. The main\nmethod to test a BXL script is to actually invoke it with required inputs then\nverify the outputs.")),(0,r.mdx)("h2",{id:"getting-the-path-of-an-artifact-as-a-string"},"Getting the path of an artifact as a string"),(0,r.mdx)("p",null,"The starlark ",(0,r.mdx)("inlineCode",{parentName:"p"},"artifact")," type encapsulates source artifacts, declared artifacts,\nand build artifacts. It can be dangerous to access paths and use them in further\nBXL computations. For example, if you are trying to use absolute paths for\nsomething and end up passing it into a remotely executed action, the absolute\npath may not exist on the remote machine. Or, if you are working with paths and\nexpecting the artifact to already have been materialized in further BXL\ncomputations, that would also result in errors."),(0,r.mdx)("p",null,"However, if you are not making any assumptions about the existence of these\nartifacts, you can use use\n",(0,r.mdx)("a",{parentName:"p",href:"../../api/bxl/globals#get_path_without_materialization"},(0,r.mdx)("inlineCode",{parentName:"a"},"get_path_without_materialization()")),",\nwhich accepts source, declared, or build aritfacts. It does ",(0,r.mdx)("em",{parentName:"p"},"not")," accept ensured\nartifacts (also see\n",(0,r.mdx)("a",{parentName:"p",href:"/docs/developers/bxl_faqs#what-do-i-need-to-know-about-ensured-artifacts"},"What do I need to know about ensured artifacts"),")."),(0,r.mdx)("p",null,"For getting paths of ",(0,r.mdx)("inlineCode",{parentName:"p"},"cmd_args()")," inputs, you can use\n",(0,r.mdx)("a",{parentName:"p",href:"../../api/bxl/globals#get_paths_without_materialization"},(0,r.mdx)("inlineCode",{parentName:"a"},"get_paths_without_materialization()")),",\nbut note this is risky because the inputs could contain tsets, which, when\nexpanded, could be very large. Use these methods at your own risk."))}m.isMDXComponent=!0}}]);