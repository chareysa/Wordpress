(globalThis.webpackChunkgutenberg=globalThis.webpackChunkgutenberg||[]).push([[9119],{"./node_modules/fast-memoize/src/index.js":module=>{function monadic(fn,cache,serializer,arg){var cacheKey=function isPrimitive(value){return null==value||"number"==typeof value||"boolean"==typeof value}(arg)?arg:serializer(arg),computedValue=cache.get(cacheKey);return void 0===computedValue&&(computedValue=fn.call(this,arg),cache.set(cacheKey,computedValue)),computedValue}function variadic(fn,cache,serializer){var args=Array.prototype.slice.call(arguments,3),cacheKey=serializer(args),computedValue=cache.get(cacheKey);return void 0===computedValue&&(computedValue=fn.apply(this,args),cache.set(cacheKey,computedValue)),computedValue}function assemble(fn,context,strategy,cache,serialize){return strategy.bind(context,fn,cache,serialize)}function strategyDefault(fn,options){return assemble(fn,this,1===fn.length?monadic:variadic,options.cache.create(),options.serializer)}function serializerDefault(){return JSON.stringify(arguments)}function ObjectWithoutPrototypeCache(){this.cache=Object.create(null)}ObjectWithoutPrototypeCache.prototype.has=function(key){return key in this.cache},ObjectWithoutPrototypeCache.prototype.get=function(key){return this.cache[key]},ObjectWithoutPrototypeCache.prototype.set=function(key,value){this.cache[key]=value};var cacheDefault={create:function create(){return new ObjectWithoutPrototypeCache}};module.exports=function memoize(fn,options){var cache=options&&options.cache?options.cache:cacheDefault,serializer=options&&options.serializer?options.serializer:serializerDefault;return(options&&options.strategy?options.strategy:strategyDefault)(fn,{cache,serializer})},module.exports.strategies={variadic:function strategyVariadic(fn,options){return assemble(fn,this,variadic,options.cache.create(),options.serializer)},monadic:function strategyMonadic(fn,options){return assemble(fn,this,monadic,options.cache.create(),options.serializer)}}},"./node_modules/re-resizable/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{e:()=>Resizable});var extendStatics,react=__webpack_require__("./node_modules/react/index.js"),__extends=(extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p])},extendStatics(d,b)},function(d,b){function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)}),__assign=function(){return __assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(t[p]=s[p]);return t},__assign.apply(this,arguments)},styles={top:{width:"100%",height:"10px",top:"-5px",left:"0px",cursor:"row-resize"},right:{width:"10px",height:"100%",top:"0px",right:"-5px",cursor:"col-resize"},bottom:{width:"100%",height:"10px",bottom:"-5px",left:"0px",cursor:"row-resize"},left:{width:"10px",height:"100%",top:"0px",left:"-5px",cursor:"col-resize"},topRight:{width:"20px",height:"20px",position:"absolute",right:"-10px",top:"-10px",cursor:"ne-resize"},bottomRight:{width:"20px",height:"20px",position:"absolute",right:"-10px",bottom:"-10px",cursor:"se-resize"},bottomLeft:{width:"20px",height:"20px",position:"absolute",left:"-10px",bottom:"-10px",cursor:"sw-resize"},topLeft:{width:"20px",height:"20px",position:"absolute",left:"-10px",top:"-10px",cursor:"nw-resize"}},Resizer=function(_super){function Resizer(){var _this=null!==_super&&_super.apply(this,arguments)||this;return _this.onMouseDown=function(e){_this.props.onResizeStart(e,_this.props.direction)},_this.onTouchStart=function(e){_this.props.onResizeStart(e,_this.props.direction)},_this}return __extends(Resizer,_super),Resizer.prototype.render=function(){return react.createElement("div",{className:this.props.className||"",style:__assign(__assign({position:"absolute",userSelect:"none"},styles[this.props.direction]),this.props.replaceStyles||{}),onMouseDown:this.onMouseDown,onTouchStart:this.onTouchStart},this.props.children)},Resizer}(react.PureComponent),src=__webpack_require__("./node_modules/fast-memoize/src/index.js"),src_default=__webpack_require__.n(src),lib_extends=function(){var extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b}||function(d,b){for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p])},extendStatics(d,b)};return function(d,b){function __(){this.constructor=d}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)}}(),lib_assign=function(){return lib_assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(t[p]=s[p]);return t},lib_assign.apply(this,arguments)},DEFAULT_SIZE={width:"auto",height:"auto"},clamp=src_default()((function(n,min,max){return Math.max(Math.min(n,max),min)})),snap=src_default()((function(n,size){return Math.round(n/size)*size})),hasDirection=src_default()((function(dir,target){return new RegExp(dir,"i").test(target)})),isTouchEvent=function(event){return Boolean(event.touches&&event.touches.length)},findClosestSnap=src_default()((function(n,snapArray,snapGap){void 0===snapGap&&(snapGap=0);var closestGapIndex=snapArray.reduce((function(prev,curr,index){return Math.abs(curr-n)<Math.abs(snapArray[prev]-n)?index:prev}),0),gap=Math.abs(snapArray[closestGapIndex]-n);return 0===snapGap||gap<snapGap?snapArray[closestGapIndex]:n})),endsWith=src_default()((function(str,searchStr){return str.substr(str.length-searchStr.length,searchStr.length)===searchStr})),getStringSize=src_default()((function(n){return"auto"===(n=n.toString())||endsWith(n,"px")||endsWith(n,"%")||endsWith(n,"vh")||endsWith(n,"vw")||endsWith(n,"vmax")||endsWith(n,"vmin")?n:n+"px"})),getPixelSize=function(size,parentSize,innerWidth,innerHeight){if(size&&"string"==typeof size){if(endsWith(size,"px"))return Number(size.replace("px",""));if(endsWith(size,"%"))return parentSize*(Number(size.replace("%",""))/100);if(endsWith(size,"vw"))return innerWidth*(Number(size.replace("vw",""))/100);if(endsWith(size,"vh"))return innerHeight*(Number(size.replace("vh",""))/100)}return size},calculateNewMax=src_default()((function(parentSize,innerWidth,innerHeight,maxWidth,maxHeight,minWidth,minHeight){return maxWidth=getPixelSize(maxWidth,parentSize.width,innerWidth,innerHeight),maxHeight=getPixelSize(maxHeight,parentSize.height,innerWidth,innerHeight),minWidth=getPixelSize(minWidth,parentSize.width,innerWidth,innerHeight),minHeight=getPixelSize(minHeight,parentSize.height,innerWidth,innerHeight),{maxWidth:void 0===maxWidth?void 0:Number(maxWidth),maxHeight:void 0===maxHeight?void 0:Number(maxHeight),minWidth:void 0===minWidth?void 0:Number(minWidth),minHeight:void 0===minHeight?void 0:Number(minHeight)}})),definedProps=["as","style","className","grid","snap","bounds","boundsByDirection","size","defaultSize","minWidth","minHeight","maxWidth","maxHeight","lockAspectRatio","lockAspectRatioExtraWidth","lockAspectRatioExtraHeight","enable","handleStyles","handleClasses","handleWrapperStyle","handleWrapperClass","children","onResizeStart","onResize","onResizeStop","handleComponent","scale","resizeRatio","snapGap"],Resizable=function(_super){function Resizable(props){var _this=_super.call(this,props)||this;return _this.ratio=1,_this.resizable=null,_this.parentLeft=0,_this.parentTop=0,_this.resizableLeft=0,_this.resizableRight=0,_this.resizableTop=0,_this.resizableBottom=0,_this.targetLeft=0,_this.targetTop=0,_this.appendBase=function(){if(!_this.resizable||!_this.window)return null;var parent=_this.parentNode;if(!parent)return null;var element=_this.window.document.createElement("div");return element.style.width="100%",element.style.height="100%",element.style.position="absolute",element.style.transform="scale(0, 0)",element.style.left="0",element.style.flex="0",element.classList?element.classList.add("__resizable_base__"):element.className+="__resizable_base__",parent.appendChild(element),element},_this.removeBase=function(base){var parent=_this.parentNode;parent&&parent.removeChild(base)},_this.ref=function(c){c&&(_this.resizable=c)},_this.state={isResizing:!1,width:void 0===(_this.propsSize&&_this.propsSize.width)?"auto":_this.propsSize&&_this.propsSize.width,height:void 0===(_this.propsSize&&_this.propsSize.height)?"auto":_this.propsSize&&_this.propsSize.height,direction:"right",original:{x:0,y:0,width:0,height:0},backgroundStyle:{height:"100%",width:"100%",backgroundColor:"rgba(0,0,0,0)",cursor:"auto",opacity:0,position:"fixed",zIndex:9999,top:"0",left:"0",bottom:"0",right:"0"},flexBasis:void 0},_this.onResizeStart=_this.onResizeStart.bind(_this),_this.onMouseMove=_this.onMouseMove.bind(_this),_this.onMouseUp=_this.onMouseUp.bind(_this),_this}return lib_extends(Resizable,_super),Object.defineProperty(Resizable.prototype,"parentNode",{get:function(){return this.resizable?this.resizable.parentNode:null},enumerable:!1,configurable:!0}),Object.defineProperty(Resizable.prototype,"window",{get:function(){return this.resizable&&this.resizable.ownerDocument?this.resizable.ownerDocument.defaultView:null},enumerable:!1,configurable:!0}),Object.defineProperty(Resizable.prototype,"propsSize",{get:function(){return this.props.size||this.props.defaultSize||DEFAULT_SIZE},enumerable:!1,configurable:!0}),Object.defineProperty(Resizable.prototype,"size",{get:function(){var width=0,height=0;if(this.resizable&&this.window){var orgWidth=this.resizable.offsetWidth,orgHeight=this.resizable.offsetHeight,orgPosition=this.resizable.style.position;"relative"!==orgPosition&&(this.resizable.style.position="relative"),width="auto"!==this.resizable.style.width?this.resizable.offsetWidth:orgWidth,height="auto"!==this.resizable.style.height?this.resizable.offsetHeight:orgHeight,this.resizable.style.position=orgPosition}return{width,height}},enumerable:!1,configurable:!0}),Object.defineProperty(Resizable.prototype,"sizeStyle",{get:function(){var _this=this,size=this.props.size,getSize=function(key){if(void 0===_this.state[key]||"auto"===_this.state[key])return"auto";if(_this.propsSize&&_this.propsSize[key]&&endsWith(_this.propsSize[key].toString(),"%")){if(endsWith(_this.state[key].toString(),"%"))return _this.state[key].toString();var parentSize=_this.getParentSize();return Number(_this.state[key].toString().replace("px",""))/parentSize[key]*100+"%"}return getStringSize(_this.state[key])};return{width:size&&void 0!==size.width&&!this.state.isResizing?getStringSize(size.width):getSize("width"),height:size&&void 0!==size.height&&!this.state.isResizing?getStringSize(size.height):getSize("height")}},enumerable:!1,configurable:!0}),Resizable.prototype.getParentSize=function(){if(!this.parentNode)return this.window?{width:this.window.innerWidth,height:this.window.innerHeight}:{width:0,height:0};var base=this.appendBase();if(!base)return{width:0,height:0};var wrapChanged=!1,wrap=this.parentNode.style.flexWrap;"wrap"!==wrap&&(wrapChanged=!0,this.parentNode.style.flexWrap="wrap"),base.style.position="relative",base.style.minWidth="100%";var size={width:base.offsetWidth,height:base.offsetHeight};return wrapChanged&&(this.parentNode.style.flexWrap=wrap),this.removeBase(base),size},Resizable.prototype.bindEvents=function(){this.window&&(this.window.addEventListener("mouseup",this.onMouseUp),this.window.addEventListener("mousemove",this.onMouseMove),this.window.addEventListener("mouseleave",this.onMouseUp),this.window.addEventListener("touchmove",this.onMouseMove,{capture:!0,passive:!1}),this.window.addEventListener("touchend",this.onMouseUp))},Resizable.prototype.unbindEvents=function(){this.window&&(this.window.removeEventListener("mouseup",this.onMouseUp),this.window.removeEventListener("mousemove",this.onMouseMove),this.window.removeEventListener("mouseleave",this.onMouseUp),this.window.removeEventListener("touchmove",this.onMouseMove,!0),this.window.removeEventListener("touchend",this.onMouseUp))},Resizable.prototype.componentDidMount=function(){if(this.resizable&&this.window){var computedStyle=this.window.getComputedStyle(this.resizable);this.setState({width:this.state.width||this.size.width,height:this.state.height||this.size.height,flexBasis:"auto"!==computedStyle.flexBasis?computedStyle.flexBasis:void 0})}},Resizable.prototype.componentWillUnmount=function(){this.window&&this.unbindEvents()},Resizable.prototype.createSizeForCssProperty=function(newSize,kind){var propsSize=this.propsSize&&this.propsSize[kind];return"auto"!==this.state[kind]||this.state.original[kind]!==newSize||void 0!==propsSize&&"auto"!==propsSize?newSize:"auto"},Resizable.prototype.calculateNewMaxFromBoundary=function(maxWidth,maxHeight){var boundWidth,boundHeight,boundsByDirection=this.props.boundsByDirection,direction=this.state.direction,widthByDirection=boundsByDirection&&hasDirection("left",direction),heightByDirection=boundsByDirection&&hasDirection("top",direction);if("parent"===this.props.bounds){var parent_1=this.parentNode;parent_1&&(boundWidth=widthByDirection?this.resizableRight-this.parentLeft:parent_1.offsetWidth+(this.parentLeft-this.resizableLeft),boundHeight=heightByDirection?this.resizableBottom-this.parentTop:parent_1.offsetHeight+(this.parentTop-this.resizableTop))}else"window"===this.props.bounds?this.window&&(boundWidth=widthByDirection?this.resizableRight:this.window.innerWidth-this.resizableLeft,boundHeight=heightByDirection?this.resizableBottom:this.window.innerHeight-this.resizableTop):this.props.bounds&&(boundWidth=widthByDirection?this.resizableRight-this.targetLeft:this.props.bounds.offsetWidth+(this.targetLeft-this.resizableLeft),boundHeight=heightByDirection?this.resizableBottom-this.targetTop:this.props.bounds.offsetHeight+(this.targetTop-this.resizableTop));return boundWidth&&Number.isFinite(boundWidth)&&(maxWidth=maxWidth&&maxWidth<boundWidth?maxWidth:boundWidth),boundHeight&&Number.isFinite(boundHeight)&&(maxHeight=maxHeight&&maxHeight<boundHeight?maxHeight:boundHeight),{maxWidth,maxHeight}},Resizable.prototype.calculateNewSizeFromDirection=function(clientX,clientY){var scale=this.props.scale||1,resizeRatio=this.props.resizeRatio||1,_a=this.state,direction=_a.direction,original=_a.original,_b=this.props,lockAspectRatio=_b.lockAspectRatio,lockAspectRatioExtraHeight=_b.lockAspectRatioExtraHeight,lockAspectRatioExtraWidth=_b.lockAspectRatioExtraWidth,newWidth=original.width,newHeight=original.height,extraHeight=lockAspectRatioExtraHeight||0,extraWidth=lockAspectRatioExtraWidth||0;return hasDirection("right",direction)&&(newWidth=original.width+(clientX-original.x)*resizeRatio/scale,lockAspectRatio&&(newHeight=(newWidth-extraWidth)/this.ratio+extraHeight)),hasDirection("left",direction)&&(newWidth=original.width-(clientX-original.x)*resizeRatio/scale,lockAspectRatio&&(newHeight=(newWidth-extraWidth)/this.ratio+extraHeight)),hasDirection("bottom",direction)&&(newHeight=original.height+(clientY-original.y)*resizeRatio/scale,lockAspectRatio&&(newWidth=(newHeight-extraHeight)*this.ratio+extraWidth)),hasDirection("top",direction)&&(newHeight=original.height-(clientY-original.y)*resizeRatio/scale,lockAspectRatio&&(newWidth=(newHeight-extraHeight)*this.ratio+extraWidth)),{newWidth,newHeight}},Resizable.prototype.calculateNewSizeFromAspectRatio=function(newWidth,newHeight,max,min){var _a=this.props,lockAspectRatio=_a.lockAspectRatio,lockAspectRatioExtraHeight=_a.lockAspectRatioExtraHeight,lockAspectRatioExtraWidth=_a.lockAspectRatioExtraWidth,computedMinWidth=void 0===min.width?10:min.width,computedMaxWidth=void 0===max.width||max.width<0?newWidth:max.width,computedMinHeight=void 0===min.height?10:min.height,computedMaxHeight=void 0===max.height||max.height<0?newHeight:max.height,extraHeight=lockAspectRatioExtraHeight||0,extraWidth=lockAspectRatioExtraWidth||0;if(lockAspectRatio){var extraMinWidth=(computedMinHeight-extraHeight)*this.ratio+extraWidth,extraMaxWidth=(computedMaxHeight-extraHeight)*this.ratio+extraWidth,extraMinHeight=(computedMinWidth-extraWidth)/this.ratio+extraHeight,extraMaxHeight=(computedMaxWidth-extraWidth)/this.ratio+extraHeight,lockedMinWidth=Math.max(computedMinWidth,extraMinWidth),lockedMaxWidth=Math.min(computedMaxWidth,extraMaxWidth),lockedMinHeight=Math.max(computedMinHeight,extraMinHeight),lockedMaxHeight=Math.min(computedMaxHeight,extraMaxHeight);newWidth=clamp(newWidth,lockedMinWidth,lockedMaxWidth),newHeight=clamp(newHeight,lockedMinHeight,lockedMaxHeight)}else newWidth=clamp(newWidth,computedMinWidth,computedMaxWidth),newHeight=clamp(newHeight,computedMinHeight,computedMaxHeight);return{newWidth,newHeight}},Resizable.prototype.setBoundingClientRect=function(){if("parent"===this.props.bounds){var parent_2=this.parentNode;if(parent_2){var parentRect=parent_2.getBoundingClientRect();this.parentLeft=parentRect.left,this.parentTop=parentRect.top}}if(this.props.bounds&&"string"!=typeof this.props.bounds){var targetRect=this.props.bounds.getBoundingClientRect();this.targetLeft=targetRect.left,this.targetTop=targetRect.top}if(this.resizable){var _a=this.resizable.getBoundingClientRect(),left=_a.left,top_1=_a.top,right=_a.right,bottom=_a.bottom;this.resizableLeft=left,this.resizableRight=right,this.resizableTop=top_1,this.resizableBottom=bottom}},Resizable.prototype.onResizeStart=function(event,direction){if(this.resizable&&this.window){var flexBasis,clientX=0,clientY=0;if(event.nativeEvent&&function(event){return Boolean((event.clientX||0===event.clientX)&&(event.clientY||0===event.clientY))}(event.nativeEvent)){if(clientX=event.nativeEvent.clientX,clientY=event.nativeEvent.clientY,3===event.nativeEvent.which)return}else event.nativeEvent&&isTouchEvent(event.nativeEvent)&&(clientX=event.nativeEvent.touches[0].clientX,clientY=event.nativeEvent.touches[0].clientY);if(this.props.onResizeStart)if(this.resizable)if(!1===this.props.onResizeStart(event,direction,this.resizable))return;this.props.size&&(void 0!==this.props.size.height&&this.props.size.height!==this.state.height&&this.setState({height:this.props.size.height}),void 0!==this.props.size.width&&this.props.size.width!==this.state.width&&this.setState({width:this.props.size.width})),this.ratio="number"==typeof this.props.lockAspectRatio?this.props.lockAspectRatio:this.size.width/this.size.height;var computedStyle=this.window.getComputedStyle(this.resizable);if("auto"!==computedStyle.flexBasis){var parent_3=this.parentNode;if(parent_3){var dir=this.window.getComputedStyle(parent_3).flexDirection;this.flexDir=dir.startsWith("row")?"row":"column",flexBasis=computedStyle.flexBasis}}this.setBoundingClientRect(),this.bindEvents();var state={original:{x:clientX,y:clientY,width:this.size.width,height:this.size.height},isResizing:!0,backgroundStyle:lib_assign(lib_assign({},this.state.backgroundStyle),{cursor:this.window.getComputedStyle(event.target).cursor||"auto"}),direction,flexBasis};this.setState(state)}},Resizable.prototype.onMouseMove=function(event){if(this.state.isResizing&&this.resizable&&this.window){if(this.window.TouchEvent&&isTouchEvent(event))try{event.preventDefault(),event.stopPropagation()}catch(e){}var _a=this.props,maxWidth=_a.maxWidth,maxHeight=_a.maxHeight,minWidth=_a.minWidth,minHeight=_a.minHeight,clientX=isTouchEvent(event)?event.touches[0].clientX:event.clientX,clientY=isTouchEvent(event)?event.touches[0].clientY:event.clientY,_b=this.state,direction=_b.direction,original=_b.original,width=_b.width,height=_b.height,parentSize=this.getParentSize(),max=calculateNewMax(parentSize,this.window.innerWidth,this.window.innerHeight,maxWidth,maxHeight,minWidth,minHeight);maxWidth=max.maxWidth,maxHeight=max.maxHeight,minWidth=max.minWidth,minHeight=max.minHeight;var _c=this.calculateNewSizeFromDirection(clientX,clientY),newHeight=_c.newHeight,newWidth=_c.newWidth,boundaryMax=this.calculateNewMaxFromBoundary(maxWidth,maxHeight),newSize=this.calculateNewSizeFromAspectRatio(newWidth,newHeight,{width:boundaryMax.maxWidth,height:boundaryMax.maxHeight},{width:minWidth,height:minHeight});if(newWidth=newSize.newWidth,newHeight=newSize.newHeight,this.props.grid){var newGridWidth=snap(newWidth,this.props.grid[0]),newGridHeight=snap(newHeight,this.props.grid[1]),gap=this.props.snapGap||0;newWidth=0===gap||Math.abs(newGridWidth-newWidth)<=gap?newGridWidth:newWidth,newHeight=0===gap||Math.abs(newGridHeight-newHeight)<=gap?newGridHeight:newHeight}this.props.snap&&this.props.snap.x&&(newWidth=findClosestSnap(newWidth,this.props.snap.x,this.props.snapGap)),this.props.snap&&this.props.snap.y&&(newHeight=findClosestSnap(newHeight,this.props.snap.y,this.props.snapGap));var delta={width:newWidth-original.width,height:newHeight-original.height};if(width&&"string"==typeof width)if(endsWith(width,"%"))newWidth=newWidth/parentSize.width*100+"%";else if(endsWith(width,"vw")){newWidth=newWidth/this.window.innerWidth*100+"vw"}else if(endsWith(width,"vh")){newWidth=newWidth/this.window.innerHeight*100+"vh"}if(height&&"string"==typeof height)if(endsWith(height,"%"))newHeight=newHeight/parentSize.height*100+"%";else if(endsWith(height,"vw")){newHeight=newHeight/this.window.innerWidth*100+"vw"}else if(endsWith(height,"vh")){newHeight=newHeight/this.window.innerHeight*100+"vh"}var newState={width:this.createSizeForCssProperty(newWidth,"width"),height:this.createSizeForCssProperty(newHeight,"height")};"row"===this.flexDir?newState.flexBasis=newState.width:"column"===this.flexDir&&(newState.flexBasis=newState.height),this.setState(newState),this.props.onResize&&this.props.onResize(event,direction,this.resizable,delta)}},Resizable.prototype.onMouseUp=function(event){var _a=this.state,isResizing=_a.isResizing,direction=_a.direction,original=_a.original;if(isResizing&&this.resizable){var delta={width:this.size.width-original.width,height:this.size.height-original.height};this.props.onResizeStop&&this.props.onResizeStop(event,direction,this.resizable,delta),this.props.size&&this.setState(this.props.size),this.unbindEvents(),this.setState({isResizing:!1,backgroundStyle:lib_assign(lib_assign({},this.state.backgroundStyle),{cursor:"auto"})})}},Resizable.prototype.updateSize=function(size){this.setState({width:size.width,height:size.height})},Resizable.prototype.renderResizer=function(){var _this=this,_a=this.props,enable=_a.enable,handleStyles=_a.handleStyles,handleClasses=_a.handleClasses,handleWrapperStyle=_a.handleWrapperStyle,handleWrapperClass=_a.handleWrapperClass,handleComponent=_a.handleComponent;if(!enable)return null;var resizers=Object.keys(enable).map((function(dir){return!1!==enable[dir]?react.createElement(Resizer,{key:dir,direction:dir,onResizeStart:_this.onResizeStart,replaceStyles:handleStyles&&handleStyles[dir],className:handleClasses&&handleClasses[dir]},handleComponent&&handleComponent[dir]?handleComponent[dir]:null):null}));return react.createElement("div",{className:handleWrapperClass,style:handleWrapperStyle},resizers)},Resizable.prototype.render=function(){var _this=this,extendsProps=Object.keys(this.props).reduce((function(acc,key){return-1!==definedProps.indexOf(key)||(acc[key]=_this.props[key]),acc}),{}),style=lib_assign(lib_assign(lib_assign({position:"relative",userSelect:this.state.isResizing?"none":"auto"},this.props.style),this.sizeStyle),{maxWidth:this.props.maxWidth,maxHeight:this.props.maxHeight,minWidth:this.props.minWidth,minHeight:this.props.minHeight,boxSizing:"border-box",flexShrink:0});this.state.flexBasis&&(style.flexBasis=this.state.flexBasis);var Wrapper=this.props.as||"div";return react.createElement(Wrapper,lib_assign({ref:this.ref,style,className:this.props.className},extendsProps),this.state.isResizing&&react.createElement("div",{style:this.state.backgroundStyle}),this.props.children,this.renderResizer())},Resizable.defaultProps={as:"div",onResizeStart:function(){},onResize:function(){},onResizeStop:function(){},enable:{top:!0,right:!0,bottom:!0,left:!0,topRight:!0,bottomRight:!0,bottomLeft:!0,topLeft:!0},style:{},grid:[1,1],lockAspectRatio:!1,lockAspectRatioExtraWidth:0,lockAspectRatioExtraHeight:0,scale:1,resizeRatio:1,snapGap:0},Resizable}(react.PureComponent)}}]);