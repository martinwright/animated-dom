//import "babel-polyfill";
import { $on, qs } from './util';
import DocReady from './windowLoaded';
import Timeline from './timeline';

DocReady(() => {
    //console.log("DocReady");
    const app = new App();
    const loadHandler = () => app.setView();
    const debounce = (fn, time) => {
        //console.log('debounce');
        let timeout;
        return function () {
            const functionCall = () => fn.apply(this, arguments);
            clearTimeout(timeout);
            timeout = setTimeout(functionCall, time);
        }
    }
    $on(window, 'load', loadHandler);
    $on(window, 'hashchange', app.hashChangedHandler.bind(app));
    $on(window, 'resize', debounce((e) => {
        app.resizeHandler();
    }, 250));
});
class App {
    constructor() {
        this.textElementTimeline;
        this.shapeElementTimeline;
        this.animationJson;
        this.throttled = false;
        this.showAnimations = true;
    };

    setView() {
        function getJsonFileName(loc) {
            //console.log('APP: getJsonFileName: ');
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
            return response.json();
        }
        function logResult(result) {
            console.log('APP: logResult: ', result);
            return result;
        }
        function logError(error) {
            console.log('Looks like there was a problem: \n', error);
        }
        function setAminProps(response) {
            console.log('****** setAminProps response', response);
            console.log('****** setAminProps response', this);
            this.animations = response;
        }
        //console.log('****** loadAnimationSeq start');

        this.hidePages();

        console.log('****** fetch ');
        return fetch(getJsonFileName(window.location))
            .then(validateResponse)
            .then(readResponseAsJSON)
            .then(logResult)
            //.then(setAminProps)
            .then(res => this.continueStartUp(res))
            .catch(err => {
                logError(err);
                this.continueStartUp({});
            });
    }

    continueStartUp(json) {
        console.log('****** continueStartUp ', json);
        this.animationJson = json;
        this.displayPage();
        this.doResize();
        this.setNavigationEvents();
        this.resetNavigationStates();
        if (this.showAnimations) this.createAnimationTimelines();
        if (this.showAnimations) this.playTimelines();
    }

    hashChangedHandler() {
        console.log('****** updateView ');
        this.hidePages();
        this.displayPage();
        this.doResize();
        this.resetNavigationStates();
        if (this.showAnimations) this.createAnimationTimelines();
        if (this.showAnimations) this.playTimelines();
    }
    resizeHandler() {
        console.log('****** resizeHandler ');
        this.doResize();
    }

    doResize() {
        console.log('****** doResize');
        let thisPage = qs('#page-' + this.getPageNumber()),
            nextPage = qs('#page-' + this.getPageNumber(1)),
            prevPage = qs('#page-' + this.getPageNumber(-1)),
            isLeft = thisPage.classList.contains('left'),
            isRight = thisPage.classList.contains('right'),
            pageToHide;

        if (isLeft) pageToHide = nextPage;
        if (isRight) pageToHide = prevPage;

        if (window.innerWidth < 900) { //SAME AS tablet-landscape-up
            if (pageToHide) pageToHide.classList.add('hidden');
        } else {
            if (pageToHide) pageToHide.classList.remove('hidden');
        }
        this.resetNavigationStates();
    }

    hidePages() {
        // Set wrapper and pages to hidden    
        const allPages = document.querySelectorAll('.container--layout-1');
        qs('.wrapper').className = 'wrapper hidden';
        [...allPages].forEach(el => {
            el.classList.add('hidden');
        });
    }

    addPageNumber(el, num) {
        el.insertAdjacentHTML('beforeend', `<div class="page-number">${num}</div>`);
    }

    displayPage() {
        let currentPageNum = this.getPageNumber();
        const currentPageNode = qs('#page-' + currentPageNum),
            isLeft = currentPageNode.classList.contains('left'),
            isRight = currentPageNode.classList.contains('right');

        this.addPageNumber(currentPageNode, currentPageNum);

        // Show current page and left or right page
        currentPageNode.classList.remove('hidden');
        if (isLeft) {
            qs(`#page-${currentPageNum + 1}`).classList.remove('hidden');
            this.addPageNumber(qs(`#page-${currentPageNum + 1}`), currentPageNum + 1);
        }
        if (isRight) {
            qs(`#page-${currentPageNum - 1}`).classList.remove('hidden');
            this.addPageNumber(qs(`#page-${currentPageNum + 1}`), currentPageNum - 1);
        }
        // show wrapper
        qs('.wrapper').classList.remove('hidden');
    }

