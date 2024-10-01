"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[6126],{"./packages/components/build-module/base-control/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Xp:()=>BaseControl,ZP:()=>__WEBPACK_DEFAULT_EXPORT__});var clsx__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/deprecated/build-module/index.js"),_wordpress_element__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react/index.js"),_visually_hidden__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/build-module/visually-hidden/component.js"),_styles_base_control_styles__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/components/build-module/base-control/styles/base-control-styles.js"),_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),_context__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./packages/components/build-module/context/context-connect.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const VisualLabel=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.forwardRef)(((props,ref)=>{const{className,children,...restProps}=props;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_base_control_styles__WEBPACK_IMPORTED_MODULE_3__.yF,{ref,...restProps,className:(0,clsx__WEBPACK_IMPORTED_MODULE_5__.Z)("components-base-control__label",className),children})})),BaseControl=Object.assign((0,_context__WEBPACK_IMPORTED_MODULE_7__.Kc)((props=>{const{__nextHasNoMarginBottom=!1,__associatedWPComponentName="BaseControl",id,label,hideLabelFromVision=!1,help,className,children}=(0,_context__WEBPACK_IMPORTED_MODULE_1__.y)(props,"BaseControl");return __nextHasNoMarginBottom||(0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__.Z)(`Bottom margin styles for wp.components.${__associatedWPComponentName}`,{since:"6.7",version:"7.0",hint:"Set the `__nextHasNoMarginBottom` prop to true to start opting into the new styles, which will become the default in a future version."}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_styles_base_control_styles__WEBPACK_IMPORTED_MODULE_3__.im,{className,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_styles_base_control_styles__WEBPACK_IMPORTED_MODULE_3__.ob,{className:"components-base-control__field",__nextHasNoMarginBottom,children:[label&&id&&(hideLabelFromVision?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_visually_hidden__WEBPACK_IMPORTED_MODULE_4__.Z,{as:"label",htmlFor:id,children:label}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_base_control_styles__WEBPACK_IMPORTED_MODULE_3__.ar,{className:"components-base-control__label",htmlFor:id,children:label})),label&&!id&&(hideLabelFromVision?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_visually_hidden__WEBPACK_IMPORTED_MODULE_4__.Z,{as:"label",children:label}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(VisualLabel,{children:label})),children]}),!!help&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_styles_base_control_styles__WEBPACK_IMPORTED_MODULE_3__.vB,{id:id?id+"__help":void 0,className:"components-base-control__help",__nextHasNoMarginBottom,children:help})]})}),"BaseControl"),{VisualLabel}),__WEBPACK_DEFAULT_EXPORT__=BaseControl},"./packages/components/build-module/base-control/styles/base-control-styles.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{ar:()=>StyledLabel,im:()=>Wrapper,ob:()=>StyledField,vB:()=>StyledHelp,yF:()=>StyledVisualLabel});var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),_emotion_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),_utils__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/utils/font.js"),_utils__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/build-module/utils/box-sizing.js"),_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/components/build-module/utils/base-label.js"),_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/components/build-module/utils/colors-values.js"),_utils_space__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/build-module/utils/space.js");const Wrapper=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("div",{target:"ej5x27r4"})("font-family:",(0,_utils__WEBPACK_IMPORTED_MODULE_1__.L)("default.fontFamily"),";font-size:",(0,_utils__WEBPACK_IMPORTED_MODULE_1__.L)("default.fontSize"),";",_utils__WEBPACK_IMPORTED_MODULE_2__.p,";"),deprecatedMarginField=({__nextHasNoMarginBottom=!1})=>!__nextHasNoMarginBottom&&(0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.iv)("margin-bottom:",(0,_utils_space__WEBPACK_IMPORTED_MODULE_4__.D)(2),";","","",""),StyledField=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("div",{target:"ej5x27r3"})(deprecatedMarginField," .components-panel__row &{margin-bottom:inherit;}"),labelStyles=(0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.iv)(_utils__WEBPACK_IMPORTED_MODULE_5__.S,";display:block;margin-bottom:",(0,_utils_space__WEBPACK_IMPORTED_MODULE_4__.D)(2),";padding:0;","","",""),StyledLabel=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("label",{target:"ej5x27r2"})(labelStyles,";");var _ref={name:"11yad0w",styles:"margin-bottom:revert"};const deprecatedMarginHelp=({__nextHasNoMarginBottom=!1})=>!__nextHasNoMarginBottom&&_ref,StyledHelp=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("p",{target:"ej5x27r1"})("margin-top:",(0,_utils_space__WEBPACK_IMPORTED_MODULE_4__.D)(2),";margin-bottom:0;font-size:",(0,_utils__WEBPACK_IMPORTED_MODULE_1__.L)("helpText.fontSize"),";font-style:normal;color:",_utils__WEBPACK_IMPORTED_MODULE_6__.D.gray[700],";",deprecatedMarginHelp,";"),StyledVisualLabel=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("span",{target:"ej5x27r0"})(labelStyles,";")},"./packages/components/build-module/utils/base-label.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{S:()=>baseLabelTypography});const baseLabelTypography={name:"9amh4a",styles:"font-size:11px;font-weight:500;line-height:1.4;text-transform:uppercase"}},"./packages/components/build-module/utils/box-sizing.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{p:()=>boxSizingReset});const boxSizingReset={name:"kv6lnz",styles:"box-sizing:border-box;*,*::before,*::after{box-sizing:inherit;}"}},"./packages/components/build-module/utils/colors-values.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>COLORS});const GRAY={900:"#1e1e1e",800:"#2f2f2f",700:"#757575",600:"#949494",400:"#ccc",300:"#ddd",200:"#e0e0e0",100:"#f0f0f0"},THEME={accent:"var(--wp-components-color-accent, var(--wp-admin-theme-color, #3858e9))",accentDarker10:"var(--wp-components-color-accent-darker-10, var(--wp-admin-theme-color-darker-10, #2145e6))",accentDarker20:"var(--wp-components-color-accent-darker-20, var(--wp-admin-theme-color-darker-20, #183ad6))",accentInverted:"var(--wp-components-color-accent-inverted, #fff)",background:"var(--wp-components-color-background, #fff)",foreground:`var(--wp-components-color-foreground, ${GRAY[900]})`,foregroundInverted:"var(--wp-components-color-foreground-inverted, #fff)",gray:{900:`var(--wp-components-color-foreground, ${GRAY[900]})`,800:`var(--wp-components-color-gray-800, ${GRAY[800]})`,700:`var(--wp-components-color-gray-700, ${GRAY[700]})`,600:`var(--wp-components-color-gray-600, ${GRAY[600]})`,400:`var(--wp-components-color-gray-400, ${GRAY[400]})`,300:`var(--wp-components-color-gray-300, ${GRAY[300]})`,200:`var(--wp-components-color-gray-200, ${GRAY[200]})`,100:`var(--wp-components-color-gray-100, ${GRAY[100]})`}},UI={background:THEME.background,backgroundDisabled:THEME.gray[100],border:THEME.gray[600],borderHover:THEME.gray[700],borderFocus:THEME.accent,borderDisabled:THEME.gray[400],textDisabled:THEME.gray[600],darkGrayPlaceholder:`color-mix(in srgb, ${THEME.foreground}, transparent 38%)`,lightGrayPlaceholder:`color-mix(in srgb, ${THEME.background}, transparent 35%)`},COLORS=Object.freeze({gray:GRAY,white:"#fff",alert:{yellow:"#f0b849",red:"#d94f4f",green:"#4ab866"},theme:THEME,ui:UI})},"./packages/components/build-module/utils/config-values.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _space__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/utils/space.js"),_colors_values__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/components/build-module/utils/colors-values.js");const CONTROL_PROPS={controlPaddingX:12,controlPaddingXSmall:8,controlPaddingXLarge:12*1.3334,controlBackgroundColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,controlBoxShadowFocus:`0 0 0 0.5px ${_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.theme.accent}`,controlHeight:"36px",controlHeightXSmall:"calc( 36px * 0.6 )",controlHeightSmall:"calc( 36px * 0.8 )",controlHeightLarge:"calc( 36px * 1.2 )",controlHeightXLarge:"calc( 36px * 1.4 )"},__WEBPACK_DEFAULT_EXPORT__=Object.assign({},CONTROL_PROPS,{colorDivider:"rgba(0, 0, 0, 0.1)",colorScrollbarThumb:"rgba(0, 0, 0, 0.2)",colorScrollbarThumbHover:"rgba(0, 0, 0, 0.5)",colorScrollbarTrack:"rgba(0, 0, 0, 0.04)",elevationIntensity:1,radiusXSmall:"1px",radiusSmall:"2px",radiusMedium:"4px",radiusLarge:"8px",radiusFull:"9999px",radiusRound:"50%",borderWidth:"1px",borderWidthFocus:"1.5px",borderWidthTab:"4px",spinnerSize:16,fontSize:"13px",fontSizeH1:"calc(2.44 * 13px)",fontSizeH2:"calc(1.95 * 13px)",fontSizeH3:"calc(1.56 * 13px)",fontSizeH4:"calc(1.25 * 13px)",fontSizeH5:"13px",fontSizeH6:"calc(0.8 * 13px)",fontSizeInputMobile:"16px",fontSizeMobile:"15px",fontSizeSmall:"calc(0.92 * 13px)",fontSizeXSmall:"calc(0.75 * 13px)",fontLineHeightBase:"1.4",fontWeight:"normal",fontWeightHeading:"600",gridBase:"4px",cardPaddingXSmall:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(2)}`,cardPaddingSmall:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(4)}`,cardPaddingMedium:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(4)} ${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(6)}`,cardPaddingLarge:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(6)} ${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(8)}`,elevationXSmall:"0 1px 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02), 0 3px 3px rgba(0, 0, 0, 0.02), 0 4px 4px rgba(0, 0, 0, 0.01)",elevationSmall:"0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.04), 0 6px 6px rgba(0, 0, 0, 0.03), 0 8px 8px rgba(0, 0, 0, 0.02)",elevationMedium:"0 2px 3px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.04), 0 12px 12px rgba(0, 0, 0, 0.03), 0 16px 16px rgba(0, 0, 0, 0.02)",elevationLarge:"0 5px 15px rgba(0, 0, 0, 0.08), 0 15px 27px rgba(0, 0, 0, 0.07), 0 30px 36px rgba(0, 0, 0, 0.04), 0 50px 43px rgba(0, 0, 0, 0.02)",surfaceBackgroundColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,surfaceBackgroundSubtleColor:"#F3F3F3",surfaceBackgroundTintColor:"#F5F5F5",surfaceBorderColor:"rgba(0, 0, 0, 0.1)",surfaceBorderBoldColor:"rgba(0, 0, 0, 0.15)",surfaceBorderSubtleColor:"rgba(0, 0, 0, 0.05)",surfaceBackgroundTertiaryColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,surfaceColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,transitionDuration:"200ms",transitionDurationFast:"160ms",transitionDurationFaster:"120ms",transitionDurationFastest:"100ms",transitionTimingFunction:"cubic-bezier(0.08, 0.52, 0.52, 1)",transitionTimingFunctionControl:"cubic-bezier(0.12, 0.8, 0.32, 1)"})},"./packages/components/build-module/utils/font.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{L:()=>font});const font_values={"default.fontFamily":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif","default.fontSize":"13px","helpText.fontSize":"12px",mobileTextMinFontSize:"16px"};function font(value){var _FONT$value;return null!==(_FONT$value=font_values[value])&&void 0!==_FONT$value?_FONT$value:""}},"./packages/components/build-module/visually-hidden/component.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>visually_hidden_component});var use_context_system=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),context_connect=__webpack_require__("./packages/components/build-module/context/context-connect.js");const visuallyHidden={border:0,clip:"rect(1px, 1px, 1px, 1px)",WebkitClipPath:"inset( 50% )",clipPath:"inset( 50% )",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"absolute",width:"1px",wordWrap:"normal"};var component=__webpack_require__("./packages/components/build-module/view/component.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const visually_hidden_component=(0,context_connect.Iq)((function UnconnectedVisuallyHidden(props,forwardedRef){const{style:styleProp,...contextProps}=(0,use_context_system.y)(props,"VisuallyHidden");return(0,jsx_runtime.jsx)(component.Z,{ref:forwardedRef,...contextProps,style:{...visuallyHidden,...styleProp||{}}})}),"VisuallyHidden")},"./packages/compose/build-module/hooks/use-instance-id/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const instanceMap=new WeakMap;const __WEBPACK_DEFAULT_EXPORT__=function useInstanceId(object,prefix,preferredId){return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>{if(preferredId)return preferredId;const id=function createId(object){const instances=instanceMap.get(object)||0;return instanceMap.set(object,instances+1),instances}(object);return prefix?`${prefix}-${id}`:id}),[object,preferredId,prefix])}}}]);