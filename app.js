!function n(t,o,e){function i(c,u){if(!o[c]){if(!t[c]){var s="function"==typeof require&&require;if(!u&&s)return s(c,!0);if(r)return r(c,!0);var f=new Error("Cannot find module '"+c+"'");throw f.code="MODULE_NOT_FOUND",f}var a=o[c]={exports:{}};t[c][0].call(a.exports,function(n){var o=t[c][1][n];return i(o?o:n)},a,a.exports,n,t,o,e)}return o[c].exports}for(var r="function"==typeof require&&require,c=0;c<e.length;c++)i(e[c]);return i}({1:[function(n,t,o){function e(){var n;a&&(n=Math.round((f-Date.now())/1e3),n>0?(h.html(r(n)),d=setTimeout(e,100)):(c=s(l,m),h.add("flash"),i()))}function i(){a=0,h.html(r(0)),d&&clearTimeout(d)}function r(n){return[n/60,n%60].map(Math.floor).map(function(n){return n>=10?n:"0"+n}).join(":")}var c,u=n(2),s=n(3),f=0,a=0,l="",d=null,h=u("h1"),m="./noticon.png";u("button").on("click",function(){var n=this.dataset;h.remove("flash"),i(),c&&c.close(),c=null,a=1,f=Date.now()+6e4*n.interval,l=n.message,e(),this.focus()}),s.grant()},{2:2,3:3}],2:[function(n,t,o){function e(n,t,o){r[n]||(r[n]=[],document.addEventListener(n,function(t){r[n].forEach(function(n){t.target.matches(n.selector)&&n.handler.call(t.target,t)})})),r[n].push({selector:t,handler:o})}function i(n){this.nodes=[].slice.call(document.querySelectorAll(n)),this.selector=n}var r={};i.prototype={on:function(n,t){e(n,this.selector,t)},html:function(n){this.nodes.forEach(function(t){t.innerHTML=n})},add:function(n){this.nodes.forEach(function(t){t.classList.add(n)})},remove:function(n){n=n.split(/\s+/),this.nodes.forEach(function(t){t.classList.remove(n)})}},t.exports=function(n){return new i(n)}},{}],3:[function(n,t,o){function e(){return"permission"in r?r.permission:""}function i(n,t){if("granted"===e()){var o=new r(n,{icon:t});return o.onclick=function(){window.focus()},o}}var r="Notification"in window?window.Notification:{};i.grant=function(){"requestPermission"in r&&"denied"!==e()&&r.requestPermission(function(n){r.permission=n})},t.exports=i},{}]},{},[1]);