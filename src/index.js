//import {$} from "../node_modules/jquery/dist/jquery";
//import _ from 'lodash';
import './style.scss';
//import Icon from './img1.png';
import { Shapes } from './app'


let shape = new Shapes();
console.log('shape ', shape)

(function ($, _) {  // start IIFE

    $(document).ready(function () {


        function component() {
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

        document.body.appendChild(component());



    });

}($, _)); // END IIFE


