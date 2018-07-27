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

        let wrapper = document.getElementsByClassName("js-container")[0];
        console.log('wrapper: ', wrapper);
        wrapper.classList.add('hidden');


        let animations,
            myTimeline;

        let defaultDuration = "200",
            defaultOffset = "-=50";


        const nodelist = document.querySelectorAll("[data-animate]");
        const nodesArray = Array.prototype.slice.call(nodelist);


        function handleErrors(response) {
            console.log(`handleErrors: ${response.ok}`);
            if (!response.ok) {
                throw Error(response.statusText + 'V');
            }
            return response;
        }

        function getJsonFileName(loc) {
            //url = url.pathname;
            //let filename = url.substring(url.lastIndexOf('/')+1);

            let [fileName, foldername, ...rest] = loc.href.split('/').reverse();
            //let filename = (url.split('\\').pop().split('/').pop().split('.'))[0];
            //console.log('url: ', url);
            console.log('fileName: ', fileName);
            console.log('foldername: ', foldername);
            console.log('rest: ', rest);

            return loc.origin + '/' + foldername + '/' + fileName.split('.')[0] + '.json';

        }

        function setAminProbs(response) {
            animations = response.json();
        }


        fetch(getJsonFileName(window.location))
            .then(handleErrors)
            .then(response => response.json())
            .then(j => buildAnimationSteps(j))
            .catch(error => {
                console.error(`Error in xxx fetch: ${error.message}`);
                buildAnimationSteps({});
            });

        function getElementsWithAmimate() {
            return Array.from(document.querySelectorAll("[data-animate]"))
        }

        function getAnimProp(step, prop, defaultVal) {
            console.log('getAnimProp: ', step);

            return defaultVal;

            try {
                /*let ret = animations.steps;
                console.log('ret: ', ret);
                if (ret) ret = ret[step];
                if (ret) ret = ret[prop];*/

                return animations.steps[step][prop];
            } catch (e) {
                return defaultVal;
            }
        }

        function sorter(obj1, obj2) {
            return obj1.dataset.animate - obj2.dataset.animate;
        }

        function buildAnimationSteps(json) {
            animations = json;
            console.log('buildAnimationSteps animations: ', animations);

            myTimeline = anime.timeline({
                direction: 'reverse',
                autoplay: false
            });


            let myArr = Array.from(nodesArray)
                    .sort(sorter)
                    .reverse(),
                animationStep = 0;


            //const animElements = document.querySelectorAll("[data-animate]");

            console.log('myArr: ', myArr);

            myArr.forEach(function (el) {
                let animStep = el.dataset.animate;
                console.log('animStep: ', animStep);
                myTimeline.add({
                    targets: el,
                    opacity: '0',
                    translateX: '100',
                    easing: 'easeInQuad',
                    //duration: el.dataset.duration || getAnimProp(animStep, 'duration', defaultDuration),
                    duration: defaultDuration,
                    //offset: el.dataset.offset || getAnimProp(animStep, 'offset', defaultDuration)
                    offset: defaultOffset
                });
            });

            myTimeline.play();


            myTimeline.begin = function () {
                console.log('#################### myTimeline ');

                let wait = setTimeout(function () {
                    let wrapper = document.getElementsByClassName("js-container")[0];
                    wrapper && wrapper.classList.remove('hidden');
                }, 10);
            };

            myTimeline.complete = function () {
                //let wrapper = document.getElementsByClassName("wrapper")[0];
                //wrapper.classList.remove('hidden');

                //(document.getElementsByClassName("wrapper")[0]).classList.remove('hidden');

                [].slice.call(document.getElementsByClassName('cell'))
                    .forEach(function (elem) {
                        elem.classList.add('--bottom-border');
                    });

            };

        }


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


        //const nodesArray = [...Array.from(document.querySelectorAll("[data-step]"))];

        /*function renumber(obj, n) {
            console.log('renumber ', obj, n);
            obj.dataset.order = (n - parseInt(obj.dataset.step)).toString();
        }*/


        // TODO table animation
        /* let tCols = 4, tRows = 6;
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
         }*/


        // TODO various anim types
        /*Array.from(myArr)
            .forEach(function (el) {
                let elTarget = `[data-step="${el.dataset.step}"]`,
                    elOffset = el.dataset.offset,
                    elDuration = el.dataset.duration;
                animationStep++;

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
                            /!*rotate: {
                                value: 25,
                                duration: 2000,
                                easing: 'easeInOutSine'
                            }*!/
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
                            /!*rotate: {
                                value: 25,
                                duration: 2000,
                                easing: 'easeInOutSine'
                            }*!/
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
                            /!*rotate: {
                                value: 25,
                                duration: 2000,
                                easing: 'easeInOutSine'
                            }*!/
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
                            /!*rotate: {
                                value: 45,
                                duration: 800,
                                easing: 'easeInOutSine'
                            },*!/
                            //direction: 'reverse'
                        });
                        break;
                }
            });*/


    }
}

