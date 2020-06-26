(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{1203:function(t,e,n){"use strict";n.d(e,"a",function(){return d});var i,r=n(0),a=n.n(r),o=n(696),s=n(583),l=n.n(s),h=n(1204),u=n.n(h),c=(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),d=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.ds=new l.a({state:{start:"2018-09-10",end:"2018-10-23"}}),e.onChange=function(t){var n=t.startText,i=t.endText;e.ds.setState("start",n),e.ds.setState("end",i)},e}return c(e,t),e.prototype.render=function(){var t=this,e=(l.a.DataView,this.props.data),n=this.ds.createView();return n.source(e).transform({type:"filter",callback:function(e){var n=e.time;return n<=t.ds.state.end&&n>=t.ds.state.start}}).transform({type:"map",callback:function(t){return t.trend=t.start<=t.end?"上涨":"下跌",t.range=[t.start,t.end,t.max,t.min],t}}),a.a.createElement("div",null,a.a.createElement(o.Chart,{height:600,animate:!1,padding:[30,60,40,80],data:n,scale:{time:{type:"timeCat",nice:!1,range:[0,1]},trend:{values:["上涨","下跌"]},volume:{alias:"成交量"},start:{alias:"开盘价"},end:{alias:"收盘价"},max:{alias:"最高价"},min:{alias:"最低价"},range:{alias:"股票价格"}},forceFit:!0},a.a.createElement(o.Legend,null),a.a.createElement(o.Tooltip,{showTitle:!1,itemTpl:'<li data-index={index}><span style="background-color:{color};"\r\n              class="g2-tooltip-marker"></span>{name}{value}</li>'}),a.a.createElement(o.View,{end:{x:1,y:.5},data:n},a.a.createElement(o.Axis,{name:"time"}),a.a.createElement(o.Axis,{name:"range"}),a.a.createElement(o.Geom,{type:"schema",position:"time*range",color:["trend",function(t){return"上涨"===t?"#f04864":"下跌"===t?"#2fc25b":"#ffffff"}],tooltip:["time*start*end*max*min",function(t,e,n,i,r){return{name:t,value:'<br><span style="padding-left: 16px">开盘价：'+e+'</span><br/><span style="padding-left: 16px">收盘价：'+n+'</span><br/><span style="padding-left: 16px">最高价：'+i+'</span><br/><span style="padding-left: 16px">最低价：'+r+"</span>"}}],shape:"candle"})),a.a.createElement(o.View,{start:{x:0,y:.65},data:n,scale:{volume:{tickCount:2}}},a.a.createElement(o.Axis,{name:"volume",label:{formatter:function(t){return parseInt(t,10)/1e3+"k"}}}),a.a.createElement(o.Axis,{name:"time",tickLine:null,label:null}),a.a.createElement(o.Geom,{type:"interval",position:"time*volume",color:["trend",function(t){return"上涨"===t?"#f04864":"下跌"===t?"#2fc25b":"#ffffff"}],tooltip:["time*volume",function(t,e){return{name:t,value:'<br/><span style="padding-left: 16px">成交量：'+e+"</span><br/>"}}],shape:"candle"}))),a.a.createElement("div",null,a.a.createElement(u.a,{padding:[40,80,40,80],width:"auto",start:this.ds.state.start,end:this.ds.state.end,xAxis:"time",yAxis:"volume",data:e,onChange:this.onChange})))},e}(a.a.Component)},1204:function(t,e,n){"use strict";var i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),a=h(n(1205)),o=n(0),s=h(o),l=h(n(1208));function h(t){return t&&t.__esModule?t:{default:t}}function u(t,e){var n={};for(var i in t)e.indexOf(i)>=0||Object.prototype.hasOwnProperty.call(t,i)&&(n[i]=t[i]);return n}function c(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function d(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function p(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var f=["width","height","padding","xAis","yAxis","start","end","fillerStyle","backgroundStyle","scales","textStyle","handleStyle","backgroundChart"];var g=function(t){function e(){c(this,e);var t=d(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return t.refHandle=function(e){t.container||(t.container=e)},t.reBuild=!1,t}return p(e,o.Component),r(e,[{key:"componentDidMount",value:function(){this.createG2Instance().render()}},{key:"componentWillReceiveProps",value:function(t){var e=this.props,n=e.data,i=u(e,["data"]),r=t.data,a=u(t,["data"]);n!==r&&(this.slider.changeData(r),this.slider.repaint()),function(t,e){if(t.onChange!==e.onChange)return!0;for(var n=0;n<f.length;n+=1){var i=f[n];if(!window.G2.Util.isEqual(t[i],e[i]))return!0}return!1}(i,a)&&(this.reBuild=!0)}},{key:"componentDidUpdate",value:function(){this.reBuild&&(this.slider.destroy(),this.createG2Instance().render(),this.reBuild=!1)}},{key:"componentWillUnmount",value:function(){this.slider.destroy()}},{key:"createG2Instance",value:function(){return this.slider=new a.default(i({container:this.container},this.props)),this.slider}},{key:"render",value:function(){return s.default.createElement("div",{ref:this.refHandle})}}]),e}(),m=function(t){function e(){return c(this,e),d(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return p(e,o.Component),r(e,[{key:"render",value:function(){return s.default.createElement(l.default,null,s.default.createElement(g,this.props))}}]),e}();e.default=m,t.exports=e.default},1205:function(t,e,n){var i=n(1206);window&&!window.G2&&console.err("Please load the G2 script first!"),t.exports=i},1206:function(t,e,n){var i=n(1207),r=window&&window.G2,a=r.Chart,o=r.Util,s=r.G,l=r.Global,h=s.Canvas,u=o.DomUtil,c=function(t){return"number"==typeof t},d=function(){function t(t){this._initProps(),o.deepMix(this,t);var e=this.container;if(!e)throw new Error("Please specify the container for the Slider!");o.isString(e)?this.domContainer=document.getElementById(e):this.domContainer=e,this.handleStyle=o.mix({width:this.height,height:this.height},this.handleStyle),"auto"===this.width&&window.addEventListener("resize",o.wrapBehavior(this,"_initForceFitEvent"))}return t.prototype._initProps=function(){this.height=26,this.width="auto",this.padding=l.plotCfg.padding,this.container=null,this.xAxis=null,this.yAxis=null,this.fillerStyle={fill:"#BDCCED",fillOpacity:.3},this.backgroundStyle={stroke:"#CCD6EC",fill:"#CCD6EC",fillOpacity:.3,lineWidth:1},this.range=[0,100],this.layout="horizontal",this.textStyle={fill:"#545454"},this.handleStyle={img:"https://gw.alipayobjects.com/zos/rmsportal/QXtfhORGlDuRvLXFzpsQ.png",width:5},this.backgroundChart={type:["area"],color:"#CCD6EC"}},t.prototype._initForceFitEvent=function(){var t=setTimeout(o.wrapBehavior(this,"forceFit"),200);clearTimeout(this.resizeTimer),this.resizeTimer=t},t.prototype.forceFit=function(){if(this&&!this.destroyed){var t=u.getWidth(this.domContainer),e=this.height;if(t!==this.domWidth){var n=this.canvas;n.changeSize(t,e),this.bgChart&&this.bgChart.changeWidth(t),n.clear(),this._initWidth(),this._initSlider(),this._bindEvent(),n.draw()}}},t.prototype._initWidth=function(){var t;t="auto"===this.width?u.getWidth(this.domContainer):this.width,this.domWidth=t;var e=o.toAllPadding(this.padding);"horizontal"===this.layout?(this.plotWidth=t-e[1]-e[3],this.plotPadding=e[3],this.plotHeight=this.height):"vertical"===this.layout&&(this.plotWidth=this.width,this.plotHeight=this.height-e[0]-e[2],this.plotPadding=e[0])},t.prototype.render=function(){this._initWidth(),this._initCanvas(),this._initBackground(),this._initSlider(),this._bindEvent(),this.canvas.draw()},t.prototype.changeData=function(t){this.data=t,this.repaint()},t.prototype.destroy=function(){clearTimeout(this.resizeTimer),this.rangeElement.off("sliderchange"),this.bgChart&&this.bgChart.destroy(),this.canvas.destroy();for(var t=this.domContainer;t.hasChildNodes();)t.removeChild(t.firstChild);window.removeEventListener("resize",o.getWrapBehavior(this,"_initForceFitEvent")),this.destroyed=!0},t.prototype.clear=function(){this.canvas.clear(),this.bgChart&&this.bgChart.destroy(),this.bgChart=null,this.scale=null,this.canvas.draw()},t.prototype.repaint=function(){this.clear(),this.render()},t.prototype._initCanvas=function(){var t=this.domWidth,e=this.height,n=new h({width:t,height:e,containerDOM:this.domContainer,capture:!1}),i=n.get("el");i.style.position="absolute",i.style.top=0,i.style.left=0,i.style.zIndex=3,this.canvas=n},t.prototype._initBackground=function(){var t,e=this.data,n=this.xAxis,i=this.yAxis,r=o.deepMix(((t={})[""+n]={range:[0,1]},t),this.scales);if(!e)throw new Error("Please specify the data!");if(!n)throw new Error("Please specify the xAxis!");if(!i)throw new Error("Please specify the yAxis!");var s=this.backgroundChart,l=s.type,h=s.color;o.isArray(l)||(l=[l]);var u=o.toAllPadding(this.padding),c=new a({container:this.container,width:this.domWidth,height:this.height,padding:[0,u[1],0,u[3]],animate:!1});c.source(e),c.scale(r),c.axis(!1),c.tooltip(!1),c.legend(!1),o.each(l,function(t){c[t]().position(n+"*"+i).color(h).opacity(1)}),c.render(),this.bgChart=c,this.scale="horizontal"===this.layout?c.getXScale():c.getYScales()[0],"vertical"===this.layout&&c.destroy()},t.prototype._initRange=function(){var t=this.startRadio,e=this.endRadio,n=this.start,i=this.end,r=this.scale,a=0,o=1;c(t)?a=t:n&&(a=r.scale(r.translate(n))),c(e)?o=e:i&&(o=r.scale(r.translate(i)));var s=this.minSpan,l=this.maxSpan,h=0;if("time"===r.type||"timeCat"===r.type){var u=r.values,d=u[0];h=u[u.length-1]-d}else r.isLinear&&(h=r.max-r.min);h&&s&&(this.minRange=s/h*100),h&&l&&(this.maxRange=l/h*100);var p=[100*a,100*o];return this.range=p,p},t.prototype._getHandleValue=function(t){var e=this.range,n=e[0]/100,i=e[1]/100,r=this.scale;return"min"===t?this.start?this.start:r.invert(n):this.end?this.end:r.invert(i)},t.prototype._initSlider=function(){var t=this.canvas,e=this._initRange(),n=this.scale,r=t.addGroup(i,{middleAttr:this.fillerStyle,range:e,minRange:this.minRange,maxRange:this.maxRange,layout:this.layout,width:this.plotWidth,height:this.plotHeight,backgroundStyle:this.backgroundStyle,textStyle:this.textStyle,handleStyle:this.handleStyle,minText:n.getText(this._getHandleValue("min")),maxText:n.getText(this._getHandleValue("max"))});"horizontal"===this.layout?r.translate(this.plotPadding,0):"vertical"===this.layout&&r.translate(0,this.plotPadding),this.rangeElement=r},t.prototype._bindEvent=function(){var t=this;t.rangeElement.on("sliderchange",function(e){var n=e.range,i=n[0]/100,r=n[1]/100;t._updateElement(i,r)})},t.prototype._updateElement=function(t,e){var n=this.scale,i=this.rangeElement,r=i.get("minTextElement"),a=i.get("maxTextElement"),o=n.invert(t),s=n.invert(e),l=n.getText(o),h=n.getText(s);r.attr("text",l),a.attr("text",h),this.start=l,this.end=h,this.onChange&&this.onChange({startText:l,endText:h,startValue:o,endValue:s,startRadio:t,endRadio:e})},t}();t.exports=d},1207:function(t,e){var n,i=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function i(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)}),r=window&&window.G2,a=r.Util,o=r.G.Group,s=a.DomUtil,l=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return i(e,t),e.prototype.getDefaultCfg=function(){return{range:null,middleAttr:null,backgroundElement:null,minHandleElement:null,maxHandleElement:null,middleHandleElement:null,currentTarget:null,layout:"vertical",width:null,height:null,pageX:null,pageY:null}},e.prototype._initHandle=function(t){var e,n,i,r=this.addGroup(),o=this.get("layout"),s=this.get("handleStyle"),l=s.img,h=s.width,u=s.height;if("horizontal"===o){var c=s.width;i="ew-resize",n=r.addShape("Image",{attrs:{x:-c/2,y:0,width:c,height:u,img:l,cursor:i}}),e=r.addShape("Text",{attrs:a.mix({x:"min"===t?-(c/2+5):c/2+5,y:u/2,textAlign:"min"===t?"end":"start",textBaseline:"middle",text:"min"===t?this.get("minText"):this.get("maxText"),cursor:i},this.get("textStyle"))})}else i="ns-resize",n=r.addShape("Image",{attrs:{x:0,y:-u/2,width:h,height:u,img:l,cursor:i}}),e=r.addShape("Text",{attrs:a.mix({x:h/2,y:"min"===t?u/2+5:-(u/2+5),textAlign:"center",textBaseline:"middle",text:"min"===t?this.get("minText"):this.get("maxText"),cursor:i},this.get("textStyle"))});return this.set(t+"TextElement",e),this.set(t+"IconElement",n),r},e.prototype._initSliderBackground=function(){var t=this.addGroup();return t.initTransform(),t.translate(0,0),t.addShape("Rect",{attrs:a.mix({x:0,y:0,width:this.get("width"),height:this.get("height")},this.get("backgroundStyle"))}),t},e.prototype._beforeRenderUI=function(){var t=this._initSliderBackground(),e=this._initHandle("min"),n=this._initHandle("max"),i=this.addShape("rect",{attrs:this.get("middleAttr")});this.set("middleHandleElement",i),this.set("minHandleElement",e),this.set("maxHandleElement",n),this.set("backgroundElement",t),t.set("zIndex",0),i.set("zIndex",1),e.set("zIndex",2),n.set("zIndex",2),i.attr("cursor","move"),this.sort()},e.prototype._renderUI=function(){"horizontal"===this.get("layout")?this._renderHorizontal():this._renderVertical()},e.prototype._transform=function(t){var e=this.get("range"),n=e[0]/100,i=e[1]/100,r=this.get("width"),a=this.get("height"),o=this.get("minHandleElement"),s=this.get("maxHandleElement"),l=this.get("middleHandleElement");o.resetMatrix?(o.resetMatrix(),s.resetMatrix()):(o.initTransform(),s.initTransform()),"horizontal"===t?(l.attr({x:r*n,y:0,width:(i-n)*r,height:a}),o.translate(n*r,0),s.translate(i*r,0)):(l.attr({x:0,y:a*(1-i),width:r,height:(i-n)*a}),o.translate(0,(1-n)*a),s.translate(0,(1-i)*a))},e.prototype._renderHorizontal=function(){this._transform("horizontal")},e.prototype._renderVertical=function(){this._transform("vertical")},e.prototype._bindUI=function(){this.on("mousedown",a.wrapBehavior(this,"_onMouseDown"))},e.prototype._isElement=function(t,e){var n=this.get(e);return t===n||!!n.isGroup&&n.get("children").indexOf(t)>-1},e.prototype._getRange=function(t,e){var n=t+e;return n=(n=n>100?100:n)<0?0:n},e.prototype._limitRange=function(t,e,n){n[0]=this._getRange(t,n[0]),n[1]=n[0]+e,n[1]>100&&(n[1]=100,n[0]=n[1]-e)},e.prototype._updateStatus=function(t,e){var n="x"===t?this.get("width"):this.get("height");t=a.upperFirst(t);var i,r=this.get("range"),o=this.get("page"+t),s=this.get("currentTarget"),l=this.get("rangeStash"),h="vertical"===this.get("layout")?-1:1,u=e["page"+t],c=(u-o)/n*100*h,d=this.get("minRange"),p=this.get("maxRange");r[1]<=r[0]?(this._isElement(s,"minHandleElement")||this._isElement(s,"maxHandleElement"))&&(r[0]=this._getRange(c,r[0]),r[1]=this._getRange(c,r[0])):(this._isElement(s,"minHandleElement")&&(r[0]=this._getRange(c,r[0]),d&&r[1]-r[0]<=d&&this._limitRange(c,d,r),p&&r[1]-r[0]>=p&&this._limitRange(c,p,r)),this._isElement(s,"maxHandleElement")&&(r[1]=this._getRange(c,r[1]),d&&r[1]-r[0]<=d&&this._limitRange(c,d,r),p&&r[1]-r[0]>=p&&this._limitRange(c,p,r))),this._isElement(s,"middleHandleElement")&&(i=l[1]-l[0],this._limitRange(c,i,r)),this.emit("sliderchange",{range:r}),this.set("page"+t,u),this._renderUI(),this.get("canvas").draw()},e.prototype._onMouseDown=function(t){var e=t.currentTarget,n=t.event,i=this.get("range");n.stopPropagation(),n.preventDefault(),this.set("pageX",n.pageX),this.set("pageY",n.pageY),this.set("currentTarget",e),this.set("rangeStash",[i[0],i[1]]),this._bindCanvasEvents()},e.prototype._bindCanvasEvents=function(){var t=this.get("canvas").get("containerDOM");this.onMouseMoveListener=s.addEventListener(t,"mousemove",a.wrapBehavior(this,"_onCanvasMouseMove")),this.onMouseUpListener=s.addEventListener(t,"mouseup",a.wrapBehavior(this,"_onCanvasMouseUp")),this.onMouseLeaveListener=s.addEventListener(t,"mouseleave",a.wrapBehavior(this,"_onCanvasMouseUp"))},e.prototype._onCanvasMouseMove=function(t){"horizontal"===this.get("layout")?this._updateStatus("x",t):this._updateStatus("y",t)},e.prototype._onCanvasMouseUp=function(){this._removeDocumentEvents()},e.prototype._removeDocumentEvents=function(){this.onMouseMoveListener.remove(),this.onMouseUpListener.remove(),this.onMouseLeaveListener.remove()},e}(o);t.exports=l},1208:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i,r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),a=n(0),o=(i=a)&&i.__esModule?i:{default:i};var s=function(t){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e);var n=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t));return n.state={hasError:!1},n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,o.default.Component),r(e,[{key:"componentDidCatch",value:function(t,e){this.setState({hasError:!0})}},{key:"unstable_handleError",value:function(t,e){this.setState({hasError:!0})}},{key:"render",value:function(){return this.state.hasError?o.default.createElement("h1",null,"Slider error."):this.props.children}}]),e}();e.default=s},1553:function(t,e,n){"use strict";n.r(e);var i,r=n(0),a=n.n(r),o=n(4),s=(n(534),n(529),n(543)),l=n.n(s),h=(n(542),n(82)),u=n(1203),c=n(96),d=n(149),p=(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),f=function(t,e,n,i){var r,a=arguments.length,o=a<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(o=(a<3?r(o):a>3?r(e,n,o):r(e,n))||o);return a>3&&o&&Object.defineProperty(e,n,o),o},g=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},m=function(t,e,n,i){return new(n||(n=Promise))(function(r,a){function o(t){try{l(i.next(t))}catch(t){a(t)}}function s(t){try{l(i.throw(t))}catch(t){a(t)}}function l(t){t.done?r(t.value):new n(function(e){e(t.value)}).then(o,s)}l((i=i.apply(t,e||[])).next())})},y=function(t,e){var n,i,r,a,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(n)throw new TypeError("Generator is already executing.");for(;o;)try{if(n=1,i&&(r=2&a[0]?i.return:a[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,a[1])).done)return r;switch(i=0,r&&(a=[2&a[0],r.value]),a[0]){case 0:case 1:r=a;break;case 4:return o.label++,{value:a[1],done:!1};case 5:o.label++,i=a[1],a=[0];continue;case 7:a=o.ops.pop(),o.trys.pop();continue;default:if(!(r=(r=o.trys).length>0&&r[r.length-1])&&(6===a[0]||2===a[0])){o=0;continue}if(3===a[0]&&(!r||a[1]>r[0]&&a[1]<r[3])){o.label=a[1];break}if(6===a[0]&&o.label<r[1]){o.label=r[1],r=a;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(a);break}r[2]&&o.ops.pop(),o.trys.pop();continue}a=e.call(t,o)}catch(t){a=[6,t],i=0}finally{n=r=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}},v=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.renderItem=function(){return m(e,void 0,void 0,function(){var t;return y(this,function(e){switch(e.label){case 0:return[4,this.quotationService.getGoodsQuotationData()];case 1:return t=e.sent(),[2,a.a.createElement(l.a,null,a.a.createElement("h1",null,"原油现货 商品市场表现"),a.a.createElement(u.a,{data:t}))]}})})},e}var n;return p(e,t),e.prototype.render=function(){return a.a.createElement(c.a,{render:this.renderItem,componentWhenLoading:a.a.createElement(d.a,null)})},f([o.Inject,g("design:type","function"==typeof(n=void 0!==h.a&&h.a)?n:Object)],e.prototype,"quotationService",void 0),e}(a.a.Component);e.default=v},529:function(t,e,n){"use strict";n(34),n(563)},534:function(t,e,n){"use strict";n(34),n(563)}}]);