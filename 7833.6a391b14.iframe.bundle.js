"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[7833],{"./packages/components/build-module/toggle-group-control/context.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>useToggleGroupControlContext,Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const ToggleGroupControlContext=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)({}),useToggleGroupControlContext=()=>(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(ToggleGroupControlContext),__WEBPACK_DEFAULT_EXPORT__=ToggleGroupControlContext},"./packages/components/build-module/toggle-group-control/toggle-group-control-option-base/component.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>component});var styles_namespaceObject={};__webpack_require__.r(styles_namespaceObject),__webpack_require__.d(styles_namespaceObject,{ButtonContentView:()=>ButtonContentView,LabelView:()=>LabelView,Uz:()=>backdropView,Ji:()=>buttonView,IA:()=>labelBlock});var K7FXVWIT=__webpack_require__("./packages/components/node_modules/@ariakit/react-core/esm/__chunks/K7FXVWIT.js"),motion=__webpack_require__("./node_modules/framer-motion/dist/es/render/dom/motion.mjs"),use_reduced_motion=__webpack_require__("./packages/compose/build-module/hooks/use-reduced-motion/index.js"),use_instance_id=__webpack_require__("./packages/compose/build-module/hooks/use-instance-id/index.js"),react=__webpack_require__("./node_modules/react/index.js"),use_context_system=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),context_connect=__webpack_require__("./packages/components/build-module/context/context-connect.js"),context=__webpack_require__("./packages/components/build-module/toggle-group-control/context.js"),emotion_styled_base_browser_esm=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),emotion_react_browser_esm=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),config_values=__webpack_require__("./packages/components/build-module/utils/config-values.js"),colors_values=__webpack_require__("./packages/components/build-module/utils/colors-values.js");const LabelView=(0,emotion_styled_base_browser_esm.Z)("div",{target:"et6ln9s1"})({name:"sln1fl",styles:"display:inline-flex;max-width:100%;min-width:0;position:relative"}),labelBlock={name:"82a6rk",styles:"flex:1"},buttonView=({isDeselectable,isIcon,isPressed,size})=>(0,emotion_react_browser_esm.iv)("align-items:center;appearance:none;background:transparent;border:none;border-radius:",config_values.Z.radiusXSmall,";color:",colors_values.D.gray[700],";fill:currentColor;cursor:pointer;display:flex;font-family:inherit;height:100%;justify-content:center;line-height:100%;outline:none;padding:0 12px;position:relative;text-align:center;@media not ( prefers-reduced-motion ){transition:background ",config_values.Z.transitionDurationFast," linear,color ",config_values.Z.transitionDurationFast," linear,font-weight 60ms linear;}user-select:none;width:100%;z-index:2;&::-moz-focus-inner{border:0;}&[disabled]{opacity:0.4;cursor:default;}&:active{background:",config_values.Z.controlBackgroundColor,";}",isDeselectable&&deselectable," ",isIcon&&isIconStyles({size})," ",isPressed&&pressed,";","","",""),pressed=(0,emotion_react_browser_esm.iv)("color:",colors_values.D.white,";&:active{background:transparent;}","","",""),deselectable=(0,emotion_react_browser_esm.iv)("color:",colors_values.D.gray[900],";&:focus{box-shadow:inset 0 0 0 1px ",colors_values.D.white,",0 0 0 ",config_values.Z.borderWidthFocus," ",colors_values.D.theme.accent,";outline:2px solid transparent;}","","",""),ButtonContentView=(0,emotion_styled_base_browser_esm.Z)("div",{target:"et6ln9s0"})("display:flex;font-size:",config_values.Z.fontSize,";line-height:1;"),isIconStyles=({size="default"})=>(0,emotion_react_browser_esm.iv)("color:",colors_values.D.gray[900],";height:",{default:"30px","__unstable-large":"32px"}[size],";aspect-ratio:1;padding-left:0;padding-right:0;","","",""),backdropView=(0,emotion_react_browser_esm.iv)("background:",colors_values.D.gray[900],";border-radius:",config_values.Z.radiusXSmall,";position:absolute;inset:0;z-index:1;outline:2px solid transparent;outline-offset:-3px;","","","");var use_cx=__webpack_require__("./packages/components/build-module/utils/hooks/use-cx.js"),tooltip=__webpack_require__("./packages/components/build-module/tooltip/index.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const{ButtonContentView:component_ButtonContentView,LabelView:component_LabelView}=styles_namespaceObject,REDUCED_MOTION_TRANSITION_CONFIG={duration:0},WithToolTip=({showTooltip,text,children})=>showTooltip&&text?(0,jsx_runtime.jsx)(tooltip.ZP,{text,placement:"top",children}):(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children});const ConnectedToggleGroupControlOptionBase=(0,context_connect.Iq)((function ToggleGroupControlOptionBase(props,forwardedRef){const shouldReduceMotion=(0,use_reduced_motion.Z)(),toggleGroupControlContext=(0,context.L)(),id=(0,use_instance_id.Z)(ToggleGroupControlOptionBase,toggleGroupControlContext.baseId||"toggle-group-control-option-base"),buttonProps=(0,use_context_system.y)({...props,id},"ToggleGroupControlOptionBase"),{isBlock=!1,isDeselectable=!1,size="default"}=toggleGroupControlContext,{className,isIcon=!1,value,children,showTooltip=!1,onFocus:onFocusProp,disabled,...otherButtonProps}=buttonProps,isPressed=toggleGroupControlContext.value===value,cx=(0,use_cx.I)(),labelViewClasses=(0,react.useMemo)((()=>cx(isBlock&&labelBlock)),[cx,isBlock]),itemClasses=(0,react.useMemo)((()=>cx(buttonView({isDeselectable,isIcon,isPressed,size}),className)),[cx,isDeselectable,isIcon,isPressed,size,className]),backdropClasses=(0,react.useMemo)((()=>cx(backdropView)),[cx]),commonProps={...otherButtonProps,className:itemClasses,"data-value":value,ref:forwardedRef};return(0,jsx_runtime.jsxs)(component_LabelView,{className:labelViewClasses,children:[(0,jsx_runtime.jsx)(WithToolTip,{showTooltip,text:otherButtonProps["aria-label"],children:isDeselectable?(0,jsx_runtime.jsx)("button",{...commonProps,disabled,onFocus:onFocusProp,"aria-pressed":isPressed,type:"button",onClick:()=>{isDeselectable&&isPressed?toggleGroupControlContext.setValue(void 0):toggleGroupControlContext.setValue(value)},children:(0,jsx_runtime.jsx)(component_ButtonContentView,{children})}):(0,jsx_runtime.jsx)(K7FXVWIT.Y,{disabled,render:(0,jsx_runtime.jsx)("button",{type:"button",...commonProps,onFocus:event=>{onFocusProp?.(event),event.defaultPrevented||toggleGroupControlContext.setValue(value)}}),value,children:(0,jsx_runtime.jsx)(component_ButtonContentView,{children})})}),isPressed?(0,jsx_runtime.jsx)(motion.E.div,{layout:!0,layoutRoot:!0,children:(0,jsx_runtime.jsx)(motion.E.div,{className:backdropClasses,transition:shouldReduceMotion?REDUCED_MOTION_TRANSITION_CONFIG:void 0,role:"presentation",layoutId:"toggle-group-backdrop-shared-layout-id"})}):null]})}),"ToggleGroupControlOptionBase"),component=ConnectedToggleGroupControlOptionBase},"./packages/components/build-module/toggle-group-control/toggle-group-control/component.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>toggle_group_control_component});var LayoutGroup=__webpack_require__("./node_modules/framer-motion/dist/es/components/LayoutGroup/index.mjs"),use_instance_id=__webpack_require__("./packages/compose/build-module/hooks/use-instance-id/index.js"),react=__webpack_require__("./node_modules/react/index.js"),use_context_system=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),context_connect=__webpack_require__("./packages/components/build-module/context/context-connect.js"),use_cx=__webpack_require__("./packages/components/build-module/utils/hooks/use-cx.js"),base_control=__webpack_require__("./packages/components/build-module/base-control/index.js"),emotion_styled_base_browser_esm=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),emotion_react_browser_esm=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),colors_values=__webpack_require__("./packages/components/build-module/utils/colors-values.js"),config_values=__webpack_require__("./packages/components/build-module/utils/config-values.js");const enclosingBorders=isBlock=>{const enclosingBorder=(0,emotion_react_browser_esm.iv)("border-color:",colors_values.D.ui.border,";","","","");return(0,emotion_react_browser_esm.iv)(isBlock&&enclosingBorder," &:hover{border-color:",colors_values.D.ui.borderHover,";}&:focus-within{border-color:",colors_values.D.ui.borderFocus,";box-shadow:",config_values.Z.controlBoxShadowFocus,";z-index:1;outline:2px solid transparent;outline-offset:-2px;}","","","")};var _ref={name:"1aqh2c7",styles:"min-height:40px;padding:3px"},_ref2={name:"1ndywgm",styles:"min-height:36px;padding:2px"};const toggleGroupControlSize=size=>({default:_ref2,"__unstable-large":_ref}[size]),block={name:"7whenc",styles:"display:flex;width:100%"},VisualLabelWrapper=(0,emotion_styled_base_browser_esm.Z)("div",{target:"eakva830"})({name:"zjik7",styles:"display:flex"});var DYHFBFEH=__webpack_require__("./packages/components/node_modules/@ariakit/react-core/esm/__chunks/DYHFBFEH.js"),radio_group=__webpack_require__("./packages/components/node_modules/@ariakit/react-core/esm/radio/radio-group.js"),_2GXGCHW6=__webpack_require__("./packages/components/node_modules/@ariakit/react-core/esm/__chunks/2GXGCHW6.js"),build_module=__webpack_require__("./packages/i18n/build-module/index.js"),component=__webpack_require__("./packages/components/build-module/view/component.js"),context=__webpack_require__("./packages/components/build-module/toggle-group-control/context.js"),use_previous=__webpack_require__("./packages/compose/build-module/hooks/use-previous/index.js");function useComputeControlledOrUncontrolledValue(valueProp){const isInitialRenderRef=(0,react.useRef)(!0),prevValueProp=(0,use_previous.Z)(valueProp),prevIsControlledRef=(0,react.useRef)(!1);(0,react.useEffect)((()=>{isInitialRenderRef.current&&(isInitialRenderRef.current=!1)}),[]);const isControlled=prevIsControlledRef.current||!isInitialRenderRef.current&&prevValueProp!==valueProp;return(0,react.useEffect)((()=>{prevIsControlledRef.current=isControlled}),[isControlled]),isControlled?{value:null!=valueProp?valueProp:"",defaultValue:void 0}:{value:void 0,defaultValue:valueProp}}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const ToggleGroupControlAsRadioGroup=(0,react.forwardRef)((function UnforwardedToggleGroupControlAsRadioGroup({children,isAdaptiveWidth,label,onChange:onChangeProp,size,value:valueProp,id:idProp,...otherProps},forwardedRef){const generatedId=(0,use_instance_id.Z)(ToggleGroupControlAsRadioGroup,"toggle-group-control-as-radio-group"),baseId=idProp||generatedId,{value,defaultValue}=useComputeControlledOrUncontrolledValue(valueProp),wrappedOnChangeProp=onChangeProp?v=>{onChangeProp(null!=v?v:void 0)}:void 0,radio=DYHFBFEH.s({defaultValue,value,setValue:wrappedOnChangeProp,rtl:(0,build_module.dZ)()}),selectedValue=(0,_2GXGCHW6.Kw)(radio,"value"),setValue=radio.setValue,groupContextValue=(0,react.useMemo)((()=>({baseId,isBlock:!isAdaptiveWidth,size,value:selectedValue,setValue})),[baseId,isAdaptiveWidth,size,selectedValue,setValue]);return(0,jsx_runtime.jsx)(context.Z.Provider,{value:groupContextValue,children:(0,jsx_runtime.jsx)(radio_group.E,{store:radio,"aria-label":label,render:(0,jsx_runtime.jsx)(component.Z,{}),...otherProps,id:baseId,ref:forwardedRef,children})})}));var use_controlled_value=__webpack_require__("./packages/components/build-module/utils/hooks/use-controlled-value.js");const ToggleGroupControlAsButtonGroup=(0,react.forwardRef)((function UnforwardedToggleGroupControlAsButtonGroup({children,isAdaptiveWidth,label,onChange,size,value:valueProp,id:idProp,...otherProps},forwardedRef){const generatedId=(0,use_instance_id.Z)(ToggleGroupControlAsButtonGroup,"toggle-group-control-as-button-group"),baseId=idProp||generatedId,{value,defaultValue}=useComputeControlledOrUncontrolledValue(valueProp),[selectedValue,setSelectedValue]=(0,use_controlled_value.O)({defaultValue,value,onChange}),groupContextValue=(0,react.useMemo)((()=>({baseId,value:selectedValue,setValue:setSelectedValue,isBlock:!isAdaptiveWidth,isDeselectable:!0,size})),[baseId,selectedValue,setSelectedValue,isAdaptiveWidth,size]);return(0,jsx_runtime.jsx)(context.Z.Provider,{value:groupContextValue,children:(0,jsx_runtime.jsx)(component.Z,{"aria-label":label,...otherProps,ref:forwardedRef,role:"group",children})})}));const ToggleGroupControl=(0,context_connect.Iq)((function UnconnectedToggleGroupControl(props,forwardedRef){const{__nextHasNoMarginBottom=!1,__next40pxDefaultSize=!1,className,isAdaptiveWidth=!1,isBlock=!1,isDeselectable=!1,label,hideLabelFromVision=!1,help,onChange,size="default",value,children,...otherProps}=(0,use_context_system.y)(props,"ToggleGroupControl"),baseId=(0,use_instance_id.Z)(ToggleGroupControl,"toggle-group-control"),normalizedSize=__next40pxDefaultSize&&"default"===size?"__unstable-large":size,cx=(0,use_cx.I)(),classes=(0,react.useMemo)((()=>cx((({isBlock,isDeselectable,size})=>(0,emotion_react_browser_esm.iv)("background:",colors_values.D.ui.background,";border:1px solid transparent;border-radius:",config_values.Z.radiusSmall,";display:inline-flex;min-width:0;position:relative;",toggleGroupControlSize(size)," ",!isDeselectable&&enclosingBorders(isBlock),";","","",""))({isBlock,isDeselectable,size:normalizedSize}),isBlock&&block,className)),[className,cx,isBlock,isDeselectable,normalizedSize]),MainControl=isDeselectable?ToggleGroupControlAsButtonGroup:ToggleGroupControlAsRadioGroup;return(0,jsx_runtime.jsxs)(base_control.ZP,{help,__nextHasNoMarginBottom,__associatedWPComponentName:"ToggleGroupControl",children:[!hideLabelFromVision&&(0,jsx_runtime.jsx)(VisualLabelWrapper,{children:(0,jsx_runtime.jsx)(base_control.ZP.VisualLabel,{children:label})}),(0,jsx_runtime.jsx)(MainControl,{...otherProps,className:classes,isAdaptiveWidth,label,onChange,ref:forwardedRef,size:normalizedSize,value,children:(0,jsx_runtime.jsx)(LayoutGroup.S,{id:baseId,children})})]})}),"ToggleGroupControl"),toggle_group_control_component=ToggleGroupControl},"./packages/components/build-module/utils/hooks/use-controlled-value.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>useControlledValue});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function useControlledValue({defaultValue,onChange,value:valueProp}){const hasValue=void 0!==valueProp,initialValue=hasValue?valueProp:defaultValue,[state,setState]=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(initialValue);let setValue;return setValue=hasValue&&"function"==typeof onChange?onChange:hasValue||"function"!=typeof onChange?setState:nextValue=>{onChange(nextValue),setState(nextValue)},[hasValue?valueProp:state,setValue]}},"./packages/compose/build-module/hooks/use-previous/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>usePrevious});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function usePrevious(value){const ref=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{ref.current=value}),[value]),ref.current}}}]);