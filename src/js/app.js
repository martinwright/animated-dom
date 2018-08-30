//import "babel-polyfill";
import { $on, qs } from './util';
import DocReady from './windowLoaded';
import Timeline from './timeline';

DocReady(() => {
    console.log("DocReady");

    const app = new App();
    const setView = () => app.startUp();
    const updateView = () => app.updateView();

    $on(window, 'load', setView);
    $on(window, 'hashchange', updateView);
    //$on(window, 'resize', app.doResize);

});

class App {
    constructor() {
        this.textElementTimeline;
        this.shapeElementTimeline;
        this.animationJson;
    };

    doResize() {

        //console.log('****** doResize');
        //let app = this;
        //this.doFunc();
        var w = window.innerWidth;
        //console.log('doResize:' + w);
        let currentHash = location.hash || '#1';
        let currentPageNum = (currentHash.replace('#', ''));
        //console.log('***PETE : currentPageNum:' + currentPageNum);
        let page = document.querySelector('#page-' + currentPageNum);
        //
        let pageToHide;
        //let leftElementParent = page.parentNode;
        //console.log('page:'+page.outerHTML);
        let isLeft = page.className.split(' ').indexOf('left');
        //console.log('leftElement:'+leftElement);
        if (isLeft >= 0) {
            //console.log('left found');
            var nextPageNum = Number(currentPageNum) + 1;
            //console.log('***PETE : nextPageNum:' + nextPageNum);
            pageToHide = document.querySelector('#page-' + nextPageNum);
            //pageToHide = pageR;
            //console.log('pageToHide:'+pageToHide.outerHTML);
        }
        let isRight = page.className.split(' ').indexOf('right');
        if (isRight >= 0) {
            //console.log('right found');
            var prevPageNum = Number(currentPageNum) - 1;
            //console.log('nextPageNum:'+nextPageNum);
            pageToHide = document.querySelector('#page-' + prevPageNum);
            //pageToHide = pageR;
            //console.log('pageToHide:'+pageToHide.outerHTML);
        }
        if (w < 900) { //SAME AS tablet-landscape-up
            if (pageToHide) {
                pageToHide.classList.add('hidden');
            }

            //console.log('currentPageNum:'+currentPageNum);
        } else {
            if (pageToHide) {
                pageToHide.classList.remove('hidden');
            }
        }
    }

    hidePages() {
        // Set wrapper and pages to hidden    
        const allPages = document.querySelectorAll('.container--layout-1');
        qs('.wrapper').className = 'wrapper hidden';
        [...allPages].forEach(el => {
            el.classList.add('hidden');
        });
    }

    displayPage() {
        let currentPageNum = this.getNextPageNumber();
        const currentPageNode = qs('#page-' + currentPageNum),
            isLeft = currentPageNode.classList.contains('left'),
            isRight = currentPageNode.classList.contains('right');

        // Show current page and left or right page
        currentPageNode.classList.remove('hidden');
        if (isLeft) qs(`#page-${currentPageNum + 1}`).classList.remove('hidden');
        if (isRight) qs(`#page-${currentPageNum - 1}`).classList.remove('hidden');

        // show wrapper
        qs('.wrapper').classList.remove('hidden');
    }

    getNextPageNumber(num = 0) {
        let currentHash = location.hash || '#1';
        return (+currentHash.replace('#', '')) + num;
    }
    setNavigationStates() {
        console.log('****** setNavigationStates');
        location.hash = location.hash || '#1';

        if (!location.hash || location.hash == '#1') {
            document.querySelector('.nav-bar .js-back').setAttribute("disabled", "");
        } else {
            document.querySelector('.nav-bar .js-back').removeAttribute("disabled");
        }

        document.querySelector('.nav-bar .js-back').onclick = (e) => {
            location.hash = this.getNextPageNumber(-1);
            //loadPage();
        };
        document.querySelector('.nav-bar .js-next').onclick = (e) => {
            location.hash = this.getNextPageNumber(+1);
            //loadPage();
        };
    }

    startUp() {

        function getJsonFileName(loc) {
            console.log('APP: getJsonFileName: ');
            let [fileName, foldername, ...rest] = loc.href.split('/').reverse();
            //return loc.origin + '/' + foldername + '/' + fileName.split('.')[0] + '.json';
            return loc.origin + '/' + foldername + '/animate.json';
        }
        function validateResponse(response) {
            console.log('APP: validateResponse: ', response);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }
        function readResponseAsJSON(response) {
            console.log('APP: readResponseAsJSON: ', response);
            return response;
        }
        function logResult(result) {
            console.log('APP: logResult: ', result);
            return result;
        }
        function logError(error) {
            console.log('Looks like there was a problem: \n', error);
        }
        function setAminProbs(response) {
            this.animations = response;
        }
        console.log('****** loadAnimationSeq start');

        this.hidePages();

        return fetch(getJsonFileName(window.location))
            .then(validateResponse)
            .then(readResponseAsJSON)
            .then(logResult)
            .then(setAminProbs)
            .then(this.continueStartUp)
            .catch(err => {
                logError(err);
                this.continueStartUp({});
            });
    }

    continueStartUp(json) {
        this.animationJson = json;
        this.createAnimationTimelines();
        this.displayPage();
        this.playTimelines();
        this.setNavigationStates();
    }
    updateView() {
        this.hidePages();
        this.displayPage();
        this.setNavigationStates();
    }

    playTimelines() {
        if (this.textElementTimeline) this.textElementTimeline.startAmnimation();
        if (this.shapeElementTimeline) this.shapeElementTimeline.startAmnimation();
    }

    createAnimationTimelines() {
        let defaultDuration = "200",
            defaultOffset = "-=50";

        const nodelist = document.querySelectorAll('#page-' + this.getNextPageNumber() + ' [data-animate]');
        const nodesArray = Array.prototype.slice.call(nodelist);
        const textElements = nodesArray.filter(node => /P|H1|H2|H3|H4|H5/.test(node.nodeName))
            .sort(sorter)
            .reverse()

        const shapeElements = nodesArray.filter(node => /FIGURE/.test(node.nodeName))
            .sort(sorter)
            .reverse()

        //console.log('****** textElements ', textElements);
        //console.log('****** shapeElements ', shapeElements);

        if (textElements.length) {
            this.textElementTimeline = new Timeline(textElements, this.animationJson);
            this.textElementTimeline.setup();
        }
        if (shapeElements.length) {
            this.shapeElementTimeline = new Timeline(shapeElements, this.animationJson);
            this.shapeElementTimeline.setup();
        }

        function sorter(obj1, obj2) {
            return obj1.dataset.animate - obj2.dataset.animate;
        }
    }
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