    getPageNumber(num = 0) {
        let currentHash = location.hash || '#1';
        return (+currentHash.replace('#', '')) + num;
    }
    setNavigationEvents() {
        //console.log('****** setNavigationStates');
        location.hash = location.hash || '#1';
        qs('.nav-bar .js-back').onclick = (e) => this.previousClick();
        qs('.nav-bar .js-next').onclick = (e) => this.nextClick();
        qs('.nav-bar .js-replay').onclick = (e) => this.replayAnimation();
        qs('.nav-bar .js-animation input').checked = this.showAnimations;
        qs('.nav-bar .js-animation input').onclick = (e) => this.toggleAnimation(e);
    }
    resetNavigationStates() {
        let thisPage = qs('#page-' + this.getPageNumber()),
            nextPage = qs('#page-' + this.getPageNumber(1)),
            prevPage = qs('#page-' + this.getPageNumber(-1));

        if (prevPage) {
            if (prevPage.classList.contains('left')) {
                if (prevPage.classList.contains('hidden')) {
                    enablePrevioust();
                } else {
                    prevPage = qs('#page-' + this.getPageNumber(-2));
                    if (prevPage) {
                        enablePrevioust();
                    } else {
                        disablePrevious();
                    }
                }
            } else {
                enablePrevioust();
            }
        } else {
            disablePrevious();
        }

        if (nextPage) {
            if (nextPage.classList.contains('right')) {
                if (nextPage.classList.contains('hidden')) {
                    enableNext();
                } else {
                    // Already visible
                    nextPage = qs('#page-' + this.getPageNumber(2));
                    if (nextPage) {
                        enableNext();
                    } else {
                        disableNext();
                    }
                }
            } else {
                enableNext();
            }
        } else {
            disableNext();
        }

        function disablePrevious() {
            qs('.nav-bar .js-back').setAttribute("disabled", "");
        }
        function enablePrevioust() {
            qs('.nav-bar .js-back').removeAttribute("disabled");
        }
        function disableNext() {
            qs('.nav-bar .js-next').setAttribute("disabled", "");
        }
        function enableNext() {
            qs('.nav-bar .js-next').removeAttribute("disabled");
        }
    }
    toggleAnimation(e) {
        //console.log('****** toggleAnimation ', e.target.checked);
        this.showAnimations = e.target.checked;
    }
    replayAnimation() {
        if (this.textElementTimeline) this.textElementTimeline.replayAnimation();
        if (this.shapeElementTimeline) this.shapeElementTimeline.replayAnimation();
    }
    nextClick() {
        if (qs('#page-' + this.getPageNumber()).classList.contains('left')
            && qs('#page-' + this.getPageNumber(1))
            && !qs('#page-' + this.getPageNumber(1)).classList.contains('hidden')) {
            this.navigateToPage(this.getPageNumber(2));
        } else {
            this.navigateToPage(this.getPageNumber(1));
        }
    }
    previousClick() {
        if (qs('#page-' + this.getPageNumber()).classList.contains('right')
            && qs('#page-' + this.getPageNumber(-1))
            && !qs('#page-' + this.getPageNumber(-1)).classList.contains('hidden')) {
            this.navigateToPage(this.getPageNumber(-2));
        } else {
            this.navigateToPage(this.getPageNumber(-1));
        }
    }
    navigateToPage(p) {
        location.hash = '#' + p;
        this.resetNavigationStates();
    }

    playTimelines() {
        if (this.textElementTimeline) this.textElementTimeline.startAmnimation();
        if (this.shapeElementTimeline) this.shapeElementTimeline.startAmnimation();
    }

