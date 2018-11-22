import { qs } from './util';

export default class Timeline {
    constructor(el, anim) {
        //console.log('????????? anim', anim);
        this.elementsList = el;
        this.animationJson = anim;
        this.timeline;
        //console.log('????????? el', el);
        //console.log('????????? anim', anim);
    };

    getAnimProp(page, step, prop, defaultVal) {
        //console.log('>>>>>>>>> page', page);
        //console.log('>>>>>>>>> step', step);
        //console.log('>>>>>>>>> prop', prop);
        //console.log('getAnimProp: ', step);
        //return defaultVal;

        try {
            //console.log('this.animationJson.screens[page]: ', this.animationJson.screens[page].steps[String(step)][prop]);
            let returnValue = this.animationJson.screens[page].steps[String(step)][prop];

            //if (ret) ret = ret[step];
            //if (ret) ret = ret[prop];
            //return defaultVal;
            return returnValue;
        } catch (e) {
            //console.log('catch: ', e);
            return defaultVal;
        }
    }

    startAmnimation() {
        //console.log('????????? setAnimations start');
        //this.timeline.play();
        console.log('????????? this.timeline', this.timeline);
        this.timeline.reverse();
        this.timeline.play();
    }
    replayAnimation() {
        this.timeline.restart();
        this.timeline.reverse();
    }

