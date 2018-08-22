/**
 * Created by kirkgoble on 24/07/2018.
 */


function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleDivs(p, c) {
    console.log('shuffleDivs');
    var parent = $(p);
    var divs = parent.children(c);
    while (divs.length) {
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
}


// //base64 encoding
//
// var encodedData = btoa("stringToEncode");
//
// //If you are using nodejs:
//
//
//     var encodedStr = new Buffer("Hello World").toString('base64') //decode to original value:
//
//     var originalString = new Buffer("SGVsbG8gV29ybGQ=", 'base64').toStr