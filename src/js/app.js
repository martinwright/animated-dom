import "babel-polyfill";
import {$on} from './util';
import DocReady from './windowLoaded';

DocReady(() => {
    console.log("DocReady");

    const app = new App();
    const setView = () => {
        app.startUp();
    };

    $on(window, 'load', setView);
    $on(window, 'hashchange', setView);

});

class App {
    constructor() {

    };

    startUp() {

        console.log('ddd', this);
        /*document.querySelector('.nav-bar .js-play').onclick = (e) => {
            myTimeline.play()
        };
        document.querySelector('.nav-bar .js-pause').onclick = (e) => {
            myTimeline.pause()
        };
        document.querySelector('.nav-bar .js-restart').onclick = (e) => {
            myTimeline.restart()
        };
        document.querySelector('.nav-bar .js-back').onclick = (e) => {
           console.log('back')
            window.location.href = "index.html";
        };
        document.querySelector('.nav-bar .js-next').onclick = (e) => {
            console.log('next')
            window.location.href = "page2.html";
        };*/

        //data-step="9"
        //data-type="right-slide"
        //data-duration="200"
        //data-offset="-=50"

        let defaultDuration = "200",
            defaultOffset = "-=50";

        let anims = {
            'business-admin-l3_t1-u1-p5': {
                1 : {
                    type: "right-slide"
                },
                2 : {
                    type: "right-slide"
                },
                3 : {
                    type: "right-slide"
                },
                4 : {
                    type: "right-slide"
                }
            }
        };

        let url = window.location.pathname;
        let filename = url.substring(url.lastIndexOf('/')+1);


        if (anims[filename]) {
            const animElements = document.querySelectorAll("[data-animate]");

            Array.from(document.querySelectorAll("[data-animate]")).forEach(function (el) {
                let animStep = el.dataset.animate;
                myTimeline.add({
                    targets: el,
                    opacity: '0',
                    translateX: '100',
                    easing: 'easeInQuad',
                    duration: el.dataset.duration || anims[filename][animStep].duration || defaultDuration,
                    offset: el.dataset.offset || anims[filename][animStep].offset || defaultoffset
                });
            });

        }

        

        let myTimeline = anime.timeline({
            direction: 'reverse',
            autoplay: false
        });

        const nodelist = document.querySelectorAll("[data-step]");
        const nodesArray = Array.prototype.slice.call(nodelist);

        //const nodesArray = [...Array.from(document.querySelectorAll("[data-step]"))];

        function sorter(obj1, obj2) {
            return obj1.dataset.step - obj2.dataset.step;
        }

        function renumber(obj, n) {
            console.log('renumber ', obj, n);
            obj.dataset.order = (n - parseInt(obj.dataset.step)).toString();
        }

        let tCols = 4, tRows = 6;
        for (let i = 5; i >= 0; i--) {
            console.log('nth ', (i * 4) + 1, (i * 4) + 4);

            let start = (i * 4) + 1, end = (i * 4) + 4,
                offset = (end === 24 && start === 21) ? '0' : '-=25';

            Array.from(document.querySelectorAll(`.cell:nth-child(n+${start}):nth-child(-n+${end})`)).forEach(function (el) {
                myTimeline.add({
                    targets: el,
                    opacity: '0',
                    translateX: '100',
                    easing: 'easeInQuad',
                    duration: 50,
                    offset: offset
                });
            });
        }

        let myArr = Array.from(nodesArray)
            .sort(sorter)
            .reverse();

        Array.from(myArr)
            .forEach(function (el) {
                let elTarget = `[data-step="${el.dataset.step}"]`;
                let elOffset = el.dataset.offset;
                let elDuration = el.dataset.duration;

                console.log('elDuration', elDuration);

                switch (el.dataset.type) {
                    case 'fade':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: 0,
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset,
                            scale: .5
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
                    case 'right-roll':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: '0',
                            translateX: '20em',
                            rotate: '2turn',
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: Number(elOffset)
                            //scale: 4
                            //translateX: '-350'
                            /*rotate: {
                                value: 25,
                                duration: 2000,
                                easing: 'easeInOutSine'
                            }*/
                            //direction: 'reverse'
                        });
                        break;
                    case 'roll-from-left':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: '0',
                            //translateX: '20em',
                            rotate: '-2turn',
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset,
                            scale: 4,
                            translateY: '-1350'
                            /*rotate: {
                                value: 25,
                                duration: 2000,
                                easing: 'easeInOutSine'
                            }*/
                            //direction: 'reverse'
                        });
                        break;

                    case 'top-roll':
                        myTimeline.add({
                            targets: elTarget,
                            opacity: 0.1,
                            //translateX: '20em',
                            rotate: 270,
                            easing: 'easeInQuad',
                            duration: elDuration,
                            offset: elOffset,
                            //scale: 4,
                            translateY: 1200,
                            translateX: 1200
                            /*rotate: {
                                value: 45,
                                duration: 800,
                                easing: 'easeInOutSine'
                            },*/
                            //direction: 'reverse'
                        });
                        break;
                }
            });


        myTimeline.begin = function () {
            console.log('#################### myTimeline ');

            let wait = setTimeout(function () {
                let wrapper = document.getElementsByClassName("wrapper")[0];
                wrapper.classList.remove('hidden');
            }, 10);
        };

        myTimeline.complete = function() {
            //let wrapper = document.getElementsByClassName("wrapper")[0];
            //wrapper.classList.remove('hidden');

            (document.getElementsByClassName("wrapper")[0]).classList.remove('hidden');

            [].slice.call(document.getElementsByClassName('cell'))
                .forEach(function(elem) {
                    elem.classList.add('--bottom-border');
                });

        };

        myTimeline.play();

        //console.log('myTimeline ', myTimeline);

    }
}

