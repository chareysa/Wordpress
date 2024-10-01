"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[1821],{"./packages/compose/build-module/hooks/use-focusable-iframe/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useFocusableIframe});var _use_ref_effect__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/compose/build-module/hooks/use-ref-effect/index.js");function useFocusableIframe(){return(0,_use_ref_effect__WEBPACK_IMPORTED_MODULE_0__.Z)((element=>{const{ownerDocument}=element;if(!ownerDocument)return;const{defaultView}=ownerDocument;if(defaultView)return defaultView.addEventListener("blur",checkFocus),()=>{defaultView.removeEventListener("blur",checkFocus)};function checkFocus(){ownerDocument&&ownerDocument.activeElement===element&&element.focus()}}),[])}},"./packages/compose/build-module/hooks/use-merge-refs/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useMergeRefs});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function assignRef(ref,value){"function"==typeof ref?ref(value):ref&&ref.hasOwnProperty("current")&&(ref.current=value)}function useMergeRefs(refs){const element=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(),isAttachedRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),didElementChangeRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),previousRefsRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)([]),currentRefsRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(refs);return currentRefsRef.current=refs,(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((()=>{!1===didElementChangeRef.current&&!0===isAttachedRef.current&&refs.forEach(((ref,index)=>{const previousRef=previousRefsRef.current[index];ref!==previousRef&&(assignRef(previousRef,null),assignRef(ref,element.current))})),previousRefsRef.current=refs}),refs),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((()=>{didElementChangeRef.current=!1})),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((value=>{assignRef(element,value),didElementChangeRef.current=!0,isAttachedRef.current=null!==value;const refsToAssign=value?currentRefsRef.current:previousRefsRef.current;for(const ref of refsToAssign)assignRef(ref,value)}),[])}},"./packages/compose/build-module/hooks/use-ref-effect/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useRefEffect});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function useRefEffect(callback,dependencies){const cleanupRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((node=>{node?cleanupRef.current=callback(node):cleanupRef.current&&cleanupRef.current()}),dependencies)}},"./packages/components/src/sandbox/stories/index.story.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,default:()=>index_story});var react=__webpack_require__("./node_modules/react/index.js"),serialize=__webpack_require__("./packages/element/build-module/serialize.js"),use_merge_refs=__webpack_require__("./packages/compose/build-module/hooks/use-merge-refs/index.js"),use_focusable_iframe=__webpack_require__("./packages/compose/build-module/hooks/use-focusable-iframe/index.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const observeAndResizeJS=function(){const{MutationObserver}=window;if(!MutationObserver||!document.body||!window.parent)return;function sendResize(){const clientBoundingRect=document.body.getBoundingClientRect();window.parent.postMessage({action:"resize",width:clientBoundingRect.width,height:clientBoundingRect.height},"*")}function removeViewportStyles(ruleOrNode){ruleOrNode.style&&["width","height","minHeight","maxHeight"].forEach((function(style){/^\\d+(vw|vh|svw|lvw|dvw|svh|lvh|dvh|vi|svi|lvi|dvi|vb|svb|lvb|dvb|vmin|svmin|lvmin|dvmin|vmax|svmax|lvmax|dvmax)$/.test(ruleOrNode.style[style])&&(ruleOrNode.style[style]="")}))}new MutationObserver(sendResize).observe(document.body,{attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0}),window.addEventListener("load",sendResize,!0),Array.prototype.forEach.call(document.querySelectorAll("[style]"),removeViewportStyles),Array.prototype.forEach.call(document.styleSheets,(function(stylesheet){Array.prototype.forEach.call(stylesheet.cssRules||stylesheet.rules,removeViewportStyles)})),document.body.style.position="absolute",document.body.style.width="100%",document.body.setAttribute("data-resizable-iframe-connected",""),sendResize(),window.addEventListener("resize",sendResize,!0)};function SandBox({html="",title="",type,styles=[],scripts=[],onFocus,tabIndex}){const ref=(0,react.useRef)(),[width,setWidth]=(0,react.useState)(0),[height,setHeight]=(0,react.useState)(0);function trySandBox(forceRerender=!1){if(!function isFrameAccessible(){try{return!!ref.current?.contentDocument?.body}catch(e){return!1}}())return;const{contentDocument,ownerDocument}=ref.current;if(!forceRerender&&null!==contentDocument?.body.getAttribute("data-resizable-iframe-connected"))return;const htmlDoc=(0,jsx_runtime.jsxs)("html",{lang:ownerDocument.documentElement.lang,className:type,children:[(0,jsx_runtime.jsxs)("head",{children:[(0,jsx_runtime.jsx)("title",{children:title}),(0,jsx_runtime.jsx)("style",{dangerouslySetInnerHTML:{__html:"\n\tbody {\n\t\tmargin: 0;\n\t}\n\thtml,\n\tbody,\n\tbody > div {\n\t\twidth: 100%;\n\t}\n\thtml.wp-has-aspect-ratio,\n\tbody.wp-has-aspect-ratio,\n\tbody.wp-has-aspect-ratio > div,\n\tbody.wp-has-aspect-ratio > div iframe {\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\toverflow: hidden; /* If it has an aspect ratio, it shouldn't scroll. */\n\t}\n\tbody > div > * {\n\t\tmargin-top: 0 !important; /* Has to have !important to override inline styles. */\n\t\tmargin-bottom: 0 !important;\n\t}\n"}}),styles.map(((rules,i)=>(0,jsx_runtime.jsx)("style",{dangerouslySetInnerHTML:{__html:rules}},i)))]}),(0,jsx_runtime.jsxs)("body",{"data-resizable-iframe-connected":"data-resizable-iframe-connected",className:type,children:[(0,jsx_runtime.jsx)("div",{dangerouslySetInnerHTML:{__html:html}}),(0,jsx_runtime.jsx)("script",{type:"text/javascript",dangerouslySetInnerHTML:{__html:`(${observeAndResizeJS.toString()})();`}}),scripts.map((src=>(0,jsx_runtime.jsx)("script",{src},src)))]})]});contentDocument.open(),contentDocument.write("<!DOCTYPE html>"+(0,serialize.ZP)(htmlDoc)),contentDocument.close()}return(0,react.useEffect)((()=>{function tryNoForceSandBox(){trySandBox(!1)}function checkMessageForResize(event){const iframe=ref.current;if(!iframe||iframe.contentWindow!==event.source)return;let data=event.data||{};if("string"==typeof data)try{data=JSON.parse(data)}catch(e){}"resize"===data.action&&(setWidth(data.width),setHeight(data.height))}trySandBox();const iframe=ref.current,defaultView=iframe?.ownerDocument?.defaultView;return iframe?.addEventListener("load",tryNoForceSandBox,!1),defaultView?.addEventListener("message",checkMessageForResize),()=>{iframe?.removeEventListener("load",tryNoForceSandBox,!1),defaultView?.removeEventListener("message",checkMessageForResize)}}),[]),(0,react.useEffect)((()=>{trySandBox()}),[title,styles,scripts]),(0,react.useEffect)((()=>{trySandBox(!0)}),[html,type]),(0,jsx_runtime.jsx)("iframe",{ref:(0,use_merge_refs.Z)([ref,(0,use_focusable_iframe.Z)()]),title,tabIndex,className:"components-sandbox",sandbox:"allow-scripts allow-same-origin allow-presentation",onFocus,width:Math.ceil(width),height:Math.ceil(height)})}SandBox.displayName="SandBox";const sandbox=SandBox;try{SandBox.displayName="SandBox",SandBox.__docgenInfo={description:'This component provides an isolated environment for arbitrary HTML via iframes.\n\n```jsx\nimport { SandBox } from \'@wordpress/components\';\n\nconst MySandBox = () => (\n\t<SandBox html="<p>Content</p>" title="SandBox" type="embed" />\n);\n```',displayName:"SandBox",props:{html:{defaultValue:{value:""},description:"The HTML to render in the body of the iframe document.",name:"html",required:!1,type:{name:"string"}},title:{defaultValue:{value:""},description:"The `<title>` of the iframe document.",name:"title",required:!1,type:{name:"string"}},type:{defaultValue:null,description:"The CSS class name to apply to the `<html>` and `<body>` elements of the iframe.",name:"type",required:!1,type:{name:"string"}},styles:{defaultValue:{value:"[]"},description:"An array of CSS strings to inject into the `<head>` of the iframe document.",name:"styles",required:!1,type:{name:"string[]"}},scripts:{defaultValue:{value:"[]"},description:"An array of script URLs to inject as `<script>` tags into the bottom of the `<body>` of the iframe document.",name:"scripts",required:!1,type:{name:"string[]"}},onFocus:{defaultValue:null,description:"The `onFocus` callback for the iframe.",name:"onFocus",required:!1,type:{name:"FocusEventHandler<HTMLIFrameElement>"}},tabIndex:{defaultValue:{value:"0"},description:"The `tabindex` the iframe should receive.",name:"tabIndex",required:!1,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/sandbox/index.tsx#SandBox"]={docgenInfo:SandBox.__docgenInfo,name:"SandBox",path:"packages/components/src/sandbox/index.tsx#SandBox"})}catch(__react_docgen_typescript_loader_error){}const index_story={component:sandbox,title:"Components/SandBox",argTypes:{onFocus:{control:{type:null}}},parameters:{sourceLink:"packages/components/src/sandbox",badges:[],actions:{argTypesRegex:"^on.*"},controls:{expanded:!0},docs:{canvas:{sourceState:"shown"}}}},Template=args=>(0,jsx_runtime.jsx)(sandbox,{...args});Template.displayName="Template";const Default=Template.bind({});Default.args={html:"<p>Arbitrary HTML content</p>"},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => <SandBox {...args} />",...Default.parameters?.docs?.source}}}}}]);