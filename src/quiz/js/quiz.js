//import "babel-polyfill";
import {$on, qs} from './helpers';
import DocReady from './windowLoaded';

DocReady(() => {
    console.log("DocReady");

    const quizApp = new QuizApp();
    const setQuiz = () => {
        quizApp.startUp();
    };

    $on(window, 'load', setQuiz);
    $on(window, 'hashchange', setQuiz);
    $on(window, 'resize', quizApp.doResize);

});


class QuizApp {
    constructor() {

    };

    startUp() {

        function getJsonFileName(loc) {
            let [fileName, foldername, ...rest] = loc.href.split('/').reverse();
            return loc.origin + '/' + foldername + '/' + fileName.split('.')[0] + '.json';
        }

        fetch(getJsonFileName(window.location))
            .then(handleErrors)
            .then(response => response.json())
            .then(j => setQuizData(j)
            .catch(error => {
                console.error(`Error in fetch: ${error.message}`);
                //buildAnimationSteps({});
            });

        function setQuizData(json) {
            console.log('setQuizData: ', json);
        }
    }
}

