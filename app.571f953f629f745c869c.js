!function(t){function e(o){if(n[o])return n[o].exports;var a=n[o]={exports:{},id:o,loaded:!1};return t[o].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}var a=n(2),r=o(a),i=n(4);o(i);(0,r.default)(window.location.pathname.replace(/\//g,""),!0),window.goto=r.default;var l=["Hi.","G’day.","Hey.","Hi!","Hi,","Hi,","Hola!","Hallo,","Ahoyhoy,","Ahoy,"],s=l[parseInt(Math.random()*l.length)];document.querySelectorAll(".content.home .site-title span")[0].textContent=s},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var a=n(3),r=o(a),i=n(4),l=o(i),s=["","about","projects","contact"];e.default=function(t,e){var n="";return s.indexOf(t)>-1?n=t:window.history.replaceState(null,null,"/"),e&&(0,r.default)(n),t!==window.location.pathname.replace(/\//g,"")&&((0,r.default)(n),(0,l.default)(),window.history.pushState(n,n,"/"+n)),!1}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=null,o=function(t,e){t.className=t.className.replace(e,"").replace(" "+e,"")},a=function(t){if(t=t?t:"home",document.body.className=t,n&&n!==t){var e=document.querySelectorAll(".content."+n)[0],a=document.querySelectorAll(".content."+t)[0];o(a,/\s*hidden\s*/);var r=e.getAttribute("data-index")>a.getAttribute("data-index");r?(e.className+=" going-down",a.className+=" coming-down"):(e.className+=" going-up",a.className+=" coming-up"),setTimeout(function(){r?(o(e,/\s*going-down\s*/),o(a,/\s*coming-down\s*/)):(o(e,/\s*going-up\s*/),o(a,/\s*coming-up\s*/)),e.className+=" hidden"},990)}n=t};a(),window.onpopstate=function(t){a(t.path[0].location.pathname.replace(/\//g,""))},e.default=a},function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var a=n(5),r=o(a);document.getElementById("polygen").setAttribute("height",window.innerHeight),document.getElementById("polygen").setAttribute("width",Math.max(1200,window.innerWidth));var i=256*Math.random();(0,r.default)(document.getElementById("polygen"),{hue:i,split:6,padding:1,colorgen:"fade_down"}),document.body.style.setProperty("--base-color","hsl("+i+", 75%, 75%)"),e.default=function(){var t=256*Math.random();(0,r.default)(document.getElementById("polygen"),{hue:t}),document.body.style.setProperty("--base-color","hsl("+t+", 75%, 75%)")}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){var t={},e={basic_light:function(t,e){return n(t,50,30+30*Math.cos(e[0].x-e[1].x+e[2].x-e[0].y+e[1].y-e[2].y))},basic_dark:function(t,e){return n(t,50,50-111*(e[0].x+e[1].x+e[2].x+e[0].y+e[1].y+e[2].y)%25)},fade_streak:function(t,e){return n(t,50,25*Math.sin((e[0].x+e[0].y)/2*Math.PI)+50)},fade_down:function(t,e){var o=25,a=16*Math.sin(e[2].x*Math.PI)+16*Math.cos(e[2].y*Math.PI),r=4*Math.sin(e[1].x*Math.PI)+4*Math.cos(e[1].y*Math.PI);return n(t,50,Math.max(o+a+r,o))},fade_center:function(t,e){var o=function(t){return t*t},a=Math.sqrt(o(e[0].x-.5)+o(e[0].y-.5)),r=Math.max(50,20+50*(1-a));return n(t,50,r)}},n=function(t,e,n){return"hsl("+t+", "+(e?e:50)+"%, "+(n?n:50)+"%)"},o=function(t,e,n){return{x:t.x+(e.x-t.x)*n,y:t.y+(e.y-t.y)*n}},a=function t(e){for(var n=[],o=e.splitx+2*e.padding,a=e.splity+2*e.padding,t=-e.padding;t<a;t++){for(var r=[],i=-e.padding;i<o;i++){var l=Math.random()*Math.PI*2,s=Math.random()/(2*e.splitx)*e.overbound,u=Math.random()/(2*e.splity)*e.overbound;r.push({x:i/e.splitx+s*Math.cos(l)+1/(2*e.splitx),y:t/e.splity+u*Math.cos(l)+1/(2*e.splity)})}n.push(r)}return n};return function(n,r){var i=t[n.getAttribute("id")];i&&i.anim&&clearInterval(i.anim),r&&r.colorgen&&"string"==typeof r.colorgen&&(Object.keys(e).indexOf(r.colorgen)>-1?r.colorgen=e[r.colorgen]:delete r.colorgen),r=Object.assign({hue:256*Math.random(),splitx:10,splity:10,padding:0,overbound:1,transition:1,colorgen:e.basic_dark},i?i.opts:null,r),r.split&&(r.splitx=r.split,r.splity=r.split);var l=r.hue,s=n.clientWidth,u=n.clientHeight,c=n.getContext("2d"),d=function(t,e,n){c.beginPath(),c.lineTo(t.x*s,t.y*u),c.lineTo(e.x*s,e.y*u),c.lineTo(n.x*s,n.y*u),c.lineTo(t.x*s,t.y*u),c.fillStyle=r.colorgen(l,[t,e,n]),c.strokeStyle=c.fillStyle,c.fill(),c.stroke(),c.closePath()},h=function(t){for(var e=0;e<t.length-1;e++)for(var n=0;n<t[0].length-1;n++)d(t[e][n],t[e][n+1],t[e+1][n]),d(t[e][n+1],t[e+1][n],t[e+1][n+1])};if(i||(i=t[n.getAttribute("id")]={}),void 0===i.verts||0===i.verts.length){var f=a(r);h(f),i.verts=f}else{var p=a(r),y=i.verts,g=i.opts.hue,m=l-g,v=.01;i.anim=setInterval(function(){c.clearRect(0,0,s,u),l=g+m*v;for(var t=[],e=0;e<p.length;e++){for(var n=[],a=0;a<p[0].length;a++)n.push(o(y[e][a],p[e][a],v));t.push(n)}h(t),v+=Math.sin(v*Math.PI)/30/r.transition,(isNaN(v)||v>=.99)&&clearInterval(i.anim)},12),i.verts=p}return i.opts=r,n}}()}]);
//# sourceMappingURL=app.571f953f629f745c869c.js.map