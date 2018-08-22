/**
 * Created by kirkgoble on 05/02/2018.
 */

function initQuizClickText(){
    $( ".quiz_clickText" ).click(function(e) {
        //var el = $(e.target);
        setAnswer(e.target);
    });
}


function setAnswer(el){
    console.log('setAnswer:');
    //
    // SET HIGHLIGHT BAR
    //
    //
    // GET CLICKED ELEMENTS
    //
    var clickTextID =  Number($(el).attr('id'));
    var clickGroupID =  $(el).closest( ".quiz_clickText_container" ).attr('id');
    console.log('clickGroupID:'+clickGroupID);
    //
    var text = $(el).text();
    var element = $(el);
//        console.log('setAnswer:'+$(e.target).attr('class'));
//        console.log('y:'+$(e.target).position().top);
    console.log('el:'+el);
    console.log('$(el):'+$(el));
    var style = window.getComputedStyle(el, null).getPropertyValue('font-size');
    var fontSize = parseFloat(style);
    // console.log(fontSize);
    var newTop = $(el).position().top + parseInt($(el).css('marginTop'));
    // var newTop = $(el).position().top;
    var newLeft = $(el).position().left + parseInt($(el).css('marginLeft'));
    var topAdjuster = (12 / 100) * fontSize;
    var newHeight = $(el).outerHeight();
    console.log('newTop:'+newTop);
    //
    if (qData.multipleAnswers == false) { // ONLY ALLOW 1 ANSWER SO CLEAR OTHERS
        console.log('multipleAnswers = false');
        var s = '#'+clickGroupID+' .quiz_highlighter';
        var ss = '#'+clickGroupID+' .quiz_clickText';
        $(s).removeClass( "selected" ); // REMOVE SELECTED TO SHOW COLOUR
        $(ss).removeClass("selected"); // CLEAR HIGHLIGHT

        $(el).closest(".quiz_clickText_container").find('.quiz_highlighter').animate(
            {top: newTop + 'px', height: newHeight + 'px'}, 200, function () {
                $(el).addClass("selected");
                // $('.quiz_highlighter').addClass("selected");
            }
        );
    }else{
        $(el).toggleClass("selected");
    }

    //
    // ADD SCORES TO QDATA OBJECT FOR LOCAL STORAGE
    //

    clickGroupID = clickGroupID.replace('g', ''); // remove letters from ID
    var userAnswerArr = qData.questionArray[(clickGroupID-1)].userAnswer;

//        console.log(clickTextID);
//        console.log(clickGroupID);
//     qData.questionArray[(clickGroupID-1)].userAnswer = Number(clickTextID);

    // USER ANSWER ARRAY STUFF
    if (qData.multipleAnswers==false) { // ONLY ALLOW 1 ANSWER
        userAnswerArr[0] = clickTextID;
    }else{ //  ALLOW MULTIPLE ANSWERS
        if ($(el).hasClass( "selected" )) { // MULTIPLE ANSWERS & Selected
            if ($.inArray(clickTextID, userAnswerArr) < 0) { // If answer doesnt exist in userAnswerArr Push ANSWER in
                userAnswerArr.push(clickTextID);
            }
        }else{ // MULTIPLE ANSWERS & DE-Selected
            if ($.inArray(clickTextID, userAnswerArr) > -1) { // If answer DOES exist in userAnswerArr REMOVE it
                userAnswerArr.splice($.inArray(clickTextID, userAnswerArr),1);
            }
        }
    }

    console.log(qData.questionArray);

}


function reState(showAns){
    console.log('reState:showAns:'+showAns);
    for (i = 0; i < qData.questionArray.length; i++) { // LOOP THROUGH GROUPS OF ANSWERS
        var answerArr;
        if(showAns==true) {
            answerArr = qData.questionArray[i].ans;
        }else{
            answerArr = qData.questionArray[i].userAnswer;
        }
        if (answerArr.length > 0){ // FIRST CHECK THERE ARE SOME ANSWERS TO LOOP THROUGH IN THIS GROUP
            console.log('userAnswerArr:'+answerArr);
            for (ii = 0; ii < answerArr.length; ii++) {
                var s = '#g'+(i+1)+' #'+(answerArr[ii]); // Build string to target Click Element in Group
                var el = $(s).get(0);
                $(el).toggleClass("selected"); // Set Element to selected
            }
        }
    }

    //var s = '#g1 #1';
    //var el = $(s).get(0);
    //console.log('el:'+el);
    //setAnswer(el, false); // pass element and ANIMATE flag
    //$(el).toggleClass("selected");
}


function doSubmit(event){
    
    console.log('doSubmit');

    console.log(qData.questionArray[0].ans);
    //
    // work out score
    //
    var myScore = 0;
    //var myTotalScore = 0;
    for (i = 0; i < qData.questionArray.length; i++) {
        // ADD UP SCORE
        var userAnswerArr = qData.questionArray[i].userAnswer;
        var answerArr = qData.questionArray[i].ans;
        //
        if (userAnswerArr.length == answerArr.length){ // FIRST CHECK NUMBER OF ANSWERS MATCH
            // console.log('array lengths match:');
            for (ii = 0; ii < answerArr.length; ii++) {
                if($.inArray(answerArr[ii], userAnswerArr)>-1) {
                    myScore++;
                }
            }
        }

    }
    console.log('myScore:'+myScore);
    //
    //check score & action feedback
    //
    $('.iquiz_feedback.wrong').css({ display: 'none' });
    $('.iquiz_feedback.correct').css({ display: 'none' });
    //
    if(myScore===qData.maxScore) {
        $('.iquiz_feedback.correct').css({ display: 'block' });
    }else{
        $('.iquiz_feedback.wrong').css({ display: 'block' });
    }
    //
    // SHOW FEEDBACK
    //

    showPop();
}