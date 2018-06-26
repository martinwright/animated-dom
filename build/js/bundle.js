(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //import {$} from "../node_modules/jquery/dist/jquery";
//import _ from 'lodash';
//import '../css/style.scss';
//import Icon from './img1.png';
//import { Shapes } from './app'
//import "babel-polyfill";


var _util = require('./util');

var _windowLoaded = require('./windowLoaded');

var _windowLoaded2 = _interopRequireDefault(_windowLoaded);

var _slider = require('./slider');

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//(function (document, window) {


/*    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
        startup();
    } else {
        document.addEventListener("DOMContentLoaded", startup, false);
    }*/

//(function ($) {  // start IIFE

(0, _windowLoaded2.default)(function () {
    console.log("DocReady");

    var app = new App();
    var setView = function setView() {
        app.startUp();
    };

    (0, _util.$on)(window, 'load', setView);
    (0, _util.$on)(window, 'hashchange', setView);
});

var App = function () {
    function App() {
        _classCallCheck(this, App);
    }

    _createClass(App, [{
        key: 'startUp',
        value: function startUp() {

            var sliderEl = document.querySelector('#slider1');

            var slider = new _slider2.default(sliderEl, {
                slide: true,
                callback: transitioned
            });

            return;

            function transitioned(slide) {
                console.log('transitioned ', slide.children[0]);
            }

            //document.addEventListener('DOMContentLoaded', ready);


            /*let opts = {
                el: '#root',
                btnGpEl: '#pg-control',
                renderFn: f
            }*/

            // init
            //var p = new Pager(opts)

            // change page
            //p.prev();
            //p.next();

            // update list
            //p.setState({
            //list: [...]
            //});

            // render function
            /*function f(val, index, arr) {
                const d = document.createElement('p');
                d.innerText = val;
                return d;
            }*/

            document.querySelector('.js-play').onclick = function (e) {
                myTimeline.play();
            };
            document.querySelector(' .js-pause').onclick = function (e) {
                myTimeline.pause();
            };
            document.querySelector('.js-restart').onclick = function (e) {
                myTimeline.restart();
            };

            document.querySelector('.js-next').onclick = function (e) {
                p.next();
            };
            document.querySelector('.js-back').onclick = function (e) {
                p.prev();
            };

            var myTimeline = anime.timeline({
                direction: 'reverse',
                autoplay: false
            });

            var nodelist = document.querySelectorAll('[data-page="1"] [data-step]');

            var nodesArray = Array.prototype.slice.call(nodelist);

            //const nodesArray = [...Array.from(document.querySelectorAll("[data-step]"))];

            function sorter(obj1, obj2) {
                return obj1.dataset.step - obj2.dataset.step;
            }

            function renumber(obj, n) {
                console.log('renumber ', obj, n);
                obj.dataset.order = (n - parseInt(obj.dataset.step)).toString();
            }

            var tCols = 4,
                tRows = 6;

            var _loop = function _loop(i) {
                console.log('nth ', i * 4 + 1, i * 4 + 4);

                var start = i * 4 + 1,
                    end = i * 4 + 4,
                    offset = end === 24 && start === 21 ? '0' : '-=25';

                Array.from(document.querySelectorAll('[data-page="1"] .cell:nth-child(n+' + start + '):nth-child(-n+' + end + ')')).forEach(function (el) {
                    myTimeline.add({
                        targets: el,
                        opacity: '0',
                        translateX: '100',
                        easing: 'easeInQuad',
                        duration: 50,
                        offset: offset
                    });
                });
            };

            for (var i = 5; i >= 0; i--) {
                _loop(i);
            }

            var myArr = Array.from(nodesArray).sort(sorter).reverse();
            console.log('myArr ', typeof myArr === 'undefined' ? 'undefined' : _typeof(myArr));
            console.log('myArr ', myArr);

            //return;

            Array.from(myArr)
            //.sort(sorter)
            //.reverse()
            .forEach(function (el) {
                //console.log(this.dataset.step);
                //console.log(this);
                //console.log(this.dataset);
                var elTarget = '[data-step="' + el.dataset.step + '"]';

                var elOffset = el.dataset.offset;
                var elDuration = el.dataset.duration;

                console.log('elDuration', elDuration);
                var obj = void 0;

                switch (el.dataset.type) {
                    case 'fade':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: 0,
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset
                            //direction: 'reverse'
                        });
                        break;
                    case 'right-slide':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: '0',
                            translateX: '150',
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset
                        });
                        break;
                    case 'left-slide':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: '0',
                            translateX: '-150',
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset
                            //direction: 'reverse'
                        });
                        break;
                    case 'left-roll':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: '0',
                            //translateX: '20em',
                            rotate: '-1turn',
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset,
                            scale: 4,
                            translateX: '350'
                            /*rotate: {
                                value: 25,
                                duration: 2000,
                                easing: 'easeInOutSine'
                            }*/
                            //direction: 'reverse'
                        });
                        break;
                }
            });

            myTimeline.begin = function () {
                console.log('#################### myTimeline ');

                var wait = setTimeout(function () {
                    var wrapper = document.getElementsByClassName("wrapper")[0];
                    wrapper.classList.remove('hidden');
                }, 10);
            };

            myTimeline.complete = function () {
                //let wrapper = document.getElementsByClassName("wrapper")[0];
                //wrapper.classList.remove('hidden');

                document.getElementsByClassName("wrapper")[0].classList.remove('hidden');

                [].slice.call(document.getElementsByClassName('cell')).forEach(function (elem) {
                    elem.classList.add('--bottom-border');
                });
            };

            myTimeline.play();

            //console.log('myTimeline ', myTimeline);
        }
    }]);

    return App;
}();

