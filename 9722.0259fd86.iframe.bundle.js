"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[9722],{"./packages/compose/build-module/hooks/use-copy-to-clipboard/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useCopyToClipboard});var clipboard__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/compose/node_modules/clipboard/dist/clipboard.js"),clipboard__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(clipboard__WEBPACK_IMPORTED_MODULE_0__),_wordpress_element__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/index.js"),_use_ref_effect__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/compose/build-module/hooks/use-ref-effect/index.js");function useUpdatedRef(value){const ref=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(value);return ref.current=value,ref}function useCopyToClipboard(text,onSuccess){const textRef=useUpdatedRef(text),onSuccessRef=useUpdatedRef(onSuccess);return(0,_use_ref_effect__WEBPACK_IMPORTED_MODULE_2__.Z)((node=>{const clipboard=new(clipboard__WEBPACK_IMPORTED_MODULE_0___default())(node,{text:()=>"function"==typeof textRef.current?textRef.current():textRef.current||""});return clipboard.on("success",(({clearSelection})=>{clearSelection(),onSuccessRef.current&&onSuccessRef.current()})),()=>{clipboard.destroy()}}),[])}},"./packages/compose/build-module/hooks/use-debounce/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useDebounce});var use_memo_one__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/use-memo-one/dist/use-memo-one.esm.js"),_wordpress_element__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),_utils_debounce__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/compose/build-module/utils/debounce/index.js");function useDebounce(fn,wait,options){const debounced=(0,use_memo_one__WEBPACK_IMPORTED_MODULE_0__.Pr)((()=>(0,_utils_debounce__WEBPACK_IMPORTED_MODULE_1__.D)(fn,null!=wait?wait:0,options)),[fn,wait,options]);return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)((()=>()=>debounced.cancel()),[debounced]),debounced}},"./packages/compose/build-module/utils/debounce/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>debounce});const debounce=(func,wait,options)=>{let lastArgs,lastThis,result,timerId,lastCallTime,maxWait=0,lastInvokeTime=0,leading=!1,maxing=!1,trailing=!0;function invokeFunc(time){const args=lastArgs,thisArg=lastThis;return lastArgs=void 0,lastThis=void 0,lastInvokeTime=time,result=func.apply(thisArg,args),result}function startTimer(pendingFunc,waitTime){timerId=setTimeout(pendingFunc,waitTime)}function getTimeSinceLastCall(time){return time-(lastCallTime||0)}function shouldInvoke(time){const timeSinceLastCall=getTimeSinceLastCall(time);return void 0===lastCallTime||timeSinceLastCall>=wait||timeSinceLastCall<0||maxing&&time-lastInvokeTime>=maxWait}function timerExpired(){const time=Date.now();if(shouldInvoke(time))return trailingEdge(time);startTimer(timerExpired,function remainingWait(time){const timeSinceLastCall=getTimeSinceLastCall(time),timeSinceLastInvoke=time-lastInvokeTime,timeWaiting=wait-timeSinceLastCall;return maxing?Math.min(timeWaiting,maxWait-timeSinceLastInvoke):timeWaiting}(time))}function clearTimer(){timerId=void 0}function trailingEdge(time){return clearTimer(),trailing&&lastArgs?invokeFunc(time):(lastArgs=lastThis=void 0,result)}function pending(){return void 0!==timerId}function debounced(...args){const time=Date.now(),isInvoking=shouldInvoke(time);if(lastArgs=args,lastThis=this,lastCallTime=time,isInvoking){if(!pending())return function leadingEdge(time){return lastInvokeTime=time,startTimer(timerExpired,wait),leading?invokeFunc(time):result}(lastCallTime);if(maxing)return startTimer(timerExpired,wait),invokeFunc(lastCallTime)}return pending()||startTimer(timerExpired,wait),result}return options&&(leading=!!options.leading,maxing="maxWait"in options,void 0!==options.maxWait&&(maxWait=Math.max(options.maxWait,wait)),trailing="trailing"in options?!!options.trailing:trailing),debounced.cancel=function cancel(){!function cancelTimer(){void 0!==timerId&&clearTimeout(timerId)}(),lastInvokeTime=0,clearTimer(),lastArgs=lastCallTime=lastThis=void 0},debounced.flush=function flush(){return pending()?trailingEdge(Date.now()):result},debounced.pending=pending,debounced}},"./packages/icons/build-module/library/copy.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/primitives/build-module/svg/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Wj,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.y$,{fillRule:"evenodd",clipRule:"evenodd",d:"M5 4.5h11a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5ZM3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm17 3v10.75c0 .69-.56 1.25-1.25 1.25H6v1.5h12.75a2.75 2.75 0 0 0 2.75-2.75V8H20Z"})})},"./packages/components/src/color-picker/component.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{z:()=>ColorPicker,Z:()=>color_picker_component});var colord=__webpack_require__("./node_modules/colord/index.mjs"),names=__webpack_require__("./node_modules/colord/plugins/names.mjs"),react=__webpack_require__("./node_modules/react/index.js"),use_debounce=__webpack_require__("./packages/compose/build-module/hooks/use-debounce/index.js"),build_module=__webpack_require__("./packages/i18n/build-module/index.js"),use_context_system=__webpack_require__("./packages/components/src/context/use-context-system.js"),context_connect=__webpack_require__("./packages/components/src/context/context-connect.ts"),emotion_styled_base_browser_esm=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),number_control=__webpack_require__("./packages/components/src/number-control/index.tsx"),select_control=__webpack_require__("./packages/components/src/select-control/index.tsx"),range_control=__webpack_require__("./packages/components/src/range-control/index.tsx"),space=__webpack_require__("./packages/components/src/utils/space.ts"),box_sizing=__webpack_require__("./packages/components/src/utils/box-sizing.ts"),src_button=__webpack_require__("./packages/components/src/button/index.tsx"),component=__webpack_require__("./packages/components/src/flex/flex/component.tsx"),h_stack_component=__webpack_require__("./packages/components/src/h-stack/component.tsx"),config_values=__webpack_require__("./packages/components/src/utils/config-values.js");const NumberControlWrapper=(0,emotion_styled_base_browser_esm.Z)(number_control.Z,{target:"ez9hsf47"})("width:",(0,space.D)(24),";"),SelectControl=(0,emotion_styled_base_browser_esm.Z)(select_control.Z,{target:"ez9hsf46"})("margin-left:",(0,space.D)(-2),";width:5em;"),RangeControl=(0,emotion_styled_base_browser_esm.Z)(range_control.Z,{target:"ez9hsf45"})("flex:1;margin-right:",(0,space.D)(2),";"),interactiveHueStyles=`\n.react-colorful__interactive {\n\twidth: calc( 100% - ${(0,space.D)(2)} );\n\tmargin-left: ${(0,space.D)(1)};\n}`,AuxiliaryColorArtefactWrapper=(0,emotion_styled_base_browser_esm.Z)("div",{target:"ez9hsf44"})("padding-top:",(0,space.D)(2),";padding-right:0;padding-left:0;padding-bottom:0;"),AuxiliaryColorArtefactHStackHeader=(0,emotion_styled_base_browser_esm.Z)(h_stack_component.Z,{target:"ez9hsf43"})("padding-left:",(0,space.D)(4),";padding-right:",(0,space.D)(4),";"),ColorInputWrapper=(0,emotion_styled_base_browser_esm.Z)(component.Z,{target:"ez9hsf42"})("padding-top:",(0,space.D)(4),";padding-left:",(0,space.D)(4),";padding-right:",(0,space.D)(3),";padding-bottom:",(0,space.D)(5),";"),ColorfulWrapper=(0,emotion_styled_base_browser_esm.Z)("div",{target:"ez9hsf41"})(box_sizing.p,";width:216px;.react-colorful{display:flex;flex-direction:column;align-items:center;width:216px;height:auto;}.react-colorful__saturation{width:100%;border-radius:0;height:216px;margin-bottom:",(0,space.D)(4),";border-bottom:none;}.react-colorful__hue,.react-colorful__alpha{width:184px;height:16px;border-radius:",config_values.Z.radiusFull,";margin-bottom:",(0,space.D)(2),";}.react-colorful__pointer{height:16px;width:16px;border:none;box-shadow:0 0 2px 0 rgba( 0, 0, 0, 0.25 );outline:2px solid transparent;}.react-colorful__pointer-fill{box-shadow:inset 0 0 0 ",config_values.Z.borderWidthFocus," #fff;}",interactiveHueStyles,";"),CopyButton=(0,emotion_styled_base_browser_esm.Z)(src_button.ZP,{target:"ez9hsf40"})("&&&&&{min-width:",(0,space.D)(6),";padding:0;>svg{margin-right:0;}}");var use_copy_to_clipboard=__webpack_require__("./packages/compose/build-module/hooks/use-copy-to-clipboard/index.js"),copy=__webpack_require__("./packages/icons/build-module/library/copy.js"),tooltip=__webpack_require__("./packages/components/src/tooltip/index.tsx"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ColorCopyButton=props=>{const{color,colorType}=props,[copiedColor,setCopiedColor]=(0,react.useState)(null),copyTimerRef=(0,react.useRef)(),copyRef=(0,use_copy_to_clipboard.Z)((()=>{switch(colorType){case"hsl":return color.toHslString();case"rgb":return color.toRgbString();default:return color.toHex()}}),(()=>{copyTimerRef.current&&clearTimeout(copyTimerRef.current),setCopiedColor(color.toHex()),copyTimerRef.current=setTimeout((()=>{setCopiedColor(null),copyTimerRef.current=void 0}),3e3)}));return(0,react.useEffect)((()=>()=>{copyTimerRef.current&&clearTimeout(copyTimerRef.current)}),[]),(0,jsx_runtime.jsx)(tooltip.ZP,{delay:0,hideOnClick:!1,text:copiedColor===color.toHex()?(0,build_module.__)("Copied!"):(0,build_module.__)("Copy"),children:(0,jsx_runtime.jsx)(CopyButton,{size:"small",ref:copyRef,icon:copy.Z,showTooltip:!1})})};ColorCopyButton.displayName="ColorCopyButton";try{ColorCopyButton.displayName="ColorCopyButton",ColorCopyButton.__docgenInfo={description:"",displayName:"ColorCopyButton",props:{color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"Colord"}},colorType:{defaultValue:null,description:"",name:"colorType",required:!0,type:{name:"enum",value:[{value:'"rgb"'},{value:'"hsl"'},{value:'"hex"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/color-copy-button.tsx#ColorCopyButton"]={docgenInfo:ColorCopyButton.__docgenInfo,name:"ColorCopyButton",path:"packages/components/src/color-picker/color-copy-button.tsx#ColorCopyButton"})}catch(__react_docgen_typescript_loader_error){}var text_component=__webpack_require__("./packages/components/src/text/component.tsx"),colors_values=__webpack_require__("./packages/components/src/utils/colors-values.js"),input_prefix_wrapper=__webpack_require__("./packages/components/src/input-control/input-prefix-wrapper.tsx");const InputWithSlider=({min,max,label,abbreviation,onChange,value})=>(0,jsx_runtime.jsxs)(h_stack_component.Z,{spacing:4,children:[(0,jsx_runtime.jsx)(NumberControlWrapper,{min,max,label,hideLabelFromVision:!0,value,onChange:newValue=>{onChange(newValue?"string"!=typeof newValue?newValue:parseInt(newValue,10):0)},prefix:(0,jsx_runtime.jsx)(input_prefix_wrapper.Z,{children:(0,jsx_runtime.jsx)(text_component.Z,{color:colors_values.D.theme.accent,lineHeight:1,children:abbreviation})}),spinControls:"none",size:"__unstable-large"}),(0,jsx_runtime.jsx)(RangeControl,{__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0,label,hideLabelFromVision:!0,min,max,value,onChange,withInputField:!1})]});InputWithSlider.displayName="InputWithSlider";try{InputWithSlider.displayName="InputWithSlider",InputWithSlider.__docgenInfo={description:"",displayName:"InputWithSlider",props:{min:{defaultValue:null,description:"",name:"min",required:!0,type:{name:"number"}},max:{defaultValue:null,description:"",name:"max",required:!0,type:{name:"number"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"number"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},abbreviation:{defaultValue:null,description:"",name:"abbreviation",required:!0,type:{name:"string"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: number) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/input-with-slider.tsx#InputWithSlider"]={docgenInfo:InputWithSlider.__docgenInfo,name:"InputWithSlider",path:"packages/components/src/color-picker/input-with-slider.tsx#InputWithSlider"})}catch(__react_docgen_typescript_loader_error){}const RgbInput=({color,onChange,enableAlpha})=>{const{r,g,b,a}=color.toRgb();return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:255,label:"Red",abbreviation:"R",value:r,onChange:nextR=>onChange((0,colord.Vi)({r:nextR,g,b,a}))}),(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:255,label:"Green",abbreviation:"G",value:g,onChange:nextG=>onChange((0,colord.Vi)({r,g:nextG,b,a}))}),(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:255,label:"Blue",abbreviation:"B",value:b,onChange:nextB=>onChange((0,colord.Vi)({r,g,b:nextB,a}))}),enableAlpha&&(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:100,label:"Alpha",abbreviation:"A",value:Math.trunc(100*a),onChange:nextA=>onChange((0,colord.Vi)({r,g,b,a:nextA/100}))})]})};try{RgbInput.displayName="RgbInput",RgbInput.__docgenInfo={description:"",displayName:"RgbInput",props:{color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"Colord"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(nextColor: Colord) => void"}},enableAlpha:{defaultValue:null,description:"",name:"enableAlpha",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/rgb-input.tsx#RgbInput"]={docgenInfo:RgbInput.__docgenInfo,name:"RgbInput",path:"packages/components/src/color-picker/rgb-input.tsx#RgbInput"})}catch(__react_docgen_typescript_loader_error){}const HslInput=({color,onChange,enableAlpha})=>{const colorPropHSLA=(0,react.useMemo)((()=>color.toHsl()),[color]),[internalHSLA,setInternalHSLA]=(0,react.useState)({...colorPropHSLA}),isInternalColorSameAsReceivedColor=color.isEqual((0,colord.Vi)(internalHSLA));(0,react.useEffect)((()=>{isInternalColorSameAsReceivedColor||setInternalHSLA(colorPropHSLA)}),[colorPropHSLA,isInternalColorSameAsReceivedColor]);const colorValue=isInternalColorSameAsReceivedColor?internalHSLA:colorPropHSLA,updateHSLAValue=partialNewValue=>{const nextOnChangeValue=(0,colord.Vi)({...colorValue,...partialNewValue});color.isEqual(nextOnChangeValue)?setInternalHSLA((prevHSLA=>({...prevHSLA,...partialNewValue}))):onChange(nextOnChangeValue)};return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:359,label:"Hue",abbreviation:"H",value:colorValue.h,onChange:nextH=>{updateHSLAValue({h:nextH})}}),(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:100,label:"Saturation",abbreviation:"S",value:colorValue.s,onChange:nextS=>{updateHSLAValue({s:nextS})}}),(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:100,label:"Lightness",abbreviation:"L",value:colorValue.l,onChange:nextL=>{updateHSLAValue({l:nextL})}}),enableAlpha&&(0,jsx_runtime.jsx)(InputWithSlider,{min:0,max:100,label:"Alpha",abbreviation:"A",value:Math.trunc(100*colorValue.a),onChange:nextA=>{updateHSLAValue({a:nextA/100})}})]})};try{HslInput.displayName="HslInput",HslInput.__docgenInfo={description:"",displayName:"HslInput",props:{color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"Colord"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(nextColor: Colord) => void"}},enableAlpha:{defaultValue:null,description:"",name:"enableAlpha",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/hsl-input.tsx#HslInput"]={docgenInfo:HslInput.__docgenInfo,name:"HslInput",path:"packages/components/src/color-picker/hsl-input.tsx#HslInput"})}catch(__react_docgen_typescript_loader_error){}var input_control=__webpack_require__("./packages/components/src/input-control/index.tsx");const HexInput=({color,onChange,enableAlpha})=>(0,jsx_runtime.jsx)(input_control.gs,{prefix:(0,jsx_runtime.jsx)(input_prefix_wrapper.Z,{children:(0,jsx_runtime.jsx)(text_component.Z,{color:colors_values.D.theme.accent,lineHeight:1,children:"#"})}),value:color.toHex().slice(1).toUpperCase(),onChange:nextValue=>{if(!nextValue)return;const hexValue=nextValue.startsWith("#")?nextValue:"#"+nextValue;onChange((0,colord.Vi)(hexValue))},maxLength:enableAlpha?9:7,label:(0,build_module.__)("Hex color"),hideLabelFromVision:!0,size:"__unstable-large",__unstableStateReducer:(state,action)=>{const nativeEvent=action.payload?.event?.nativeEvent;if("insertFromPaste"!==nativeEvent?.inputType)return{...state};const value=state.value?.startsWith("#")?state.value.slice(1).toUpperCase():state.value?.toUpperCase();return{...state,value}},__unstableInputWidth:"9em"});HexInput.displayName="HexInput";try{HexInput.displayName="HexInput",HexInput.__docgenInfo={description:"",displayName:"HexInput",props:{color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"Colord"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(nextColor: Colord) => void"}},enableAlpha:{defaultValue:null,description:"",name:"enableAlpha",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/hex-input.tsx#HexInput"]={docgenInfo:HexInput.__docgenInfo,name:"HexInput",path:"packages/components/src/color-picker/hex-input.tsx#HexInput"})}catch(__react_docgen_typescript_loader_error){}const ColorInput=({colorType,color,onChange,enableAlpha})=>{const props={color,onChange,enableAlpha};switch(colorType){case"hsl":return(0,jsx_runtime.jsx)(HslInput,{...props});case"rgb":return(0,jsx_runtime.jsx)(RgbInput,{...props});default:return(0,jsx_runtime.jsx)(HexInput,{...props})}};try{ColorInput.displayName="ColorInput",ColorInput.__docgenInfo={description:"",displayName:"ColorInput",props:{colorType:{defaultValue:null,description:"",name:"colorType",required:!0,type:{name:"enum",value:[{value:'"rgb"'},{value:'"hsl"'},{value:'"hex"'}]}},color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"Colord"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(nextColor: Colord) => void"}},enableAlpha:{defaultValue:null,description:"",name:"enableAlpha",required:!0,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/color-input.tsx#ColorInput"]={docgenInfo:ColorInput.__docgenInfo,name:"ColorInput",path:"packages/components/src/color-picker/color-input.tsx#ColorInput"})}catch(__react_docgen_typescript_loader_error){}var index_module=__webpack_require__("./node_modules/react-colorful/dist/index.module.js");const Picker=({color,enableAlpha,onChange})=>{const Component=enableAlpha?index_module.ef:index_module.W_,rgbColor=(0,react.useMemo)((()=>color.toRgbString()),[color]);return(0,jsx_runtime.jsx)(Component,{color:rgbColor,onChange:nextColor=>{onChange((0,colord.Vi)(nextColor))},onPointerDown:({currentTarget,pointerId})=>{currentTarget.setPointerCapture(pointerId)},onPointerUp:({currentTarget,pointerId})=>{currentTarget.releasePointerCapture(pointerId)}})};Picker.displayName="Picker";try{Picker.displayName="Picker",Picker.__docgenInfo={description:"",displayName:"Picker",props:{color:{defaultValue:null,description:"",name:"color",required:!0,type:{name:"Colord"}},enableAlpha:{defaultValue:null,description:"",name:"enableAlpha",required:!0,type:{name:"boolean"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(nextColor: Colord) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/picker.tsx#Picker"]={docgenInfo:Picker.__docgenInfo,name:"Picker",path:"packages/components/src/color-picker/picker.tsx#Picker"})}catch(__react_docgen_typescript_loader_error){}var use_controlled_value=__webpack_require__("./packages/components/src/utils/hooks/use-controlled-value.ts");(0,colord.l7)([names.Z]);const options=[{label:"RGB",value:"rgb"},{label:"HSL",value:"hsl"},{label:"Hex",value:"hex"}],UnconnectedColorPicker=(props,forwardedRef)=>{const{enableAlpha=!1,color:colorProp,onChange,defaultValue="#fff",copyFormat,...divProps}=(0,use_context_system.y)(props,"ColorPicker"),[color,setColor]=(0,use_controlled_value.O)({onChange,value:colorProp,defaultValue}),safeColordColor=(0,react.useMemo)((()=>(0,colord.Vi)(color||"")),[color]),debouncedSetColor=(0,use_debounce.Z)(setColor),handleChange=(0,react.useCallback)((nextValue=>{debouncedSetColor(nextValue.toHex())}),[debouncedSetColor]),[colorType,setColorType]=(0,react.useState)(copyFormat||"hex");return(0,jsx_runtime.jsxs)(ColorfulWrapper,{ref:forwardedRef,...divProps,children:[(0,jsx_runtime.jsx)(Picker,{onChange:handleChange,color:safeColordColor,enableAlpha}),(0,jsx_runtime.jsxs)(AuxiliaryColorArtefactWrapper,{children:[(0,jsx_runtime.jsxs)(AuxiliaryColorArtefactHStackHeader,{justify:"space-between",children:[(0,jsx_runtime.jsx)(SelectControl,{__nextHasNoMarginBottom:!0,options,value:colorType,onChange:nextColorType=>setColorType(nextColorType),label:(0,build_module.__)("Color format"),hideLabelFromVision:!0,variant:"minimal"}),(0,jsx_runtime.jsx)(ColorCopyButton,{color:safeColordColor,colorType:copyFormat||colorType})]}),(0,jsx_runtime.jsx)(ColorInputWrapper,{direction:"column",gap:2,children:(0,jsx_runtime.jsx)(ColorInput,{colorType,color:safeColordColor,onChange:handleChange,enableAlpha})})]})]})};UnconnectedColorPicker.displayName="UnconnectedColorPicker";const ColorPicker=(0,context_connect.Iq)(UnconnectedColorPicker,"ColorPicker"),color_picker_component=ColorPicker;try{ColorPicker.displayName="ColorPicker",ColorPicker.__docgenInfo={description:"",displayName:"ColorPicker",props:{enableAlpha:{defaultValue:{value:"false"},description:"When `true` the color picker will display the alpha channel both in\nthe bottom inputs as well as in the color picker itself.",name:"enableAlpha",required:!1,type:{name:"boolean"}},color:{defaultValue:null,description:"The current color value to display in the picker.\nMust be a hex or hex8 string.",name:"color",required:!1,type:{name:"string"}},onChange:{defaultValue:null,description:"Fired when the color changes. Always passes a hex or hex8 color string.",name:"onChange",required:!1,type:{name:"(color: string) => void"}},defaultValue:{defaultValue:null,description:"An optional default value to use for the color picker.",name:"defaultValue",required:!1,type:{name:"string"}},copyFormat:{defaultValue:null,description:"The format to copy when clicking the displayed color format.",name:"copyFormat",required:!1,type:{name:"enum",value:[{value:'"rgb"'},{value:'"hsl"'},{value:'"hex"'}]}},as:{defaultValue:null,description:"The HTML element or React component to render the component as.",name:"as",required:!1,type:{name:'"symbol" | "object" | "select" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | ... 516 more ... | ("view" & FunctionComponent<...>)'}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/color-picker/component.tsx#ColorPicker"]={docgenInfo:ColorPicker.__docgenInfo,name:"ColorPicker",path:"packages/components/src/color-picker/component.tsx#ColorPicker"})}catch(__react_docgen_typescript_loader_error){}},"./packages/components/src/input-control/input-prefix-wrapper.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T:()=>InputControlPrefixWrapper,Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/context/use-context-system.js"),_context__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/components/src/context/context-connect.ts"),_styles_input_control_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/src/input-control/styles/input-control-styles.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");function UnconnectedInputControlPrefixWrapper(props,forwardedRef){const derivedProps=(0,_context__WEBPACK_IMPORTED_MODULE_1__.y)(props,"InputControlPrefixWrapper");return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_input_control_styles__WEBPACK_IMPORTED_MODULE_2__.If,{...derivedProps,isPrefix:!0,ref:forwardedRef})}UnconnectedInputControlPrefixWrapper.displayName="UnconnectedInputControlPrefixWrapper";const InputControlPrefixWrapper=(0,_context__WEBPACK_IMPORTED_MODULE_3__.Iq)(UnconnectedInputControlPrefixWrapper,"InputControlPrefixWrapper"),__WEBPACK_DEFAULT_EXPORT__=InputControlPrefixWrapper;try{InputControlPrefixWrapper.displayName="InputControlPrefixWrapper",InputControlPrefixWrapper.__docgenInfo={description:"A convenience wrapper for the `prefix` when you want to apply\nstandard padding in accordance with the size variant.\n\n```jsx\nimport {\n  __experimentalInputControl as InputControl,\n  __experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,\n} from '@wordpress/components';\n\n<InputControl\n  prefix={<InputControlPrefixWrapper>@</InputControlPrefixWrapper>}\n/>\n```",displayName:"InputControlPrefixWrapper",props:{children:{defaultValue:null,description:"The content to be inserted.",name:"children",required:!0,type:{name:"ReactNode"}},size:{defaultValue:null,description:"Internal prop used to control the padding size of the wrapper.\n@ignore",name:"size",required:!1,type:{name:"enum",value:[{value:'"small"'},{value:'"default"'},{value:'"compact"'},{value:'"__unstable-large"'}]}},__next40pxDefaultSize:{defaultValue:null,description:"Internal prop used to control the padding size of the wrapper.\n@ignore",name:"__next40pxDefaultSize",required:!1,type:{name:"boolean"}},variant:{defaultValue:{value:"'default'"},description:"Adjust the wrapper based on the prefix or suffix content.\n\n- `'default'`: Standard padding for text content.\n- `'icon'`: For icons.\n- `'control'`: For controls, like buttons or selects.",name:"variant",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"icon"'},{value:'"control"'}]}},as:{defaultValue:null,description:"The HTML element or React component to render the component as.",name:"as",required:!1,type:{name:'"symbol" | "object" | "select" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | ... 516 more ... | ("view" & FunctionComponent<...>)'}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/input-control/input-prefix-wrapper.tsx#InputControlPrefixWrapper"]={docgenInfo:InputControlPrefixWrapper.__docgenInfo,name:"InputControlPrefixWrapper",path:"packages/components/src/input-control/input-prefix-wrapper.tsx#InputControlPrefixWrapper"})}catch(__react_docgen_typescript_loader_error){}},"./packages/components/src/select-control/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Y:()=>SelectControl,Z:()=>__WEBPACK_DEFAULT_EXPORT__});var clsx__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/compose/build-module/hooks/use-instance-id/index.js"),_wordpress_element__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/react/index.js"),_base_control__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/src/base-control/index.tsx"),_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/components/src/select-control/styles/select-control-styles.ts"),_chevron_down__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/components/src/select-control/chevron-down.tsx"),_utils_use_deprecated_props__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/src/utils/use-deprecated-props.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");function SelectOptions({options}){return options.map((({id,label,value,...optionProps},index)=>{const key=id||`${label}-${value}-${index}`;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option",{value,...optionProps,children:label},key)}))}function UnforwardedSelectControl(props,ref){const{className,disabled=!1,help,hideLabelFromVision,id:idProp,label,multiple=!1,onChange,options=[],size="default",value:valueProp,labelPosition="top",children,prefix,suffix,variant="default",__next40pxDefaultSize=!1,__nextHasNoMarginBottom=!1,...restProps}=(0,_utils_use_deprecated_props__WEBPACK_IMPORTED_MODULE_2__.s)(props),id=function useUniqueId(idProp){const instanceId=(0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.Z)(SelectControl);return idProp||`inspector-select-control-${instanceId}`}(idProp),helpId=help?`${id}__help`:void 0;if(!options?.length&&!children)return null;const classes=(0,clsx__WEBPACK_IMPORTED_MODULE_3__.Z)("components-select-control",className);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_base_control__WEBPACK_IMPORTED_MODULE_4__.ZP,{help,id,__nextHasNoMarginBottom,__associatedWPComponentName:"SelectControl",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_5__.el,{className:classes,disabled,hideLabelFromVision,id,isBorderless:"minimal"===variant,label,size,suffix:suffix||!multiple&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chevron_down__WEBPACK_IMPORTED_MODULE_6__.Z,{}),prefix,labelPosition,__unstableInputWidth:"minimal"===variant?"auto":void 0,variant,__next40pxDefaultSize,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_5__.Ph,{...restProps,__next40pxDefaultSize,"aria-describedby":helpId,className:"components-select-control__input",disabled,id,multiple,onChange:event=>{if(props.multiple){const newValues=Array.from(event.target.options).filter((({selected})=>selected)).map((({value})=>value));props.onChange?.(newValues,{event})}else props.onChange?.(event.target.value,{event})},ref,selectSize:size,value:valueProp,variant,children:children||(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SelectOptions,{options})})})})}UnforwardedSelectControl.displayName="UnforwardedSelectControl";const SelectControl=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.forwardRef)(UnforwardedSelectControl),__WEBPACK_DEFAULT_EXPORT__=SelectControl;try{SelectControl.displayName="SelectControl",SelectControl.__docgenInfo={description:"`SelectControl` allows users to select from a single or multiple option menu.\nIt functions as a wrapper around the browser's native `<select>` element.\n\n```jsx\nimport { SelectControl } from '@wordpress/components';\nimport { useState } from '@wordpress/element';\n\nconst MySelectControl = () => {\n  const [ size, setSize ] = useState( '50%' );\n\n  return (\n    <SelectControl\n      __nextHasNoMarginBottom\n      label=\"Size\"\n      value={ size }\n      options={ [\n        { label: 'Big', value: '100%' },\n        { label: 'Medium', value: '50%' },\n        { label: 'Small', value: '25%' },\n      ] }\n      onChange={ setSize }\n    />\n  );\n};\n```",displayName:"SelectControl",props:{label:{defaultValue:null,description:"If this property is added, a label will be generated using label property as the content.",name:"label",required:!1,type:{name:"ReactNode"}},prefix:{defaultValue:null,description:"Renders an element on the left side of the input.\n\nBy default, the prefix is aligned with the edge of the input border, with no padding.\nIf you want to apply standard padding in accordance with the size variant, wrap the element in\nthe provided `<InputControlPrefixWrapper>` component.\n@example import {\n  __experimentalInputControl as InputControl,\n  __experimentalInputControlPrefixWrapper as InputControlPrefixWrapper,\n} from '@wordpress/components';\n\n<InputControl\n  prefix={<InputControlPrefixWrapper>@</InputControlPrefixWrapper>}\n/>",name:"prefix",required:!1,type:{name:"ReactNode"}},disabled:{defaultValue:{value:"false"},description:"If true, the `input` will be disabled.",name:"disabled",required:!1,type:{name:"boolean"}},size:{defaultValue:{value:"'default'"},description:"Adjusts the size of the input.",name:"size",required:!1,type:{name:"enum",value:[{value:'"small"'},{value:'"default"'},{value:'"compact"'},{value:'"__unstable-large"'}]}},suffix:{defaultValue:null,description:"Renders an element on the right side of the input.\n\nBy default, the suffix is aligned with the edge of the input border, with no padding.\nIf you want to apply standard padding in accordance with the size variant, wrap the element in\nthe provided `<InputControlSuffixWrapper>` component.\n@example import {\n  __experimentalInputControl as InputControl,\n  __experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,\n} from '@wordpress/components';\n\n<InputControl\n  suffix={<InputControlSuffixWrapper>%</InputControlSuffixWrapper>}\n/>",name:"suffix",required:!1,type:{name:"ReactNode"}},__next36pxDefaultSize:{defaultValue:{value:"false"},description:"Deprecated. Use `__next40pxDefaultSize` instead.\n@deprecated\n@ignore",name:"__next36pxDefaultSize",required:!1,type:{name:"boolean"}},__next40pxDefaultSize:{defaultValue:{value:"false"},description:"Start opting into the larger default height that will become the default size in a future version.",name:"__next40pxDefaultSize",required:!1,type:{name:"boolean"}},hideLabelFromVision:{defaultValue:{value:"false"},description:"If true, the label will only be visible to screen readers.",name:"hideLabelFromVision",required:!1,type:{name:"boolean"}},labelPosition:{defaultValue:{value:"'top'"},description:"The position of the label.",name:"labelPosition",required:!1,type:{name:"enum",value:[{value:'"top"'},{value:'"bottom"'},{value:'"edge"'},{value:'"side"'}]}},help:{defaultValue:null,description:"Additional description for the control.\n\nOnly use for meaningful description or instructions for the control. An element containing the description will be programmatically associated to the BaseControl by the means of an `aria-describedby` attribute.",name:"help",required:!1,type:{name:"ReactNode"}},__nextHasNoMarginBottom:{defaultValue:{value:"false"},description:"Start opting into the new margin-free styles that will become the default in a future version.",name:"__nextHasNoMarginBottom",required:!1,type:{name:"boolean"}},options:{defaultValue:null,description:"An array of option property objects to be rendered,\neach with a `label` and `value` property, as well as any other\n`<option>` attributes.",name:"options",required:!1,type:{name:'readonly ({ label: string; value: V; } & Omit<OptionHTMLAttributes<HTMLOptionElement>, "label" | "value">)[]'}},children:{defaultValue:null,description:"As an alternative to the `options` prop, `optgroup`s and `options` can be\npassed in as `children` for more customizability.",name:"children",required:!1,type:{name:"ReactNode"}},variant:{defaultValue:{value:"'default'"},description:"The style variant of the control.",name:"variant",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"minimal"'}]}},multiple:{defaultValue:{value:"false\nfalse"},description:"If this property is added, multiple values can be selected. The `value` passed should be an array.\n\nIn most cases, it is preferable to use the `FormTokenField` or `CheckboxControl` components instead.",name:"multiple",required:!1,type:{name:"boolean"}},value:{defaultValue:null,description:"The value of the selected option.\n\nIf `multiple` is true, the `value` should be an array with the values of the selected options.",name:"value",required:!1,type:{name:"string | NoInfer<V>[]"}},onChange:{defaultValue:null,description:"A function that receives the value of the new option that is being selected as input.\n\nIf `multiple` is `true`, the value received is an array of the selected value.\nOtherwise, the value received is a single value with the new selected value.",name:"onChange",required:!1,type:{name:"((value: NoInfer<V>, extra?: { event?: ChangeEvent<HTMLSelectElement>; }) => void) | ((value: NoInfer<V>[], extra?: { event?: ChangeEvent<HTMLSelectElement>; }) => void)"}},ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"Ref<HTMLSelectElement>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/select-control/index.tsx#SelectControl"]={docgenInfo:SelectControl.__docgenInfo,name:"SelectControl",path:"packages/components/src/select-control/index.tsx#SelectControl"})}catch(__react_docgen_typescript_loader_error){}},"./packages/components/src/utils/hooks/use-controlled-value.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>useControlledValue});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function useControlledValue({defaultValue,onChange,value:valueProp}){const hasValue=void 0!==valueProp,initialValue=hasValue?valueProp:defaultValue,[state,setState]=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(initialValue);let setValue;return setValue=hasValue&&"function"==typeof onChange?onChange:hasValue||"function"!=typeof onChange?setState:nextValue=>{onChange(nextValue),setState(nextValue)},[hasValue?valueProp:state,setValue]}}}]);