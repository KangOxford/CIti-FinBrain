(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{1197:function(t,n,e){"use strict";var o,r=e(0),c=e.n(r),i=e(4),a=e(50),s=e(7),p=(e(70),e(83),e(41)),u=e.n(p),h=(e(99),e(23)),d=(o=function(t,n){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(t,n)},function(t,n){function e(){this.constructor=t}o(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}),l=function(t,n,e,o){var r,c=arguments.length,i=c<3?n:null===o?o=Object.getOwnPropertyDescriptor(n,e):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(t,n,e,o);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(i=(c<3?r(i):c>3?r(n,e,i):r(n,e))||i);return c>3&&i&&Object.defineProperty(n,e,i),i},f=function(t,n){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,n)},m=(u.a.Sider,function(t){function n(){return null!==t&&t.apply(this,arguments)||this}var e,o;return d(n,t),n.prototype.componentDidMount=function(){this.navStore.sidenavs=this.props.routes},n.prototype.componentWillUnmount=function(){this.navStore.sidenavs=null},n.prototype.render=function(){return this.props.children},l([i.Inject,f("design:type","function"==typeof(e=void 0!==a.a&&a.a)?e:Object)],n.prototype,"navStore",void 0),l([i.Inject,f("design:type","function"==typeof(o=void 0!==h.a&&h.a)?o:Object)],n.prototype,"routerStore",void 0),l([s.action,f("design:type",Function),f("design:paramtypes",[]),f("design:returntype",void 0)],n.prototype,"componentDidMount",null),l([s.action,f("design:type",Function),f("design:paramtypes",[]),f("design:returntype",void 0)],n.prototype,"componentWillUnmount",null),n}(c.a.Component));n.a=m},1554:function(t,n,e){"use strict";e.r(n);var o=e(0),r=e.n(o),c=e(71),i=e(1372),a=e(147),s=e(1197),p=e(35),u=e(67),h=function(){return(h=Object.assign||function(t){for(var n,e=1,o=arguments.length;e<o;e++)for(var r in n=arguments[e])Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r]);return t}).apply(this,arguments)};function d(t){return t.split("/").filter(function(t){return!!t}).slice(2).join("/")}var l=Object(p.c)().invreq.detail.bought,f=[{path:"",component:Promise.all([e.e(0),e.e(1),e.e(2),e.e(3),e.e(15)]).then(e.bind(null,1571)),match:function(t){return!d(t)},iconName:"area-chart",exact:!0},{path:"stock",textId:l.stock._root,component:e.e(57).then(e.bind(null,1557)),match:function(t){return d(t).startsWith("stock")},iconName:"line-chart",exact:!1,children:[{path:"stock/",match:function(t){return"stock"===d(t)},iconName:"line-chart",textId:l.stock._root},{path:"stock/perform",match:function(t){return d(t).startsWith("stock/perform")},iconName:"line-chart",textId:l.stock.perform},{path:"stock/attribute",match:function(t){return d(t).startsWith("stock/attribute")},iconName:"eye",textId:l.stock.attribute},{path:"stock/scenario",match:function(t){return d(t).startsWith("stock/scenario")},iconName:"radar-chart",textId:l.stock.scenario}]},{path:"bond",component:e.e(52).then(e.bind(null,1558)),match:function(t){return d(t).startsWith("bond")},iconName:"bar-chart",textId:l.bond._root,exact:!1,children:[{path:"bond/",match:function(t){return"bond"===d(t)},iconName:"bar-chart",textId:l.bond._root},{path:"bond/credit",match:function(t){return d(t).startsWith("bond/credit")},iconName:"bar-chart",textId:l.bond.credit},{path:"bond/rate",match:function(t){return d(t).startsWith("bond/rate")},iconName:"bar-chart",textId:l.bond.rate}]},{path:"goods",component:e.e(56).then(e.bind(null,1559)),match:function(t){return d(t).startsWith("goods")},iconName:"dot-chart",textId:l.product._root,exact:!1,children:[{path:"goods/",match:function(t){return"goods"===d(t)},iconName:"dot-chart",textId:l.product._root},{path:"goods/analysis",match:function(t){return d(t).startsWith("goods/analysis")},iconName:"dot-chart",textId:l.product.analysis}]},{path:"transactions",component:Promise.all([e.e(0),e.e(1),e.e(2),e.e(3),e.e(26)]).then(e.bind(null,1560)),match:function(t){return d(t).startsWith("transactions")},iconName:"bars",exact:!1},{path:"position",component:e.e(55).then(e.bind(null,1561)),match:function(t){return d(t).startsWith("position")},textId:l.position._root,iconName:"profile",exact:!1,children:[{path:"position/dailyPosition",match:function(t){return d(t).startsWith("position/dailyPosition")},iconName:"clock-circle",textId:l.position.dailyPosition},{path:"position/reallocation",match:function(t){return d(t).startsWith("position/reallocation")},iconName:"profile",textId:l.position.reallocation,exact:!1}]},{path:"setting",component:Promise.all([e.e(0),e.e(1),e.e(7),e.e(34),e.e(51)]).then(e.bind(null,1586)),match:function(t){return"setting"===d(t)},iconName:"setting",exact:!0}],m=f.map(function(t){return{type:c.a.Async,path:t.path,exact:t.exact,component:t.component}}),b=Object(a.a)(m),y=i.a;n.default=y(function(t){var n=t.invreq,e=f.map(function(t){return{path:Object(a.b)("invreq",n.invreqId,t.path),textId:t.textId||l[t.path],iconName:t.iconName,match:t.match,children:Object(u.a)(t.children)?t.children.map(function(t){return h({},t,{path:Object(a.b)("invreq",n.invreqId,t.path)})}):null}});return r.a.createElement(s.a,{routes:e},r.a.createElement(b,h({},t)))})}}]);