/*myTimeline
    .add({
        targets: '[data-step="1"]',
        translateX: 250,
        direction: 'reverse'
    })
    .add({
        targets: '[data-step="2"]',
        translateX: 250,
        direction: 'reverse'
    })
    .add({
        targets: '[data-step="3"]',
        translateX: 250,
        direction: 'reverse'
    });*/

/*myTimeline.completed = false;
myTimeline.complete = () => {
    // your call back funtion
    console.log("reverse done 😏");
};
myTimeline.reverse();
myTimeline.play();*/

/*var playPause = anime({
    targets: '#playPause .el',
    translateX: 250,
    delay: function(el, i, l) { return i * 100; },
    direction: 'alternate',
    loop: true,
    autoplay: false
});

document.querySelector('.navigation .play').onclick = playPause.play;
document.querySelector('.navigation .pause').onclick = playPause.pause;*/

/*var queue = [];

$('[data-animation-step]').each(function (i, $el) {
    queue.push($(this).fadeOut(5000));
})*/

/* var bouncingBall = anime({
     targets: '.ball',
     translateY: '50vh',
     duration: 300,
     loop: true,
     direction: 'alternate',
     easing: 'easeInCubic',
     scaleX: {
         value: 1.05,
         duration: 150,
         delay: 268
     }
 });*/

// Start Queue
//$('#startQueue').bind('click', function (e) {
// Go through Each Element and Fade Out //

/*$('[data-animation-step]').each(function (i, $el) {
    queue.push($(this).fadeOut(5000));

})*/

/*$('.queueItem').each(function (i, $el) {
    // Don't Delay First Element//
    if (i == 0) {
        queue.push($(this).fadeOut(5000));
    } else {
        queue.push($(this).delay(5000 * i).fadeOut(5000));
    }
});*/
//});


// Create the array of Velocity calls
/*var loadingSequence = [
    { e: $element1, p: { translateX: 100, opacity: 1 }, o: { duration: 1000 } },
    { e: $element2, p: { translateX: 200, opacity: 1 }, o: { duration: 1000 } },
    { e: $element3, p: { translateX: 300, opacity: 1 }, o: { duration: 1000 } }
];*/

// Pass the array into $.Velocity.RunSequence to kick off the sequence
//$.Velocity.RunSequence(loadingSequence);


/*function component() {
    var element = document.createElement('div');

    console.log('element ', element)

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    console.log('element ', element)
    // Add the image to our existing div.
    var myIcon = new Image();
    myIcon.src = './img1.png';

    element.appendChild(myIcon);

    return element;
}



    }
}


*/

