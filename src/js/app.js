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

        /*let animations = {
            'business-admin-l3_t1-u1-p5': {
                1: {
                    type: "right-slide"
                },
                2: {
                    type: "right-slide"
                },
                3: {
                    type: "right-slide"
                },
                4: {
                    type: "right-slide"
                }
            }
        };*/

        function getAmimationJson (loc) {
            //url = url.pathname;
            //let filename = url.substring(url.lastIndexOf('/')+1);

            let [fileName, foldername, ...rest] = loc.href.split('/').reverse();
            //let filename = (url.split('\\').pop().split('/').pop().split('.'))[0];
            //console.log('url: ', url);
            console.log('fileName: ', fileName);
            console.log('foldername: ', foldername);
            console.log('rest: ', rest);

            let animFile = loc.origin+'/'+foldername+'/'+fileName.split('.')[0]+'.json';
            console.log('animFile: ', animFile);


            return fetch(animFile)
                .then(response => {
                    console.log('response: ', response);
                    if (response.ok) {
                        return response;
                    } else {
                        let errorMessage = `${response.status} (${response.statusText})`,
                            error = new Error(errorMessage);
                        throw(error);
                    }
                })
                .then(response => response.json())
                .then(body => {
                    console.log(body);
                })
                .catch(error => console.error(`Error in fetch: ${error.message}`));


        }


        let animations = getAmimationJson(window.location);
        console.log('animations: ', animations);
        console.log('window.location: ', window.location);





        let myTimeline = anime.timeline({
            direction: 'reverse',
            autoplay: false
        });

        function getAnimProp(file, step, prop, defaultVal) {
            try {
                return animations[file][step][prop];
            } catch (e) {
                return defaultVal;
            }
        }



        if (animations[filename]) {
            const animElements = document.querySelectorAll("[data-animate]");

            Array.from(document.querySelectorAll("[data-animate]")).forEach(function (el) {
                let animStep = el.dataset.animate;
                myTimeline.add({
                    targets: el,
                    opacity: '0',
                    translateX: '100',
                    easing: 'easeInQuad',
                    duration: el.dataset.duration || getAnimProp(filename, animStep, 'duration', defaultDuration),
                    offset: el.dataset.offset || getAnimProp(filename, animStep, 'offset', defaultDuration)
                });
            });
        }

        const nodelist = document.querySelectorAll("[data-step]");
        const nodesArray = Array.prototype.slice.call(nodelist);

        //const nodesArray = [...Array.from(document.querySelectorAll("[data-step]"))];

        /*function renumber(obj, n) {
            console.log('renumber ', obj, n);
            obj.dataset.order = (n - parseInt(obj.dataset.step)).toString();
        }*/


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

        function sorter(obj1, obj2) {
            return obj1.dataset.step - obj2.dataset.step;
        }

        let myArr = Array.from(nodesArray)
                .sort(sorter)
                .reverse(),
            animationStep = 0;




        Array.from(myArr)
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

        myTimeline.complete = function () {
            //let wrapper = document.getElementsByClassName("wrapper")[0];
            //wrapper.classList.remove('hidden');

            (document.getElementsByClassName("wrapper")[0]).classList.remove('hidden');

            [].slice.call(document.getElementsByClassName('cell'))
                .forEach(function (elem) {
                    elem.classList.add('--bottom-border');
                });

        };

        myTimeline.play();

        //console.log('myTimeline ', myTimeline);

    }
}

