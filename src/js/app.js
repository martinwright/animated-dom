//import {$} from "../node_modules/jquery/dist/jquery";
//import _ from 'lodash';
//import '../css/style.scss';
//import Icon from './img1.png';
//import { Shapes } from './app'
import "babel-polyfill";
import {$on} from './util';
import DocReady from './windowLoaded';

//(function (document, window) {


/*    if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
        startup();
    } else {
        document.addEventListener("DOMContentLoaded", startup, false);
    }*/

//(function ($) {  // start IIFE


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


        /*var reverse = anime({
            targets: '[data-animation-step="1"]',
            translateX: 250,
            direction: 'reverse'
        });*/

        console.log('ddd', this);
        document.querySelector('.navigation .play').onclick = (e) => {
            myTimeline.play()
        };
        document.querySelector('.navigation .pause').onclick = (e) => {
            myTimeline.pause()
        };
        document.querySelector('.navigation .restart').onclick = (e) => {
            myTimeline.restart()
        };


        var myTimeline = anime.timeline({
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


        let myArr = Array.from(nodesArray).sort(sorter).reverse();
        console.log('myArr ', typeof myArr);
        console.log('myArr ', myArr);

        //return;

        Array.from(myArr)
        //.sort(sorter)
        //.reverse()
            .forEach(function (el) {
                //console.log(this.dataset.step);
                //console.log(this);
                //console.log(this.dataset);
                let elTarget = `[data-step="${el.dataset.step}"]`;

                let elOffset = el.dataset.offset;
                let elDuration = el.dataset.duration;

                console.log('elDuration', elDuration);
                let obj;

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


