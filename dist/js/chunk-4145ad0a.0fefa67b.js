(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4145ad0a"],{"159b":function(t,e,a){var i=a("da84"),s=a("fdbc"),r=a("17c2"),n=a("9112");for(var o in s){var c=i[o],d=c&&c.prototype;if(d&&d.forEach!==r)try{n(d,"forEach",r)}catch(l){d.forEach=r}}},"17c2":function(t,e,a){"use strict";var i=a("b727").forEach,s=a("a640"),r=a("ae40"),n=s("forEach"),o=r("forEach");t.exports=n&&o?[].forEach:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}},"35aa":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"orderDetails"},[a("van-nav-bar",{attrs:{title:"订单详情","left-text":"返回","left-arrow":""},on:{"click-left":t.back}}),a("div",{staticClass:"content"},[a("div",{staticClass:"bg"}),a("div",{staticClass:"block"},[a("van-tabs",{attrs:{"line-height":2},on:{change:t.changeOrderStatus},model:{value:t.activeTabIndex,callback:function(e){t.activeTabIndex=e},expression:"activeTabIndex"}},t._l(t.nav,(function(e,i){return a("van-tab",{key:i,attrs:{title:e.title}},[a("div",{staticClass:"tab-content"},[t.orderlis.length>0?a("div",t._l(t.orderlis,(function(e,i){return a("div",{key:i,staticClass:"tab-box"},[a("Order",{attrs:{"pro-info":e.proInfo},scopedSlots:t._u([{key:"title",fn:function(){return[a("div",{staticClass:"pay-title-box"},[a("div",{staticClass:"pay-t"},[t._v(t._s(e.oid))]),2===e.status?a("div",{staticClass:"pay-s"},[a("div",{staticClass:"pay-text"},[t._v("已完成")]),a("div",{staticClass:"pay-icon",on:{click:function(a){return t.removeOrder(e.oid,i)}}},[a("van-icon",{attrs:{name:"delete-o"}})],1)]):t._e(),1===e.status?a("div",{staticClass:"pay-s"},[a("div",{staticClass:"pay-text",on:{click:function(a){return t.ConfirmOrder(e,i)}}},[t._v("确认订单")])]):t._e()])]},proxy:!0},{key:"order-item",fn:function(){return t._l(e.data,(function(t,e){return a("OrderItem",{key:e,attrs:{product:t}})}))},proxy:!0}],null,!0)})],1)})),0):a("div",[a("van-empty",{attrs:{description:"没有该状态的订单"}})],1)])])})),1)],1)])],1)},s=[],r=(a("4160"),a("c975"),a("a434"),a("159b"),a("c77f")),n=a("9d57"),o={name:"OrderDetails",data:function(){return{activeTabIndex:0,nav:[{title:"全部",status:0},{title:"运输中",status:1},{title:"已完成",status:2}],orderlis:[]}},components:{Order:r["a"],OrderItem:n["a"]},created:function(){this.getOrderLis(0)},methods:{back:function(){this.$router.back()},getOrderLis:function(t){var e=this,a=this.$cookies.get("tokenString");if(!a)return this.$router.push({name:"Login"});this.$toast.loading({message:"加载中.....",frobidClick:!0,duration:0}),this.axios({method:"GET",url:this.baseUrl+"/findOrder",params:{appkey:this.appkey,tokenString:a,status:t}}).then((function(t){if(e.$toast.clear(),700==t.data.code)return e.$toast({message:t.data.msg,frobidClick:!0,duration:3e3}),e.$router.push({name:"Login"});if(7e4===t.data.code){var a=[],i=[];t.data.result.forEach((function(t){if(t.small_img=t.smallImg,-1===i.indexOf(t.oid)){var e={oid:t.oid,status:t.status,proInfo:{date:t.updatedAt,count:0,total:0},data:[]};i.push(t.oid),a.push(e)}})),a.forEach((function(e){t.data.result.forEach((function(t){e.oid===t.oid&&(e.data.push(t),e.proInfo.count+=t.count,e.proInfo.total+=t.count*t.price)}))})),e.orderlis=a}else e.$toast({message:t.data.msg,frobidClick:!0,duration:3e3})})).catch((function(t){e.$toast.clear(),console.log("err==>",t)}))},changeOrderStatus:function(t,e){this.getOrderLis(t)},ConfirmOrder:function(t,e){var a=this,i=this.$cookies.get("tokenString");if(!i)return this.$router.push({name:"Login"});this.$toast.loading({message:"加载中",frobidClick:!0,duration:0}),this.axios({method:"POST",url:this.baseUrl+"/receive",data:{appkey:this.appkey,tokenString:i,oid:t.oid}}).then((function(i){if(a.$toast.clear(),700==i.data.code)return a.$toast({message:i.data.msg,frobidClick:!0,duration:3e3}),a.$router.push({name:"Login"});8e4===i.data.code&&(t.status=2,1===a.activeTabIndex&&a.orderlis.splice(e,1)),a.$toast({message:i.data.msg,frobidClick:!0,duration:3e3})})).catch((function(t){a.$toast.clear(),console.log("err==>",t)}))},removeOrder:function(t,e){var a=this,i=this.$cookies.get("tokenString");if(!i)return this.$router.push({name:"Login"});this.$toast.loading({message:"加载中.....",frobidClick:!0,duration:0}),this.axios({method:"POST",url:this.baseUrl+"/removeOrder",data:{appkey:this.appkey,tokenString:i,oid:t}}).then((function(t){if(a.$toast.clear(),700==t.data.code)return a.$toast({message:t.data.msg,frobidClick:!0,duration:3e3}),a.$router.push({name:"Login"});9e4===t.data.code&&a.orderlis.splice(e,1),a.$toast({message:t.data.msg,frobidClick:!0,duration:3e3})})).catch((function(t){a.$toast.clear(),console.log("err==>",t)}))}}},c=o,d=(a("eeb0"),a("2877")),l=Object(d["a"])(c,i,s,!1,null,"5652e56f",null);e["default"]=l.exports},"39ad":function(t,e,a){},4160:function(t,e,a){"use strict";var i=a("23e7"),s=a("17c2");i({target:"Array",proto:!0,forced:[].forEach!=s},{forEach:s})},"6bb7":function(t,e,a){"use strict";a("e3d6")},"7acc":function(t,e,a){},"88ee":function(t,e,a){"use strict";a("39ad")},"9d57":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"item"},[a("div",{staticClass:"img"},[a("img",{attrs:{src:t.product.small_img}})]),a("div",{staticClass:"pro-info"},[a("div",{staticClass:"top"},[a("div",{staticClass:"pro-name"},[a("div",{staticClass:"name"},[t._v(t._s(t.product.name))]),a("div",{staticClass:"rule"},[t._v(t._s(t.product.rule))])]),a("div",{staticClass:"enname"},[t._v(t._s(t.product.enname))])]),a("div",{staticClass:"bottom"},[a("div",{staticClass:"price"},[t._v("¥"+t._s(t.product.price))]),a("div",{staticClass:"count"},[t._v(t._s(t.product.count))])])])])},s=[],r={name:"OrderItem",props:{product:{type:Object,default:function(){return{}}}}},n=r,o=(a("6bb7"),a("2877")),c=Object(o["a"])(n,i,s,!1,null,"1ba0d5fd",null);e["a"]=c.exports},a434:function(t,e,a){"use strict";var i=a("23e7"),s=a("23cb"),r=a("a691"),n=a("50c4"),o=a("7b0b"),c=a("65f0"),d=a("8418"),l=a("1dde"),u=a("ae40"),f=l("splice"),p=u("splice",{ACCESSORS:!0,0:0,1:2}),v=Math.max,h=Math.min,m=9007199254740991,g="Maximum allowed length exceeded";i({target:"Array",proto:!0,forced:!f||!p},{splice:function(t,e){var a,i,l,u,f,p,C=o(this),b=n(C.length),k=s(t,b),_=arguments.length;if(0===_?a=i=0:1===_?(a=0,i=b-k):(a=_-2,i=h(v(r(e),0),b-k)),b+a-i>m)throw TypeError(g);for(l=c(C,i),u=0;u<i;u++)f=k+u,f in C&&d(l,u,C[f]);if(l.length=i,a<i){for(u=k;u<b-i;u++)f=u+i,p=u+a,f in C?C[p]=C[f]:delete C[p];for(u=b;u>b-i+a;u--)delete C[u-1]}else if(a>i)for(u=b-i;u>k;u--)f=u+i-1,p=u+a-1,f in C?C[p]=C[f]:delete C[p];for(u=0;u<a;u++)C[u+k]=arguments[u+2];return C.length=b-i+a,l}})},a640:function(t,e,a){"use strict";var i=a("d039");t.exports=function(t,e){var a=[][t];return!!a&&i((function(){a.call(null,e||function(){throw 1},1)}))}},c77f:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"order"},[a("div",{staticClass:"name"},[t._t("title",[a("div",{staticClass:"title"},[t._v("订单信息")])])],2),a("div",{staticClass:"list"},[t._t("order-item")],2),a("div",{staticClass:"text"},[t._m(0),a("div",{staticClass:"proInfo"},[t.proInfo.date?a("div",{staticClass:"time"},[t._v(t._s(t._f("formatDate")(t.proInfo.date,"yyyy-MM-dd hh:mm:ss")))]):t._e(),a("div",{staticClass:"num"},[a("div",{staticClass:"count"},[t._v("共计 "+t._s(t.proInfo.count)+" 件")]),a("div",{staticClass:"total"},[t._v("合计 ¥"+t._s(t.proInfo.total))])])])])])},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"line"},[a("div",{staticClass:"line-left"}),a("div",{staticClass:"line-right"})])}],r={name:"Order",props:{proInfo:{type:Object,default:function(){return{count:0,total:0,date:""}}}}},n=r,o=(a("88ee"),a("2877")),c=Object(o["a"])(n,i,s,!1,null,"0a6cc1cc",null);e["a"]=c.exports},c975:function(t,e,a){"use strict";var i=a("23e7"),s=a("4d64").indexOf,r=a("a640"),n=a("ae40"),o=[].indexOf,c=!!o&&1/[1].indexOf(1,-0)<0,d=r("indexOf"),l=n("indexOf",{ACCESSORS:!0,1:0});i({target:"Array",proto:!0,forced:c||!d||!l},{indexOf:function(t){return c?o.apply(this,arguments)||0:s(this,t,arguments.length>1?arguments[1]:void 0)}})},e3d6:function(t,e,a){},eeb0:function(t,e,a){"use strict";a("7acc")},fdbc:function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=chunk-4145ad0a.0fefa67b.js.map