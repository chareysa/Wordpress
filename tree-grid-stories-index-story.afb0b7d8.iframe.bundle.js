"use strict";(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[7875],{"./packages/dom/build-module/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T_:()=>build_module_focus});var focusable_namespaceObject={};__webpack_require__.r(focusable_namespaceObject),__webpack_require__.d(focusable_namespaceObject,{find:()=>find});var tabbable_namespaceObject={};function isVisible(element){return element.offsetWidth>0||element.offsetHeight>0||element.getClientRects().length>0}function find(context,{sequential=!1}={}){const elements=context.querySelectorAll(function buildSelector(sequential){return[sequential?'[tabindex]:not([tabindex^="-"])':"[tabindex]","a[href]","button:not([disabled])",'input:not([type="hidden"]):not([disabled])',"select:not([disabled])","textarea:not([disabled])",'iframe:not([tabindex^="-"])',"object","embed","area[href]","[contenteditable]:not([contenteditable=false])"].join(",")}(sequential));return Array.from(elements).filter((element=>{if(!isVisible(element))return!1;const{nodeName}=element;return"AREA"!==nodeName||function isValidFocusableArea(element){const map=element.closest("map[name]");if(!map)return!1;const img=element.ownerDocument.querySelector('img[usemap="#'+map.name+'"]');return!!img&&isVisible(img)}(element)}))}function getTabIndex(element){const tabIndex=element.getAttribute("tabindex");return null===tabIndex?0:parseInt(tabIndex,10)}function isTabbableIndex(element){return-1!==getTabIndex(element)}function mapElementToObjectTabbable(element,index){return{element,index}}function mapObjectTabbableToElement(object){return object.element}function compareObjectTabbables(a,b){const aTabIndex=getTabIndex(a.element),bTabIndex=getTabIndex(b.element);return aTabIndex===bTabIndex?a.index-b.index:aTabIndex-bTabIndex}function filterTabbable(focusables){return focusables.filter(isTabbableIndex).map(mapElementToObjectTabbable).sort(compareObjectTabbables).map(mapObjectTabbableToElement).reduce(function createStatefulCollapseRadioGroup(){const CHOSEN_RADIO_BY_NAME={};return function collapseRadioGroup(result,element){const{nodeName,type,checked,name}=element;if("INPUT"!==nodeName||"radio"!==type||!name)return result.concat(element);const hasChosen=CHOSEN_RADIO_BY_NAME.hasOwnProperty(name);if(!checked&&hasChosen)return result;if(hasChosen){const hadChosenElement=CHOSEN_RADIO_BY_NAME[name];result=result.filter((e=>e!==hadChosenElement))}return CHOSEN_RADIO_BY_NAME[name]=element,result.concat(element)}}(),[])}function tabbable_find(context){return filterTabbable(find(context))}function findPrevious(element){return filterTabbable(find(element.ownerDocument.body)).reverse().find((focusable=>element.compareDocumentPosition(focusable)&element.DOCUMENT_POSITION_PRECEDING))}function findNext(element){return filterTabbable(find(element.ownerDocument.body)).find((focusable=>element.compareDocumentPosition(focusable)&element.DOCUMENT_POSITION_FOLLOWING))}__webpack_require__.r(tabbable_namespaceObject),__webpack_require__.d(tabbable_namespaceObject,{find:()=>tabbable_find,findNext:()=>findNext,findPrevious:()=>findPrevious,isTabbableIndex:()=>isTabbableIndex});const build_module_focus={focusable:focusable_namespaceObject,tabbable:tabbable_namespaceObject}},"./packages/keycodes/build-module/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Ac:()=>rawShortcut,Bi:()=>PAGEDOWN,E_:()=>displayShortcut,J3:()=>shortcutAriaLabel,K5:()=>ENTER,L_:()=>SPACE,Mf:()=>TAB,RL:()=>LEFT,Sd:()=>HOME,UP:()=>UP,WV:()=>DOWN,ZH:()=>BACKSPACE,a2:()=>displayShortcutList,hY:()=>ESCAPE,kC:()=>F10,pX:()=>RIGHT,uR:()=>END,vd:()=>isKeyboardEvent,wx:()=>PAGEUP,yY:()=>DELETE});var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./packages/i18n/build-module/index.js"),_platform__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./packages/keycodes/build-module/platform.js");const BACKSPACE=8,TAB=9,ENTER=13,ESCAPE=27,SPACE=32,PAGEUP=33,PAGEDOWN=34,END=35,HOME=36,LEFT=37,UP=38,RIGHT=39,DOWN=40,DELETE=46,F10=121,ALT="alt",CTRL="ctrl",COMMAND="meta",SHIFT="shift";function capitaliseFirstCharacter(string){return string.length<2?string.toUpperCase():string.charAt(0).toUpperCase()+string.slice(1)}function mapValues(object,mapFn){return Object.fromEntries(Object.entries(object).map((([key,value])=>[key,mapFn(value)])))}const modifiers={primary:_isApple=>_isApple()?[COMMAND]:[CTRL],primaryShift:_isApple=>_isApple()?[SHIFT,COMMAND]:[CTRL,SHIFT],primaryAlt:_isApple=>_isApple()?[ALT,COMMAND]:[CTRL,ALT],secondary:_isApple=>_isApple()?[SHIFT,ALT,COMMAND]:[CTRL,SHIFT,ALT],access:_isApple=>_isApple()?[CTRL,ALT]:[SHIFT,ALT],ctrl:()=>[CTRL],alt:()=>[ALT],ctrlShift:()=>[CTRL,SHIFT],shift:()=>[SHIFT],shiftAlt:()=>[SHIFT,ALT],undefined:()=>[]},rawShortcut=mapValues(modifiers,(modifier=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.R)=>[...modifier(_isApple),character.toLowerCase()].join("+"))),displayShortcutList=mapValues(modifiers,(modifier=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.R)=>{const isApple=_isApple(),replacementKeyMap={[ALT]:isApple?"⌥":"Alt",[CTRL]:isApple?"⌃":"Ctrl",[COMMAND]:"⌘",[SHIFT]:isApple?"⇧":"Shift"};return[...modifier(_isApple).reduce(((accumulator,key)=>{var _replacementKeyMap$ke;const replacementKey=null!==(_replacementKeyMap$ke=replacementKeyMap[key])&&void 0!==_replacementKeyMap$ke?_replacementKeyMap$ke:key;return isApple?[...accumulator,replacementKey]:[...accumulator,replacementKey,"+"]}),[]),capitaliseFirstCharacter(character)]})),displayShortcut=mapValues(displayShortcutList,(shortcutList=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.R)=>shortcutList(character,_isApple).join(""))),shortcutAriaLabel=mapValues(modifiers,(modifier=>(character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.R)=>{const isApple=_isApple(),replacementKeyMap={[SHIFT]:"Shift",[COMMAND]:isApple?"Command":"Control",[CTRL]:"Control",[ALT]:isApple?"Option":"Alt",",":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Comma"),".":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Period"),"`":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Backtick"),"~":(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Tilde")};return[...modifier(_isApple),character].map((key=>{var _replacementKeyMap$ke2;return capitaliseFirstCharacter(null!==(_replacementKeyMap$ke2=replacementKeyMap[key])&&void 0!==_replacementKeyMap$ke2?_replacementKeyMap$ke2:key)})).join(isApple?" ":" + ")}));const isKeyboardEvent=mapValues(modifiers,(getModifiers=>(event,character,_isApple=_platform__WEBPACK_IMPORTED_MODULE_1__.R)=>{const mods=getModifiers(_isApple),eventMods=function getEventModifiers(event){return[ALT,CTRL,COMMAND,SHIFT].filter((key=>event[`${key}Key`]))}(event),replacementWithShiftKeyMap={Comma:",",Backslash:"\\",IntlRo:"\\",IntlYen:"\\"},modsDiff=mods.filter((mod=>!eventMods.includes(mod))),eventModsDiff=eventMods.filter((mod=>!mods.includes(mod)));if(modsDiff.length>0||eventModsDiff.length>0)return!1;let key=event.key.toLowerCase();return character?(event.altKey&&1===character.length&&(key=String.fromCharCode(event.keyCode).toLowerCase()),event.shiftKey&&1===character.length&&replacementWithShiftKeyMap[event.code]&&(key=replacementWithShiftKeyMap[event.code]),"del"===character&&(character="delete"),key===character.toLowerCase()):mods.includes(key)}))},"./packages/keycodes/build-module/platform.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function isAppleOS(_window=null){if(!_window){if("undefined"==typeof window)return!1;_window=window}const{platform}=_window.navigator;return-1!==platform.indexOf("Mac")||["iPad","iPhone"].includes(platform)}__webpack_require__.d(__webpack_exports__,{R:()=>isAppleOS})},"./packages/components/src/tree-grid/stories/index.story.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,default:()=>index_story});var react=__webpack_require__("./node_modules/react/index.js"),build_module=__webpack_require__("./packages/dom/build-module/index.js"),keycodes_build_module=__webpack_require__("./packages/keycodes/build-module/index.js");const RovingTabIndexContext=(0,react.createContext)(void 0),RovingTabIndexProvider=RovingTabIndexContext.Provider;var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");function RovingTabIndex({children}){const[lastFocusedElement,setLastFocusedElement]=(0,react.useState)(),providerValue=(0,react.useMemo)((()=>({lastFocusedElement,setLastFocusedElement})),[lastFocusedElement]);return(0,jsx_runtime.jsx)(RovingTabIndexProvider,{value:providerValue,children})}RovingTabIndex.displayName="RovingTabIndex";try{rovingtabindex.displayName="rovingtabindex",rovingtabindex.__docgenInfo={description:"Provider for adding roving tab index behaviors to tree grid structures.",displayName:"rovingtabindex",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/roving-tab-index.tsx#rovingtabindex"]={docgenInfo:rovingtabindex.__docgenInfo,name:"rovingtabindex",path:"packages/components/src/tree-grid/roving-tab-index.tsx#rovingtabindex"})}catch(__react_docgen_typescript_loader_error){}function getRowFocusables(rowElement){return build_module.T_.focusable.find(rowElement,{sequential:!0}).filter((focusable=>focusable.closest('[role="row"]')===rowElement))}function UnforwardedTreeGrid({children,onExpandRow=()=>{},onCollapseRow=()=>{},onFocusRow=()=>{},applicationAriaLabel,...props},ref){const onKeyDown=(0,react.useCallback)((event=>{const{keyCode,metaKey,ctrlKey,altKey}=event;if(metaKey||ctrlKey||altKey||![keycodes_build_module.UP,keycodes_build_module.WV,keycodes_build_module.RL,keycodes_build_module.pX,keycodes_build_module.Sd,keycodes_build_module.uR].includes(keyCode))return;event.stopPropagation();const{activeElement}=document,{currentTarget:treeGridElement}=event;if(!activeElement||!treeGridElement.contains(activeElement))return;const activeRow=activeElement.closest('[role="row"]');if(!activeRow)return;const focusablesInRow=getRowFocusables(activeRow),currentColumnIndex=focusablesInRow.indexOf(activeElement),canExpandCollapse=0===currentColumnIndex,cannotFocusNextColumn=canExpandCollapse&&("false"===activeRow.getAttribute("data-expanded")||"false"===activeRow.getAttribute("aria-expanded"))&&keyCode===keycodes_build_module.pX;if([keycodes_build_module.RL,keycodes_build_module.pX].includes(keyCode)){let nextIndex;if(nextIndex=keyCode===keycodes_build_module.RL?Math.max(0,currentColumnIndex-1):Math.min(currentColumnIndex+1,focusablesInRow.length-1),canExpandCollapse){if(keyCode===keycodes_build_module.RL){var _activeRow$getAttribu;if("true"===activeRow.getAttribute("data-expanded")||"true"===activeRow.getAttribute("aria-expanded"))return onCollapseRow(activeRow),void event.preventDefault();const level=Math.max(parseInt(null!==(_activeRow$getAttribu=activeRow?.getAttribute("aria-level"))&&void 0!==_activeRow$getAttribu?_activeRow$getAttribu:"1",10)-1,1),rows=Array.from(treeGridElement.querySelectorAll('[role="row"]'));let parentRow=activeRow;for(let i=rows.indexOf(activeRow);i>=0;i--){const ariaLevel=rows[i].getAttribute("aria-level");if(null!==ariaLevel&&parseInt(ariaLevel,10)===level){parentRow=rows[i];break}}getRowFocusables(parentRow)?.[0]?.focus()}if(keyCode===keycodes_build_module.pX){if("false"===activeRow.getAttribute("data-expanded")||"false"===activeRow.getAttribute("aria-expanded"))return onExpandRow(activeRow),void event.preventDefault();const focusableItems=getRowFocusables(activeRow);focusableItems.length>0&&focusableItems[nextIndex]?.focus()}return void event.preventDefault()}if(cannotFocusNextColumn)return;focusablesInRow[nextIndex].focus(),event.preventDefault()}else if([keycodes_build_module.UP,keycodes_build_module.WV].includes(keyCode)){const rows=Array.from(treeGridElement.querySelectorAll('[role="row"]')),currentRowIndex=rows.indexOf(activeRow);let nextRowIndex;if(nextRowIndex=keyCode===keycodes_build_module.UP?Math.max(0,currentRowIndex-1):Math.min(currentRowIndex+1,rows.length-1),nextRowIndex===currentRowIndex)return void event.preventDefault();const focusablesInNextRow=getRowFocusables(rows[nextRowIndex]);if(!focusablesInNextRow||!focusablesInNextRow.length)return void event.preventDefault();focusablesInNextRow[Math.min(currentColumnIndex,focusablesInNextRow.length-1)].focus(),onFocusRow(event,activeRow,rows[nextRowIndex]),event.preventDefault()}else if([keycodes_build_module.Sd,keycodes_build_module.uR].includes(keyCode)){const rows=Array.from(treeGridElement.querySelectorAll('[role="row"]')),currentRowIndex=rows.indexOf(activeRow);let nextRowIndex;if(nextRowIndex=keyCode===keycodes_build_module.Sd?0:rows.length-1,nextRowIndex===currentRowIndex)return void event.preventDefault();const focusablesInNextRow=getRowFocusables(rows[nextRowIndex]);if(!focusablesInNextRow||!focusablesInNextRow.length)return void event.preventDefault();focusablesInNextRow[Math.min(currentColumnIndex,focusablesInNextRow.length-1)].focus(),onFocusRow(event,activeRow,rows[nextRowIndex]),event.preventDefault()}}),[onExpandRow,onCollapseRow,onFocusRow]);return(0,jsx_runtime.jsx)(RovingTabIndex,{children:(0,jsx_runtime.jsx)("div",{role:"application","aria-label":applicationAriaLabel,children:(0,jsx_runtime.jsx)("table",{...props,role:"treegrid",onKeyDown,ref,children:(0,jsx_runtime.jsx)("tbody",{children})})})})}UnforwardedTreeGrid.displayName="UnforwardedTreeGrid";const TreeGrid=(0,react.forwardRef)(UnforwardedTreeGrid),tree_grid=TreeGrid;try{TreeGrid.displayName="TreeGrid",TreeGrid.__docgenInfo={description:"`TreeGrid` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.\n\nA tree grid is a hierarchical 2 dimensional UI component, for example it could be\nused to implement a file system browser.\n\nA tree grid allows the user to navigate using arrow keys.\nUp/down to navigate vertically across rows, and left/right to navigate horizontally\nbetween focusables in a row.\n\nThe `TreeGrid` renders both a `table` and `tbody` element, and is intended to be used\nwith `TreeGridRow` (`tr`) and `TreeGridCell` (`td`) to build out a grid.\n\n```jsx\nfunction TreeMenu() {\n\treturn (\n\t\t<TreeGrid>\n\t\t\t<TreeGridRow level={ 1 } positionInSet={ 1 } setSize={ 2 }>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onSelect } { ...props }>Select</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onMove } { ...props }>Move</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t</TreeGridRow>\n\t\t\t<TreeGridRow level={ 1 } positionInSet={ 2 } setSize={ 2 }>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onSelect } { ...props }>Select</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onMove } { ...props }>Move</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t</TreeGridRow>\n\t\t\t<TreeGridRow level={ 2 } positionInSet={ 1 } setSize={ 1 }>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onSelect } { ...props }>Select</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onMove } { ...props }>Move</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t</TreeGridRow>\n\t\t</TreeGrid>\n\t);\n}\n```",displayName:"TreeGrid",props:{applicationAriaLabel:{defaultValue:null,description:"Label to use for the element with the `application` role.",name:"applicationAriaLabel",required:!1,type:{name:"string"}},children:{defaultValue:null,description:"The children to be rendered in the tree grid.",name:"children",required:!0,type:{name:"ReactNode"}},onExpandRow:{defaultValue:{value:"noop"},description:"Callback to fire when row is expanded.",name:"onExpandRow",required:!1,type:{name:"(row: HTMLElement) => void"}},onCollapseRow:{defaultValue:{value:"noop"},description:"Callback to fire when row is collapsed.",name:"onCollapseRow",required:!1,type:{name:"(row: HTMLElement) => void"}},onFocusRow:{defaultValue:{value:"noop"},description:"Callback that fires when focus is shifted from one row to another via\nthe Up and Down keys. Callback is also fired on Home and End keys which\nmove focus from the beginning row to the end row.\n\nThe callback is passed the event, the start row element that the focus was on\noriginally, and the destination row element after the focus has moved.",name:"onFocusRow",required:!1,type:{name:"(event: KeyboardEvent<HTMLTableElement>, startRow: HTMLElement, destinationRow: HTMLElement) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/index.tsx#TreeGrid"]={docgenInfo:TreeGrid.__docgenInfo,name:"TreeGrid",path:"packages/components/src/tree-grid/index.tsx#TreeGrid"})}catch(__react_docgen_typescript_loader_error){}try{treegrid.displayName="treegrid",treegrid.__docgenInfo={description:"`TreeGrid` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.\n\nA tree grid is a hierarchical 2 dimensional UI component, for example it could be\nused to implement a file system browser.\n\nA tree grid allows the user to navigate using arrow keys.\nUp/down to navigate vertically across rows, and left/right to navigate horizontally\nbetween focusables in a row.\n\nThe `TreeGrid` renders both a `table` and `tbody` element, and is intended to be used\nwith `TreeGridRow` (`tr`) and `TreeGridCell` (`td`) to build out a grid.\n\n```jsx\nfunction TreeMenu() {\n\treturn (\n\t\t<TreeGrid>\n\t\t\t<TreeGridRow level={ 1 } positionInSet={ 1 } setSize={ 2 }>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onSelect } { ...props }>Select</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onMove } { ...props }>Move</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t</TreeGridRow>\n\t\t\t<TreeGridRow level={ 1 } positionInSet={ 2 } setSize={ 2 }>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onSelect } { ...props }>Select</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onMove } { ...props }>Move</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t</TreeGridRow>\n\t\t\t<TreeGridRow level={ 2 } positionInSet={ 1 } setSize={ 1 }>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onSelect } { ...props }>Select</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t\t<TreeGridCell>\n\t\t\t\t\t{ ( props ) => (\n\t\t\t\t\t\t<Button onClick={ onMove } { ...props }>Move</Button>\n\t\t\t\t\t) }\n\t\t\t\t</TreeGridCell>\n\t\t\t</TreeGridRow>\n\t\t</TreeGrid>\n\t);\n}\n```",displayName:"treegrid",props:{applicationAriaLabel:{defaultValue:null,description:"Label to use for the element with the `application` role.",name:"applicationAriaLabel",required:!1,type:{name:"string"}},children:{defaultValue:null,description:"The children to be rendered in the tree grid.",name:"children",required:!0,type:{name:"ReactNode"}},onExpandRow:{defaultValue:{value:"noop"},description:"Callback to fire when row is expanded.",name:"onExpandRow",required:!1,type:{name:"(row: HTMLElement) => void"}},onCollapseRow:{defaultValue:{value:"noop"},description:"Callback to fire when row is collapsed.",name:"onCollapseRow",required:!1,type:{name:"(row: HTMLElement) => void"}},onFocusRow:{defaultValue:{value:"noop"},description:"Callback that fires when focus is shifted from one row to another via\nthe Up and Down keys. Callback is also fired on Home and End keys which\nmove focus from the beginning row to the end row.\n\nThe callback is passed the event, the start row element that the focus was on\noriginally, and the destination row element after the focus has moved.",name:"onFocusRow",required:!1,type:{name:"(event: KeyboardEvent<HTMLTableElement>, startRow: HTMLElement, destinationRow: HTMLElement) => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/index.tsx#treegrid"]={docgenInfo:treegrid.__docgenInfo,name:"treegrid",path:"packages/components/src/tree-grid/index.tsx#treegrid"})}catch(__react_docgen_typescript_loader_error){}try{TreeGridRow.displayName="TreeGridRow",TreeGridRow.__docgenInfo={description:"`TreeGridRow` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"TreeGridRow",props:{children:{defaultValue:null,description:"The children to be rendered in the row.",name:"children",required:!0,type:{name:"ReactNode"}},level:{defaultValue:null,description:"An integer value designating the level in the hierarchical tree structure.\nCounting starts at 1. A value of `1` indicates the root level of the structure.",name:"level",required:!0,type:{name:"number"}},positionInSet:{defaultValue:null,description:"An integer value that represents the position in the set.\nA set is the count of elements at a specific level. Counting starts at 1.",name:"positionInSet",required:!0,type:{name:"number"}},setSize:{defaultValue:null,description:"An integer value that represents the total number of items in the set,\nat this specific level of the hierarchy.",name:"setSize",required:!0,type:{name:"number"}},isExpanded:{defaultValue:null,description:"An optional value that designates whether a row is expanded or collapsed.\nCurrently this value only sets the correct aria-expanded property on a row,\nit has no other built-in behavior.\n\nIf there is a need to implement `aria-expanded` elsewhere in the row, cell,\nor element within a cell, you may pass `isExpanded={ undefined }`.\nIn order for keyboard navigation to continue working, add the\n`data-expanded` attribute with either `true`/`false`. This allows the\n`TreeGrid` component to still manage keyboard interactions while allowing\nthe `aria-expanded` attribute to be placed elsewhere.",name:"isExpanded",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/index.tsx#TreeGridRow"]={docgenInfo:TreeGridRow.__docgenInfo,name:"TreeGridRow",path:"packages/components/src/tree-grid/index.tsx#TreeGridRow"})}catch(__react_docgen_typescript_loader_error){}try{TreeGridCell.displayName="TreeGridCell",TreeGridCell.__docgenInfo={description:"`TreeGridCell` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"TreeGridCell",props:{withoutGridItem:{defaultValue:{value:"false"},description:"Render `children` without wrapping it in a `TreeGridItem` component.\nThis means that `children` will not participate in the roving tabindex.",name:"withoutGridItem",required:!1,type:{name:"boolean"}},children:{defaultValue:null,description:"A render function that receives the props necessary to make it participate in the\nroving tabindex. Any extra props will also be passed through to this function.\n\nProps passed as an argument to the render prop must be passed to the child\nfocusable component/element within the cell. If a component is used, it must\ncorrectly handle the `onFocus`, `tabIndex`, and `ref` props, passing these to the\nelement it renders. These props are used to handle the roving tabindex functionality\nof the tree grid.\n\n```jsx\n<TreeGridCell>\n\t{ ( props ) => (\n\t\t<Button onClick={ doSomething } { ...props }>\n\t\t\tDo something\n\t\t</Button>\n\t) }\n</TreeGridCell>\n```",name:"children",required:!1,type:{name:"ReactNode | ((props: RovingTabIndexItemPassThruProps) => Element)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/index.tsx#TreeGridCell"]={docgenInfo:TreeGridCell.__docgenInfo,name:"TreeGridCell",path:"packages/components/src/tree-grid/index.tsx#TreeGridCell"})}catch(__react_docgen_typescript_loader_error){}try{TreeGridItem.displayName="TreeGridItem",TreeGridItem.__docgenInfo={description:"`TreeGridItem` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"TreeGridItem",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/index.tsx#TreeGridItem"]={docgenInfo:TreeGridItem.__docgenInfo,name:"TreeGridItem",path:"packages/components/src/tree-grid/index.tsx#TreeGridItem"})}catch(__react_docgen_typescript_loader_error){}function UnforwardedTreeGridRow({children,level,positionInSet,setSize,isExpanded,...props},ref){return(0,jsx_runtime.jsx)("tr",{...props,ref,role:"row","aria-level":level,"aria-posinset":positionInSet,"aria-setsize":setSize,"aria-expanded":isExpanded,children})}UnforwardedTreeGridRow.displayName="UnforwardedTreeGridRow";const row_TreeGridRow=(0,react.forwardRef)(UnforwardedTreeGridRow),tree_grid_row=row_TreeGridRow;try{row_TreeGridRow.displayName="TreeGridRow",row_TreeGridRow.__docgenInfo={description:"`TreeGridRow` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"TreeGridRow",props:{children:{defaultValue:null,description:"The children to be rendered in the row.",name:"children",required:!0,type:{name:"ReactNode"}},level:{defaultValue:null,description:"An integer value designating the level in the hierarchical tree structure.\nCounting starts at 1. A value of `1` indicates the root level of the structure.",name:"level",required:!0,type:{name:"number"}},positionInSet:{defaultValue:null,description:"An integer value that represents the position in the set.\nA set is the count of elements at a specific level. Counting starts at 1.",name:"positionInSet",required:!0,type:{name:"number"}},setSize:{defaultValue:null,description:"An integer value that represents the total number of items in the set,\nat this specific level of the hierarchy.",name:"setSize",required:!0,type:{name:"number"}},isExpanded:{defaultValue:null,description:"An optional value that designates whether a row is expanded or collapsed.\nCurrently this value only sets the correct aria-expanded property on a row,\nit has no other built-in behavior.\n\nIf there is a need to implement `aria-expanded` elsewhere in the row, cell,\nor element within a cell, you may pass `isExpanded={ undefined }`.\nIn order for keyboard navigation to continue working, add the\n`data-expanded` attribute with either `true`/`false`. This allows the\n`TreeGrid` component to still manage keyboard interactions while allowing\nthe `aria-expanded` attribute to be placed elsewhere.",name:"isExpanded",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/row.tsx#TreeGridRow"]={docgenInfo:row_TreeGridRow.__docgenInfo,name:"TreeGridRow",path:"packages/components/src/tree-grid/row.tsx#TreeGridRow"})}catch(__react_docgen_typescript_loader_error){}try{row.displayName="row",row.__docgenInfo={description:"`TreeGridRow` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"row",props:{children:{defaultValue:null,description:"The children to be rendered in the row.",name:"children",required:!0,type:{name:"ReactNode"}},level:{defaultValue:null,description:"An integer value designating the level in the hierarchical tree structure.\nCounting starts at 1. A value of `1` indicates the root level of the structure.",name:"level",required:!0,type:{name:"number"}},positionInSet:{defaultValue:null,description:"An integer value that represents the position in the set.\nA set is the count of elements at a specific level. Counting starts at 1.",name:"positionInSet",required:!0,type:{name:"number"}},setSize:{defaultValue:null,description:"An integer value that represents the total number of items in the set,\nat this specific level of the hierarchy.",name:"setSize",required:!0,type:{name:"number"}},isExpanded:{defaultValue:null,description:"An optional value that designates whether a row is expanded or collapsed.\nCurrently this value only sets the correct aria-expanded property on a row,\nit has no other built-in behavior.\n\nIf there is a need to implement `aria-expanded` elsewhere in the row, cell,\nor element within a cell, you may pass `isExpanded={ undefined }`.\nIn order for keyboard navigation to continue working, add the\n`data-expanded` attribute with either `true`/`false`. This allows the\n`TreeGrid` component to still manage keyboard interactions while allowing\nthe `aria-expanded` attribute to be placed elsewhere.",name:"isExpanded",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/row.tsx#row"]={docgenInfo:row.__docgenInfo,name:"row",path:"packages/components/src/tree-grid/row.tsx#row"})}catch(__react_docgen_typescript_loader_error){}const RovingTabIndexItem=(0,react.forwardRef)((function UnforwardedRovingTabIndexItem({children,as:Component,...props},forwardedRef){const localRef=(0,react.useRef)(),ref=forwardedRef||localRef,{lastFocusedElement,setLastFocusedElement}=(0,react.useContext)(RovingTabIndexContext);let tabIndex;lastFocusedElement&&(tabIndex=lastFocusedElement===("current"in ref?ref.current:void 0)?0:-1);const allProps={ref,tabIndex,onFocus:event=>setLastFocusedElement?.(event.target),...props};return"function"==typeof children?children(allProps):Component?(0,jsx_runtime.jsx)(Component,{...allProps,children}):null})),roving_tab_index_item=RovingTabIndexItem;try{RovingTabIndexItem.displayName="RovingTabIndexItem",RovingTabIndexItem.__docgenInfo={description:"",displayName:"RovingTabIndexItem",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/roving-tab-index-item.tsx#RovingTabIndexItem"]={docgenInfo:RovingTabIndexItem.__docgenInfo,name:"RovingTabIndexItem",path:"packages/components/src/tree-grid/roving-tab-index-item.tsx#RovingTabIndexItem"})}catch(__react_docgen_typescript_loader_error){}try{rovingtabindexitem.displayName="rovingtabindexitem",rovingtabindexitem.__docgenInfo={description:"",displayName:"rovingtabindexitem",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/roving-tab-index-item.tsx#rovingtabindexitem"]={docgenInfo:rovingtabindexitem.__docgenInfo,name:"rovingtabindexitem",path:"packages/components/src/tree-grid/roving-tab-index-item.tsx#rovingtabindexitem"})}catch(__react_docgen_typescript_loader_error){}function UnforwardedTreeGridItem({children,...props},ref){return(0,jsx_runtime.jsx)(roving_tab_index_item,{ref,...props,children})}UnforwardedTreeGridItem.displayName="UnforwardedTreeGridItem";const item_TreeGridItem=(0,react.forwardRef)(UnforwardedTreeGridItem),tree_grid_item=item_TreeGridItem;try{item_TreeGridItem.displayName="TreeGridItem",item_TreeGridItem.__docgenInfo={description:"`TreeGridItem` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"TreeGridItem",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/item.tsx#TreeGridItem"]={docgenInfo:item_TreeGridItem.__docgenInfo,name:"TreeGridItem",path:"packages/components/src/tree-grid/item.tsx#TreeGridItem"})}catch(__react_docgen_typescript_loader_error){}try{item.displayName="item",item.__docgenInfo={description:"`TreeGridItem` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"item",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/item.tsx#item"]={docgenInfo:item.__docgenInfo,name:"item",path:"packages/components/src/tree-grid/item.tsx#item"})}catch(__react_docgen_typescript_loader_error){}function UnforwardedTreeGridCell({children,withoutGridItem=!1,...props},ref){return(0,jsx_runtime.jsx)("td",{...props,role:"gridcell",children:withoutGridItem?(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children}):(0,jsx_runtime.jsx)(tree_grid_item,{ref,children})})}UnforwardedTreeGridCell.displayName="UnforwardedTreeGridCell";const cell_TreeGridCell=(0,react.forwardRef)(UnforwardedTreeGridCell),tree_grid_cell=cell_TreeGridCell;try{cell_TreeGridCell.displayName="TreeGridCell",cell_TreeGridCell.__docgenInfo={description:"`TreeGridCell` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"TreeGridCell",props:{withoutGridItem:{defaultValue:{value:"false"},description:"Render `children` without wrapping it in a `TreeGridItem` component.\nThis means that `children` will not participate in the roving tabindex.",name:"withoutGridItem",required:!1,type:{name:"boolean"}},children:{defaultValue:null,description:"A render function that receives the props necessary to make it participate in the\nroving tabindex. Any extra props will also be passed through to this function.\n\nProps passed as an argument to the render prop must be passed to the child\nfocusable component/element within the cell. If a component is used, it must\ncorrectly handle the `onFocus`, `tabIndex`, and `ref` props, passing these to the\nelement it renders. These props are used to handle the roving tabindex functionality\nof the tree grid.\n\n```jsx\n<TreeGridCell>\n\t{ ( props ) => (\n\t\t<Button onClick={ doSomething } { ...props }>\n\t\t\tDo something\n\t\t</Button>\n\t) }\n</TreeGridCell>\n```",name:"children",required:!1,type:{name:"ReactNode | ((props: RovingTabIndexItemPassThruProps) => Element)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/cell.tsx#TreeGridCell"]={docgenInfo:cell_TreeGridCell.__docgenInfo,name:"TreeGridCell",path:"packages/components/src/tree-grid/cell.tsx#TreeGridCell"})}catch(__react_docgen_typescript_loader_error){}try{cell.displayName="cell",cell.__docgenInfo={description:"`TreeGridCell` is used to create a tree hierarchy.\nIt is not a visually styled component, but instead helps with adding\nkeyboard navigation and roving tab index behaviors to tree grid structures.",displayName:"cell",props:{withoutGridItem:{defaultValue:{value:"false"},description:"Render `children` without wrapping it in a `TreeGridItem` component.\nThis means that `children` will not participate in the roving tabindex.",name:"withoutGridItem",required:!1,type:{name:"boolean"}},children:{defaultValue:null,description:"A render function that receives the props necessary to make it participate in the\nroving tabindex. Any extra props will also be passed through to this function.\n\nProps passed as an argument to the render prop must be passed to the child\nfocusable component/element within the cell. If a component is used, it must\ncorrectly handle the `onFocus`, `tabIndex`, and `ref` props, passing these to the\nelement it renders. These props are used to handle the roving tabindex functionality\nof the tree grid.\n\n```jsx\n<TreeGridCell>\n\t{ ( props ) => (\n\t\t<Button onClick={ doSomething } { ...props }>\n\t\t\tDo something\n\t\t</Button>\n\t) }\n</TreeGridCell>\n```",name:"children",required:!1,type:{name:"ReactNode | ((props: RovingTabIndexItemPassThruProps) => Element)"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["packages/components/src/tree-grid/cell.tsx#cell"]={docgenInfo:cell.__docgenInfo,name:"cell",path:"packages/components/src/tree-grid/cell.tsx#cell"})}catch(__react_docgen_typescript_loader_error){}var src_button=__webpack_require__("./packages/components/src/button/index.tsx"),input_control=__webpack_require__("./packages/components/src/input-control/index.tsx");const index_story={title:"Components (Experimental)/TreeGrid",component:tree_grid,subcomponents:{TreeGridRow:tree_grid_row,TreeGridCell:tree_grid_cell},argTypes:{children:{control:{type:null}}},parameters:{sourceLink:"packages/components/src/tree-grid",badges:[],actions:{argTypesRegex:"^on.*"},controls:{expanded:!0}}},Descender=({level})=>{if(1===level)return null;const indentation=" ".repeat(4*(level-1));return(0,jsx_runtime.jsx)("span",{"aria-hidden":"true",children:indentation+"├ "})};Descender.displayName="Descender";const Rows=({items=[],level=1})=>(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:items.map(((item,index)=>{const hasChildren=!!item.types&&!!item.types.length;return(0,jsx_runtime.jsxs)(react.Fragment,{children:[(0,jsx_runtime.jsxs)(tree_grid_row,{positionInSet:index+1,setSize:items.length,level,isExpanded:!0,children:[(0,jsx_runtime.jsx)(tree_grid_cell,{children:props=>(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Descender,{level}),(0,jsx_runtime.jsx)(src_button.zx,{variant:"primary",...props,children:item.name})]})}),(0,jsx_runtime.jsx)(tree_grid_cell,{children:props=>(0,jsx_runtime.jsx)(input_control.ZP,{label:"Description",hideLabelFromVision:!0,placeholder:"Description",...props})}),(0,jsx_runtime.jsx)(tree_grid_cell,{children:props=>(0,jsx_runtime.jsx)(input_control.ZP,{label:"Notes",hideLabelFromVision:!0,placeholder:"Notes",...props})})]}),hasChildren&&(0,jsx_runtime.jsx)(Rows,{items:item.types,level:level+1})]},item.name)}))}),Template=args=>(0,jsx_runtime.jsx)(tree_grid,{...args});Template.displayName="Template";const Default=Template.bind({});Default.args={children:(0,jsx_runtime.jsx)(Rows,{items:[{name:"Fruit",types:[{name:"Apple"},{name:"Orange"},{name:"Pear"}]},{name:"Vegetable",types:[{name:"Cucumber"},{name:"Parsnip"},{name:"Pumpkin"}]}]})},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => <TreeGrid {...args} />",...Default.parameters?.docs?.source}}}}}]);