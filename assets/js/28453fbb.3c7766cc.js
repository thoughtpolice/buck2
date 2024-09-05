"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1522],{3905:(e,t,n)=>{n.r(t),n.d(t,{MDXContext:()=>c,MDXProvider:()=>p,mdx:()=>b,useMDXComponents:()=>d,withMDXComponents:()=>l});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(){return o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o.apply(this,arguments)}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){return function(t){var n=d(t.components);return r.createElement(e,o({},t,{components:n}))}},d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},m="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),l=d(n),p=a,m=l["".concat(i,".").concat(p)]||l[p]||h[p]||o;return n?r.createElement(m,s(s({ref:t},c),{},{components:n})):r.createElement(m,s({ref:t},c))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=f;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s[m]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},86814:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(87462),a=(n(67294),n(3905));const o={id:"buck_hanging",title:"Why is Buck2 hanging?"},i=void 0,s={unversionedId:"users/faq/buck_hanging",id:"users/faq/buck_hanging",title:"Why is Buck2 hanging?",description:"Let's look at how to troubleshoot when buck2 hangs, i.e. it just sits there",source:"@site/../docs/users/faq/buck_hanging.md",sourceDirName:"users/faq",slug:"/users/faq/buck_hanging",permalink:"/docs/users/faq/buck_hanging",draft:!1,tags:[],version:"current",frontMatter:{id:"buck_hanging",title:"Why is Buck2 hanging?"},sidebar:"mainSidebar",previous:{title:"Debugging Excess Starlark Peak Memory",permalink:"/docs/users/faq/starlark_peak_mem"},next:{title:"Buck2 Consoles",permalink:"/docs/users/build_observability/interactive_console"}},u={},c=[{value:"How to debug a \u201cbusy\u201d hang",id:"how-to-debug-a-busy-hang",level:2},{value:"Getting a stack trace",id:"getting-a-stack-trace",level:3},{value:"Interpreting the stack trace",id:"interpreting-the-stack-trace",level:3},{value:"How to debug a \u201cdoing nothing\u201d hang",id:"how-to-debug-a-doing-nothing-hang",level:2}],l=e=>function(t){return console.warn("Component "+e+" was not imported, exported, or provided by MDXProvider as global scope"),(0,a.mdx)("div",t)},d=l("FbInternalOnly"),p=l("OssOnly"),m={toc:c};function h(e){let{components:t,...n}=e;return(0,a.mdx)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,a.mdx)("p",null,'Let\'s look at how to troubleshoot when buck2 hangs, i.e. it just sits there\nsaying "Jobs: In progress: 0, ..." but it\u2019s not finishing...'),(0,a.mdx)("p",null,"When buck2 hangs, there are two possibilities: It\u2019s either hanging doing\n",(0,a.mdx)("em",{parentName:"p"},"something"),", or it\u2019s hanging doing ",(0,a.mdx)("em",{parentName:"p"},"nothing"),". The first thing you should do is\nfigure out which of those is happening. That\u2019s because the tools to debug either\nof those are ",(0,a.mdx)("em",{parentName:"p"},"very")," different! We will mainly focus on the first in this case."),(0,a.mdx)("p",null,"To figure out which hang you have on your hands, just look at how much CPU buck2\nis using when the hang occurs using your favorite activity monitor (e.g. ",(0,a.mdx)("inlineCode",{parentName:"p"},"top"),",\n",(0,a.mdx)("inlineCode",{parentName:"p"},"htop"),"). Remember that you can find the buck2 daemon\u2019s PID using ",(0,a.mdx)("inlineCode",{parentName:"p"},"buck2 status"),".\nIdeally, break the utilization down by threads (in top, that\u2019s ",(0,a.mdx)("inlineCode",{parentName:"p"},"top -Hp $PID"),")."),(0,a.mdx)("p",null,"If any thread is using 100% CPU for some period of time, then you probably have\na busy hang (buck2 is doing \u201csomething\u201d) which are usually easier to debug."),(0,a.mdx)("h2",{id:"how-to-debug-a-busy-hang"},"How to debug a \u201cbusy\u201d hang"),(0,a.mdx)("h3",{id:"getting-a-stack-trace"},"Getting a stack trace"),(0,a.mdx)("p",null,"When debugging a busy hang, the first thing to do is to work out what the\nprocess is doing. There are many tools you can use for this (like a profiler),\nbut the absolute simplest one is quickstack: just run ",(0,a.mdx)("inlineCode",{parentName:"p"},"quickstack -p $PID"),", and\nit\u2019ll show you a stack dump for all the threads in your process. If you prefer\n",(0,a.mdx)("inlineCode",{parentName:"p"},"gdb"),", you can use ",(0,a.mdx)("inlineCode",{parentName:"p"},"gdb -p $PID"),", then ",(0,a.mdx)("inlineCode",{parentName:"p"},"thread apply all bt"),", and that\u2019s the\nsame thing."),(0,a.mdx)("p",null,"Note that a stack trace tells you what the process is doing at a point in time,\nso don\u2019t just look at the very last frame and call it the culprit. Instead, look\nat the stack as a whole. If you need more perspective, use a sampling profiler"),(0,a.mdx)(d,{mdxType:"FbInternalOnly"},"(strobeclient run --pid $PID)"),". You can also just grab stack traces at a few points in time and see if they look similar: this is exactly what a sampling profiler does, albeit at a higher frequency.",(0,a.mdx)("h3",{id:"interpreting-the-stack-trace"},"Interpreting the stack trace"),(0,a.mdx)("p",null,"Let's consider an example user report ",(0,a.mdx)(d,{mdxType:"FbInternalOnly"},"( see\n",(0,a.mdx)("a",{parentName:"p",href:"https://fb.workplace.com/groups/buck2users/permalink/3232782826978076/"},"here"),")"),"\nwith the following stack trace:"),(0,a.mdx)("pre",null,(0,a.mdx)("code",{parentName:"pre"},"#01  0x0000000005b1ec26 in <buck2_build_api::artifact_groups::artifact_group_values::TransitiveSetIterator<buck2_build_api::artifact_groups::artifact_group_values::ArtifactGroupValues, (buck2_build_api::actions::artifact::Artifact, buck2_execute::artifact_value::ArtifactValue), buck2_build_api::artifact_groups::artifact_group_values::ArtifactValueIdentity> as core::iter::traits::iterator::Iterator>::next () from ...\n#02  0x0000000005b23998 in <buck2_build_api::artifact_groups::artifact_group_values::TransitiveSetIterator<buck2_build_api::artifact_groups::artifact_group_values::ArtifactGroupValues, (buck2_build_api::actions::artifact::Artifact, buck2_execute::artifact_value::ArtifactValue), buck2_build_api::artifact_groups::artifact_group_values::ArtifactValueIdentity> as itertools::Itertools>::exactly_one () from ...\n#03  0x00000000059dbb2c in buck2_server_commands::commands::build::create_unhashed_outputs () from ...\n#04  0x0000000005c3c677 in <core::future::from_generator::GenFuture<<buck2_server_commands::commands::build::BuildServerCommand as buck2_server_ctx::template::ServerCommandTemplate>::command::{closure#0}> as core::future::future::Future>::poll () from ...\n#05  0x00000000054c58a3 in <core::future::from_generator::GenFuture<<alloc::boxed::Box<dyn buck2_server_ctx::ctx::ServerCommandContextTrait> as buck2_server_ctx::ctx::ServerCommandDiceContext>::with_dice_ctx<buck2_server_ctx::template::run_server_command<buck2_server_commands::commands::build::BuildServerCommand>::{closure#0}::{closure#0}::{closure#0}, core::pin::Pin<alloc::boxed::Box<dyn core::future::future::Future<Output = core::result::Result<cli_proto::BuildResponse, anyhow::Error>> + core::marker::Send>>, cli_proto::BuildResponse>::{closure#0}> as core::future::future::Future>::poll () from ...\n#06  0x00000000054c7ae3 in <core::future::from_generator::GenFuture<buck2_server_ctx::template::run_server_command<buck2_server_commands::commands::build::BuildServerCommand>::{closure#0}::{closure#0}> as core::future::future::Future>::poll () from ...\n#07  0x0000000005370df8 in <buck2_events::dispatch::Span>::call_in_span::<core::task::poll::Poll<(core::result::Result<cli_proto::BuildResponse, anyhow::Error>, buck2_data::CommandEnd)>, <buck2_events::dispatch::EventDispatcher>::span_async<buck2_data::CommandStart, buck2_data::CommandEnd, core::future::from_generator::GenFuture<buck2_server_ctx::template::run_server_command<buck2_server_commands::commands::build::BuildServerCommand>::{closure#0}::{closure#0}>, core::result::Result<cli_proto::BuildResponse, anyhow::Error>>::{closure#0}::{closure#0}::{closure#0}> () from ...\n#08  0x00000000054f7288 in <core::future::from_generator::GenFuture<<cli::commands::daemon::BuckdServerDependenciesImpl as buck2_server::daemon::server::BuckdServerDependencies>::build::{closure#0}> as core::future::future::Future>::poll () from...\n ...\n")),(0,a.mdx)("p",null,"At this point, you can look at the code, and note that there is no span around\nthe output symlink creation function (",(0,a.mdx)("inlineCode",{parentName:"p"},"create_unhashed_outputs"),"). This suggests\nyou\u2019ve found your culprit: there is indeed a buck2 bug and we\u2019re spending ages\ncreating unhashed output symlinks, and since you need a span to get any console\nfeedback, the console says nothing is happening."),(0,a.mdx)("p",null,(0,a.mdx)("strong",{parentName:"p"},"An easy fix"),": In this particular instance, Thomas spotted\n",(0,a.mdx)("a",{parentName:"p",href:"https://github.com/facebook/buck2/commit/d677e41253b73a31aafa1255a532c38992482efd"},"an easy optimization"),"\nwhich resolved the issue. But, of course, that\u2019s not always possible. If the\neasy fix hadn't been available, we\u2019d be at a dead end, so what do we do next?"),(0,a.mdx)("p",null,(0,a.mdx)("strong",{parentName:"p"},"A harder fix"),": If it is not clear what the root-cause is, ",(0,a.mdx)(p,{mdxType:"OssOnly"},"you can\nbisect"),(0,a.mdx)(d,{mdxType:"FbInternalOnly"},(0,a.mdx)("a",{parentName:"p",href:"users/faq/how_to_bisect.fb.md"},"you can bisect")),":\ni.e. do a binary search across commits for the commit that introduced a given\nbreakage/perf degradation. ",(0,a.mdx)(d,{mdxType:"FbInternalOnly"}," Thanks to the fact that we enforce a\nlinear history, bisecting is pretty straightforward in\n",(0,a.mdx)("inlineCode",{parentName:"p"},"fbsource"),".")," Then, once you identify their commit that caused\nbreakage, investigate what caused the issue."),(0,a.mdx)("h2",{id:"how-to-debug-a-doing-nothing-hang"},"How to debug a \u201cdoing nothing\u201d hang"),(0,a.mdx)("p",null,(0,a.mdx)("strong",{parentName:"p"},"Cycle in dependencies"),": If buck2 seems to be doing nothing (e.g. CPU usage is\n0%), one of the reasons could be a cycle in your dependencies, which may cause\nbuck2 to hang (buck2 does implement a form of cycle detection, but it\nunfortunately has false negatives). You can confirm this by running buck1, which\nwill report cycles properly."))}h.isMDXComponent=!0}}]);