    createAnimationTimelines() {
        //console.log('****** createAnimationTimelines ')
        const defaultDuration = "200",
            defaultOffset = "-=50",
            currentPageNum = this.getPageNumber(),
            currentPageNode = qs('#page-' + currentPageNum),
            prevPageNode = qs('#page-' + (currentPageNum - 1)),
            nextPageNode = qs('#page-' + (currentPageNum + 1)),
            isLeft = currentPageNode.classList.contains('left'),
            isRight = currentPageNode.classList.contains('right');

        const [...currentPageNodelist] = document.querySelectorAll('#page-' + currentPageNum + ' [data-animate]'),
            [...lefttNodelist] = document.querySelectorAll('#page-' + (currentPageNum - 1) + ' [data-animate]'),
            [...rightNodelist] = document.querySelectorAll('#page-' + (currentPageNum + 1) + ' [data-animate]');
        let completeTextNodeList,
            completeShapeNodeList;

        console.log('****** thisNodelist ', currentPageNodelist)
        //console.log('****** lefttNodelist ', lefttNodelist)
        //console.log('****** rightNodelist ', rightNodelist)
        //console.log('****** isLeft ', isLeft)
        //console.log('****** isLeft ', isRight)

        if (isLeft && nextPageNode && nextPageNode.classList.contains('right') && !nextPageNode.classList.contains('hidden')) {
            // Combine next page nodes
            //console.log('****** nextPageNode ', nextPageNode.classList.contains('hidden'))
            //console.log('****** nextPageNode ', nextPageNode)

            const currentPageTextNodelistSorted = getTextNodes(currentPageNodelist, currentPageNum),
                currentPageShapeNodelistSorted = getShapeNodes(currentPageNodelist, currentPageNum),
                nextPageTextNodelistSorted = getTextNodes(rightNodelist, currentPageNum + 1),
                nextPageShapeNodelistSorted = getShapeNodes(rightNodelist, currentPageNum + 1);


            completeTextNodeList = [...nextPageTextNodelistSorted, ...currentPageTextNodelistSorted];
            completeShapeNodeList = [...nextPageShapeNodelistSorted, ...currentPageShapeNodelistSorted];

        } else if (isRight && prevPageNode && prevPageNode.classList.contains('left') && !prevPageNode.classList.contains('hidden')) {
            // Combine previous page nodes
            const currentPageTextNodelistSorted = getTextNodes(currentPageNodelist, currentPageNum),
                currentPageShapeNodelistSorted = getShapeNodes(currentPageNodelist, currentPageNum),
                previousPageTextNodelistSorted = getTextNodes(lefttNodelist, currentPageNum - 1),
                previousPageShapeNodelistSorted = getShapeNodes(lefttNodelist, currentPageNum - 1);


            completeTextNodeList = [...currentPageTextNodelistSorted, ...previousPageTextNodelistSorted];
            completeShapeNodeList = [...currentPageShapeNodelistSorted, ...previousPageShapeNodelistSorted];

        } else {
            // This page nodes only
            completeTextNodeList = getTextNodes(currentPageNodelist, currentPageNum);
            completeShapeNodeList = getShapeNodes(currentPageNodelist, currentPageNum);

            /* const currentPageTextNodes = completeTextNodeList.map(el => {
                el.pageNumber = currentPageNum;
                return el;
            })
            const currentPageShapeNodes = completeShapeNodeList.map(el => {
                el.pageNumber = currentPageNum;
                return el;
            }) */
            //console.log('****** currentPageTextNodes', completeTextNodeList);
            //console.log('****** currentPageShapeNodes', completeShapeNodeList);
        }

        function getTextNodes(nodes, page, counter = 0) {
            return nodes.filter(node => /P|H1|H2|H3|H4|H5|LI|DIV/.test(node.nodeName))
                .map(node => {
                    let step = node.getAttribute('data-animate');
                    if (!step || step === '*' || step === '') {
                        counter++;
                        node.setAttribute('data-animate', counter)
                    } else {
                        counter = +step;
                    }
                    return node;
                })
                .sort(sorter)
                .reverse()
                .map(node => {
                    node.pageNumber = page;
                    return node;
                })
        }
        function getShapeNodes(nodes, page) {
            return nodes.filter(node => /FIGURE|IMG/.test(node.nodeName))
                .sort(sorter)
                .reverse()
                .map(node => {
                    node.pageNumber = page;
                    return node;
                })
        }
        function sorter(obj1, obj2) {
            return obj1.dataset.animate - obj2.dataset.animate;
        }
        //console.log('****** completeTextNodeList ', completeTextNodeList)
        //console.log('****** completeShapeNodeList ', completeShapeNodeList)
        //console.log('****** setAminProps response', this.animations);

        if (completeTextNodeList.length) {
            this.textElementTimeline = new Timeline(completeTextNodeList, this.animationJson);
            this.textElementTimeline.setup();
        }
        if (completeShapeNodeList.length) {
            this.shapeElementTimeline = new Timeline(completeShapeNodeList, this.animationJson);
            this.shapeElementTimeline.setup();
        }
        console.log('****** textElementTimeline', this.textElementTimeline);

        return;

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
