import "babel-polyfill";
import {$on, qs} from './util';
import DocReady from './windowLoaded';

DocReady(() => {
    console.log("DocReady");

    const app = new App();
    const setView = () => {
        app.startUp();
    };

    $on(window, 'load', setView);
    $on(window, 'hashchange', setView);
    $on(window, 'resize', app.doResize);

});

class App {
    constructor() {

    };

    doResize() {
        //let app = this;
        //this.doFunc();
        var w = window.innerWidth;
       console.log('doResize:'+w);
        let currentHash = location.hash || '#1';
        let currentPageNum = (currentHash.replace('#', ''));
        console.log('currentPageNum:'+currentPageNum);
        let page = document.querySelector('#page-'+currentPageNum);
        //
        let pageToHide;
        //let leftElementParent = page.parentNode;
        //console.log('page:'+page.outerHTML);
        let isLeft = page.className.split(' ').indexOf('left');
        //console.log('leftElement:'+leftElement);
        if(isLeft>=0){
            console.log('left found');
            var nextPageNum = Number(currentPageNum)+1;
            //console.log('nextPageNum:'+nextPageNum);
            pageToHide = document.querySelector('#page-'+nextPageNum);
            //pageToHide = pageR;
            //console.log('pageToHide:'+pageToHide.outerHTML);
        }
        let isRight = page.className.split(' ').indexOf('right');
        if(isRight>=0){
            console.log('right found');
            var prevPageNum = Number(currentPageNum)-1;
            //console.log('nextPageNum:'+nextPageNum);
            pageToHide = document.querySelector('#page-'+prevPageNum);
            //pageToHide = pageR;
            //console.log('pageToHide:'+pageToHide.outerHTML);
        }
        if (w<900) { //SAME AS tablet-landscape-up
            if(pageToHide){
                pageToHide.classList.add('hidden');
            }

            //console.log('currentPageNum:'+currentPageNum);
        }else{
            if(pageToHide){
                pageToHide.classList.remove('hidden');
            }
        }
    }

    doFunc() {
        alert('doFunc');
    }

    hasSomeParentTheClass(element, classname) {
        //
        // If we are here we didn't find the searched class in any parents node
        //
        if (!element.parentNode) return false;
        //
        // If the current node has the class return true, otherwise we will search
        // it in the parent node
        //
        if (element.className.split(' ').indexOf(classname)>=0) return element;
        return this.hasSomeParentTheClass(element.parentNode, classname);
    }


