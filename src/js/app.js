//import {$} from "../node_modules/jquery/dist/jquery";
//import _ from 'lodash';
//import '../css/style.scss';
//import Icon from './img1.png';
//import { Shapes } from './app'


/*let shape = new Shapes();
console.log('shape ', shape)*/

(function ($) {  // start IIFE

    $(document).ready(function () {

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


        var myTimeline = anime.timeline({
            direction: 'reverse',
            autoplay: false
        });

        $('[data-step]').each(function (i, $el) {
            //console.log(this.dataset.step);
            //console.log(this);
            //console.log(this.dataset);
            let elTarget = `[data-step="${this.dataset.step}"]`;

            let obj;
            switch (this.dataset.type) {
                case 'fade':
                    myTimeline.add({
                        targets: elTarget,
                        opacity: 0,
                        scale: 0.5,
                        direction: 'reverse'
                    });
                    break;
                case 'right-slide':
                    myTimeline.add({
                        targets: elTarget,
                        opacity: 0,
                        translateX: 250,
                        direction: 'reverse'
                    });
                    break;
                case 'left-slide':
                    myTimeline.add({
                        targets: elTarget,
                        opacity: 0,
                        translateX: -250,
                        direction: 'reverse'
                    });
                    break;

            }

            //if (obj) myTimeline.add(obj);


            console.log('myTimeline ', myTimeline);

            /*myTimeline
                .add({
                    targets: elTarget,
                    //translateX: 250,
                    opacity: 0,
                    scale: 0.5,
                   /!* rotate: {
                        value: 25,
                        duration: 500,
                        easing: 'easeInOutSine'
                    },*!/
                    direction: 'reverse'
                })*/

        })


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
        $('#startQueue').bind('click', function (e) {
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
        });


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

        document.body.appendChild(component());*/


    });

}($));


