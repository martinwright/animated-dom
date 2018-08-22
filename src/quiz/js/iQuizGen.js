/**
 * Created by kirkgoble on 05/02/2018.
 */


function initQuizNav(){

    console.log('initQuizNav');

    FastClick.attach(document.body);

    $( "#iqSubmit" ).click(function() {
        // alert('blab');
        doSubmit();
    });

    $( "#iqFeedbackNext" ).click(function() {
        closePop(true);
    });

    $( ".iquiz_popClose, .iquiz_popBG" ).click(function() {
        //alert(window.pageYOffset);
        closePop();
    });

}



function showPop(){
    console.log('showPop');
    $('body').addClass('no-scroll');
    // stopScroll('.player_container'); // stop scroll on main content to avoid double scroll
    $( ".iquiz_popBG" ).fadeIn( 200, function() {
        $('.iquiz_popContainer').css({ top: '0px' });
        $('.iquiz_popContainer').fadeIn({queue: false, duration: 200});
        $('.iquiz_innerScroll').scrollTop(0); // set scroll to top
        $('.iquiz_popContainer').animate({ top: "80px" }, 200);
        //

    });
}

function closePop(goNext=false){
    console.log('closePop');
    $('body').removeClass('no-scroll');
    // $('.iquiz_innerScroll').scrollTop(0); // set scroll to top
    $('.iquiz_popContainer').fadeOut({queue: false, duration: 200});
    $('.iquiz_popContainer').animate({ top: "0px" }, 200);
    $('.iquiz_popBG').fadeOut({queue: false, duration: 200}).promise().done(function() {
        if(goNext==true){
            // loadNextPage(true); action next question screen load
            alert('loadNext Question Page');
        }
    });

    // allowScroll('.player_container'); // allow scroll on main content
}

