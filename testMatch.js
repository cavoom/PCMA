var stringSimilarity = require('string-similarity');

var candidate = "the car is blue";
var theArray = ["the truck is yellow", "the ca is blu","the bike is green", "the car is red"];

bestMatch(candidate,theArray, (theBestMatch)=>{
    console.log(theBestMatch)
})


function bestMatch(candidate,theArray, callback){
    //console.log('in best match', toMatch);
    var matches = stringSimilarity.findBestMatch(candidate, theArray);

    if(matches.bestMatch.rating >= .6){
        theBestMatch = matches.bestMatch.target
    } else {
        theBestMatch = "No good matches"
    }

    callback(theBestMatch)
}

