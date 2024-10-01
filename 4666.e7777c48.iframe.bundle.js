"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[4666],{"./packages/components/build-module/input-control/input-suffix-wrapper.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),_context__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/components/build-module/context/context-connect.js"),_styles_input_control_styles__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/build-module/input-control/styles/input-control-styles.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,_context__WEBPACK_IMPORTED_MODULE_3__.Iq)((function UnconnectedInputControlSuffixWrapper(props,forwardedRef){const derivedProps=(0,_context__WEBPACK_IMPORTED_MODULE_1__.y)(props,"InputControlSuffixWrapper");return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_input_control_styles__WEBPACK_IMPORTED_MODULE_2__.If,{...derivedProps,ref:forwardedRef})}),"InputControlSuffixWrapper")},"./packages/components/build-module/select-control/chevron-down.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/icons/build-module/icon/index.js"),_wordpress_icons__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/icons/build-module/library/chevron-down.js"),_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/select-control/styles/select-control-styles.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_1__.j,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_1__.fE,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_2__.Z,{icon:_wordpress_icons__WEBPACK_IMPORTED_MODULE_3__.Z,size:_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_1__.Vx})})})},"./packages/components/build-module/select-control/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Y:()=>SelectControl,Z:()=>__WEBPACK_DEFAULT_EXPORT__});var clsx__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/compose/build-module/hooks/use-instance-id/index.js"),_wordpress_element__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/react/index.js"),_base_control__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/build-module/base-control/index.js"),_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/components/build-module/select-control/styles/select-control-styles.js"),_chevron_down__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/components/build-module/select-control/chevron-down.js"),_utils_use_deprecated_props__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/build-module/utils/use-deprecated-props.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");function SelectOptions({options}){return options.map((({id,label,value,...optionProps},index)=>{const key=id||`${label}-${value}-${index}`;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option",{value,...optionProps,children:label},key)}))}const SelectControl=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_7__.forwardRef)((function UnforwardedSelectControl(props,ref){const{className,disabled=!1,help,hideLabelFromVision,id:idProp,label,multiple=!1,onChange,options=[],size="default",value:valueProp,labelPosition="top",children,prefix,suffix,variant="default",__next40pxDefaultSize=!1,__nextHasNoMarginBottom=!1,...restProps}=(0,_utils_use_deprecated_props__WEBPACK_IMPORTED_MODULE_2__.s)(props),id=function useUniqueId(idProp){const instanceId=(0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.Z)(SelectControl);return idProp||`inspector-select-control-${instanceId}`}(idProp),helpId=help?`${id}__help`:void 0;if(!options?.length&&!children)return null;const classes=(0,clsx__WEBPACK_IMPORTED_MODULE_3__.Z)("components-select-control",className);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_base_control__WEBPACK_IMPORTED_MODULE_4__.ZP,{help,id,__nextHasNoMarginBottom,__associatedWPComponentName:"SelectControl",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_5__.el,{className:classes,disabled,hideLabelFromVision,id,isBorderless:"minimal"===variant,label,size,suffix:suffix||!multiple&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chevron_down__WEBPACK_IMPORTED_MODULE_6__.Z,{}),prefix,labelPosition,__unstableInputWidth:"minimal"===variant?"auto":void 0,variant,__next40pxDefaultSize,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_select_control_styles__WEBPACK_IMPORTED_MODULE_5__.Ph,{...restProps,__next40pxDefaultSize,"aria-describedby":helpId,className:"components-select-control__input",disabled,id,multiple,onChange:event=>{if(props.multiple){const newValues=Array.from(event.target.options).filter((({selected})=>selected)).map((({value})=>value));props.onChange?.(newValues,{event})}else props.onChange?.(event.target.value,{event})},ref,selectSize:size,value:valueProp,variant,children:children||(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(SelectOptions,{options})})})})})),__WEBPACK_DEFAULT_EXPORT__=SelectControl},"./packages/components/build-module/select-control/styles/select-control-styles.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ph:()=>Select,Vx:()=>chevronIconSize,el:()=>StyledInputBase,fE:()=>DownArrowWrapper,j:()=>InputControlSuffixWrapperWithClickThrough});var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),_emotion_react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),_utils__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/build-module/utils/colors-values.js"),_utils__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/build-module/utils/config-values.js"),_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/components/build-module/utils/rtl.js"),_utils_space__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/components/build-module/utils/space.js"),_input_control_input_suffix_wrapper__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/components/build-module/input-control/input-suffix-wrapper.js"),_input_control_styles_input_control_styles__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/components/build-module/input-control/styles/input-control-styles.js"),_input_control_input_base__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/components/build-module/input-control/input-base.js");const disabledStyles=({disabled})=>disabled?(0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__.iv)("color:",_utils__WEBPACK_IMPORTED_MODULE_2__.D.ui.textDisabled,";cursor:default;","","",""):"";var _ref2={name:"1lv1yo7",styles:"display:inline-flex"};const inputBaseVariantStyles=({variant})=>"minimal"===variant?_ref2:"",StyledInputBase=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)(_input_control_input_base__WEBPACK_IMPORTED_MODULE_3__.Z,{target:"e1mv6sxx3"})("color:",_utils__WEBPACK_IMPORTED_MODULE_2__.D.theme.foreground,";cursor:pointer;",disabledStyles," ",inputBaseVariantStyles,";"),sizeStyles=({__next40pxDefaultSize,multiple,selectSize="default"})=>{if(multiple)return;const sizes={default:{height:40,minHeight:40,paddingTop:0,paddingBottom:0},small:{height:24,minHeight:24,paddingTop:0,paddingBottom:0},compact:{height:32,minHeight:32,paddingTop:0,paddingBottom:0},"__unstable-large":{height:40,minHeight:40,paddingTop:0,paddingBottom:0}};__next40pxDefaultSize||(sizes.default=sizes.compact);const style=sizes[selectSize]||sizes.default;return(0,_emotion_react__WEBPACK_IMPORTED_MODULE_1__.iv)(style,"","","","")},chevronIconSize=18,sizePaddings=({__next40pxDefaultSize,multiple,selectSize="default"})=>{const padding={default:_utils__WEBPACK_IMPORTED_MODULE_4__.Z.controlPaddingX,small:_utils__WEBPACK_IMPORTED_MODULE_4__.Z.controlPaddingXSmall,compact:_utils__WEBPACK_IMPORTED_MODULE_4__.Z.controlPaddingXSmall,"__unstable-large":_utils__WEBPACK_IMPORTED_MODULE_4__.Z.controlPaddingX};__next40pxDefaultSize||(padding.default=padding.compact);const selectedPadding=padding[selectSize]||padding.default;return(0,_utils__WEBPACK_IMPORTED_MODULE_5__.b)({paddingLeft:selectedPadding,paddingRight:selectedPadding+chevronIconSize,...multiple?{paddingTop:selectedPadding,paddingBottom:selectedPadding}:{}})},overflowStyles=({multiple})=>({overflow:multiple?"auto":"hidden"});var _ref={name:"n1jncc",styles:"field-sizing:content"};const variantStyles=({variant})=>"minimal"===variant?_ref:"",Select=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("select",{target:"e1mv6sxx2"})("&&&{appearance:none;background:transparent;box-sizing:border-box;border:none;box-shadow:none!important;color:currentColor;cursor:inherit;display:block;font-family:inherit;margin:0;width:100%;max-width:none;white-space:nowrap;text-overflow:ellipsis;",_input_control_styles_input_control_styles__WEBPACK_IMPORTED_MODULE_6__.NS,";",sizeStyles,";",sizePaddings,";",overflowStyles," ",variantStyles,";}"),DownArrowWrapper=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("div",{target:"e1mv6sxx1"})("margin-inline-end:",(0,_utils_space__WEBPACK_IMPORTED_MODULE_7__.D)(-1),";line-height:0;path{fill:currentColor;}"),InputControlSuffixWrapperWithClickThrough=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)(_input_control_input_suffix_wrapper__WEBPACK_IMPORTED_MODULE_8__.Z,{target:"e1mv6sxx0"})("position:absolute;pointer-events:none;",(0,_utils__WEBPACK_IMPORTED_MODULE_5__.b)({right:0}),";")},"./packages/icons/build-module/icon/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const __WEBPACK_DEFAULT_EXPORT__=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((function Icon({icon,size=24,...props},ref){return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon,{width:size,height:size,...props,ref})}))},"./packages/icons/build-module/library/chevron-down.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/primitives/build-module/svg/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Wj,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.y$,{d:"M17.5 11.6L12 16l-5.5-4.4.9-1.2L12 14l4.5-3.6 1 1.2z"})})}}]);