"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[8275],{"./packages/components/build-module/dropdown/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var clsx__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),_wordpress_element__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react/index.js"),_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./packages/compose/build-module/hooks/use-merge-refs/index.js"),_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/deprecated/build-module/index.js"),_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),_context__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./packages/components/build-module/context/context-connect.js"),_utils_hooks__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./packages/components/build-module/utils/hooks/use-controlled-value.js"),_popover__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./packages/components/build-module/popover/index.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,_context__WEBPACK_IMPORTED_MODULE_8__.Iq)(((props,forwardedRef)=>{const{renderContent,renderToggle,className,contentClassName,expandOnMobile,headerTitle,focusOnMount,popoverProps,onClose,onToggle,style,open,defaultOpen,position,variant}=(0,_context__WEBPACK_IMPORTED_MODULE_1__.y)(props,"Dropdown");void 0!==position&&(0,_wordpress_deprecated__WEBPACK_IMPORTED_MODULE_2__.Z)("`position` prop in wp.components.Dropdown",{since:"6.2",alternative:"`popoverProps.placement` prop",hint:"Note that the `position` prop will override any values passed through the `popoverProps.placement` prop."});const[fallbackPopoverAnchor,setFallbackPopoverAnchor]=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(null),containerRef=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)(),[isOpen,setIsOpen]=(0,_utils_hooks__WEBPACK_IMPORTED_MODULE_4__.O)({defaultValue:defaultOpen,value:open,onChange:onToggle});function close(){onClose?.(),setIsOpen(!1)}const args={isOpen:!!isOpen,onToggle:()=>setIsOpen(!isOpen),onClose:close},popoverPropsHaveAnchor=!!(popoverProps?.anchor||popoverProps?.anchorRef||popoverProps?.getAnchorRect||popoverProps?.anchorRect);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div",{className,ref:(0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_5__.Z)([containerRef,forwardedRef,setFallbackPopoverAnchor]),tabIndex:-1,style,children:[renderToggle(args),isOpen&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_popover__WEBPACK_IMPORTED_MODULE_6__.ZP,{position,onClose:close,onFocusOutside:function closeIfFocusOutside(){if(!containerRef.current)return;const{ownerDocument}=containerRef.current,dialog=ownerDocument?.activeElement?.closest('[role="dialog"]');containerRef.current.contains(ownerDocument.activeElement)||dialog&&!dialog.contains(containerRef.current)||close()},expandOnMobile,headerTitle,focusOnMount,offset:13,anchor:popoverPropsHaveAnchor?void 0:fallbackPopoverAnchor,variant,...popoverProps,className:(0,clsx__WEBPACK_IMPORTED_MODULE_7__.Z)("components-dropdown__content",popoverProps?.className,contentClassName),children:renderContent(args)})]})}),"Dropdown")},"./packages/components/build-module/heading/component.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>heading_component});var context_connect=__webpack_require__("./packages/components/build-module/context/context-connect.js"),component=__webpack_require__("./packages/components/build-module/view/component.js"),use_context_system=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),hook=__webpack_require__("./packages/components/build-module/text/hook.js"),font_size=__webpack_require__("./packages/components/build-module/utils/font-size.js"),colors_values=__webpack_require__("./packages/components/build-module/utils/colors-values.js"),config_values=__webpack_require__("./packages/components/build-module/utils/config-values.js");var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const heading_component=(0,context_connect.Iq)((function UnconnectedHeading(props,forwardedRef){const headerProps=function useHeading(props){const{as:asProp,level=2,color=colors_values.D.gray[900],isBlock=!0,weight=config_values.Z.fontWeightHeading,...otherProps}=(0,use_context_system.y)(props,"Heading"),as=asProp||`h${level}`,a11yProps={};return"string"==typeof as&&"h"!==as[0]&&(a11yProps.role="heading",a11yProps["aria-level"]="string"==typeof level?parseInt(level):level),{...(0,hook.Z)({color,isBlock,weight,size:(0,font_size.gZ)(level),...otherProps}),...a11yProps,as}}(props);return(0,jsx_runtime.jsx)(component.Z,{...headerProps,ref:forwardedRef})}),"Heading")},"./packages/components/build-module/popover/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{ZP:()=>popover});var clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),floating_ui_core=__webpack_require__("./node_modules/@floating-ui/core/dist/floating-ui.core.mjs"),floating_ui_dom=__webpack_require__("./node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs"),floating_ui_react_dom_esm=__webpack_require__("./packages/components/node_modules/@floating-ui/react-dom/dist/floating-ui.react-dom.esm.js"),motion=__webpack_require__("./node_modules/framer-motion/dist/es/render/dom/motion.mjs"),react=__webpack_require__("./node_modules/react/index.js"),react_dom=__webpack_require__("./node_modules/react-dom/index.js"),use_viewport_match=__webpack_require__("./packages/compose/build-module/hooks/use-viewport-match/index.js"),use_dialog=__webpack_require__("./packages/compose/build-module/hooks/use-dialog/index.js"),use_merge_refs=__webpack_require__("./packages/compose/build-module/hooks/use-merge-refs/index.js"),use_reduced_motion=__webpack_require__("./packages/compose/build-module/hooks/use-reduced-motion/index.js"),library_close=__webpack_require__("./packages/icons/build-module/library/close.js"),build_module=__webpack_require__("./packages/deprecated/build-module/index.js"),svg=__webpack_require__("./packages/primitives/build-module/svg/index.js"),build_module_button=__webpack_require__("./packages/components/build-module/button/index.js");let previousScrollTop=0;function setLocked(locked){const scrollingElement=document.scrollingElement||document.body;locked&&(previousScrollTop=scrollingElement.scrollTop);const methodName=locked?"add":"remove";scrollingElement.classList[methodName]("lockscroll"),document.documentElement.classList[methodName]("lockscroll"),locked||(scrollingElement.scrollTop=previousScrollTop)}let lockCounter=0;const scroll_lock=function ScrollLock(){return(0,react.useEffect)((()=>(0===lockCounter&&setLocked(!0),++lockCounter,()=>{1===lockCounter&&setLocked(!1),--lockCounter})),[]),null};var use_slot=__webpack_require__("./packages/components/build-module/slot-fill/bubbles-virtually/use-slot.js"),slot_fill=__webpack_require__("./packages/components/build-module/slot-fill/index.js"),utils=__webpack_require__("./packages/components/build-module/popover/utils.js"),use_context_system=__webpack_require__("./packages/components/build-module/context/use-context-system.js"),context_connect=__webpack_require__("./packages/components/build-module/context/context-connect.js");var style_provider=__webpack_require__("./packages/components/build-module/style-provider/index.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const SLOT_NAME="Popover",ArrowTriangle=()=>(0,jsx_runtime.jsxs)(svg.Wj,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 100 100",className:"components-popover__triangle",role:"presentation",children:[(0,jsx_runtime.jsx)(svg.y$,{className:"components-popover__triangle-bg",d:"M 0 0 L 50 50 L 100 0"}),(0,jsx_runtime.jsx)(svg.y$,{className:"components-popover__triangle-border",d:"M 0 0 L 50 50 L 100 0",vectorEffect:"non-scaling-stroke"})]}),slotNameContext=(0,react.createContext)(void 0),Popover=(0,context_connect.Iq)(((props,forwardedRef)=>{const{animate=!0,headerTitle,constrainTabbing,onClose,children,className,noArrow=!0,position,placement:placementProp="bottom-start",offset:offsetProp=0,focusOnMount="firstElement",anchor,expandOnMobile,onFocusOutside,__unstableSlotName=SLOT_NAME,flip=!0,resize=!0,shift=!1,inline=!1,variant,style:contentStyle,__unstableForcePosition,anchorRef,anchorRect,getAnchorRect,isAlternate,...contentProps}=(0,use_context_system.y)(props,"Popover");let computedFlipProp=flip,computedResizeProp=resize;void 0!==__unstableForcePosition&&((0,build_module.Z)("`__unstableForcePosition` prop in wp.components.Popover",{since:"6.1",version:"6.3",alternative:"`flip={ false }` and  `resize={ false }`"}),computedFlipProp=!__unstableForcePosition,computedResizeProp=!__unstableForcePosition),void 0!==anchorRef&&(0,build_module.Z)("`anchorRef` prop in wp.components.Popover",{since:"6.1",alternative:"`anchor` prop"}),void 0!==anchorRect&&(0,build_module.Z)("`anchorRect` prop in wp.components.Popover",{since:"6.1",alternative:"`anchor` prop"}),void 0!==getAnchorRect&&(0,build_module.Z)("`getAnchorRect` prop in wp.components.Popover",{since:"6.1",alternative:"`anchor` prop"});const computedVariant=isAlternate?"toolbar":variant;void 0!==isAlternate&&(0,build_module.Z)("`isAlternate` prop in wp.components.Popover",{since:"6.2",alternative:"`variant` prop with the `'toolbar'` value"});const arrowRef=(0,react.useRef)(null),[fallbackReferenceElement,setFallbackReferenceElement]=(0,react.useState)(null),anchorRefFallback=(0,react.useCallback)((node=>{setFallbackReferenceElement(node)}),[]),isMobileViewport=(0,use_viewport_match.Z)("medium","<"),isExpanded=expandOnMobile&&isMobileViewport,hasArrow=!isExpanded&&!noArrow,normalizedPlacementFromProps=position?(0,utils.KF)(position):placementProp,middleware=[..."overlay"===placementProp?[{name:"overlay",fn:({rects})=>rects.reference},(0,floating_ui_dom.dp)({apply({rects,elements}){var _elements$floating;const{firstElementChild}=null!==(_elements$floating=elements.floating)&&void 0!==_elements$floating?_elements$floating:{};firstElementChild instanceof HTMLElement&&Object.assign(firstElementChild.style,{width:`${rects.reference.width}px`,height:`${rects.reference.height}px`})}})]:[],(0,floating_ui_core.cv)(offsetProp),computedFlipProp&&(0,floating_ui_dom.RR)(),computedResizeProp&&(0,floating_ui_dom.dp)({apply(sizeProps){var _refs$floating$curren;const{firstElementChild}=null!==(_refs$floating$curren=refs.floating.current)&&void 0!==_refs$floating$curren?_refs$floating$curren:{};firstElementChild instanceof HTMLElement&&Object.assign(firstElementChild.style,{maxHeight:`${sizeProps.availableHeight}px`,overflow:"auto"})}}),shift&&(0,floating_ui_dom.uY)({crossAxis:!0,limiter:(0,floating_ui_dom.dr)(),padding:1}),(0,floating_ui_react_dom_esm.x7)({element:arrowRef})],slotName=(0,react.useContext)(slotNameContext)||__unstableSlotName,slot=(0,use_slot.Z)(slotName);let onDialogClose;(onClose||onFocusOutside)&&(onDialogClose=(type,event)=>{"focus-outside"===type&&onFocusOutside?onFocusOutside(event):onClose&&onClose()});const[dialogRef,dialogProps]=(0,use_dialog.Z)({constrainTabbing,focusOnMount,__unstableOnClose:onDialogClose,onClose:onDialogClose}),{x,y,refs,strategy,update,placement:computedPlacement,middlewareData:{arrow:arrowData}}=(0,floating_ui_react_dom_esm.YF)({placement:"overlay"===normalizedPlacementFromProps?void 0:normalizedPlacementFromProps,middleware,whileElementsMounted:(referenceParam,floatingParam,updateParam)=>(0,floating_ui_dom.Me)(referenceParam,floatingParam,updateParam,{layoutShift:!1,animationFrame:!0})}),arrowCallbackRef=(0,react.useCallback)((node=>{arrowRef.current=node,update()}),[update]),anchorRefTop=anchorRef?.top,anchorRefBottom=anchorRef?.bottom,anchorRefStartContainer=anchorRef?.startContainer,anchorRefCurrent=anchorRef?.current;(0,react.useLayoutEffect)((()=>{const resultingReferenceElement=(0,utils.CK)({anchor,anchorRef,anchorRect,getAnchorRect,fallbackReferenceElement});refs.setReference(resultingReferenceElement)}),[anchor,anchorRef,anchorRefTop,anchorRefBottom,anchorRefStartContainer,anchorRefCurrent,anchorRect,getAnchorRect,fallbackReferenceElement,refs]);const mergedFloatingRef=(0,use_merge_refs.Z)([refs.setFloating,dialogRef,forwardedRef]),style=isExpanded?void 0:{position:strategy,top:0,left:0,x:(0,utils.sw)(x),y:(0,utils.sw)(y)},shouldReduceMotion=(0,use_reduced_motion.Z)(),shouldAnimate=animate&&!isExpanded&&!shouldReduceMotion,[animationFinished,setAnimationFinished]=(0,react.useState)(!1),{style:motionInlineStyles,...otherMotionProps}=(0,react.useMemo)((()=>(0,utils.d9)(computedPlacement)),[computedPlacement]),animationProps=shouldAnimate?{style:{...contentStyle,...motionInlineStyles,...style},onAnimationComplete:()=>setAnimationFinished(!0),...otherMotionProps}:{animate:!1,style:{...contentStyle,...style}},isPositioned=(!shouldAnimate||animationFinished)&&null!==x&&null!==y;let content=(0,jsx_runtime.jsxs)(motion.E.div,{className:(0,clsx.Z)(className,{"is-expanded":isExpanded,"is-positioned":isPositioned,[`is-${"toolbar"===computedVariant?"alternate":computedVariant}`]:computedVariant}),...animationProps,...contentProps,ref:mergedFloatingRef,...dialogProps,tabIndex:-1,children:[isExpanded&&(0,jsx_runtime.jsx)(scroll_lock,{}),isExpanded&&(0,jsx_runtime.jsxs)("div",{className:"components-popover__header",children:[(0,jsx_runtime.jsx)("span",{className:"components-popover__header-title",children:headerTitle}),(0,jsx_runtime.jsx)(build_module_button.ZP,{className:"components-popover__close",icon:library_close.Z,onClick:onClose})]}),(0,jsx_runtime.jsx)("div",{className:"components-popover__content",children}),hasArrow&&(0,jsx_runtime.jsx)("div",{ref:arrowCallbackRef,className:["components-popover__arrow",`is-${computedPlacement.split("-")[0]}`].join(" "),style:{left:void 0!==arrowData?.x&&Number.isFinite(arrowData.x)?`${arrowData.x}px`:"",top:void 0!==arrowData?.y&&Number.isFinite(arrowData.y)?`${arrowData.y}px`:""},children:(0,jsx_runtime.jsx)(ArrowTriangle,{})})]});const shouldRenderWithinSlot=slot.ref&&!inline,hasAnchor=anchorRef||anchorRect||anchor;return shouldRenderWithinSlot?content=(0,jsx_runtime.jsx)(slot_fill.de,{name:slotName,children:content}):inline||(content=(0,react_dom.createPortal)((0,jsx_runtime.jsx)(style_provider.V,{document,children:content}),(()=>{let container=document.body.querySelector(".components-popover__fallback-container");return container||(container=document.createElement("div"),container.className="components-popover__fallback-container",document.body.append(container)),container})())),hasAnchor?content:(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)("span",{ref:anchorRefFallback}),content]})}),"Popover");Popover.Slot=(0,react.forwardRef)((function PopoverSlot({name=SLOT_NAME},ref){return(0,jsx_runtime.jsx)(slot_fill.g7,{bubblesVirtually:!0,name,className:"popover-slot",ref})})),Popover.__unstableSlotNameProvider=slotNameContext.Provider;const popover=Popover},"./packages/components/build-module/slot-fill/bubbles-virtually/slot-fill-context.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/index.js"),_wordpress_warning__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/warning/build-module/index.js"),_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/compose/build-module/utils/observable-map/index.js");const initialContextValue={slots:(0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__.s)(),fills:(0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_0__.s)(),registerSlot:()=>{!0===globalThis.SCRIPT_DEBUG&&!0===globalThis.SCRIPT_DEBUG&&(0,_wordpress_warning__WEBPACK_IMPORTED_MODULE_1__.Z)("Components must be wrapped within `SlotFillProvider`. See https://developer.wordpress.org/block-editor/components/slot-fill/")},updateSlot:()=>{},unregisterSlot:()=>{},registerFill:()=>{},unregisterFill:()=>{},isDefault:!0},__WEBPACK_DEFAULT_EXPORT__=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createContext)(initialContextValue)},"./packages/components/build-module/slot-fill/bubbles-virtually/use-slot.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useSlot});var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/compose/build-module/hooks/use-observable-value/index.js"),_slot_fill_context__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/components/build-module/slot-fill/bubbles-virtually/slot-fill-context.js");function useSlot(name){const registry=(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(_slot_fill_context__WEBPACK_IMPORTED_MODULE_1__.Z);return{...(0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.Z)(registry.slots,name),...(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>({updateSlot:fillProps=>registry.updateSlot(name,fillProps),unregisterSlot:ref=>registry.unregisterSlot(name,ref),registerFill:ref=>registry.registerFill(name,ref),unregisterFill:ref=>registry.unregisterFill(name,ref)})),[name,registry])}}},"./packages/components/build-module/slot-fill/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{de:()=>slot_fill_Fill,zt:()=>Provider,g7:()=>slot_fill_Slot,Es:()=>createPrivateSlotFill,up:()=>createSlotFill});var react=__webpack_require__("./node_modules/react/index.js");const initialValue={registerSlot:()=>{},unregisterSlot:()=>{},registerFill:()=>{},unregisterFill:()=>{},getSlot:()=>{},getFills:()=>[],subscribe:()=>()=>{}},context=(0,react.createContext)(initialValue),use_slot=name=>{const{getSlot,subscribe}=(0,react.useContext)(context);return(0,react.useSyncExternalStore)(subscribe,(()=>getSlot(name)),(()=>getSlot(name)))};function Fill({name,children}){const{registerFill,unregisterFill}=(0,react.useContext)(context),slot=use_slot(name),ref=(0,react.useRef)({name,children});return(0,react.useLayoutEffect)((()=>{const refValue=ref.current;return registerFill(name,refValue),()=>unregisterFill(name,refValue)}),[]),(0,react.useLayoutEffect)((()=>{ref.current.children=children,slot&&slot.forceUpdate()}),[children]),(0,react.useLayoutEffect)((()=>{name!==ref.current.name&&(unregisterFill(ref.current.name,ref.current),ref.current.name=name,registerFill(name,ref.current))}),[name]),null}var utils=__webpack_require__("./packages/element/build-module/utils.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function isFunction(maybeFunc){return"function"==typeof maybeFunc}class SlotComponent extends react.Component{constructor(props){super(props),this.isUnmounted=!1}componentDidMount(){const{registerSlot}=this.props;this.isUnmounted=!1,registerSlot(this.props.name,this)}componentWillUnmount(){const{unregisterSlot}=this.props;this.isUnmounted=!0,unregisterSlot(this.props.name,this)}componentDidUpdate(prevProps){const{name,unregisterSlot,registerSlot}=this.props;prevProps.name!==name&&(unregisterSlot(prevProps.name,this),registerSlot(name,this))}forceUpdate(){this.isUnmounted||super.forceUpdate()}render(){var _getFills;const{children,name,fillProps={},getFills}=this.props,fills=(null!==(_getFills=getFills(name,this))&&void 0!==_getFills?_getFills:[]).map((fill=>{const fillChildren=isFunction(fill.children)?fill.children(fillProps):fill.children;return react.Children.map(fillChildren,((child,childIndex)=>{if(!child||"string"==typeof child)return child;let childKey=childIndex;return"object"==typeof child&&"key"in child&&child?.key&&(childKey=child.key),(0,react.cloneElement)(child,{key:childKey})}))})).filter((element=>!(0,utils.V)(element)));return(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:isFunction(children)?children(fills):fills})}}SlotComponent.displayName="SlotComponent";const slot=props=>(0,jsx_runtime.jsx)(context.Consumer,{children:({registerSlot,unregisterSlot,getFills})=>(0,jsx_runtime.jsx)(SlotComponent,{...props,registerSlot,unregisterSlot,getFills})});var react_dom=__webpack_require__("./node_modules/react-dom/index.js"),bubbles_virtually_use_slot=__webpack_require__("./packages/components/build-module/slot-fill/bubbles-virtually/use-slot.js"),style_provider=__webpack_require__("./packages/components/build-module/style-provider/index.js");function fill_Fill(props){var _slot$fillProps;const{name,children}=props,{registerFill,unregisterFill,...slot}=(0,bubbles_virtually_use_slot.Z)(name),rerender=function useForceUpdate(){const[,setState]=(0,react.useState)({}),mountedRef=(0,react.useRef)(!0);return(0,react.useEffect)((()=>(mountedRef.current=!0,()=>{mountedRef.current=!1})),[]),()=>{mountedRef.current&&setState({})}}(),ref=(0,react.useRef)({rerender});if((0,react.useEffect)((()=>(registerFill(ref),()=>{unregisterFill(ref)})),[registerFill,unregisterFill]),!slot.ref||!slot.ref.current)return null;const wrappedChildren=(0,jsx_runtime.jsx)(style_provider.Z,{document:slot.ref.current.ownerDocument,children:"function"==typeof children?children(null!==(_slot$fillProps=slot.fillProps)&&void 0!==_slot$fillProps?_slot$fillProps:{}):children});return(0,react_dom.createPortal)(wrappedChildren,slot.ref.current)}var use_merge_refs=__webpack_require__("./packages/compose/build-module/hooks/use-merge-refs/index.js"),component=__webpack_require__("./packages/components/build-module/view/component.js"),slot_fill_context=__webpack_require__("./packages/components/build-module/slot-fill/bubbles-virtually/slot-fill-context.js");const bubbles_virtually_slot=(0,react.forwardRef)((function slot_Slot(props,forwardedRef){const{name,fillProps={},as,children,...restProps}=props,{registerSlot,unregisterSlot,...registry}=(0,react.useContext)(slot_fill_context.Z),ref=(0,react.useRef)(null);return(0,react.useLayoutEffect)((()=>(registerSlot(name,ref,fillProps),()=>{unregisterSlot(name,ref)})),[registerSlot,unregisterSlot,name]),(0,react.useLayoutEffect)((()=>{registry.updateSlot(name,fillProps)})),(0,jsx_runtime.jsx)(component.Z,{as,ref:(0,use_merge_refs.Z)([forwardedRef,ref]),...restProps})}));var build_module=__webpack_require__("./packages/is-shallow-equal/build-module/index.js"),observable_map=__webpack_require__("./packages/compose/build-module/utils/observable-map/index.js");function createSlotRegistry(){const slots=(0,observable_map.s)(),fills=(0,observable_map.s)();return{slots,fills,registerSlot:(name,ref,fillProps)=>{const slot=slots.get(name);slots.set(name,{...slot,ref:ref||slot?.ref,fillProps:fillProps||slot?.fillProps||{}})},updateSlot:(name,fillProps)=>{const slot=slots.get(name);if(!slot)return;if((0,build_module.ZP)(slot.fillProps,fillProps))return;slot.fillProps=fillProps;const slotFills=fills.get(name);slotFills&&slotFills.forEach((fill=>fill.current.rerender()))},unregisterSlot:(name,ref)=>{slots.get(name)?.ref===ref&&slots.delete(name)},registerFill:(name,ref)=>{fills.set(name,[...fills.get(name)||[],ref])},unregisterFill:(name,ref)=>{const fillsForName=fills.get(name);fillsForName&&fills.set(name,fillsForName.filter((fillRef=>fillRef!==ref)))}}}function SlotFillProvider({children}){const[registry]=(0,react.useState)(createSlotRegistry);return(0,jsx_runtime.jsx)(slot_fill_context.Z.Provider,{value:registry,children})}function provider_createSlotRegistry(){const slots={},fills={};let listeners=[];function getSlot(name){return slots[name]}function forceUpdateSlot(name){const slot=getSlot(name);slot&&slot.forceUpdate()}function triggerListeners(){listeners.forEach((listener=>listener()))}return{registerSlot:function registerSlot(name,slot){const previousSlot=slots[name];slots[name]=slot,triggerListeners(),forceUpdateSlot(name),previousSlot&&previousSlot.forceUpdate()},unregisterSlot:function unregisterSlot(name,instance){slots[name]===instance&&(delete slots[name],triggerListeners())},registerFill:function registerFill(name,instance){fills[name]=[...fills[name]||[],instance],forceUpdateSlot(name)},unregisterFill:function unregisterFill(name,instance){var _fills$name$filter;fills[name]=null!==(_fills$name$filter=fills[name]?.filter((fill=>fill!==instance)))&&void 0!==_fills$name$filter?_fills$name$filter:[],forceUpdateSlot(name)},getSlot,getFills:function getFills(name,slotInstance){return slots[name]!==slotInstance?[]:fills[name]},subscribe:function subscribe(listener){return listeners.push(listener),()=>{listeners=listeners.filter((l=>l!==listener))}}}}const provider=function provider_SlotFillProvider({children}){const[contextValue]=(0,react.useState)(provider_createSlotRegistry);return(0,jsx_runtime.jsx)(context.Provider,{value:contextValue,children})};function slot_fill_Fill(props){return(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Fill,{...props}),(0,jsx_runtime.jsx)(fill_Fill,{...props})]})}const slot_fill_Slot=(0,react.forwardRef)((function UnforwardedSlot(props,ref){const{bubblesVirtually,...restProps}=props;return bubblesVirtually?(0,jsx_runtime.jsx)(bubbles_virtually_slot,{...restProps,ref}):(0,jsx_runtime.jsx)(slot,{...restProps})}));function Provider({children,passthrough=!1}){return!(0,react.useContext)(slot_fill_context.Z).isDefault&&passthrough?(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children}):(0,jsx_runtime.jsx)(provider,{children:(0,jsx_runtime.jsx)(SlotFillProvider,{children})})}function createSlotFill(key){const baseName="symbol"==typeof key?key.description:key,FillComponent=props=>(0,jsx_runtime.jsx)(slot_fill_Fill,{name:key,...props});FillComponent.displayName=`${baseName}Fill`;const SlotComponent=props=>(0,jsx_runtime.jsx)(slot_fill_Slot,{name:key,...props});return SlotComponent.displayName=`${baseName}Slot`,SlotComponent.__unstableName=key,{Fill:FillComponent,Slot:SlotComponent}}Provider.displayName="SlotFillProvider";const createPrivateSlotFill=name=>{const privateKey=Symbol(name);return{privateKey,...createSlotFill(privateKey)}}},"./packages/components/build-module/style-provider/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{V:()=>StyleProvider,Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _emotion_react__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@emotion/react/dist/emotion-element-699e6908.browser.esm.js"),_emotion_cache__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@emotion/cache/dist/emotion-cache.browser.esm.js"),uuid__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./packages/components/node_modules/uuid/dist/esm-browser/v4.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const uuidCache=new Set,containerCacheMap=new WeakMap,memoizedCreateCacheWithContainer=container=>{if(containerCacheMap.has(container))return containerCacheMap.get(container);let key=uuid__WEBPACK_IMPORTED_MODULE_2__.Z().replace(/[0-9]/g,"");for(;uuidCache.has(key);)key=uuid__WEBPACK_IMPORTED_MODULE_2__.Z().replace(/[0-9]/g,"");uuidCache.add(key);const cache=(0,_emotion_cache__WEBPACK_IMPORTED_MODULE_0__.Z)({container,key});return containerCacheMap.set(container,cache),cache};function StyleProvider(props){const{children,document}=props;if(!document)return null;const cache=memoizedCreateCacheWithContainer(document.head);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_emotion_react__WEBPACK_IMPORTED_MODULE_3__.C,{value:cache,children})}const __WEBPACK_DEFAULT_EXPORT__=StyleProvider},"./packages/dataviews/src/normalize-fields.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{U:()=>normalizeFields});const field_types_integer={sort:function sort(a,b,direction){return"asc"===direction?a-b:b-a},isValid:function isValid(value,context){if(""===value)return!1;if(!Number.isInteger(Number(value)))return!1;if(context?.elements){const validValues=context?.elements.map((f=>f.value));if(!validValues.includes(Number(value)))return!1}return!0},Edit:"integer"};const field_types_text={sort:function text_sort(valueA,valueB,direction){return"asc"===direction?valueA.localeCompare(valueB):valueB.localeCompare(valueA)},isValid:function text_isValid(value,context){if(context?.elements){const validValues=context?.elements?.map((f=>f.value));if(!validValues.includes(value))return!1}return!0},Edit:"text"};const field_types_datetime={sort:function datetime_sort(a,b,direction){const timeA=new Date(a).getTime(),timeB=new Date(b).getTime();return"asc"===direction?timeA-timeB:timeB-timeA},isValid:function datetime_isValid(value,context){if(context?.elements){const validValues=context?.elements.map((f=>f.value));if(!validValues.includes(value))return!1}return!0},Edit:"datetime"};try{fieldtypes.displayName="fieldtypes",fieldtypes.__docgenInfo={description:"",displayName:"fieldtypes",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/field-types/index.tsx#fieldtypes"]={docgenInfo:fieldtypes.__docgenInfo,name:"fieldtypes",path:"packages/dataviews/src/field-types/index.tsx#fieldtypes"})}catch(__react_docgen_typescript_loader_error){}var base_control=__webpack_require__("./packages/components/build-module/base-control/index.js"),component=__webpack_require__("./packages/components/build-module/visually-hidden/component.js"),time=__webpack_require__("./packages/components/build-module/date-time/time/index.js"),react=__webpack_require__("./node_modules/react/index.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function DateTime({data,field,onChange,hideLabelFromVision}){const{id,label}=field,value=field.getValue({item:data}),onChangeControl=(0,react.useCallback)((newValue=>onChange({[id]:newValue})),[id,onChange]);return(0,jsx_runtime.jsxs)("fieldset",{className:"dataviews-controls__datetime",children:[!hideLabelFromVision&&(0,jsx_runtime.jsx)(base_control.ZP.VisualLabel,{as:"legend",children:label}),hideLabelFromVision&&(0,jsx_runtime.jsx)(component.Z,{as:"legend",children:label}),(0,jsx_runtime.jsx)(time.Z,{currentTime:value,onChange:onChangeControl,hideLabelFromVision:!0})]})}DateTime.displayName="DateTime";try{datetime.displayName="datetime",datetime.__docgenInfo={description:"",displayName:"datetime",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"Item"}},field:{defaultValue:null,description:"",name:"field",required:!0,type:{name:"NormalizedField<Item>"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: Record<string, any>) => void"}},hideLabelFromVision:{defaultValue:null,description:"",name:"hideLabelFromVision",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/dataform-controls/datetime.tsx#datetime"]={docgenInfo:datetime.__docgenInfo,name:"datetime",path:"packages/dataviews/src/dataform-controls/datetime.tsx#datetime"})}catch(__react_docgen_typescript_loader_error){}var number_control=__webpack_require__("./packages/components/build-module/number-control/index.js");function Integer({data,field,onChange,hideLabelFromVision}){var _field$getValue;const{id,label,description}=field,value=null!==(_field$getValue=field.getValue({item:data}))&&void 0!==_field$getValue?_field$getValue:"",onChangeControl=(0,react.useCallback)((newValue=>onChange({[id]:Number(newValue)})),[id,onChange]);return(0,jsx_runtime.jsx)(number_control.Z,{label,help:description,value,onChange:onChangeControl,__next40pxDefaultSize:!0,hideLabelFromVision})}Integer.displayName="Integer";try{integer.displayName="integer",integer.__docgenInfo={description:"",displayName:"integer",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"Item"}},field:{defaultValue:null,description:"",name:"field",required:!0,type:{name:"NormalizedField<Item>"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: Record<string, any>) => void"}},hideLabelFromVision:{defaultValue:null,description:"",name:"hideLabelFromVision",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/dataform-controls/integer.tsx#integer"]={docgenInfo:integer.__docgenInfo,name:"integer",path:"packages/dataviews/src/dataform-controls/integer.tsx#integer"})}catch(__react_docgen_typescript_loader_error){}var radio_control=__webpack_require__("./packages/components/build-module/radio-control/index.js");try{radio.displayName="radio",radio.__docgenInfo={description:"",displayName:"radio",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"Item"}},field:{defaultValue:null,description:"",name:"field",required:!0,type:{name:"NormalizedField<Item>"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: Record<string, any>) => void"}},hideLabelFromVision:{defaultValue:null,description:"",name:"hideLabelFromVision",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/dataform-controls/radio.tsx#radio"]={docgenInfo:radio.__docgenInfo,name:"radio",path:"packages/dataviews/src/dataform-controls/radio.tsx#radio"})}catch(__react_docgen_typescript_loader_error){}var select_control=__webpack_require__("./packages/components/build-module/select-control/index.js"),build_module=__webpack_require__("./packages/i18n/build-module/index.js");function Select({data,field,onChange,hideLabelFromVision}){var _field$getValue,_field$elements;const{id,label}=field,value=null!==(_field$getValue=field.getValue({item:data}))&&void 0!==_field$getValue?_field$getValue:"",onChangeControl=(0,react.useCallback)((newValue=>onChange({[id]:newValue})),[id,onChange]),elements=[{label:(0,build_module.__)("Select item"),value:""},...null!==(_field$elements=field?.elements)&&void 0!==_field$elements?_field$elements:[]];return(0,jsx_runtime.jsx)(select_control.Z,{label,value,options:elements,onChange:onChangeControl,__next40pxDefaultSize:!0,__nextHasNoMarginBottom:!0,hideLabelFromVision})}Select.displayName="Select";try{select.displayName="select",select.__docgenInfo={description:"",displayName:"select",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"Item"}},field:{defaultValue:null,description:"",name:"field",required:!0,type:{name:"NormalizedField<Item>"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: Record<string, any>) => void"}},hideLabelFromVision:{defaultValue:null,description:"",name:"hideLabelFromVision",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/dataform-controls/select.tsx#select"]={docgenInfo:select.__docgenInfo,name:"select",path:"packages/dataviews/src/dataform-controls/select.tsx#select"})}catch(__react_docgen_typescript_loader_error){}var text_control=__webpack_require__("./packages/components/build-module/text-control/index.js");function Text({data,field,onChange,hideLabelFromVision}){const{id,label,placeholder}=field,value=field.getValue({item:data}),onChangeControl=(0,react.useCallback)((newValue=>onChange({[id]:newValue})),[id,onChange]);return(0,jsx_runtime.jsx)(text_control.Z,{label,placeholder,value:null!=value?value:"",onChange:onChangeControl,__next40pxDefaultSize:!0,__nextHasNoMarginBottom:!0,hideLabelFromVision})}Text.displayName="Text";try{text.displayName="text",text.__docgenInfo={description:"",displayName:"text",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"Item"}},field:{defaultValue:null,description:"",name:"field",required:!0,type:{name:"NormalizedField<Item>"}},onChange:{defaultValue:null,description:"",name:"onChange",required:!0,type:{name:"(value: Record<string, any>) => void"}},hideLabelFromVision:{defaultValue:null,description:"",name:"hideLabelFromVision",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/dataform-controls/text.tsx#text"]={docgenInfo:text.__docgenInfo,name:"text",path:"packages/dataviews/src/dataform-controls/text.tsx#text"})}catch(__react_docgen_typescript_loader_error){}const FORM_CONTROLS={datetime:DateTime,integer:Integer,radio:function Radio({data,field,onChange,hideLabelFromVision}){const{id,label}=field,value=field.getValue({item:data}),onChangeControl=(0,react.useCallback)((newValue=>onChange({[id]:newValue})),[id,onChange]);return field.elements?(0,jsx_runtime.jsx)(radio_control.Z,{label,onChange:onChangeControl,options:field.elements,selected:value,hideLabelFromVision}):null},select:Select,text:Text};function getControlByType(type){if(Object.keys(FORM_CONTROLS).includes(type))return FORM_CONTROLS[type];throw"Control "+type+" not found"}try{getControlByType.displayName="getControlByType",getControlByType.__docgenInfo={description:"",displayName:"getControlByType",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/dataviews/src/dataform-controls/index.tsx#getControlByType"]={docgenInfo:getControlByType.__docgenInfo,name:"getControlByType",path:"packages/dataviews/src/dataform-controls/index.tsx#getControlByType"})}catch(__react_docgen_typescript_loader_error){}function normalizeFields(fields){return fields.map((field=>{var _field$sort,_field$isValid,_field$enableHiding,_field$enableSorting;const fieldTypeDefinition=function getFieldTypeDefinition(type){return"integer"===type?field_types_integer:"text"===type?field_types_text:"datetime"===type?field_types_datetime:{sort:(a,b,direction)=>"number"==typeof a&&"number"==typeof b?"asc"===direction?a-b:b-a:"asc"===direction?a.localeCompare(b):b.localeCompare(a),isValid:(value,context)=>{if(context?.elements){const validValues=context?.elements?.map((f=>f.value));if(!validValues.includes(value))return!1}return!0},Edit:()=>null}}(field.type),getValue=field.getValue||(({item})=>item[field.id]),sort=null!==(_field$sort=field.sort)&&void 0!==_field$sort?_field$sort:function sort(a,b,direction){return fieldTypeDefinition.sort(getValue({item:a}),getValue({item:b}),direction)},isValid=null!==(_field$isValid=field.isValid)&&void 0!==_field$isValid?_field$isValid:function isValid(item,context){return fieldTypeDefinition.isValid(getValue({item}),context)},Edit=function getControl(field,fieldTypeDefinition){return"function"==typeof field.Edit?field.Edit:"string"==typeof field.Edit?getControlByType(field.Edit):field.elements?getControlByType("select"):"string"==typeof fieldTypeDefinition.Edit?getControlByType(fieldTypeDefinition.Edit):fieldTypeDefinition.Edit}(field,fieldTypeDefinition),render=field.render||(field.elements?({item})=>{const value=getValue({item});return field?.elements?.find((element=>element.value===value))?.label||getValue({item})}:getValue);return{...field,label:field.label||field.id,header:field.header||field.label||field.id,getValue,render,sort,isValid,Edit,enableHiding:null===(_field$enableHiding=field.enableHiding)||void 0===_field$enableHiding||_field$enableHiding,enableSorting:null===(_field$enableSorting=field.enableSorting)||void 0===_field$enableSorting||_field$enableSorting}}))}}}]);