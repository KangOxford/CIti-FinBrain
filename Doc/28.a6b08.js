(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{1628:function(t,e,n){"use strict";n.r(e);var r,o=n(1),a=n.n(o),i=n(4),c=n(79),l=n(1203),u=n.n(l),p=(n(1200),n(145),n(25)),f=n.n(p),s=(n(68),n(1216)),h=n.n(s),d=(n(1215),n(14)),y=n(555),b=n.n(y),w=(n(554),function(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}),v=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object(d.a)(f.a).withConfig({displayName:"ClickableIcon"})(m||(m=w(["\n  :hover {\n  cursor: pointer;\n\n  }\n    float: right;\n"],["\n  :hover {\n  cursor: pointer;\n\n  }\n    float: right;\n"])));var m,g,O,j,_=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={opened:!1},t.onOpen=function(){t.setState({opened:!t.state.opened})},t}return v(t,e),t.prototype.render=function(){var t,e=this.props.news,n=e.title,r=e.content,o=e.time;return a.a.createElement(b.a,{style:{width:"100%"},title:a.a.createElement(a.a.Fragment,null,n,a.a.createElement("small",{style:{marginLeft:"24px"}},"发布于 ",o)),extra:a.a.createElement("a",{onClick:this.onOpen},this.state.opened?"收回":"更多"),hoverable:!0},this.state.opened?r:(t=r).length<=20?t:t.substr(0,20)+"...")},t}(a.a.PureComponent),P=function(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t},k=(g=function(t,e){return(g=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}g(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),E=function(t,e,n,r){var o,a=arguments.length,i=a<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,e,n,r);else for(var c=t.length-1;0<=c;c--)(o=t[c])&&(i=(a<3?o(i):3<a?o(e,n,i):o(e,n))||i);return 3<a&&i&&Object.defineProperty(e,n,i),i},x=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)},C=function(a,i,c,l){return new(c||(c=Promise))(function(t,e){function n(t){try{o(l.next(t))}catch(t){e(t)}}function r(t){try{o(l.throw(t))}catch(t){e(t)}}function o(e){e.done?t(e.value):new c(function(t){t(e.value)}).then(n,r)}o((l=l.apply(a,i||[])).next())})},S=function(n,r){var o,a,i,t,c={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return t={next:e(0),throw:e(1),return:e(2)},"function"==typeof Symbol&&(t[Symbol.iterator]=function(){return this}),t;function e(e){return function(t){return function(e){if(o)throw new TypeError("Generator is already executing.");for(;c;)try{if(o=1,a&&(i=2&e[0]?a.return:e[0]?a.throw||((i=a.return)&&i.call(a),0):a.next)&&!(i=i.call(a,e[1])).done)return i;switch(a=0,i&&(e=[2&e[0],i.value]),e[0]){case 0:case 1:i=e;break;case 4:return c.label++,{value:e[1],done:!1};case 5:c.label++,a=e[1],e=[0];continue;case 7:e=c.ops.pop(),c.trys.pop();continue;default:if(!(i=0<(i=c.trys).length&&i[i.length-1])&&(6===e[0]||2===e[0])){c=0;continue}if(3===e[0]&&(!i||e[1]>i[0]&&e[1]<i[3])){c.label=e[1];break}if(6===e[0]&&c.label<i[1]){c.label=i[1],i=e;break}if(i&&c.label<i[2]){c.label=i[2],c.ops.push(e);break}i[2]&&c.ops.pop(),c.trys.pop();continue}e=r.call(n,c)}catch(t){e=[6,t],a=0}finally{o=i=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,done:!0}}([e,t])}}},R=(u.a.Panel,Object(d.a)(f.a).withConfig({displayName:"ClickableIcon"})(O||(O=P(["\n  float: right;\n  :hover {\n    cursor: pointer;\n  }\n"],["\n  float: right;\n  :hover {\n    cursor: pointer;\n  }\n"])))),D=(d.a.h3.withConfig({displayName:"NewsTitle"})(j||(j=P(["\n   small {\n    margin-left: 16px;\n   }\n"],["\n   small {\n    margin-left: 16px;\n   }\n"]))),function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.state={loading:!1,data:[]},t.loadData=function(){return C(t,void 0,void 0,function(){var e;return S(this,function(t){switch(t.label){case 0:return this.setState({loading:!0}),[4,this.quotationService.getNews()];case 1:return e=t.sent(),this.setState({loading:!1,data:e}),[2]}})})},t}var n;return k(t,e),t.prototype.componentDidMount=function(){this.loadData()},t.prototype.render=function(){var t=this.state,e=t.loading,n=t.data;return a.a.createElement("div",null,a.a.createElement(h.a,{dataSource:n,renderItem:function(t,e){return a.a.createElement(h.a.Item,{key:e},a.a.createElement(_,{news:t}))},loading:e,header:a.a.createElement("h1",null,"新闻列表 ",a.a.createElement(R,{type:"reload",spin:e,onClick:this.loadData})),pagination:{position:"bottom"}}))},E([i.Inject,x("design:type","function"==typeof(n=void 0!==c.a&&c.a)?n:Object)],t.prototype,"quotationService",void 0),t}(a.a.Component));e.default=D}}]);