//document.body.appendChild(component());


//})(document, window);

},{"./slider":2,"./util":3,"./windowLoaded":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    _createClass(Slider, null, [{
        key: 'DEFAULT',
        get: function get() {
            return {
                interval: 0,
                slide: false
            };
        }
    }, {
        key: 'DIRECTION',
        get: function get() {
            return {
                PREV: 'prev',
                NEXT: 'next',
                LEFT: 'left',
                RIGHT: 'right'
            };
        }
    }]);

    function Slider(element, options) {
        _classCallCheck(this, Slider);

        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        this.element = element;
        this.options = Object.assign({}, Slider.DEFAULT, options);

        this.listElement = this.element.querySelector('.slider-list');
        this.items = this.listElement.children;
        this.controls = this.element.querySelectorAll('.slider-control');
        this.indicatorElement = this._createIndicator();
        this.indicators = this.indicatorElement.children;

        this._isSliding = false;
        this._interval = null;

        this._init();
    }

    _createClass(Slider, [{
        key: '_init',
        value: function _init() {
            this._start();
            this._bindEvents();

            this.element.style.display = 'block';
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            this.element.addEventListener('click', this._elementClickHandler.bind(this));
            this.indicatorElement.addEventListener('click', this._indicatorClickHandler.bind(this));
            document.addEventListener('visibilitychange', this._visibilityChangeHandler.bind(this));
        }
    }, {
        key: '_elementClickHandler',
        value: function _elementClickHandler(e) {
            switch (true) {
                case e.target.classList.contains('slider-control'):
                    this._controlClickHandler(e);
                    break;
            }
        }
    }, {
        key: '_controlClickHandler',
        value: function _controlClickHandler(e) {
            this._stop();
            this._slide(e.target.dataset.direction);
        }
    }, {
        key: '_indicatorClickHandler',
        value: function _indicatorClickHandler(e) {

            if (e.target.tagName !== 'SPAN') return;

            var currentElementIndex = Slider._getElementIndex(this._getCurrentElement());
            var indicatorIndex = Slider._getElementIndex(e.target);

            var direction = currentElementIndex < indicatorIndex ? Slider.DIRECTION.NEXT : Slider.DIRECTION.PREV;

            this._stop();
            this._slide(direction, this.items.item(indicatorIndex));
        }
    }, {
        key: '_visibilityChangeHandler',
        value: function _visibilityChangeHandler() {
            document.visibilityState === 'hidden' ? this._stop() : this._start();
        }
    }, {
        key: '_setIndicator',
        value: function _setIndicator(index) {
            this.indicatorElement.querySelector('.active').classList.remove('active');

            this.indicators.item(index).classList.add('active');
        }
    }, {
        key: '_start',
        value: function _start() {

            if (!this.options.slide || this._interval || this.options.slide === 0) return;

            /*this._interval = setInterval(() => {
                this._slide(Slider.DIRECTION.NEXT);
            }, this.options.interval);*/
        }
    }, {
        key: '_stop',
        value: function _stop() {
            if (!this.options.slide) return;

            clearInterval(this._interval);
            this._interval = null;
        }
    }, {
        key: '_slide',
        value: function _slide(direction) {
            var _this = this;

            var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            if (this._isSliding) return;

            var currentElement = this._getCurrentElement(),
                dir = null,
                slideTo = null;

            this._isSliding = true;

            switch (direction) {
                case Slider.DIRECTION.NEXT:
                    this.nextElement = el || currentElement.nextElementSibling || this.items.item(0);
                    dir = 'slider-item-' + Slider.DIRECTION.NEXT;
                    slideTo = 'slide-' + Slider.DIRECTION.LEFT;
                    break;
                case Slider.DIRECTION.PREV:
                    this.nextElement = el || currentElement.previousElementSibling || this.items.item(this.items.length - 1);
                    dir = 'slider-item-' + Slider.DIRECTION.PREV;
                    slideTo = 'slide-' + Slider.DIRECTION.RIGHT;
                    break;
            }

            this._setIndicator(Slider._getElementIndex(this.nextElement));

            /* function transitionComplete(e) {
                 console.log('transitionComplete ', e);
                 console.log('this ', this);
                  console.log('el ', e);
                 const el = e.target;
                 console.log('el ', el);
                   el.classList.remove(dir);
                 el.classList.remove(slideTo);
                 el.classList.remove('active');
                  this.nextElement.classList.remove(dir);
                 this.nextElement.classList.remove(slideTo);
                 this.nextElement.classList.add('active');
                  this._isSliding = false;
                  this.options.callback(this.nextElement);
                  this._start();
                }*/

            /*const func = function(event, t) {
                console.log('t ', t)
                transitionComplete( event );
                currentElement.removeEventListener('transitionend', func);
            };
            */

            //currentElement.addEventListener('transitionend', func, this);


            currentElement.addEventListener('transitionend', function transitionHandler(e) {
                var el = e.target;

                el.removeEventListener(e.type, transitionHandler);

                el.classList.remove(dir);
                el.classList.remove(slideTo);
                el.classList.remove('active');

                this.nextElement.classList.remove(dir);
                this.nextElement.classList.remove(slideTo);
                this.nextElement.classList.add('active');

                this._isSliding = false;

                this._start();
            }.bind(this));

            this.nextElement.classList.add(dir);

            setTimeout(function () {
                currentElement.classList.add(slideTo);
                _this.nextElement.classList.add(slideTo);
            }, 0);

            /*console.log('currentElement ', currentElement)
            currentElement.addEventListener('transitionend', function transitionHandler(e) {
                  const el = e.target;
                console.log('el ', el);
                 el.removeEventListener(e.type, transitionHandler);
                 el.classList.remove(dir);
                el.classList.remove(slideTo);
                el.classList.remove('active');
                 this.nextElement.classList.remove(dir);
                this.nextElement.classList.remove(slideTo);
                this.nextElement.classList.add('active');
                 this._isSliding = false;
                 this.options.callback(this.nextElement);
                 this._start();
             }, true);*/

            /*this.nextElement.classList.add(dir);
             setTimeout(() => {
                currentElement.classList.add(slideTo);
                this.nextElement.classList.add(slideTo);
            }, 0).bind(this)*/
        }
    }, {
        key: '_getCurrentElement',
        value: function _getCurrentElement() {
            return this.listElement.querySelector('.active');
        }
    }, {
        key: '_createIndicator',
        value: function _createIndicator() {
            var indicators = Array.from(this.items).reduce(function (indicators, item, index) {
                return indicators += '<span data-id="' + index + '" class="' + (!index && 'active' || '') + '"></span>';
            }, '');

            this.element.insertAdjacentHTML('afterbegin', '<div class="slider-indicators">' + indicators + '</div>');

            return this.element.querySelector('.slider-indicators');
        }

        /** Public Methods */

    }, {
        key: 'next',
        value: function next() {
            this._slide(Slider.DIRECTION.NEXT);
        }
    }, {
        key: 'prev',
        value: function prev() {
            this._slide(Slider.DIRECTION.PREV);
        }
    }], [{
        key: '_getElementIndex',
        value: function _getElementIndex(el) {
            return Array.from(el.parentNode.children).indexOf(el);
        }
    }]);

    return Slider;
}();

exports.default = Slider;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// util.js

var $on = function $on(target, event, handler) {
  return target.addEventListener(event, handler);
};

exports.$on = $on;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = docReady;
function docReady(callback) {

    function completed() {
        document.removeEventListener("DOMContentLoaded", completed, false);
        window.removeEventListener("load", completed, false);
        callback();
    }

    //Events.on(document, 'DOMContentLoaded', completed)

    if (document.readyState === "complete") {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout(callback);
    } else {

        // Use the handy event callback
        document.addEventListener("DOMContentLoaded", completed, false);

        // A fallback to window.onload, that will always work
        window.addEventListener("load", completed, false);
    }
}

},{}]},{},[1])

//# sourceMappingURL=bundle.js.map
