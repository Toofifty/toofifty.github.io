!function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={exports:{},id:o,loaded:!1};return e[o].call(a.exports,a,a.exports,t),a.loaded=!0,a.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var a=n(2),r=o(a),i=n(5);o(i);n(4),navigator.userAgent.indexOf("Safari/")>-1&&navigator.userAgent.indexOf("Chrome/")===-1&&(document.body.className="no-anim"),(0,r.default)(window.location.pathname.replace(/\//g,""),!0),window.goto=r.default;var l=["Hi.","G’day.","Hey.","Hi!","Hi,","Hi,","Hola!","Hallo,","Ahoyhoy,","Ahoy,"],u=l[parseInt(Math.random()*l.length)];document.querySelector(".content.home .site-title span").textContent=u},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(3),r=o(a),i=n(5),l=o(i),u=["","about","projects","contact"];t.default=function(e,t){var n="";return u.indexOf(e)>-1?n=e:window.history.replaceState(null,null,"/"),t&&(0,r.default)(n),e!==window.location.pathname.replace(/\//g,"")&&((0,r.default)(n),(0,l.default)(),window.history.pushState(n,n,"/"+n)),!1}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(4),r=o(a),i=null,l=function(e,t){e.className=e.className.replace(t,"").replace(" "+t,"")},u=function(e){e=e?e:"home";var t=document.body.className.indexOf("no-anim")>-1;if(document.body.className=e+(t?" no-anim":""),i&&i!==e){var n=document.querySelector(".content."+i),o=document.querySelector(".content."+e);if(l(o,/\s*hidden\s*/),t)return n.className+=" hidden",(0,r.default)(o),void(i=e);var a=n.getAttribute("data-index")>o.getAttribute("data-index");a?(n.className+=" going-down",o.className+=" coming-down"):(n.className+=" going-up",o.className+=" coming-up"),setTimeout(function(){a?(l(n,/\s*going-down\s*/),l(o,/\s*coming-down\s*/)):(l(n,/\s*going-up\s*/),l(o,/\s*coming-up\s*/)),n.className+=" hidden",(0,r.default)(o)},990)}i=e};u(),(0,r.default)(document.querySelector(".content.home")),window.onpopstate=function(e){u(e.path[0].location.pathname.replace(/\//g,""))},t.default=u},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=document.querySelector(".scroll-indicator.down"),o=document.querySelector(".scroll-indicator.up"),a=document.querySelector(".scroll-indicator.down .progress"),r=document.querySelector(".scroll-indicator.up .progress"),i=!0,l=0,u=null,s=null,c=null,d=["home","about","projects","contact"],f=function(e){i?(r.style.height="0px",a.style.height=e/2+"px",n.style.opacity=1):(a.style.height="0px",r.style.height=e/2+"px",o.style.opacity=1),0===e&&(n.style.opacity=0,o.style.opacity=0)},h=function(){l>=4?l*=.75:l--,l<=0&&(l=0,p(u)),f(l)},p=function(){clearInterval(u),u=null},y=function(){clearTimeout(s),s=null},m=function(e,t,n){return function(o){var a=e.scrollHeight-e.scrollTop<=window.innerHeight,r=e.scrollTop<=0;p(u),y(s),a&&o.deltaY>0&&void 0!==n?(i||(i=!0,l=0),l+=o.deltaY/10,l>=100&&(e.removeEventListener("mousewheel",c),window.goto(n),l=0),f(l)):r&&o.deltaY<0&&void 0!==t?(i&&(i=!1,l=0),l-=o.deltaY/10,l>=100&&(e.removeEventListener("mousewheel",c),window.goto(t),l=0),f(l)):(l=0,f(l)),s=setTimeout(function(){l>0&&null===u&&(u=setInterval(h,1e3/60))},1e3)}};t.default=function(e){var t=e.getAttribute("data-index")-1;l=0,f(l),c=m(e,d[t-1],d[t+1]),e.addEventListener("mousewheel",c,{passive:!0})}},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(6),r=o(a);document.getElementById("polygen").setAttribute("height",window.innerHeight),document.getElementById("polygen").setAttribute("width",Math.max(1200,window.innerWidth));var i=256*Math.random();(0,r.default)(document.getElementById("polygen"),{hue:i,split:6,padding:1,colorgen:"fade_down"}),document.body.style.setProperty("--base-color","hsl("+i+", 75%, 75%)"),t.default=function(){if(document.body.className.indexOf("no-anim")===-1){var e=256*Math.random();(0,r.default)(document.getElementById("polygen"),{hue:e}),document.body.style.setProperty("--base-color","hsl("+e+", 75%, 75%)")}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e={},t={basic_light:function(e,t){return n(e,50,30+30*Math.cos(t[0].x-t[1].x+t[2].x-t[0].y+t[1].y-t[2].y))},basic_dark:function(e,t){return n(e,50,50-111*(t[0].x+t[1].x+t[2].x+t[0].y+t[1].y+t[2].y)%25)},fade_streak:function(e,t){return n(e,50,25*Math.sin((t[0].x+t[0].y)/2*Math.PI)+50)},fade_down:function(e,t){var o=25,a=16*Math.sin(t[2].x*Math.PI)+16*Math.cos(t[2].y*Math.PI),r=4*Math.sin(t[1].x*Math.PI)+4*Math.cos(t[1].y*Math.PI);return n(e,50,Math.max(o+a+r,o))},fade_center:function(e,t){var o=function(e){return e*e},a=Math.sqrt(o(t[0].x-.5)+o(t[0].y-.5)),r=Math.max(50,20+50*(1-a));return n(e,50,r)}},n=function(e,t,n){return"hsl("+e+", "+(t?t:50)+"%, "+(n?n:50)+"%)"},o=function(e,t,n){return{x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n}},a=function e(t){for(var n=[],o=t.splitx+2*t.padding,a=t.splity+2*t.padding,e=-t.padding;e<a;e++){for(var r=[],i=-t.padding;i<o;i++){var l=Math.random()*Math.PI*2,u=Math.random()/(2*t.splitx)*t.overbound,s=Math.random()/(2*t.splity)*t.overbound;r.push({x:i/t.splitx+u*Math.cos(l)+1/(2*t.splitx),y:e/t.splity+s*Math.cos(l)+1/(2*t.splity)})}n.push(r)}return n};return function(n,r){var i=e[n.getAttribute("id")];i&&i.anim&&clearInterval(i.anim),r&&r.colorgen&&"string"==typeof r.colorgen&&(Object.keys(t).indexOf(r.colorgen)>-1?r.colorgen=t[r.colorgen]:delete r.colorgen),r=Object.assign({hue:256*Math.random(),splitx:10,splity:10,padding:0,overbound:1,transition:1,colorgen:t.basic_dark},i?i.opts:null,r),r.split&&(r.splitx=r.split,r.splity=r.split);var l=r.hue,u=n.clientWidth,s=n.clientHeight,c=n.getContext("2d"),d=function(e,t,n){c.beginPath(),c.lineTo(e.x*u,e.y*s),c.lineTo(t.x*u,t.y*s),c.lineTo(n.x*u,n.y*s),c.lineTo(e.x*u,e.y*s),c.fillStyle=r.colorgen(l,[e,t,n]),c.strokeStyle=c.fillStyle,c.fill(),c.stroke(),c.closePath()},f=function(e){for(var t=0;t<e.length-1;t++)for(var n=0;n<e[0].length-1;n++)d(e[t][n],e[t][n+1],e[t+1][n]),d(e[t][n+1],e[t+1][n],e[t+1][n+1])};if(i||(i=e[n.getAttribute("id")]={}),void 0===i.verts||0===i.verts.length){var h=a(r);f(h),i.verts=h}else{var p=a(r),y=i.verts,m=i.opts.hue,g=l-m,v=.01;i.anim=setInterval(function(){c.clearRect(0,0,u,s),l=m+g*v;for(var e=[],t=0;t<p.length;t++){for(var n=[],a=0;a<p[0].length;a++)n.push(o(y[t][a],p[t][a],v));e.push(n)}f(e),v+=Math.sin(v*Math.PI)/30/r.transition,(isNaN(v)||v>=.99)&&clearInterval(i.anim)},12),i.verts=p}return i.opts=r,n}}()}]);
//# sourceMappingURL=app.63f157dda8dbdbd5ea51.js.map