    startUp() {

        console.log('****** startUp');
        let app = this;

        //this.doHashChange();

        //app.doFunc();

         let wrapper = document.querySelector('.wrapper');
        // let wrapperClassListDefault = wrapper.classList;


        if (!location.hash) {
            location.hash = '#1';
            qs('.nav-bar .js-back').setAttribute("disabled", "");
        }
        loadPage();


        function setNavState() {
            if (!location.hash || location.hash == '#1') {
                document.querySelector('.nav-bar .js-back').setAttribute("disabled", "");
            } else {
                document.querySelector('.nav-bar .js-back').removeAttribute("disabled");
            }
        }

        function getNextPageNumber(num = 0) {
            let currentHash = location.hash || '#1';
            return (+currentHash.replace('#', '')) + num;
        }

        // function hasSomeParentTheClass(element, classname) {
        //     //
        //     // If we are here we didn't find the searched class in any parents node
        //     //
        //     if (!element.parentNode) return false;
        //     //
        //     // If the current node has the class return true, otherwise we will search
        //     // it in the parent node
        //     //
        //     if (element.className.split(' ').indexOf(classname)>=0) return element;
        //     return hasSomeParentTheClass(element.parentNode, classname);
        // }

        function loadPage() {
            console.log('****** loadPage');
            //app.doFunc();
            //location.reload();

            //let page = qs(`#page-${getNextPageNumber()}`);
            //let wrapper = document.querySelector('.wrapper');
            wrapper.className = 'wrapper hidden';
            //wrapper.className = wrapperClassListDefault.toString(); // SET WRAPPER CLASS TO DEFAULT

            //console.log('wrapperClassListDefault:'+wrapperClassListDefault);
            let allPages = document.querySelectorAll('.container--layout-1');

            allPages.forEach(function(userItem) {
                userItem.classList.add('hidden');
            });
            let currentPageNum = getNextPageNumber();
            let page = document.querySelector('#page-'+currentPageNum);
            page.classList.remove('hidden');

            //console.log('checkParentClass:'+hasSomeParentTheClass(page, 'left'));
            //var w = window.innerWidth;
            // if (w<900){ //SAME AS tablet-landscape-up
            //     console.log('doResize:'+w);
            // }
            let leftElement = app.hasSomeParentTheClass(page, 'left');

            if(leftElement){
                console.log('left found');
                //console.log('leftElement:'+leftElement.outerHTML);
                let pageR = document.querySelector('#page-'+(currentPageNum+1));
                pageR.classList.remove('hidden');

                //let myGridClass = leftElement.getAttribute("grid");
                //console.log('myGridClass: ', myGridClass);

                //wrapper.classList.add(myGridClass);
            }

            let rightElement = app.hasSomeParentTheClass(page, 'right');

            if(rightElement){
                console.log('right found');
                let pageL = document.querySelector('#page-'+(currentPageNum-1));
                pageL.classList.remove('hidden');

                //let leftContainer = hasSomeParentTheClass(page, 'right');
                //console.log('pageL:'+pageL.outerHTML);
                //let myGridClass = pageL.getAttribute("grid");
                //console.log('myGridClass: ', myGridClass);

                //wrapper.classList.add(myGridClass);
            }


            //console.log('page: ', page);

            app.doResize();

            wrapper.classList.remove('hidden');

            setNavState();
        }

        document.querySelector('.nav-bar .js-back').onclick = (e) => {
            location.hash = getNextPageNumber(-1);
            //loadPage();
        };

        document.querySelector('.nav-bar .js-next').onclick = (e) => {
            location.hash = getNextPageNumber(+1);
            //loadPage();
        };



        //return;
        ///////////// Start Animation ////////////


        let animations,
            myTimeline;

        let defaultDuration = "200",
            defaultOffset = "-=50";


        const nodelist = document.querySelectorAll('#page-'+getNextPageNumber() + ' [data-animate]');
        const nodesArray = Array.prototype.slice.call(nodelist);


        function handleErrors(response) {
            console.log(`handleErrors: ${response.ok}`);
            if (!response.ok) {
                throw Error(response.statusText + 'V');
            }
            return response;
        }

        function getJsonFileName(loc) {
            let [fileName, foldername, ...rest] = loc.href.split('/').reverse();
            //console.log('fileName: ', fileName);
            //console.log('foldername: ', foldername);
            //console.log('rest: ', rest);
            //return loc.origin + '/' + foldername + '/' + fileName.split('.')[0] + '.json';

            return loc.origin + '/' + foldername + '/animate.json';

        }

        function setAminProbs(response) {
            animations = response.json();
        }


        fetch(getJsonFileName(window.location))
            .then(handleErrors)
            .then(response => response.json())
            .then(j => buildAnimationSteps(j))
            .catch(error => {
                console.error(`Error in fetch: ${error.message}`);
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

                let offset = el.dataset.offset || getAnimProp(animStep, 'offset', defaultOffset),
                    duration = el.dataset.duration || getAnimProp(animStep, 'duration', defaultDuration);
                //console.log('offset: ', offset);

                myTimeline.add({
                    targets: el,
                    opacity: '0',
                    translateX: '100',
                    easing: 'easeInQuad',
                    duration: duration,
                    offset: offset
                });
            });


            console.log('myTimeline: ', myTimeline);

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