    setup() {
        console.log('????????? setAnimations setup');
        let defaultDuration = this.animationJson.params ? this.animationJson.params.defaultDuration : "400",
            defaultType = "slide-left",
            defaultOffset = this.animationJson.params ? +this.animationJson.params.defaultOffset : 50;


        if (!this.elementsList.length) return;

        this.timeline = anime.timeline({
            //direction: 'reverse',
            autoplay: false
        });

        this.elementsList.forEach((el, index) => {
            el.classList.add('hidden');
            let animStep = el.dataset.animate,
                animPage = el.pageNumber;

            defaultType = "slide-left";
            //console.log('*********** el.nodeName: ', el.nodeName);
            if (/IMG/.test(el.nodeName)) {
                //console.log('*********** el: ', qs('img', el).src);
                let img = qs('img', el);
                if (el.src) {
                    let [fileName, ...rest] = el.src.split('/').reverse();
                    //console.log('*********** fileName: ', fileName);
                    if (fileName && /^cir-.*\.svg$/.test(fileName)) {
                        //console.log('*********** CIRCLE: ', fileName);
                        defaultType = "zoom-out";
                    }
                    if (fileName && /^(dia|dec|hex|pen|squ)-.*\.svg$/.test(fileName)) {
                        //console.log('*********** DIAMOND: ', fileName);
                        defaultType = "roll-from-right";
                    }
                    if (fileName && /^.*\.(jpg|png)$/.test(fileName)) {
                        //console.log('*********** JPG: ', fileName);
                        defaultType = "zoom-in";
                    }
                }
            }
            if (/DIV/.test(el.nodeName)) {
                if (el.classList.contains('cell')) {
                    //defaultDuration = 100;
                    //defaultOffset = 30;
                    //el.style.borderColor = "white";
                }
            }



            //document.querySelectorAll('#myDiv img')[0].src


            //console.log('animStep: ', animStep);
            //console.log('animPage: ', animPage);
            defaultOffset = defaultOffset + 50;
            let offset = el.dataset.offset || this.getAnimProp(animPage, animStep, 'offset', defaultOffset),
                duration = el.dataset.duration || this.getAnimProp(animPage, animStep, 'duration', defaultDuration),
                type = el.dataset.type || this.getAnimProp(animPage, animStep, 'type', defaultType);


            //if (index === 0) offset = '0';
            //console.log('duration: ', duration);
            //console.log('el: ', el);


            function logAnimProgress(anim) {
                console.log('################### logAnimProgress: ', anim);
            }
            console.log('type: ', type);
            switch (type) {
                case 'loop-large-ccw':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        //translateX: '20em',
                        rotate: '1turn',
                        translateX: '800',
                        easing: 'easeInQuad',
                        //direction: 'reverse',
                        duration: duration * 2,
                        offset: offset,
                        scale: 3
                        //transformOrigin: "50% 50%"
                    });
                    break;
                case 'loop-large-cw':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        //translateX: '20em',
                        rotate: '-1turn',
                        translateX: '800',
                        easing: 'easeInQuad',
                        //direction: 'reverse',
                        duration: duration * 2,
                        offset: offset,
                        scale: 3
                        //transformOrigin: "50% 50%"
                    });
                    break;
                case 'zoom-in':
                    this.timeline.add({
                        update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        easing: 'easeInQuad',
                        duration: duration,
                        offset: offset,
                        scale: .5,
                        //transformOrigin: "50% 50%"
                    });
                    break;
                case 'zoom-out':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        easing: 'easeInQuad',
                        duration: duration,
                        offset: offset,
                        scale: el.dataset.scale || 2,
                        //transformOrigin: "50% 50%"
                    });
                    break;
                case 'roll-from-right':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        translateX: '600',
                        //translateX: '20em',
                        rotate: '1turn',
                        easing: 'easeInQuad',
                        //direction: 'reverse',
                        duration: duration,
                        offset: offset

                        //scale: 4,
                        //transformOrigin: "50% 50%"
                    });
                    break;

                case 'roll-from-left':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        translateX: '-400',
                        //translateX: '20em',
                        rotate: '1turn',
                        easing: 'easeInQuad',
                        //direction: 'reverse',
                        duration: duration,
                        offset: offset,

                        //scale: 4,
                        //transformOrigin: "50% 50%"
                    });
                    break;
                case 'slide-left':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: 0,
                        translateX: '300',
                        easing: 'easeInQuad',
                        duration: duration,
                        //direction: 'reverse',
                        offset: offset
                    });
                    break;
                case 'slide-right':
                    this.timeline.add({
                        targets: el,
                        opacity: 0,
                        translateX: '-300',
                        easing: 'easeInQuad',
                        duration: duration,
                        //direction: 'reverse',
                        offset: offset
                    });
                    break;
                case 'slide-up':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: 0,
                        translateY: '300',
                        easing: 'easeInQuad',
                        duration: duration,
                        //direction: 'reverse',
                        offset: offset
                    });
                    break;
                case 'slide-down':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: 0,
                        translateY: '-300',
                        easing: 'easeInQuad',
                        duration: duration,
                        //direction: 'reverse',
                        offset: offset
                    });
                    break;
                case 'left-roll':
                    this.timeline.add({
                        //update: logAnimProgress,
                        targets: el,
                        opacity: '0',
                        //translateX: '20em',
                        rotate: '2turn',
                        easing: 'easeInQuad',
                        duration: duration,
                        //direction: 'reverse',
                        offset: offset,
                        scale: 4,
                        translateX: '350'
                        /* rotate: {
                            value: 25,
                            duration: 2000,
                            easing: 'easeInOutSine'
                        } */
                    });
                    break;
            }


        });

        this.timeline.begin = () => {
            //console.log('#################### myTimeline begin ');

            let wait = setTimeout(() => {
                this.elementsList.forEach((el, index) => {
                    el.classList.remove('hidden');
                });
            }, 10);
        };


        this.timeline.complete = function () {
            // TODO 
            //let wrapper = document.getElementsByClassName("wrapper")[0];
            //wrapper.classList.remove('hidden');

            //(document.getElementsByClassName("wrapper")[0]).classList.remove('hidden');

            [].slice.call(document.getElementsByClassName('cell'))
                .forEach(function (elem) {
                    //elem.classList.add('--bottom-border');
                    elem.style['border-right-color'] = null;
                    elem.style['border-left-color'] = null;
                    elem.style.borderColor = null;
                });
        };

    };
}