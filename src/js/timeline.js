export default class Timeline {
    constructor(el, anim) {
        console.log('????????? anim', anim);
        this.elementsList = el;
        this.animationJson = anim;
        this.timeline;
    };

    getAnimProp(page, step, prop, defaultVal) {
        console.log('>>>>>>>>> page', page);
        console.log('>>>>>>>>> step', step);
        console.log('>>>>>>>>> prop', prop);
        //console.log('getAnimProp: ', step);
        //return defaultVal;

        try {
            console.log('this.animationJson.screens[page]: ', this.animationJson.screens[page].steps[String(step)][prop]);
            let returnValue = this.animationJson.screens[page].steps[String(step)][prop];

            //if (ret) ret = ret[step];
            //if (ret) ret = ret[prop];
            //return defaultVal;
            return returnValue;
        } catch (e) {
            console.log('catch: ', e);
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
            defaultOffset = "-=50",
            defaultType = "slide-left";

        if (!this.elementsList.length) return;

        this.timeline = anime.timeline({
            //direction: 'reverse',
            autoplay: false
        });

        this.elementsList.forEach((el, index) => {
            el.classList.add('hidden');
            let animStep = el.dataset.animate,
                animPage = el.pageNumber;

            console.log('animStep: ', animStep);
            console.log('animPage: ', animPage);
            let offset = el.dataset.offset || this.getAnimProp(animPage, animStep, 'offset', defaultOffset),
                duration = el.dataset.duration || this.getAnimProp(animPage, animStep, 'duration', defaultDuration),
                type = el.dataset.type || this.getAnimProp(animPage, animStep, 'type', defaultType);

            if (index === 0) offset = '0';
            //console.log('duration: ', duration);
            console.log('el: ', el);

            switch (type) {
                case 'slide-left':
                    this.timeline.add({
                        targets: el,
                        opacity: 0,
                        translateX: '100',
                        easing: 'easeInQuad',
                        duration: duration,
                        direction: 'reverse',
                        offset: offset
                    });
                    break;
                case 'left-roll':
                    this.timeline.add({
                        targets: el,
                        opacity: '0',
                        //translateX: '20em',
                        rotate: '2turn',
                        easing: 'easeInQuad',
                        duration: duration,
                        direction: 'reverse',
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