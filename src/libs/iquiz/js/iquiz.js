!function o(i,s,u){function l(t,e){if(!s[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(c)return c(t,!0);var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}var a=s[t]={exports:{}};i[t][0].call(a.exports,function(e){return l(i[t][1][e]||e)},a,a.exports,o,i,s,u)}return s[t].exports}for(var c="function"==typeof require&&require,e=0;e<u.length;e++)l(u[e]);return l}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}();function s(e,t,n,r){a("on",e),a("on",t),e.addEventListener(t,n,!!r)}n.qs=function(e,t){return(t||document).querySelector(e)},n.$on=s,n.$log=a,n.$delegate=function(a,o,e,i,t){s(a,e,function(e){for(var t=e.target,n=a.querySelectorAll(o),r=n.length;r--;)if(n[r]===t){i.call(t,e);break}},!!t)};n.EventEmitter=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._cb={}}return r(e,[{key:"addEventListener",value:function(e,t){this._cb[e]?this._cb[e].handlers.push(t):this._cb[e]={handlers:[t]}}},{key:"trigger",value:function(e,t){this._cb[e]&&this._cb[e].handlers.forEach(function(e){return e(t)})}}]),e}();function a(e){1<arguments.length&&void 0!==arguments[1]&&arguments[1]}n.escapeForHTML=function(e){return e.replace(/[&<]/g,function(e){return"&"===e?"&amp;":"&lt;"})}},{}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),u=a(e("./q-quizmc")),l=a(e("./q-freetext")),c=a(e("./q-intro")),f=e("./helpers");function a(e){return e&&e.__esModule?e:{default:e}}function o(e){return Array.isArray(e)?e:Array.from(e)}var i=function(){function e(){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.instance)return instance;(this.instance=this).allQuestionNodes,this.questionInstances=[]}return r(e,[{key:"startUp",value:function(){var i=this;(0,f.$log)("startUp");var s=void 0,e=o(document.querySelectorAll("[data-iquiz]"));this.allQuestionNodes=e.slice(0),this.allQuestionNodes.forEach(function(e){var t=e.dataset.iquiz,n=e.dataset.type,r=e.dataset.params||{},a=e.dataset.answer,o=e.dataset.state||[];switch("string"==typeof r&&(r=String(r).replace(/\#/g,'"'),r=JSON.parse(r)),n){case"click-text-mc":s=new u.default(e,{number:t,type:n,params:r,answer:a,state:o}),i.questionInstances.push(s),(0,f.$on)(s,"nextQuestion",i.nextQuestion.bind(i)),s.startUp();break;case"freetext":s=new l.default(e,{number:t,type:n,params:r,answer:a,state:o}),i.questionInstances.push(s),(0,f.$on)(s,"nextQuestion",i.nextQuestion.bind(i)),s.startUp();break;case"intro":s=new c.default(e,{number:t,type:n,params:r,answer:a,state:o}),i.questionInstances.push(s),(0,f.$on)(s,"beginQuiz",i.beginQuiz.bind(i))}}),this.initialzeNavigation()}},{key:"beginQuiz",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;(0,f.$log)("beginQuiz",e),(0,f.$log)("beginQuiz",location.hash),this.navigateToPage(this.getPageNumber(1))}},{key:"nextQuestion",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;(0,f.$log)("nextQuestion",e),(0,f.$log)("nextQuestion",this),this.navigateToPage(this.getPageNumber(1))}},{key:"initialzeNavigation",value:function(){var t=this;(0,f.qs)(".js-nav-bar")&&(location.hash=location.hash||"#q1",(0,f.qs)(".js-back").onclick=function(e){return t.previousClick()},(0,f.qs)(".js-next").onclick=function(e){return t.nextClick()},(0,f.$on)(window,"hashchange",this.hashChangedHandler.bind(this)),this.refreshPage(),this.setNavStates())}},{key:"hashChangedHandler",value:function(e){(0,f.$log)("hashChangedHandler",e.target),this.refreshPage(),this.setNavStates()}},{key:"nextClick",value:function(e){(0,f.$log)("nextClick",e),this.navigateToPage(this.getPageNumber(1))}},{key:"previousClick",value:function(e){(0,f.$log)("previousClick",e),this.navigateToPage(this.getPageNumber(-1))}},{key:"refreshPage",value:function(){Array.from(document.querySelectorAll(".container--iquiz")).forEach(function(e){e.classList.add("hidden")}),(0,f.$log)("this.getPageNumber()",this.getPageNumber());var e=(0,f.qs)('[data-iquiz="'+this.getPageNumber()+'"]');(0,f.$log)("currentPageNode",e),e&&e.classList.remove("hidden")}},{key:"setNavStates",value:function(){(0,f.qs)('[data-iquiz="'+this.getPageNumber()+'"]');var e=(0,f.qs)('[data-iquiz="'+this.getPageNumber(1)+'"]');(0,f.qs)('[data-iquiz="'+this.getPageNumber(-1)+'"]')?(0,f.qs)(".nav-bar .js-back").removeAttribute("disabled"):(0,f.qs)(".nav-bar .js-back").setAttribute("disabled",""),e?(0,f.qs)(".nav-bar .js-next").removeAttribute("disabled"):(0,f.qs)(".nav-bar .js-next").setAttribute("disabled","")}},{key:"navigateToPage",value:function(e){(0,f.$log)("navigateToPage",e),(0,f.$log)("navigateToPage","#q"+e),location.hash="#q"+e}},{key:"getPageNumber",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;return+(location.hash||"#q1").replace("#q","")+e}},{key:"decryptAnswers",value:function(e){var t=CryptoJS.AES.decrypt(e,"secret key 123");(0,f.$log)(t);var n=JSON.parse(t.toString(CryptoJS.enc.Utf8));(0,f.$log)(n)}},{key:"encryptAnswers",value:function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:[{id:1},{id:2}],t=CryptoJS.AES.encrypt(JSON.stringify(e),"secret key 123").toString();(0,f.$log)(t)}},{key:"startUpQuiz",value:function(){(0,f.$log)("startUpQuiz",json)}},{key:"loadJson",value:function(){var n=this;fetch(function(e){var t=o(e.href.split("/").reverse()),n=t[0],r=(t[1],t.slice(2),e.origin,n.split(".")[0],e.href.split("/"));n=r.pop();var a=r.join("/")+"/index.json";return(0,f.$log)("jsonFile",a),a}(window.location)).then(function(e){if((0,f.$log)("validateResponse",e),!e.ok)throw Error(e.statusText);return e}).then(function(e){return(0,f.$log)("readResponseAsJSON",e),e.json()}).then(function(e){return(0,f.$log)("logResult",e),e}).then(function(e){return n.startUpQuiz(e)}).catch(function(e){var t;t=e,(0,f.$log)("Looks like there was a problem",t),n.startUpDemoQuiz()})}},{key:"startUpDemoQuiz",value:function(){(0,f.$log)("### APP: startUpDemoQuiz: ");var e={title:"Title quiz_clickText",id:"q456",type:"quiz_clickText_mc",multipleAnswers:!1,maxScore:2,questionArray:[{description:"this is q1 text",id:0,qNum:1,ans:[2,4],userAnswer:[2]}]};(0,f.$log)("APP: startUpDemoQuiz: ",e),this.quiz=new u.default(e),this.quiz.startUp()}}]),e}();n.default=i},{"./helpers":1,"./q-freetext":3,"./q-intro":4,"./q-quizmc":6}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),o=e("./helpers");var r=function(e){function r(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return n.qData=t,n.node=e,n.sel='[data-iquiz="'+n.qData.number+'"]',n.txtBoxStartHeight="45px",n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,o.EventEmitter),a(r,[{key:"startUp",value:function(){this.initQuizNav(),this.initQuiz()}},{key:"initQuizNav",value:function(){var t=this;(0,o.$log)("FT-initQuizNav"),this.node.querySelector(".js-reveal").onclick=function(e){return t.doSubmit(e)},this.node.querySelector(".js-reset").onclick=function(e){return t.initQuiz(e)},this.node.querySelector(".js-user-answers").oninput=function(e){return t.doOnInput(e)},this.node.querySelector(".js-user-answers").onclick=function(e){return t.removeEditable(e)},this.node.querySelector(".js-add-ans")&&(this.node.querySelector(".js-add-ans").onclick=function(e){return t.addNewEditable(e)})}},{key:"initQuiz",value:function(e){var n=this;if((0,o.$log)("FT-initQuiz:"+e),void 0===e||!this.node.querySelector(".js-reset").classList.contains("disabled")){"none"!=getComputedStyle(this.node.querySelector(".js-ans-container"),null).display&&$(".js-ans-container").slideUp("fast",function(e){n.node.querySelector(".js-reveal").innerText="REVEAL"});for(var r=this.node.querySelectorAll(".js-textarea-container"),t=function(t){1==n.qData.params.fixedUserAnswers||"true"===n.qData.params.fixedUserAnswers?(r[t].querySelector(".js-textarea").value="",r[t].querySelector(".js-textarea").style.height=n.txtBoxStartHeight,t==r.length-1&&((0,o.$log)("aaa"),n.shouldRevealBeActive())):0==t?(r[t].querySelector(".js-textarea").value="",r[t].querySelector(".js-textarea").style.height=n.txtBoxStartHeight,n.shouldRevealBeActive()):$(r[t]).slideUp("fast",function(e){n.node.querySelector(".js-user-answers").removeChild(r[t]),t==r.length-1&&(n.shouldRevealBeActive(),n.checkRemoveBtnDisabled())})},a=0;a<r.length;a++)t(a);r[0].querySelector("textarea").focus()}}},{key:"doOnInput",value:function(e){(0,o.$log)("FT-doOnInput:",e),e.target.style.height=this.txtBoxStartHeight,e.target.style.height=e.target.scrollHeight+"px",this.shouldRevealBeActive()}},{key:"doOnKeyUp",value:function(e){(0,o.$log)("FT-doOnKeyUp:",e.key),"Enter"===e.key&&((0,o.$log)("Enter pressed: ",e.key),(0,o.$log)("e.innerHTML: ",e.target.innerHTML))}},{key:"addNewEditable",value:function(e){var t=this;(0,o.$log)("addNewEditable: ");var n=document.createElement("div");n.setAttribute("style","display: none"),n.setAttribute("class","iquiz-textarea-container with-btn js-textarea-container"),n.innerHTML="<textarea class='iquiz-ft-freetext js-textarea'></textarea><button class='iquiz-btn-remove js-remove-ans'>&times;</button>",$(n).appendTo(this.node.querySelector(".js-user-answers")).slideDown("fast",function(e){t.checkRemoveBtnDisabled(),t.shouldRevealBeActive(),n.querySelector("textarea").focus()})}},{key:"removeEditable",value:function(e){var t=this;(0,o.$log)("FT-removeEditable:",e.target);var n=e.target.parentNode;e.target.classList.contains("js-remove-ans")&&!e.target.classList.contains("disabled")&&$(n).slideUp("fast",function(e){t.node.querySelector(".js-user-answers").removeChild(n),t.checkRemoveBtnDisabled()})}},{key:"checkRemoveBtnDisabled",value:function(){1<this.node.querySelector(".js-user-answers").getElementsByTagName("div").length?Array.from(this.node.querySelectorAll(".js-textarea-container")).forEach(function(e){e.querySelector(".js-remove-ans").classList.remove("disabled")}):this.node.querySelector(".js-remove-ans").classList.add("disabled")}},{key:"countTextAreasWithContent",value:function(){var t=0,e=this.node.querySelectorAll(".js-textarea").length;return Array.from(this.node.querySelectorAll(".js-textarea")).forEach(function(e){""!=e.value&&t++,(0,o.$log)("rCount:",t)}),[t,e]}},{key:"shouldRevealBeActive",value:function(){(0,o.$log)("FT-shouldRevealBeActive:");var e=this.countTextAreasWithContent(),t=!1,n=!1;1==this.qData.params.fixedUserAnswers||"true"===this.qData.params.fixedUserAnswers?((0,o.$log)("fixedUserAnswers:"),e[0]==e[1]&&(t=!0),0<e[0]&&(n=!0)):0<e[0]&&(n=t=!0),!0===t?this.node.querySelector(".js-reveal").classList.remove("disabled"):this.node.querySelector(".js-reveal").classList.add("disabled"),!0===n?this.node.querySelector(".js-reset").classList.remove("disabled"):this.node.querySelector(".js-reset").classList.add("disabled")}},{key:"doSubmit",value:function(e){var t=this;(0,o.$log)("FT-doSubmit:",e),this.node.querySelector(".js-reveal").classList.contains("disabled")||("none"===getComputedStyle(this.node.querySelector(".js-ans-container"),null).display?$(this.node.querySelectorAll(".js-ans-container")).slideDown("fast",function(e){t.node.querySelector(".js-reveal").innerText="HIDE"}):$(this.node.querySelectorAll(".js-ans-container")).slideUp("fast",function(e){t.node.querySelector(".js-reveal").innerText="REVEAL"}))}}]),r}();n.default=r},{"./helpers":1}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),o=e("./helpers");var r=function(e){function r(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return n.qData=t,n.node=e,Array.from(n.node.querySelectorAll(".js-begin-quiz")).forEach(function(e){return e.addEventListener("click",n.doBeginQuiz.bind(n))}),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,o.EventEmitter),a(r,[{key:"doBeginQuiz",value:function(e){(0,o.$log)("doBeginQuiz:",e),this.trigger("beginQuiz",{a:11})}}]),r}();n.default=r},{"./helpers":1}],5:[function(e,t,n){"use strict";var r,a=e("./helpers"),o=e("./q-app");var i=new((r=o)&&r.__esModule?r:{default:r}).default;(0,a.$on)(window,"load",function(){i.startUp()})},{"./helpers":1,"./q-app":2}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),s=(e("./utils"),e("./helpers"));var r=function(e){function r(e,t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));if(n.qData=t,n.node=e,n.sel='[data-iquiz="'+n.qData.number+'"]',n.qData.answer&&""!==n.qData.answer)try{n.qData.answer=JSON.parse(n.qData.answer)}catch(e){console.error("iQuiz Error parsing data-answer from JSON to object: ",e),alert("Error parsing data-answer from JSON to object: "+e)}if(n.qData.state&&""!==n.qData.state&&"Array"===!a(n.qData.state))try{n.qData.state=JSON.parse(n.qData.state)}catch(e){console.error("iQuiz Error parsing data-state from JSON to object: ",e),alert("Error parsing data-state from JSON to object: "+e)}if(n.qData.params&&""!==n.qData.params&&"Object"===!a(n.qData.params))try{n.qData.params=JSON.parse(n.qData.params.replace(/#/gi,'"'))}catch(e){console.error("iQuiz Error parsing data-params from JSON to object: ",e),alert("Error parsing data-params from JSON to object: "+e)}return(0,s.$log)("qData:",n.qData),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,s.EventEmitter),o(r,[{key:"startUp",value:function(){(0,s.$log)("initQuiz");for(var e=this.node.querySelector(".js-answer-group"),t=e.querySelectorAll(".js-answer"),n=t.length;0<=n;n--)e.appendChild(t[Math.random()*n|0]);this.initQuizNav(),this.initQuizClickText(),this.reState(!0)}},{key:"initQuizNav",value:function(){var t=this;(0,s.$log)("initQuizNav"),this.node.querySelector(".js-submit").onclick=function(e){return t.doSubmit(e)},Array.from(this.node.querySelectorAll(".js-next-question")).forEach(function(e){return e.addEventListener("click",t.doNextQuestion.bind(t))}),$(".iquiz_popClose, .iquiz_popBG").click(function(){t.closePop()})}},{key:"initQuizClickText",value:function(){var t=this;Array.from(this.node.querySelectorAll(".quiz_clickText")).forEach(function(e){return e.addEventListener("click",t.setAnswer.bind(t))})}},{key:"doNextQuestion",value:function(e){(0,s.$log)("doNextQuestion:",e),this.closePop(!0),this.trigger("nextQuestion",{a:11})}},{key:"freezeVp",value:function(e){e.preventDefault()}},{key:"stopBodyScrolling",value:function(e){!0===e?document.querySelector(this.sel+" .iquiz_popBG").addEventListener("touchmove",this.freezeVp,!1):document.querySelector(this.sel+" .iquiz_popBG").removeEventListener("touchmove",this.freezeVp,!1)}},{key:"showPop",value:function(){(0,s.$log)("showPop"),this.stopBodyScrolling(!0);var e=this;$(this.sel+" .iquiz_popBG").fadeIn({queue:!1,duration:200}).promise().done(function(){$(e.sel+" .iquiz_popContainer").css({top:"0px"}).fadeIn({queue:!1,duration:200}).animate({top:"80px"},200),$(e.sel+" .iquiz_innerScroll").scrollTop(0)})}},{key:"closePop",value:function(){0<arguments.length&&void 0!==arguments[0]&&arguments[0];(0,s.$log)("closePop"),this.stopBodyScrolling(!1),$(this.sel+" .iquiz_popContainer").fadeOut({queue:!1,duration:200}).animate({top:"0px"},200),$(this.sel+" .iquiz_popBG").fadeOut({queue:!1,duration:200}).promise().done(function(){})}},{key:"setAnswer",value:function(e){var t=e.target;(0,s.$log)("setAnswer:",e),(0,s.$log)("setAnswer:",t),this.node.querySelector(".js-submit").classList.remove("disabled");var n=Number($(t).data("answer")),r=(this.qData.number,$(t).position().top+parseInt($(t).css("marginTop"))),a=($(t).position().left,parseInt($(t).css("marginLeft")),$(t).outerHeight());if((0,s.$log)("################# this.qData.params.multipleAnswers:",this.qData.params),0==this.qData.params.multipleAnswers||"false"===this.qData.params.multipleAnswers){var o=this.node.querySelector(".js-highlight");o.classList.remove("hide"),Array.from(this.node.querySelectorAll(".quiz_clickText")).forEach(function(e){e.classList.remove("selected")}),$(o).animate({top:r+"px",height:a+"px"},200,function(){$(t).addClass("selected notransition"),$(this).addClass("hide")})}else $(t).toggleClass("selected");var i=this.qData.state;(0,s.$log)("userAnswerArr ",i),0==this.qData.params.multipleAnswers||"false"===this.qData.params.multipleAnswers?i[0]=n:$(t).hasClass("selected")?$.inArray(n,i)<0&&i.push(n):-1<$.inArray(n,i)&&i.splice($.inArray(n,i),1),(0,s.$log)("this.qData ",this.qData)}},{key:"reState",value:function(e){(0,s.$log)("reState:showAns:"+e);for(var t=this.qData.state,n=0;n<t.length;n++){var r=this.node.querySelector('[data-answer="'+t[n]+'"]');r.classList.add("selected"),(0,s.$log)("selected:"+r)}}},{key:"doSubmit",value:function(e){(0,s.$log)("doSubmit:",e);var t=e.target;if(!$(t).hasClass("disabled")){var n=this.qData.state,r=this.qData.answer;$(this.sel+" .iquiz_feedback.wrong").css({display:"none"}),$(this.sel+" .iquiz_feedback.correct").css({display:"none"}),!function(e,t){if(e.length!==t.length)return!1;var n=e.sort(),r=t.sort();return n.map(function(e,t){return r[t]===e}).every(function(e){return e})}(n,r)?((0,s.$log)("wrong"),$(this.sel+" .iquiz_feedback.wrong").css({display:"block"})):((0,s.$log)("correct"),$(this.sel+" .iquiz_feedback.correct").css({display:"block"}),this.qData.params&&this.qData.params.maxScore&&(n.length,this.qData.state.maxScore)),this.showPop()}}}]),r}();n.default=r},{"./helpers":1,"./utils":7}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.random=function(e,t){return Math.floor(Math.random()*(t-e+1)+e)},n.shuffle=function(e){var t,n,r=e.length;for(;0!==r;)n=Math.floor(Math.random()*r),t=e[r-=1],e[r]=e[n],e[n]=t;return e},n.shuffleDivs=function(e,t){console.log("shuffleDivs p ",e),console.log("shuffleDivs c ",t);var n=$(e),r=n.children(t);console.log("shuffleDivs parent ",n),console.log("shuffleDivs divs ",r);for(;r.length;)n.append(r.splice(Math.floor(Math.random()*r.length),1)[0])}},{}]},{},[5]);
//# sourceMappingURL=iquiz.js.map
