import{r as ce,c as pe,a as ue,j as ie}from"./index-ba7c151b.js";var se={exports:{}};(function(ae,te){(function(W,M){ae.exports=M(ce)})(pe,W=>(()=>{var M={703:(u,g,C)=>{var a=C(414);function I(){}function J(){}J.resetWarningCache=I,u.exports=function(){function v(re,R,V,F,ne,K){if(K!==a){var Y=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw Y.name="Invariant Violation",Y}}function L(){return v}v.isRequired=v;var H={array:v,bigint:v,bool:v,func:v,number:v,object:v,string:v,symbol:v,any:v,arrayOf:L,element:v,elementType:v,instanceOf:L,node:v,objectOf:L,oneOf:L,oneOfType:L,shape:L,exact:L,checkPropTypes:J,resetWarningCache:I};return H.PropTypes=H,H}},697:(u,g,C)=>{u.exports=C(703)()},414:u=>{u.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},98:u=>{u.exports=W}},Z={};function h(u){var g=Z[u];if(g!==void 0)return g.exports;var C=Z[u]={exports:{}};return M[u](C,C.exports,h),C.exports}h.n=u=>{var g=u&&u.__esModule?()=>u.default:()=>u;return h.d(g,{a:g}),g},h.d=(u,g)=>{for(var C in g)h.o(g,C)&&!h.o(u,C)&&Object.defineProperty(u,C,{enumerable:!0,get:g[C]})},h.o=(u,g)=>Object.prototype.hasOwnProperty.call(u,g),h.r=u=>{typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(u,"__esModule",{value:!0})};var Q={};return(()=>{h.r(Q),h.d(Q,{default:()=>oe});var u=h(98),g=h.n(u),C=h(697),a=h.n(C);function I(){return I=Object.assign?Object.assign.bind():function(r){for(var i=1;i<arguments.length;i++){var o=arguments[i];for(var l in o)Object.prototype.hasOwnProperty.call(o,l)&&(r[l]=o[l])}return r},I.apply(this,arguments)}var J=function(r){var i=r.pageClassName,o=r.pageLinkClassName,l=r.page,S=r.selected,D=r.activeClassName,E=r.activeLinkClassName,t=r.getEventListener,e=r.pageSelectedHandler,p=r.href,n=r.extraAriaContext,s=r.pageLabelBuilder,c=r.rel,f=r.ariaLabel||"Page "+l+(n?" "+n:""),m=null;return S&&(m="page",f=r.ariaLabel||"Page "+l+" is your current page",i=i!==void 0?i+" "+D:D,o!==void 0?E!==void 0&&(o=o+" "+E):o=E),g().createElement("li",{className:i},g().createElement("a",I({rel:c,role:p?void 0:"button",className:o,href:p,tabIndex:S?"-1":"0","aria-label":f,"aria-current":m,onKeyPress:e},t(e)),s(l)))};J.propTypes={pageSelectedHandler:a().func.isRequired,selected:a().bool.isRequired,pageClassName:a().string,pageLinkClassName:a().string,activeClassName:a().string,activeLinkClassName:a().string,extraAriaContext:a().string,href:a().string,ariaLabel:a().string,page:a().number.isRequired,getEventListener:a().func.isRequired,pageLabelBuilder:a().func.isRequired,rel:a().string};const v=J;function L(){return L=Object.assign?Object.assign.bind():function(r){for(var i=1;i<arguments.length;i++){var o=arguments[i];for(var l in o)Object.prototype.hasOwnProperty.call(o,l)&&(r[l]=o[l])}return r},L.apply(this,arguments)}var H=function(r){var i=r.breakLabel,o=r.breakAriaLabel,l=r.breakClassName,S=r.breakLinkClassName,D=r.breakHandler,E=r.getEventListener,t=l||"break";return g().createElement("li",{className:t},g().createElement("a",L({className:S,role:"button",tabIndex:"0","aria-label":o,onKeyPress:D},E(D)),i))};H.propTypes={breakLabel:a().oneOfType([a().string,a().node]),breakAriaLabel:a().string,breakClassName:a().string,breakLinkClassName:a().string,breakHandler:a().func.isRequired,getEventListener:a().func.isRequired};const re=H;function R(r){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";return r??i}function V(r){return V=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(i){return typeof i}:function(i){return i&&typeof Symbol=="function"&&i.constructor===Symbol&&i!==Symbol.prototype?"symbol":typeof i},V(r)}function F(){return F=Object.assign?Object.assign.bind():function(r){for(var i=1;i<arguments.length;i++){var o=arguments[i];for(var l in o)Object.prototype.hasOwnProperty.call(o,l)&&(r[l]=o[l])}return r},F.apply(this,arguments)}function ne(r,i){for(var o=0;o<i.length;o++){var l=i[o];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(r,l.key,l)}}function K(r,i){return K=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(o,l){return o.__proto__=l,o},K(r,i)}function Y(r,i){if(i&&(V(i)==="object"||typeof i=="function"))return i;if(i!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return k(r)}function k(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function G(r){return G=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(i){return i.__proto__||Object.getPrototypeOf(i)},G(r)}function P(r,i,o){return i in r?Object.defineProperty(r,i,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[i]=o,r}var X=function(r){(function(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&K(t,e)})(E,r);var i,o,l,S,D=(l=E,S=function(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}(),function(){var t,e=G(l);if(S){var p=G(this).constructor;t=Reflect.construct(e,arguments,p)}else t=e.apply(this,arguments);return Y(this,t)});function E(t){var e,p;return function(n,s){if(!(n instanceof s))throw new TypeError("Cannot call a class as a function")}(this,E),P(k(e=D.call(this,t)),"handlePreviousPage",function(n){var s=e.state.selected;e.handleClick(n,null,s>0?s-1:void 0,{isPrevious:!0})}),P(k(e),"handleNextPage",function(n){var s=e.state.selected,c=e.props.pageCount;e.handleClick(n,null,s<c-1?s+1:void 0,{isNext:!0})}),P(k(e),"handlePageSelected",function(n,s){if(e.state.selected===n)return e.callActiveCallback(n),void e.handleClick(s,null,void 0,{isActive:!0});e.handleClick(s,null,n)}),P(k(e),"handlePageChange",function(n){e.state.selected!==n&&(e.setState({selected:n}),e.callCallback(n))}),P(k(e),"getEventListener",function(n){return P({},e.props.eventListener,n)}),P(k(e),"handleClick",function(n,s,c){var f=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},m=f.isPrevious,O=m!==void 0&&m,q=f.isNext,U=q!==void 0&&q,_=f.isBreak,x=_!==void 0&&_,w=f.isActive,A=w!==void 0&&w;n.preventDefault?n.preventDefault():n.returnValue=!1;var j=e.state.selected,d=e.props.onClick,N=c;if(d){var y=d({index:s,selected:j,nextSelectedPage:c,event:n,isPrevious:O,isNext:U,isBreak:x,isActive:A});if(y===!1)return;Number.isInteger(y)&&(N=y)}N!==void 0&&e.handlePageChange(N)}),P(k(e),"handleBreakClick",function(n,s){var c=e.state.selected;e.handleClick(s,n,c<n?e.getForwardJump():e.getBackwardJump(),{isBreak:!0})}),P(k(e),"callCallback",function(n){e.props.onPageChange!==void 0&&typeof e.props.onPageChange=="function"&&e.props.onPageChange({selected:n})}),P(k(e),"callActiveCallback",function(n){e.props.onPageActive!==void 0&&typeof e.props.onPageActive=="function"&&e.props.onPageActive({selected:n})}),P(k(e),"getElementPageRel",function(n){var s=e.state.selected,c=e.props,f=c.nextPageRel,m=c.prevPageRel,O=c.selectedPageRel;return s-1===n?m:s===n?O:s+1===n?f:void 0}),P(k(e),"pagination",function(){var n=[],s=e.props,c=s.pageRangeDisplayed,f=s.pageCount,m=s.marginPagesDisplayed,O=s.breakLabel,q=s.breakClassName,U=s.breakLinkClassName,_=s.breakAriaLabels,x=e.state.selected;if(f<=c)for(var w=0;w<f;w++)n.push(e.getPageElement(w));else{var A=c/2,j=c-A;x>f-c/2?A=c-(j=f-x):x<c/2&&(j=c-(A=x));var d,N,y=function(T){return e.getPageElement(T)},b=[];for(d=0;d<f;d++){var $=d+1;if($<=m)b.push({type:"page",index:d,display:y(d)});else if($>f-m)b.push({type:"page",index:d,display:y(d)});else if(d>=x-A&&d<=x+(x===0&&c>1?j-1:j))b.push({type:"page",index:d,display:y(d)});else if(O&&b.length>0&&b[b.length-1].display!==N&&(c>0||m>0)){var ee=d<x?_.backward:_.forward;N=g().createElement(re,{key:d,breakAriaLabel:ee,breakLabel:O,breakClassName:q,breakLinkClassName:U,breakHandler:e.handleBreakClick.bind(null,d),getEventListener:e.getEventListener}),b.push({type:"break",index:d,display:N})}}b.forEach(function(T,B){var z=T;T.type==="break"&&b[B-1]&&b[B-1].type==="page"&&b[B+1]&&b[B+1].type==="page"&&b[B+1].index-b[B-1].index<=2&&(z={type:"page",index:T.index,display:y(T.index)}),n.push(z.display)})}return n}),t.initialPage!==void 0&&t.forcePage!==void 0&&console.warn("(react-paginate): Both initialPage (".concat(t.initialPage,") and forcePage (").concat(t.forcePage,") props are provided, which is discouraged.")+` Use exclusively forcePage prop for a controlled component.
See https://reactjs.org/docs/forms.html#controlled-components`),p=t.initialPage?t.initialPage:t.forcePage?t.forcePage:0,e.state={selected:p},e}return i=E,(o=[{key:"componentDidMount",value:function(){var t=this.props,e=t.initialPage,p=t.disableInitialCallback,n=t.extraAriaContext,s=t.pageCount,c=t.forcePage;e===void 0||p||this.callCallback(e),n&&console.warn("DEPRECATED (react-paginate): The extraAriaContext prop is deprecated. You should now use the ariaLabelBuilder instead."),Number.isInteger(s)||console.warn("(react-paginate): The pageCount prop value provided is not an integer (".concat(s,"). Did you forget a Math.ceil()?")),e!==void 0&&e>s-1&&console.warn("(react-paginate): The initialPage prop provided is greater than the maximum page index from pageCount prop (".concat(e," > ").concat(s-1,").")),c!==void 0&&c>s-1&&console.warn("(react-paginate): The forcePage prop provided is greater than the maximum page index from pageCount prop (".concat(c," > ").concat(s-1,")."))}},{key:"componentDidUpdate",value:function(t){this.props.forcePage!==void 0&&this.props.forcePage!==t.forcePage&&(this.props.forcePage>this.props.pageCount-1&&console.warn("(react-paginate): The forcePage prop provided is greater than the maximum page index from pageCount prop (".concat(this.props.forcePage," > ").concat(this.props.pageCount-1,").")),this.setState({selected:this.props.forcePage})),Number.isInteger(t.pageCount)&&!Number.isInteger(this.props.pageCount)&&console.warn("(react-paginate): The pageCount prop value provided is not an integer (".concat(this.props.pageCount,"). Did you forget a Math.ceil()?"))}},{key:"getForwardJump",value:function(){var t=this.state.selected,e=this.props,p=e.pageCount,n=t+e.pageRangeDisplayed;return n>=p?p-1:n}},{key:"getBackwardJump",value:function(){var t=this.state.selected-this.props.pageRangeDisplayed;return t<0?0:t}},{key:"getElementHref",value:function(t){var e=this.props,p=e.hrefBuilder,n=e.pageCount,s=e.hrefAllControls;if(p)return s||t>=0&&t<n?p(t+1,n,this.state.selected):void 0}},{key:"ariaLabelBuilder",value:function(t){var e=t===this.state.selected;if(this.props.ariaLabelBuilder&&t>=0&&t<this.props.pageCount){var p=this.props.ariaLabelBuilder(t+1,e);return this.props.extraAriaContext&&!e&&(p=p+" "+this.props.extraAriaContext),p}}},{key:"getPageElement",value:function(t){var e=this.state.selected,p=this.props,n=p.pageClassName,s=p.pageLinkClassName,c=p.activeClassName,f=p.activeLinkClassName,m=p.extraAriaContext,O=p.pageLabelBuilder;return g().createElement(v,{key:t,pageSelectedHandler:this.handlePageSelected.bind(null,t),selected:e===t,rel:this.getElementPageRel(t),pageClassName:n,pageLinkClassName:s,activeClassName:c,activeLinkClassName:f,extraAriaContext:m,href:this.getElementHref(t),ariaLabel:this.ariaLabelBuilder(t),page:t+1,pageLabelBuilder:O,getEventListener:this.getEventListener})}},{key:"render",value:function(){var t=this.props.renderOnZeroPageCount;if(this.props.pageCount===0&&t!==void 0)return t&&t(this.props);var e=this.props,p=e.disabledClassName,n=e.disabledLinkClassName,s=e.pageCount,c=e.className,f=e.containerClassName,m=e.previousLabel,O=e.previousClassName,q=e.previousLinkClassName,U=e.previousAriaLabel,_=e.prevRel,x=e.nextLabel,w=e.nextClassName,A=e.nextLinkClassName,j=e.nextAriaLabel,d=e.nextRel,N=this.state.selected,y=N===0,b=N===s-1,$="".concat(R(O)).concat(y?" ".concat(R(p)):""),ee="".concat(R(w)).concat(b?" ".concat(R(p)):""),T="".concat(R(q)).concat(y?" ".concat(R(n)):""),B="".concat(R(A)).concat(b?" ".concat(R(n)):""),z=y?"true":"false",le=b?"true":"false";return g().createElement("ul",{className:c||f,role:"navigation","aria-label":"Pagination"},g().createElement("li",{className:$},g().createElement("a",F({className:T,href:this.getElementHref(N-1),tabIndex:y?"-1":"0",role:"button",onKeyPress:this.handlePreviousPage,"aria-disabled":z,"aria-label":U,rel:_},this.getEventListener(this.handlePreviousPage)),m)),this.pagination(),g().createElement("li",{className:ee},g().createElement("a",F({className:B,href:this.getElementHref(N+1),tabIndex:b?"-1":"0",role:"button",onKeyPress:this.handleNextPage,"aria-disabled":le,"aria-label":j,rel:d},this.getEventListener(this.handleNextPage)),x)))}}])&&ne(i.prototype,o),Object.defineProperty(i,"prototype",{writable:!1}),E}(u.Component);P(X,"propTypes",{pageCount:a().number.isRequired,pageRangeDisplayed:a().number,marginPagesDisplayed:a().number,previousLabel:a().node,previousAriaLabel:a().string,prevPageRel:a().string,prevRel:a().string,nextLabel:a().node,nextAriaLabel:a().string,nextPageRel:a().string,nextRel:a().string,breakLabel:a().oneOfType([a().string,a().node]),breakAriaLabels:a().shape({forward:a().string,backward:a().string}),hrefBuilder:a().func,hrefAllControls:a().bool,onPageChange:a().func,onPageActive:a().func,onClick:a().func,initialPage:a().number,forcePage:a().number,disableInitialCallback:a().bool,containerClassName:a().string,className:a().string,pageClassName:a().string,pageLinkClassName:a().string,pageLabelBuilder:a().func,activeClassName:a().string,activeLinkClassName:a().string,previousClassName:a().string,nextClassName:a().string,previousLinkClassName:a().string,nextLinkClassName:a().string,disabledClassName:a().string,disabledLinkClassName:a().string,breakClassName:a().string,breakLinkClassName:a().string,extraAriaContext:a().string,ariaLabelBuilder:a().func,eventListener:a().string,renderOnZeroPageCount:a().func,selectedPageRel:a().string}),P(X,"defaultProps",{pageRangeDisplayed:2,marginPagesDisplayed:3,activeClassName:"selected",previousLabel:"Previous",previousClassName:"previous",previousAriaLabel:"Previous page",prevPageRel:"prev",prevRel:"prev",nextLabel:"Next",nextClassName:"next",nextAriaLabel:"Next page",nextPageRel:"next",nextRel:"next",breakLabel:"...",breakAriaLabels:{forward:"Jump forward",backward:"Jump backward"},disabledClassName:"disabled",disableInitialCallback:!1,pageLabelBuilder:function(r){return r},eventListener:"onClick",renderOnZeroPageCount:void 0,selectedPageRel:"canonical",hrefAllControls:!1});const oe=X})(),Q})())})(se);var ge=se.exports;const de=ue(ge);const be=({pageMeta:{total:ae,totalPages:te,page:W},onPageChange:M})=>ie.jsx("div",{className:"pagination",children:ie.jsx(de,{previousLabel:"Previous",previousClassName:"previous-page",previousLinkClassName:"previous-link",nextLabel:"Next",nextClassName:"previous-page",nextLinkClassName:"previous-link",forcePage:W-1,breakLabel:"...",breakClassName:"break",breakLinkClassName:"break-link",pageCount:te,marginPagesDisplayed:3,disabledClassName:"disable",onPageChange:({selected:Z})=>M(Z),containerClassName:"pagination",pageClassName:"inactive-page",pageLinkClassName:"inactive-link",activeLinkClassName:"active-link",activeClassName:"active-page"})});export{be as default};
