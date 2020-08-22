!function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";function n(t){function e(e,i){let n=t.inputEvents;for(const t in n){let o=n[t];o[e]&&o[e](i)}}t.isMobile?["touchstart","touchmove","touchend"].forEach((function(i){t.canvas.addEventListener(i,(function(n){e(i,function(e){const i=t.canvas,n=t.scale;let o=[];for(let t=0;t<e.targetTouches.length;t++){const r=e.targetTouches[t];o.push({x:(r.clientX-i.offsetLeft)/n,y:(r.clientY-i.offsetTop)/n,id:r.identifier,type:e.type})}return o}(n))}))})):(["mousedown","mouseup"].forEach((function(i){t.canvas.addEventListener(i,(function(n){n.stopPropagation(),n.preventDefault(),e(i,function(e){const i=t.canvas,n=t.scale;return{x:(e.clientX-i.offsetLeft)/n,y:(e.clientY-i.offsetTop)/n,button:e.button}}(n))}))})),window.addEventListener("keydown",(function(i){i.stopPropagation(),i.preventDefault();const n=i.keyCode;if(122===n)return o=document.documentElement,void(void 0!==(r=o.requestFullScreen||o.webkitRequestFullScreen||o.mozRequestFullScreen||o.msRequestFullscreen)&&r&&r.call(o));var o,r;t.keyCode!==n&&(t.keyCode=n,e("keydown",n))})),window.addEventListener("keyup",(function(i){i.stopPropagation(),i.preventDefault();const n=i.keyCode;t.keyCode===n&&(t.keyCode=null),e("keyup",n)})))}function o(t){let e={};return{add(t,i){e[t]||(e[t]={fn:i,status:!0})},del(t){e[t]&&delete e[t]},enable(t){const i=e[t];i&&(i.status=!0)},disable(t){const i=e[t];i&&(i.status=!1)},clear(){e={}},execute(){for(const i in e){const n=e[i];n.status&&n.fn.call(t)}}}}i.r(e);const r={};r.init=function(t){!function(){let t=document.body;t.style.margin=0,t.style.padding=0,t.style.width="100vw",t.style.height="100vh",t.style.overflow="hidden",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center"}(),this.canvas=document.createElement("canvas"),document.body.appendChild(this.canvas),this.context=this.canvas.getContext("2d");let e=document.body.clientWidth,i=document.body.clientHeight,o=e/i;t.width&&t.height?(this.width=this.viewWidth=t.width,this.height=this.viewHeight=t.height,this.ratio=t.width/t.height):(this.width=this.viewWidth=e,this.height=this.viewHeight=i,this.ratio=e/i),this.ratio>o?(this.viewWidth=e,this.viewHeight=e/this.ratio):(this.viewHeight=i,this.viewWidth=i*this.ratio),this.canvas.setAttribute("width",this.viewWidth),this.canvas.setAttribute("height",this.viewHeight),this.canvas.style.backgroundColor="black",this.scale=this.viewHeight/this.height,this.key=null,this.inputEvents={},this.animationInterval=t.animationInterval||16,this.test=t.test||!1,this.isMobile=function(){const t="undefined"!=typeof window&&window.navigator.userAgent.toLowerCase(),e=t&&t.indexOf("android")>0,i=t&&/iphone|ipad|ipod|ios/.test(t);return!(!e&&!i)}(),this.asset.setPath(t.publicPath),function(t){window.onresize=window.onload=function(){const e=t.ratio;let i=document.body.clientWidth,n=document.body.clientHeight;i/n>e?(t.viewHeight=n,t.viewWidth=e*n):(t.viewWidth=i,t.viewHeight=i/e),t.scale=t.viewHeight/t.height,t.canvas.setAttribute("width",t.viewWidth),t.canvas.setAttribute("height",t.viewHeight)}}(this),n(this),this.test||(window.oncontextmenu=function(){return!1})},r.mix=function(t,e){t.mixins||(t.mixins=[]),t.mixins.push(e)},r.asset=function(){let t="",e=[],i={};return{onReady(t){e.length>0?Promise.all(e).then(t):t()},get:(t,e)=>i[t][e],load(n){const o=n.type,r=n.group,a=n.name,s=n.url;if(i[r]||(i[r]={}),!i[r][a]){if("image"===o){let n=new Image;return e.push(new Promise((function(t){n.onload=function(){i[r][a]=n,t(!0)}}))),void(n.src=t+s)}if("animation"===o){let o=new Image;return e.push(new Promise((function(t){o.onload=function(){i[r][a]={image:o,frame:n.frame,interval:n.interval,flip:n.flip},t(!0)}}))),void(o.src=t+s)}"audio"===o&&(i[r][a]=new Audio(t+s))}},setPath(e){e&&(t=e)}}}(),r.event=o(r),r.stage=null;var a=r;function s(t){var e=a.canvas.getContext("2d"),i=Math.floor,n=null,o=function(e,i,n){t.drawWidth=e,t.drawHeight=i,n&&(t.width=e,t.height=i)},r=function(){return{relX:t.relX,relY:t.relY,offsetLeft:t.offsetLeft,offsetTop:t.offsetTop,width:t.width,height:t.height,drawWidth:t.drawWidth,drawHeight:t.drawHeight,scale:t.scale,flip:t.flip}},s=function(t){var{relX:n,relY:o,offsetLeft:s,offsetTop:l,width:d,drawWidth:u,drawHeight:c,scale:f,flip:w}=r();if(w){g=i(a.width-d*f-n+s),p=i(o+l);h(a.width,(function(){e.drawImage(t,0,0,u,c,g,p,u*f,c*f)}))}else{var g=i(n+s),p=i(o+l);e.drawImage(t,0,0,u,c,g,p,u*f,c*f)}};function h(t,i){e.translate(t,0),e.scale(-1,1),i(),e.translate(t,0),e.scale(-1,1)}return{animation(s,l,d=!1){let u=a.asset.get(s,l);o(u.image.width/u.frame,u.image.height,d);let c={animationFrames:u.frame,animationInterval:u.interval||a.animationInterval,width:t.drawWidth,height:t.drawHeight,flip:u.flip,onComplete:null},f=0,w=0;return n=function(){!function(t,n,o){var{relX:s,relY:l,offsetLeft:d,offsetTop:u,width:c,drawWidth:f,drawHeight:w,scale:g,flip:p}=r();if(!o&&!p||o&&p){var v=i(s+d),m=i(l+u);e.drawImage(t,n*f,0,f,w,v,m,f*g,w*g)}else{v=i(a.width-c*g-s+d),m=i(l+u);h(a.width,(function(){e.drawImage(t,n*f,0,f,w,v,m,f*g,w*g)}))}}(u.image,w,c.flip),f++,f>=c.animationInterval&&(f=0,w++,w>=c.animationFrames&&(w=0,c.onComplete&&c.onComplete.call(this)))},c},clear(){n=null},draw(i){n=function(){i.call(t,e)}},image(t,e,i=!1){let r=a.asset.get(t,e);o(r.width,r.height,i),n=function(){s(r)}},mix(t,i){let o=a.canvas.cloneNode(),r=o.getContext("2d"),s=new Image;"static"===t?(r.clearRect(0,0,a.width,a.height),i(r),s.src=o.toDataURL("image/png"),n=function(){e.drawImage(s,0,0)}):"dynamic"===t&&(n=function(){r.clearRect(0,0,a.width,a.height),i(r),s.src=o.toDataURL("image/png"),e.drawImage(s,0,0)})},particle(e,i,o,r,h){let l,d,u=a.asset.get(e,i);t.width=0,t.height=0,t.drawWidth=u.width,t.drawHeight=u.height,r&&(l=(r[1]-r[0])/o),h&&(d=(h[1]-h[0])/o,t.scale=h[1]),n=function(){null!=l&&((t.alpha+l<=r[0]||t.alpha+l>=r[1])&&(l=-l),t.alpha+=l),null!=d&&((t.scale+d<=h[0]||t.scale+d>=h[1])&&(d=-d),t.scale+=d),s(u)}},render(){let{relX:i,relY:o,width:r,height:s,scale:h,alpha:l}=t.scale;l<=0?t.alpha=0:i+r*h<0||i>a.width||o+s*h<0||o>a.height||(e.globalAlpha=l,n&&n(),a.test&&(e.strokeStyle="red",e.strokeRect(t.relX,t.relY,t.width,t.height)))}}}function h(t){let e={},i=[];function n(e,i,n){const o=function(){const e=t.relX,i=t.relY;return Math.sqrt(e**2+i**2)}();i&&(e.volume=o>=i?0:n*((i-o)/i))}return{update(){if(e.audio||0!==i.length){e.audio&&e.range>0&&n(e.audio,e.range,e.defalutVolume);for(let t=0;t<i.length;t++){const e=i[t],o=e.audio;!0!==o.ended?range>0&&n(e.audio,e.range,e.defalutVolume):(i.splice(t,1),o.remove(),t--)}}},play(t){const n=t.type,o=t.group,r=t.name,s=a.asset.get(o,r);if(!n)throw Error("Audio type is missing.");"sound"===n&&function(t,e){const n=t.cloneNode();n.volume=e.volume,n.play(),i.push({audio:n,defalutVolume:e.volume,range:e.range})}(s,t),"music"===n&&function(t,i){e.audio&&e.audio===t||(e.audio=t,e.defalutVolume=i.volume,e.range=i.range,t.volume=i.volume,t.loop=i.loop),t.play()}(s,t)},stop(){e.pause(),e.currentTime=0},clear(){e.audio&&e.audio.remove(),i.forEach((function(t){t.audio.remove()}))}}}class l{constructor(t){this.$options=t,this.beforeCreate=t.beforeCreate||null,this.created=t.created||null,this.beforeUpdate=t.beforeUpdate||null,this.updated=t.updated||null,this.beforeDestroy=t.beforeDestroy||null,this.destroyed=t.destroyed||null,this.beforeCreate&&this.beforeCreate();let e=t.config;if(null==e.id)throw new Error("Sprite needs an id.");if(!isNaN(Number(e.id)))throw new Error("Sprite must start with a letter.");for(var i in this.id=e.id,this.x=this.relX=e.x||0,this.y=this.relY=e.y||0,this.width=e.width||0,this.height=e.height||0,this.offsetLeft=e.offsetLeft||0,this.offsetTop=e.offsetTop||0,this.global=e.global||!1,this.alpha=e.alpha||1,this.scale=e.scale||1,this.flip=e.flip||!1,this.layer=e.layer||0,this.disabled=e.disabled||!1,this.fixed=e.fixed||0,this.graphics=s(this),this.audio=h(this),this.event=o(this),this.input=function(t){let e=a.inputEvents;return{watch(i,n){e[t.id]||(e[t.id]={}),e[t.id][i]=n.bind(t)},unwatch(i){i&&e[t.id]&&e[t.id][i]&&delete a.inputEvents[t.id][i]}}}(this),t.data)this[i]=t.data[i];for(var i in t.methods)this[i]=t.methods[i];if(l.mixins){var n=this;l.mixins.forEach((function(t){t.call(n)}))}a.stage.sprite.add(this),t.created&&t.created.call(this)}}var d=l;let u={};function c(t){let e=Object.assign({},u),i=[];return{add(n){var o;return function(t){if(e[t])throw new Error(`Sprite '${t}' exists.`)}(n.id),e[n.id]=n,function(e){e.game={width:a.width,height:a.height},e.global||(e.stage={width:t.width,height:t.height})}(n),o=n.layer,i.indexOf(o)>-1||(i.push(o),i.sort()),function(){let t={};i.forEach(i=>{for(const n in e){const o=e[n];o.layer===i&&(t[o.id]=o)}}),e=t}(),n},del(t){var i=e[t];if(!i)throw new Error(`sprite ${t} doesn't exist`);i.beforeDestroy&&i.beforeDestroy(),delete a.inputEvents[t],i.audio.clear(),delete e[t],i.destroyed&&i.destroyed()},clear(t){for(var i in e){var n=e[i];t||!n.global?this.del(i):u[i]=n}},find:t=>e[t],filter(t){let i={};for(const n in e){const o=e[n];!1!==t(o)&&(i[n]=o)}return i},travel(t){for(var i in e)if(!1===t(e[i]))break}}}function f(t){var e={x:0,y:0,follow:null,movement:null};function i(i,n,o,r,s=!0){const h=60*o||1,l=i/h,d=n/h;if(0===l&&0===d)return;e.follow=null;const{width:u,height:c}=t,{width:f,height:w}=a.width;var g=0;!0===s&&a.sprite.travel((function(t){t.disabled=!0})),e.movement=function(){e.x+=l,e.y+=d,(++g>h||e.x<0||e.x>u-f||e.y<0||e.y>c-w)&&(e.x=Math.max(0,e.x),e.x=Math.min(e.x,u-f),e.y=Math.max(0,e.y),e.y=Math.min(e.y,c-w),e.movement=null,!0===s&&a.sprite.travel((function(t){t.disabled=!1})),r&&r())}}function n(e){const{x:i,y:n,width:o,height:r}=e,{width:s,height:h}=t,{width:l,height:d}=a;let u,c;return u=i<(l-o)/2?0:i>s-(l+o)/2?s-l:i-(l-o)/2,c=n<(d-r)/2?0:n>h-(d+r)/2?h-d:n-(d-r)/2,{x:u,y:c}}return{follow(t){t!==e.follow&&(e.follow=t)},update:()=>(function(){let t=e.follow;if(t){const i=n(t);e.x=i.x,e.y=i.y}else e.movement&&e.movement()}(),e),move(t,e,n,o){i(t,e,n,o)},moveTo(t,o,r){let{x:a,y:s}=n(t);i(a-e.x,s-e.y,o,r)},unFollow(){e.follow=null}}}class w{constructor(t){a.asset.onReady(()=>{a.stage&&a.stage.destory(),this.beforeCreate=t.beforeCreate,this.created=t.created,this.beforeUpdate=t.beforeUpdate,this.updated=t.updated,this.beforeDestroy=t.beforeDestroy,this.destoryed=t.destoryed,this.beforeCreate&&this.beforeCreate(),a.key=null,a.stage=this;var e=t.config;this.width=e&&e.width||a.width,this.height=e&&e.height||a.height,this.stop=!1,this.sprite=c(this),this.camera=f(this),this.event=o(this),this.geometry=function(){function t(t,e){const{x:i,y:n,width:o,height:r}=t,{x:a,y:s,width:h,height:l}=e;return{x1:i,y1:n,w1:o,h1:r,x2:a,y2:s,w2:h,h2:l}}return{above(e,i){const{x1:n,y1:o,w1:r,h1:a,x2:s,y2:h,w2:l}=t(e,i);return o+a<=h&&n+r>=s&&n<=s+l},contain(e,i){const{x1:n,y1:o,w1:r,h1:a,x2:s,y2:h,w2:l,h2:d}=t(e,i);return!(r<l&&a<d&&(n<=s||n+r>=s+l)&&(o<=h||o+a>=h+d))},distance(e,i,n){const{x1:o,y1:r,w1:a,h1:s,x2:h,y2:l,w2:d,h2:u}=t(i,n);if("y"===e)return l>r+s?l-(r+s):r>l+u?r-(l+u):0;if("x"===e)return h>o+a?h-(o+a):o>h+d?o-(h+d):0;if("o"===e){const t=[o+a/2,r+s/2],e=[h+d/2,l+u/2];return Math.sqrt((t[0]-e[0])**2+(t[1]-e[1])**2)}},intersect(e,i){const{x1:n,y1:o,w1:r,h1:a,x2:s,y2:h,w2:l,h2:d}=t(e,i);return!(n>=s+l||n+r<=s||o>=h+d||o+a<=h)},onRight(e,i){const{x1:n,y1:o,h1:r,x2:a,y2:s,w2:h,h2:l}=t(e,i);return n>=a+h&&o+r>=s&&o<=s+l},onLeft(e,i){const{x1:n,y1:o,w1:r,h1:a,x2:s,y2:h,h2:l}=t(e,i);return n+r<=s&&o+a>=h&&o<=h+l},tangent(e,i){const{x1:n,y1:o,w1:r,h1:a,x2:s,y2:h,w2:l,h2:d}=t(e,i);return!(n>s+l||n+r<s||o>h+d||o+a<h)},under(e,i){const{x1:n,y1:o,w1:r,x2:a,y2:s,w2:h,h2:l}=t(e,i);return o>=s+l&&n+r>=a&&n<=a+h}}}(),w.mixins&&w.mixins.forEach((function(t){t.call(this)})),this.created&&this.created.call(this),function t(e){if(e.stop)return;e.beforeUpdate&&e.beforeUpdate();var i=e.camera.update();a.event.execute(),e.event.execute(),a.context.clearRect(0,0,a.width,a.height),e.sprite.travel(t=>{!function(t,e){t.beforeUpdate&&t.beforeUpdate(),t.relX=t.x-e.x*(1-t.fixed),t.relY=t.y-e.y*(1-t.fixed),t.audio.update(),t.graphics.render(),t.event.execute(),t.updated&&t.updated()}(t,i)}),e.updated&&e.updated(),window.requestAnimationFrame(()=>t(e))}(this)})}destory(){this.beforeDestroy&&this.beforeDestroy(),this.stop=!0,a.sprite.clear(),this.destoryed&&this.destoryed()}}var g=w;console.log("Potato | version:0.9.1 | author:Roanne"),a.init({test:!0,width:1920,height:1080}),new g({created(){new d({config:{id:"test"},created(){this.input.watch("mousedown",t=>{console.log(t.x,t.y)})}})}})}]);