"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[9812],{"./packages/components/src/context/constants.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{_3:()=>CONNECTED_NAMESPACE,cT:()=>COMPONENT_NAMESPACE,rE:()=>CONNECT_STATIC_NAMESPACE});const COMPONENT_NAMESPACE="data-wp-component",CONNECTED_NAMESPACE="data-wp-c16t",CONNECT_STATIC_NAMESPACE="__contextSystemKey__"},"./packages/components/src/context/context-system-provider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{G8:()=>ContextSystemProvider,eb:()=>useComponentsContext});var deepmerge__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/deepmerge/dist/cjs.js"),deepmerge__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(deepmerge__WEBPACK_IMPORTED_MODULE_0__),fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/fast-deep-equal/es6/index.js"),fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1__),is_plain_object__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/is-plain-object/dist/is-plain-object.mjs"),_wordpress_element__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/index.js"),_wordpress_warning__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/warning/build-module/index.js"),_utils__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/src/utils/hooks/use-update-effect.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const ComponentsContext=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.createContext)({}),useComponentsContext=()=>(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useContext)(ComponentsContext);const BaseContextSystemProvider=({children,value})=>{const contextValue=function useContextSystemBridge({value}){const parentContext=useComponentsContext(),valueRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(value);return(0,_utils__WEBPACK_IMPORTED_MODULE_4__.Z)((()=>{fast_deep_equal_es6__WEBPACK_IMPORTED_MODULE_1___default()(valueRef.current,value)&&valueRef.current!==value&&!0===globalThis.SCRIPT_DEBUG&&(0,_wordpress_warning__WEBPACK_IMPORTED_MODULE_5__.Z)(`Please memoize your context: ${JSON.stringify(value)}`)}),[value]),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)((()=>deepmerge__WEBPACK_IMPORTED_MODULE_0___default()(null!=parentContext?parentContext:{},null!=value?value:{},{isMergeableObject:is_plain_object__WEBPACK_IMPORTED_MODULE_6__.P})),[parentContext,value])}({value});return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ComponentsContext.Provider,{value:contextValue,children})};BaseContextSystemProvider.displayName="BaseContextSystemProvider";const ContextSystemProvider=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.memo)(BaseContextSystemProvider);BaseContextSystemProvider.__docgenInfo={description:"A Provider component that can modify props for connected components within\nthe Context system.\n\n@example\n```jsx\n<ContextSystemProvider value={{ Button: { size: 'small' }}}>\n  <Button>...</Button>\n</ContextSystemProvider>\n```\n\n@template {Record<string, any>} T\n@param {Object}                    options\n@param {import('react').ReactNode} options.children Children to render.\n@param {T}                         options.value    Props to render into connected components.\n@return {JSX.Element} A Provider wrapped component.",methods:[],displayName:"BaseContextSystemProvider"}},"./packages/components/src/context/use-context-system.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{y:()=>useContextSystem});var build_module=__webpack_require__("./packages/warning/build-module/index.js"),context_system_provider=__webpack_require__("./packages/components/src/context/context-system-provider.js"),constants=__webpack_require__("./packages/components/src/context/constants.js");var get_styled_class_name_from_key=__webpack_require__("./packages/components/src/context/get-styled-class-name-from-key.ts"),use_cx=__webpack_require__("./packages/components/src/utils/hooks/use-cx.ts");function useContextSystem(props,namespace){const contextSystemProps=(0,context_system_provider.eb)();void 0===namespace&&!0===globalThis.SCRIPT_DEBUG&&(0,build_module.Z)("useContextSystem: Please provide a namespace");const contextProps=contextSystemProps?.[namespace]||{},finalComponentProps={[constants._3]:!0,...(componentName=namespace,{[constants.cT]:componentName})};var componentName;const{_overrides:overrideProps,...otherContextProps}=contextProps,initialMergedProps=Object.entries(otherContextProps).length?Object.assign({},otherContextProps,props):props,classes=(0,use_cx.I)()((0,get_styled_class_name_from_key.l)(namespace),props.className),rendered="function"==typeof initialMergedProps.renderChildren?initialMergedProps.renderChildren(initialMergedProps):initialMergedProps.children;for(const key in initialMergedProps)finalComponentProps[key]=initialMergedProps[key];for(const key in overrideProps)finalComponentProps[key]=overrideProps[key];return void 0!==rendered&&(finalComponentProps.children=rendered),finalComponentProps.className=classes,finalComponentProps}},"./packages/components/src/utils/config-values.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _space__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/utils/space.ts"),_colors_values__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/components/src/utils/colors-values.js");const CONTROL_PROPS={controlPaddingX:12,controlPaddingXSmall:8,controlPaddingXLarge:12*1.3334,controlBackgroundColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,controlBoxShadowFocus:`0 0 0 0.5px ${_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.theme.accent}`,controlHeight:"36px",controlHeightXSmall:"calc( 36px * 0.6 )",controlHeightSmall:"calc( 36px * 0.8 )",controlHeightLarge:"calc( 36px * 1.2 )",controlHeightXLarge:"calc( 36px * 1.4 )"},__WEBPACK_DEFAULT_EXPORT__=Object.assign({},CONTROL_PROPS,{colorDivider:"rgba(0, 0, 0, 0.1)",colorScrollbarThumb:"rgba(0, 0, 0, 0.2)",colorScrollbarThumbHover:"rgba(0, 0, 0, 0.5)",colorScrollbarTrack:"rgba(0, 0, 0, 0.04)",elevationIntensity:1,radiusXSmall:"1px",radiusSmall:"2px",radiusMedium:"4px",radiusLarge:"8px",radiusFull:"9999px",radiusRound:"50%",borderWidth:"1px",borderWidthFocus:"1.5px",borderWidthTab:"4px",spinnerSize:16,fontSize:"13px",fontSizeH1:"calc(2.44 * 13px)",fontSizeH2:"calc(1.95 * 13px)",fontSizeH3:"calc(1.56 * 13px)",fontSizeH4:"calc(1.25 * 13px)",fontSizeH5:"13px",fontSizeH6:"calc(0.8 * 13px)",fontSizeInputMobile:"16px",fontSizeMobile:"15px",fontSizeSmall:"calc(0.92 * 13px)",fontSizeXSmall:"calc(0.75 * 13px)",fontLineHeightBase:"1.4",fontWeight:"normal",fontWeightHeading:"600",gridBase:"4px",cardPaddingXSmall:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(2)}`,cardPaddingSmall:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(4)}`,cardPaddingMedium:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(4)} ${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(6)}`,cardPaddingLarge:`${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(6)} ${(0,_space__WEBPACK_IMPORTED_MODULE_1__.D)(8)}`,elevationXSmall:"0 1px 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02), 0 3px 3px rgba(0, 0, 0, 0.02), 0 4px 4px rgba(0, 0, 0, 0.01)",elevationSmall:"0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 3px rgba(0, 0, 0, 0.04), 0 6px 6px rgba(0, 0, 0, 0.03), 0 8px 8px rgba(0, 0, 0, 0.02)",elevationMedium:"0 2px 3px rgba(0, 0, 0, 0.05), 0 4px 5px rgba(0, 0, 0, 0.04), 0 12px 12px rgba(0, 0, 0, 0.03), 0 16px 16px rgba(0, 0, 0, 0.02)",elevationLarge:"0 5px 15px rgba(0, 0, 0, 0.08), 0 15px 27px rgba(0, 0, 0, 0.07), 0 30px 36px rgba(0, 0, 0, 0.04), 0 50px 43px rgba(0, 0, 0, 0.02)",surfaceBackgroundColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,surfaceBackgroundSubtleColor:"#F3F3F3",surfaceBackgroundTintColor:"#F5F5F5",surfaceBorderColor:"rgba(0, 0, 0, 0.1)",surfaceBorderBoldColor:"rgba(0, 0, 0, 0.15)",surfaceBorderSubtleColor:"rgba(0, 0, 0, 0.05)",surfaceBackgroundTertiaryColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,surfaceColor:_colors_values__WEBPACK_IMPORTED_MODULE_0__.D.white,transitionDuration:"200ms",transitionDurationFast:"160ms",transitionDurationFaster:"120ms",transitionDurationFastest:"100ms",transitionTimingFunction:"cubic-bezier(0.08, 0.52, 0.52, 1)",transitionTimingFunctionControl:"cubic-bezier(0.12, 0.8, 0.32, 1)"})},"./packages/components/src/utils/hooks/use-update-effect.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const __WEBPACK_DEFAULT_EXPORT__=function useUpdateEffect(effect,deps){const mountedRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{if(mountedRef.current)return effect();mountedRef.current=!0}),deps),(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>()=>{mountedRef.current=!1}),[])}},"./packages/components/src/context/context-connect.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{H:()=>hasConnectNamespace,Iq:()=>contextConnect,Kc:()=>contextConnectWithoutRef});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_wordpress_warning__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/warning/build-module/index.js"),_constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/src/context/constants.js"),_get_styled_class_name_from_key__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./packages/components/src/context/get-styled-class-name-from-key.ts");function contextConnect(Component,namespace){return _contextConnect(Component,namespace,{forwardsRef:!0})}function contextConnectWithoutRef(Component,namespace){return _contextConnect(Component,namespace)}function _contextConnect(Component,namespace,options){const WrappedComponent=options?.forwardsRef?(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(Component):Component;void 0===namespace&&!0===globalThis.SCRIPT_DEBUG&&(0,_wordpress_warning__WEBPACK_IMPORTED_MODULE_1__.Z)("contextConnect: Please provide a namespace");let mergedNamespace=WrappedComponent[_constants__WEBPACK_IMPORTED_MODULE_2__.rE]||[namespace];return Array.isArray(namespace)&&(mergedNamespace=[...mergedNamespace,...namespace]),"string"==typeof namespace&&(mergedNamespace=[...mergedNamespace,namespace]),Object.assign(WrappedComponent,{[_constants__WEBPACK_IMPORTED_MODULE_2__.rE]:[...new Set(mergedNamespace)],displayName:namespace,selector:`.${(0,_get_styled_class_name_from_key__WEBPACK_IMPORTED_MODULE_3__.l)(namespace)}`})}function getConnectNamespace(Component){if(!Component)return[];let namespaces=[];return Component[_constants__WEBPACK_IMPORTED_MODULE_2__.rE]&&(namespaces=Component[_constants__WEBPACK_IMPORTED_MODULE_2__.rE]),Component.type&&Component.type[_constants__WEBPACK_IMPORTED_MODULE_2__.rE]&&(namespaces=Component.type[_constants__WEBPACK_IMPORTED_MODULE_2__.rE]),namespaces}function hasConnectNamespace(Component,match){return!!Component&&("string"==typeof match?getConnectNamespace(Component).includes(match):!!Array.isArray(match)&&match.some((result=>getConnectNamespace(Component).includes(result))))}},"./packages/components/src/context/get-styled-class-name-from-key.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{l:()=>getStyledClassNameFromKey});var change_case__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/param-case/dist.es2015/index.js");const getStyledClassNameFromKey=(0,__webpack_require__("./node_modules/memize/dist/index.js").Z)((function getStyledClassName(namespace){return`components-${(0,change_case__WEBPACK_IMPORTED_MODULE_0__.o)(namespace)}`}))},"./packages/components/src/grid/component.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>grid_component});var context_connect=__webpack_require__("./packages/components/src/context/context-connect.ts"),component=__webpack_require__("./packages/components/src/view/component.tsx"),emotion_react_browser_esm=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),react=__webpack_require__("./node_modules/react/index.js"),use_context_system=__webpack_require__("./packages/components/src/context/use-context-system.js");const ALIGNMENTS={bottom:{alignItems:"flex-end",justifyContent:"center"},bottomLeft:{alignItems:"flex-start",justifyContent:"flex-end"},bottomRight:{alignItems:"flex-end",justifyContent:"flex-end"},center:{alignItems:"center",justifyContent:"center"},spaced:{alignItems:"center",justifyContent:"space-between"},left:{alignItems:"center",justifyContent:"flex-start"},right:{alignItems:"center",justifyContent:"flex-end"},stretch:{alignItems:"stretch"},top:{alignItems:"flex-start",justifyContent:"center"},topLeft:{alignItems:"flex-start",justifyContent:"flex-start"},topRight:{alignItems:"flex-start",justifyContent:"flex-end"}};var use_responsive_value=__webpack_require__("./packages/components/src/utils/use-responsive-value.ts"),config_values=__webpack_require__("./packages/components/src/utils/config-values.js"),use_cx=__webpack_require__("./packages/components/src/utils/hooks/use-cx.ts");function useGrid(props){const{align,alignment,className,columnGap,columns=2,gap=3,isInline=!1,justify,rowGap,rows,templateColumns,templateRows,...otherProps}=(0,use_context_system.y)(props,"Grid"),columnsAsArray=Array.isArray(columns)?columns:[columns],column=(0,use_responsive_value.V)(columnsAsArray),rowsAsArray=Array.isArray(rows)?rows:[rows],row=(0,use_responsive_value.V)(rowsAsArray),gridTemplateColumns=templateColumns||!!columns&&`repeat( ${column}, 1fr )`,gridTemplateRows=templateRows||!!rows&&`repeat( ${row}, 1fr )`,cx=(0,use_cx.I)();return{...otherProps,className:(0,react.useMemo)((()=>{const alignmentProps=function getAlignmentProps(alignment){return alignment?ALIGNMENTS[alignment]:{}}(alignment),gridClasses=(0,emotion_react_browser_esm.iv)({alignItems:align,display:isInline?"inline-grid":"grid",gap:`calc( ${config_values.Z.gridBase} * ${gap} )`,gridTemplateColumns:gridTemplateColumns||void 0,gridTemplateRows:gridTemplateRows||void 0,gridRowGap:rowGap,gridColumnGap:columnGap,justifyContent:justify,verticalAlign:isInline?"middle":void 0,...alignmentProps},"","");return cx(gridClasses,className)}),[align,alignment,className,columnGap,cx,gap,gridTemplateColumns,gridTemplateRows,isInline,justify,rowGap])}}var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function UnconnectedGrid(props,forwardedRef){const gridProps=useGrid(props);return(0,jsx_runtime.jsx)(component.Z,{...gridProps,ref:forwardedRef})}UnconnectedGrid.displayName="UnconnectedGrid";const Grid=(0,context_connect.Iq)(UnconnectedGrid,"Grid"),grid_component=Grid;try{Grid.displayName="Grid",Grid.__docgenInfo={description:"`Grid` is a primitive layout component that can arrange content in a grid configuration.\n\n```jsx\nimport {\n\t__experimentalGrid as Grid,\n\t__experimentalText as Text\n} from `@wordpress/components`;\n\nfunction Example() {\n\treturn (\n\t\t<Grid columns={ 3 }>\n\t\t\t<Text>Code</Text>\n\t\t\t<Text>is</Text>\n\t\t\t<Text>Poetry</Text>\n\t\t</Grid>\n\t);\n}\n```",displayName:"Grid",props:{align:{defaultValue:null,description:"Adjusts the block alignment of children.",name:"align",required:!1,type:{name:"AlignItems"}},alignment:{defaultValue:null,description:"Adjusts the horizontal and vertical alignment of children.",name:"alignment",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"left"'},{value:'"right"'},{value:'"top"'},{value:'"bottom"'},{value:'"stretch"'},{value:'"bottomLeft"'},{value:'"bottomRight"'},{value:'"topLeft"'},{value:'"topRight"'},{value:'"spaced"'}]}},children:{defaultValue:null,description:"The children elements.",name:"children",required:!0,type:{name:"ReactNode"}},columns:{defaultValue:{value:"2"},description:"Adjusts the number of columns of the `Grid`.",name:"columns",required:!1,type:{name:"ResponsiveCSSValue<number>"}},columnGap:{defaultValue:null,description:"Adjusts the `grid-column-gap`.",name:"columnGap",required:!1,type:{name:"GridColumnGap<string | number>"}},gap:{defaultValue:{value:"3"},description:"Gap between each child.",name:"gap",required:!1,type:{name:"number"}},isInline:{defaultValue:null,description:"Changes the CSS display from `grid` to `inline-grid`.",name:"isInline",required:!1,type:{name:"boolean"}},justify:{defaultValue:null,description:"Adjusts the inline alignment of children.",name:"justify",required:!1,type:{name:"JustifyContent"}},rowGap:{defaultValue:null,description:"Adjusts the `grid-row-gap`.",name:"rowGap",required:!1,type:{name:"GridRowGap<string | number>"}},rows:{defaultValue:null,description:"Adjusts the number of rows of the `Grid`.",name:"rows",required:!1,type:{name:"ResponsiveCSSValue<number>"}},templateColumns:{defaultValue:null,description:"Adjusts the CSS grid `template-columns`.",name:"templateColumns",required:!1,type:{name:"GridTemplateColumns<string | number>"}},templateRows:{defaultValue:null,description:"Adjusts the CSS grid `template-rows`.",name:"templateRows",required:!1,type:{name:"GridTemplateRows<string | number>"}},as:{defaultValue:null,description:"The HTML element or React component to render the component as.",name:"as",required:!1,type:{name:'"symbol" | "object" | "select" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | "br" | "button" | ... 516 more ... | ("view" & FunctionComponent<...>)'}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/grid/component.tsx#Grid"]={docgenInfo:Grid.__docgenInfo,name:"Grid",path:"packages/components/src/grid/component.tsx#Grid"})}catch(__react_docgen_typescript_loader_error){}},"./packages/components/src/utils/space.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D:()=>space});const GRID_BASE="4px";function space(value){if(void 0===value)return;if(!value)return"0";const asInt="number"==typeof value?value:Number(value);return"undefined"!=typeof window&&window.CSS?.supports?.("margin",value.toString())||Number.isNaN(asInt)?value.toString():`calc(${GRID_BASE} * ${value})`}},"./packages/components/src/utils/use-responsive-value.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{V:()=>useResponsiveValue});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const breakpoints=["40em","52em","64em"],useBreakpointIndex=(options={})=>{const{defaultIndex=0}=options;if("number"!=typeof defaultIndex)throw new TypeError(`Default breakpoint index should be a number. Got: ${defaultIndex}, ${typeof defaultIndex}`);if(defaultIndex<0||defaultIndex>breakpoints.length-1)throw new RangeError(`Default breakpoint index out of range. Theme has ${breakpoints.length} breakpoints, got index ${defaultIndex}`);const[value,setValue]=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultIndex);return(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{const onResize=()=>{const newValue=breakpoints.filter((bp=>"undefined"!=typeof window&&window.matchMedia(`screen and (min-width: ${bp})`).matches)).length;value!==newValue&&setValue(newValue)};return onResize(),"undefined"!=typeof window&&window.addEventListener("resize",onResize),()=>{"undefined"!=typeof window&&window.removeEventListener("resize",onResize)}}),[value]),value};function useResponsiveValue(values,options={}){const index=useBreakpointIndex(options);if(!Array.isArray(values)&&"function"!=typeof values)return values;const array=values||[];return array[index>=array.length?array.length-1:index]}},"./packages/components/src/view/component.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js"),_wordpress_element__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const PolymorphicDiv=(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__.Z)("div",{target:"e19lxcc00"})("");function UnforwardedView({as,...restProps},ref){return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(PolymorphicDiv,{as,ref,...restProps})}UnforwardedView.displayName="UnforwardedView";const View=Object.assign((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(UnforwardedView),{selector:".components-view"}),__WEBPACK_DEFAULT_EXPORT__=View;try{View.displayName="View",View.__docgenInfo={description:"`View` is a core component that renders everything in the library.\nIt is the principle component in the entire library.\n\n```jsx\nimport { View } from `@wordpress/components`;\n\nfunction Example() {\n\treturn (\n\t\t<View>\n\t\t\t Code is Poetry\n\t\t</View>\n\t);\n}\n```",displayName:"View",props:{as:{defaultValue:null,description:"The HTML element or React component to render the component as.",name:"as",required:!1,type:{name:"any"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/view/component.tsx#View"]={docgenInfo:View.__docgenInfo,name:"View",path:"packages/components/src/view/component.tsx#View"})}catch(__react_docgen_typescript_loader_error){}try{component.displayName="component",component.__docgenInfo={description:"`View` is a core component that renders everything in the library.\nIt is the principle component in the entire library.\n\n```jsx\nimport { View } from `@wordpress/components`;\n\nfunction Example() {\n\treturn (\n\t\t<View>\n\t\t\t Code is Poetry\n\t\t</View>\n\t);\n}\n```",displayName:"component",props:{as:{defaultValue:null,description:"The HTML element or React component to render the component as.",name:"as",required:!1,type:{name:"any"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/view/component.tsx#component"]={docgenInfo:component.__docgenInfo,name:"component",path:"packages/components/src/view/component.tsx#component"})}catch(__react_docgen_typescript_loader_error){}},"./node_modules/deepmerge/dist/cjs.js":module=>{var isMergeableObject=function isMergeableObject(value){return function isNonNullObject(value){return!!value&&"object"==typeof value}(value)&&!function isSpecial(value){var stringValue=Object.prototype.toString.call(value);return"[object RegExp]"===stringValue||"[object Date]"===stringValue||function isReactElement(value){return value.$$typeof===REACT_ELEMENT_TYPE}(value)}(value)};var REACT_ELEMENT_TYPE="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function cloneUnlessOtherwiseSpecified(value,options){return!1!==options.clone&&options.isMergeableObject(value)?deepmerge(function emptyTarget(val){return Array.isArray(val)?[]:{}}(value),value,options):value}function defaultArrayMerge(target,source,options){return target.concat(source).map((function(element){return cloneUnlessOtherwiseSpecified(element,options)}))}function getKeys(target){return Object.keys(target).concat(function getEnumerableOwnPropertySymbols(target){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(target).filter((function(symbol){return Object.propertyIsEnumerable.call(target,symbol)})):[]}(target))}function propertyIsOnObject(object,property){try{return property in object}catch(_){return!1}}function mergeObject(target,source,options){var destination={};return options.isMergeableObject(target)&&getKeys(target).forEach((function(key){destination[key]=cloneUnlessOtherwiseSpecified(target[key],options)})),getKeys(source).forEach((function(key){(function propertyIsUnsafe(target,key){return propertyIsOnObject(target,key)&&!(Object.hasOwnProperty.call(target,key)&&Object.propertyIsEnumerable.call(target,key))})(target,key)||(propertyIsOnObject(target,key)&&options.isMergeableObject(source[key])?destination[key]=function getMergeFunction(key,options){if(!options.customMerge)return deepmerge;var customMerge=options.customMerge(key);return"function"==typeof customMerge?customMerge:deepmerge}(key,options)(target[key],source[key],options):destination[key]=cloneUnlessOtherwiseSpecified(source[key],options))})),destination}function deepmerge(target,source,options){(options=options||{}).arrayMerge=options.arrayMerge||defaultArrayMerge,options.isMergeableObject=options.isMergeableObject||isMergeableObject,options.cloneUnlessOtherwiseSpecified=cloneUnlessOtherwiseSpecified;var sourceIsArray=Array.isArray(source);return sourceIsArray===Array.isArray(target)?sourceIsArray?options.arrayMerge(target,source,options):mergeObject(target,source,options):cloneUnlessOtherwiseSpecified(source,options)}deepmerge.all=function deepmergeAll(array,options){if(!Array.isArray(array))throw new Error("first argument should be an array");return array.reduce((function(prev,next){return deepmerge(prev,next,options)}),{})};var deepmerge_1=deepmerge;module.exports=deepmerge_1},"./node_modules/fast-deep-equal/es6/index.js":module=>{module.exports=function equal(a,b){if(a===b)return!0;if(a&&b&&"object"==typeof a&&"object"==typeof b){if(a.constructor!==b.constructor)return!1;var length,i,keys;if(Array.isArray(a)){if((length=a.length)!=b.length)return!1;for(i=length;0!=i--;)if(!equal(a[i],b[i]))return!1;return!0}if(a instanceof Map&&b instanceof Map){if(a.size!==b.size)return!1;for(i of a.entries())if(!b.has(i[0]))return!1;for(i of a.entries())if(!equal(i[1],b.get(i[0])))return!1;return!0}if(a instanceof Set&&b instanceof Set){if(a.size!==b.size)return!1;for(i of a.entries())if(!b.has(i[0]))return!1;return!0}if(ArrayBuffer.isView(a)&&ArrayBuffer.isView(b)){if((length=a.length)!=b.length)return!1;for(i=length;0!=i--;)if(a[i]!==b[i])return!1;return!0}if(a.constructor===RegExp)return a.source===b.source&&a.flags===b.flags;if(a.valueOf!==Object.prototype.valueOf)return a.valueOf()===b.valueOf();if(a.toString!==Object.prototype.toString)return a.toString()===b.toString();if((length=(keys=Object.keys(a)).length)!==Object.keys(b).length)return!1;for(i=length;0!=i--;)if(!Object.prototype.hasOwnProperty.call(b,keys[i]))return!1;for(i=length;0!=i--;){var key=keys[i];if(!equal(a[key],b[key]))return!1}return!0}return a!=a&&b!=b}},"./node_modules/memize/dist/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function memize(fn,options){var head,tail,size=0;function memoized(){var args,i,node=head,len=arguments.length;searchCache:for(;node;){if(node.args.length===arguments.length){for(i=0;i<len;i++)if(node.args[i]!==arguments[i]){node=node.next;continue searchCache}return node!==head&&(node===tail&&(tail=node.prev),node.prev.next=node.next,node.next&&(node.next.prev=node.prev),node.next=head,node.prev=null,head.prev=node,head=node),node.val}node=node.next}for(args=new Array(len),i=0;i<len;i++)args[i]=arguments[i];return node={args,val:fn.apply(null,args)},head?(head.prev=node,node.next=head):tail=node,size===options.maxSize?(tail=tail.prev).next=null:size++,head=node,node.val}return options=options||{},memoized.clear=function(){head=null,tail=null,size=0},memoized}__webpack_require__.d(__webpack_exports__,{Z:()=>memize})},"./packages/components/src/grid/stories/index.story.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _view__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/src/view/component.tsx"),___WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/src/grid/component.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={component:___WEBPACK_IMPORTED_MODULE_1__.Z,title:"Components (Experimental)/Grid",argTypes:{as:{control:{type:"text"}},align:{control:{type:"text"}},children:{control:{type:null}},columnGap:{control:{type:"text"}},columns:{table:{type:{summary:"number"}},control:{type:"number"}},justify:{control:{type:"text"}},rowGap:{control:{type:"text"}},rows:{table:{type:{summary:"number"}},control:{type:"number"}},templateColumns:{control:{type:"text"}},templateRows:{control:{type:"text"}}},parameters:{sourceLink:"packages/components/src/grid",badges:[],controls:{expanded:!0},docs:{canvas:{sourceState:"shown"}}}},Item=props=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_view__WEBPACK_IMPORTED_MODULE_2__.Z,{style:{borderRadius:8,background:"#eee",padding:8,textAlign:"center"},...props});Item.displayName="Item";const Template=props=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(___WEBPACK_IMPORTED_MODULE_1__.Z,{...props,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"One"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Two"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Three"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Four"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Five"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Six"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Seven"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Item,{children:"Eight"})]});Template.displayName="Template";const Default=Template.bind({});Default.args={alignment:"bottom",columns:4,gap:2},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"props => <Grid {...props}>\n        <Item>One</Item>\n        <Item>Two</Item>\n        <Item>Three</Item>\n        <Item>Four</Item>\n        <Item>Five</Item>\n        <Item>Six</Item>\n        <Item>Seven</Item>\n        <Item>Eight</Item>\n    </Grid>",...Default.parameters?.docs?.source}}}}}]);