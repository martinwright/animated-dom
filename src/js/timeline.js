export default class Timeline {
    constructor(el, anim) {
        this.elementsList = el;
        this.animationJson = anim;
        this.timeline;
    };

    getAnimProp(step, prop, defaultVal) {
        //console.log('getAnimProp: ', step);
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

    startAmnimation() {
        //console.log('????????? setAnimations start');
        this.timeline.play();
        this.timeline.reverse();
    }

    setup() {
        //console.log('????????? setAnimations setup');
        let defaultDuration = "200",
            defaultOffset = "-=50";

        if (!this.elementsList.length) return;

        this.timeline = anime.timeline({
            //direction: 'reverse',
            autoplay: false
        });

        this.elementsList.forEach((el, index) => {
            el.classList.add('hidden');
            let animStep = el.dataset.animate;
            //console.log('animStep: ', animStep);
            //console.log('index: ', index);
            let offset = el.dataset.offset || this.getAnimProp(animStep, 'offset', defaultOffset),
                duration = el.dataset.duration || this.getAnimProp(animStep, 'duration', defaultDuration);

            if (index === 0) offset = '0';
            //console.log('duration: ', duration);
            //console.log('el: ', el);
            this.timeline.add({
                targets: el,
                opacity: 0,
                translateX: '100',
                easing: 'easeInQuad',
                duration: duration,
                direction: 'reverse',
                offset: offset
            });
        });

        this.timeline.begin = () => {
            console.log('#################### myTimeline begin ');

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
                    elem.classList.add('--bottom-border');
                });
        };

    };
}