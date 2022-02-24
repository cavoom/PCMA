// ***********************************************************
// Required Function #3: This one has the "first four" function built in too
// Required Function #13: Remove unwanted characters
// REPLACE SPACE AND PERIODS, FIND FIRST LETTERS, SAVE
// var speakers = require('./speakers.json');
// var jsonfile = require('jsonfile'); // for saving to JSON
// var speakerCount = speakers.length;
// var i=0;
// var cleanCompany = [];
// var temp = "some mo.re Stuff & like- this";


// replacer((speakers)=>{
//     saveIt(speakers,(allDone)=>{
//         console.log(allDone)
//     })
// })

// function replacer(callback){
//     for (i = 0; i < speakerCount; i++) { 
        
//         temp = speakers[i].title;
//         //temp = temp.replace(/\s+/g, ''); // replaces a space with nothing?
//         temp = temp.replace(/&/g, '');
//         temp = temp.replace(/\-/g, '');
//         temp = temp.replace(/\:/g, '');

//         //temp = temp.slice(0,4);
//         //exhibitors[i].firstFour = temp;
//         speakers[i].title = temp;
//     }
//     callback(speakers)
// }

// // temp = temp.replace(/\./g, '');
// // console.log(temp);



// #4 Required Function
// ********************************************************************
// THIS ROUTINE GRABS THE exhibitor name AND INSERTS A VARIATIONS FIELD
// var i=0;
// var itemResult = require('./exhibitors.json');
// var itemResultCount = itemResult.length;
// var resultName = "";
// var tempVariations = [];
// var jsonfile = require('jsonfile');

// var arrayOfWords = [];
// arrayOfWords[wordCount] = "";
// var wordCount = 0;
// var variation = "";

// var myString = "";
// var s= 0;
// theArray = [];

// getString((itemResult)=>{
//     saveIt(itemResult,(allDone)=>{
//         console.log(allDone)
//     })

// });


// function getString(callback){

//     for (i = 0; i < itemResultCount; i++) { 
//         resultName = itemResult[i].exhibitorName;
//         arrayOfWords = resultName.split(" ");
//         wordCount = arrayOfWords.length;
//         myString = "";
//         variation = "";
//         arrayOfWords[wordCount] = "";

//         for (s = 0; s < wordCount; s++) { 
//             if(variation == ""){
//                 variation = variation + arrayOfWords[s];
//             } else {
//                 variation = variation +" "+arrayOfWords[s];}
            
//                 arrayOfWords[wordCount] = arrayOfWords[wordCount]+variation;
//                 if(s+1< wordCount){
//                     arrayOfWords[wordCount] = arrayOfWords[wordCount]+",";
//                     }
//             myString = arrayOfWords[wordCount];
//             }
//             //theArray[i] = myString;
//             itemResult[i].variations = myString
//         }
        
//         callback(itemResult);
//     }



// ********************************************************************
// // THIS ROUTINE GRABS THE COMPANY NAME AND INSERTS A VARIATIONS FIELD
// var i=0;
// var itemResult = require('./informsLibrary.json');
// var itemResultCount = itemResult.length;
// var resultName = "";
// var tempVariations = [];
// var jsonfile = require('jsonfile');

// var arrayOfWords = [];
// var wordCount = 0;
// var variation = "";
// arrayOfWords[wordCount] = "";
// var myString = "";
// var s= 0;
// theArray = [];

// getString((itemResult)=>{
//     saveIt(itemResult,(allDone)=>{
//         console.log(allDone)
//     })

// });


// function getString(callback){

//     for (i = 0; i < itemResultCount; i++) { 
//         resultName = itemResult[i].item;
//         arrayOfWords = resultName.split(" ");
//         wordCount = arrayOfWords.length;
//         myString = "";
//         variation = "";
//         arrayOfWords[wordCount] = "";

//         for (s = 0; s < wordCount; s++) { 
//             if(variation == ""){
//                 variation = variation + arrayOfWords[s];
//             } else {
//                 variation = variation +" "+arrayOfWords[s];}
            
//                 arrayOfWords[wordCount] = arrayOfWords[wordCount]+variation;
//                 if(s+1< wordCount){
//                     arrayOfWords[wordCount] = arrayOfWords[wordCount]+",";
//                     }
//             myString = arrayOfWords[wordCount];
//             }
//             //theArray[i] = myString;
//             itemResult[i].variations = myString
//         }
//         //callback(theArray)
//         callback(itemResult);
//     }

// REQUIRED FUNCTION #7
// ********************************************************************
// // THIS ROUTINE GRABS THE SESSION NAME AND INSERTS A VARIATIONS FIELD
// var i=0;
// var itemResult = require('./sessions.json');
// var itemResultCount = itemResult.length;
// var resultName = "";
// var tempVariations = [];
// var jsonfile = require('jsonfile');

// var arrayOfWords = [];
// var wordCount = 0;
// var variation = "";
// arrayOfWords[wordCount] = "";
// var myString = "";
// var s= 0;
// theArray = [];

// getString((itemResult)=>{

//     saveIt(itemResult,(allDone)=>{
//         console.log(allDone)
//     })

// });


// function getString(callback){

//     for (i = 0; i < itemResultCount; i++) { 

//             myString = itemResult[i].title;
//             itemResult[i].variations = myString.toLowerCase();
//         }
//         //callback(theArray)
//         callback(itemResult);
//     }

// Required Function #9
// ********************************************************************
// // // STRIP COMMON WORDS AND SAVE
// var stripCommon = require('strip-common-words');
// //console.log(stripCommon('install this module'));
// //=> 'install  module' 
// var theSessions = require('./ataSessions.json');
// var jsonfile = require('jsonfile');
// var i = 0;
// var length = theSessions.length;
// var tempString = null;
// var theResult = null;

// I don't think I need to do this
// getKeywords(theSessions,(theSessions)=>{
//     console.log('i am back');
//     console.log(theSessions[4]);
// })

// getSessionTitles(theSessions, (theSessions)=>{

//     //console.log(theSessions[5]);
//     saveIt(theSessions,(theResult)=>{
//         console.log(theResult)
//     })
// })

// function getSessionTitles(theSessions, callback){

//     for (i=0;i<length;i++){
//         tempString = theSessions[i].sessionName;
//         //tempString = stripCommon(tempString);
//         theSessions[i].keywords = tempString;

//     }
// callback(theSessions);
// }


// function getKeywords(theSessions, callback){

//     for (i=0;i<length;i++){
//         tempString = theSessions[i].sessionName;
//         tempString = stripCommon(tempString);
//         theSessions[i].keywords = tempString;

//     }
// callback(theSessions);
// }


// ********************************************************************
// REPLACE periods, semis colons and dashes and &&&
// convert to all lower
// add into sessions JSON file
// var sessions = require('./ataWithKeywords.json');
// var jsonfile = require('jsonfile'); // for saving to JSON
// var sessionsCount = sessions.length;
// var i=0;
// var temp = null;;

// replacer(sessions, (sessions)=>{
//     saveIt(sessions,(allDone)=>{
//         console.log(allDone)
//     })

// })

// function replacer(sessions, callback){
//     console.log('here is sessions 5:', sessions[5].keywords);
//     for (i = 0; i < sessionsCount; i++) { 
//         temp = sessions[i].keywords;
//         //temp = temp.replace(/\s+/g, '');
//         temp = temp.replace(/\./g, '');
//         temp = temp.replace(/\:/g, ' ');
//         temp = temp.replace(/\;/g, '');
//         temp = temp.replace(/\-/g, '');
//         temp = temp.replace(/\'/g, '');
//         temp = temp.replace(/\(/g, '');
//         temp = temp.replace(/\)/g, '');
//         //temp = temp.slice(0,4);
//         temp = temp.toLowerCase();
//         sessions[i].keywords = temp;
//     }
//     callback(sessions)
// }

// **************************************************************
// #2 REQUIRED FN
// THIS FUNCTION CREATES A KEYWORDS ARRAY FOR ALEXA

//var stripCommon = require('strip-common-words');

// var theItems = require('./recipeWithVariations.json');
// var jsonfile = require('jsonfile');
// var i = 0;
// var length = theItems.length;
// var arrayOfWords = [];
// var theBigArray = [];

// getString(theItems, (theBigArray)=>{
//     //console.log(theBigArray);
//     saveIt(theBigArray,(theResult)=>{
//        console.log(theResult)
//     })
// })

// function getString(theItems, callback){

//     for (i = 0; i < length; i++) { 
//         theString = theItems[i].variations;
//         arrayOfWords = theString.split(",");
//         //console.log(arrayOfWords);
//         wordCount = arrayOfWords.length;

//         for (s = 0; s < wordCount; s++) { 
//             theBigArray.push(arrayOfWords[s])
//             }

//         }
//         callback(theBigArray);
//     }


// function getTheItems(theItems, callback){

//     for (i=0;i<length;i++){
//         tempString = theItems[i].item;
//         //tempString = "{\"name\":{\"value\":" + tempString + "}}, \n";
//         theArray.push(tempString)

//     }
// callback(theArray);
// }




// ********************************************************************
// THIS ROUTINE CREATES A SPEAKERS ARRAY
// var i=0;
// var sessions = require('./ataWithKeywords');
// var length = sessions.length
// var jsonfile = require('jsonfile');
// var speakersList = [];
// var speakerTemp = null;


// getSpeaker((speakersList)=>{
//     saveIt(speakersList,(allDone)=>{
//         console.log(allDone)
//     })

// });

// THIS ROUTINE ADDS SPEAKERS TO A NEW FILE
// var i=0;
// var sessions = require('./ataWithKeywords');
// var length = sessions.length
// var jsonfile = require('jsonfile');
// var speakersList = [];
// var speakerTemp = null;


// getSpeaker((speakersList)=>{
//     saveIt(speakersList,(allDone)=>{
//         console.log(allDone)
//     })

// });

// function getSpeaker(callback){

//     for (i = 0; i < length; i++) { 
//         speakerTemp = sessions[i].speaker;
//         speakerTemp = speakerTemp.toLowerCase();
//         //speakerTemp = speakerTemp.replace(/\-/g, '');
//         //speakerTemp = speakerTemp.replace(/\./g, '');
//         //speakersList.push(speakerTemp);
//         sessions[i].speaker = speakerTemp
        
//         }
//         callback(sessions);
//     }


// function saveIt(newData, callback){

//     var file = './ataWithSpeakersAndKeywords.json';
//     var obj = newData;
 
//     jsonfile.writeFile(file, obj, {spaces: 2},function (err) {
//         if(err){console.error(err)};
//     });
//     callback('I saved it');
// }

// *****************************************************************
// // REMOVE DUPES FROM AN ARRAY
// const arrayUniq = require('array-unique');
// var thisArray = [1,1,3,4,5,5,5,5,6,6,7,8,1,3,4,5,7];
// var uniques = arrayUniq(thisArray);
// console.log(uniques);



// FIND A STAFFER SCHEDULE
// var schedule = require('./staffSchedule.json');

// var item = "paulette";
// var currentTime = new Date();
// //console.log('current time is ',currentTime);

// findPerson(item,(aResult)=>{
//     console.log(item, " is assinged to ", aResult, " right now.");

// })

// function findPerson(item, callback){
//     var i=0;
//     var aResult = null;
//     var theStartTime = null;
//     var theEndTime = null;
//     console.log('looking for ', item);
//     console.log('time now is ', currentTime);
//     while (i < schedule.length){
//         theStartTime = new Date(schedule[i].startTime);
//         theEndTime = new Date(schedule[i].endTime);
//         if(currentTime > theStartTime && currentTime < theEndTime){
//             aResult = schedule[i];
//             aResult = aResult[item];
//             break;
//         }
//         i++;
//     }
//     callback(aResult);
// }


//#1 REQUIRED FN
// **************************************************************************
// THIS ROUTINE CREATES A VARIATIONS FIELD FOR GENERAL Q&A QUESTIONS
// var i=0;
// var itemResult = require('./recipeNew.json');
// var itemResultCount = itemResult.length;
// var resultName = "";
// var tempVariations = [];
// var jsonfile = require('jsonfile');

// var arrayOfWords = [];
// var wordCount = 0;
// var variation = "";
// arrayOfWords[wordCount] = "";
// var myString = "";
// var s= 0;
// theArray = [];

// getString((itemResult)=>{
//     saveIt(itemResult,(allDone)=>{
//         console.log(itemResult[0])
//     })

// });


// function getString(callback){

//     for (i = 0; i < itemResultCount; i++) { 
//         resultName = itemResult[i].item;
//         arrayOfWords = resultName.split(" ");
//         wordCount = arrayOfWords.length;
//         myString = "";
//         variation = "";
//         arrayOfWords[wordCount] = "";

//         for (s = 0; s < wordCount; s++) { 
//             if(variation == ""){
//                 variation = variation + arrayOfWords[s];
//             } else {
//                 variation = variation +" "+arrayOfWords[s];}
            
//                 arrayOfWords[wordCount] = arrayOfWords[wordCount]+variation;
//                 if(s+1< wordCount){
//                     arrayOfWords[wordCount] = arrayOfWords[wordCount]+",";
//                     }
//             myString = arrayOfWords[wordCount];
//             }
//             //theArray[i] = myString;
//             itemResult[i].variations = myString
//         }
//         //callback(theArray)
//         callback(itemResult);
//     }

// function saveIt(newData, callback){

//     var file = './infocommItems.json';
//     var obj = newData;
 
//     jsonfile.writeFile(file, obj, {spaces: 2},function (err) {
//         if(err){console.error(err)};
//     });
//     callback('I saved it');
// }


// **************************************************************
// #5 REQUIRED FN
// THIS FUNCTION CREATES A COMPANY NAMES ARRAY FOR ALEXA JSON EDITOR

//var stripCommon = require('strip-common-words');

// var theItems = require('./exhibitors.json');
// var jsonfile = require('jsonfile');
// var i = 0;
// var length = theItems.length;
// var arrayOfWords = [];
// var theBigArray = [];

// getString(theItems, (theBigArray)=>{
//     //console.log(theBigArray);
//     saveIt(theBigArray,(theResult)=>{
//        console.log(theResult)
//     })
// })

// function getString(theItems, callback){

//     for (i = 0; i < length; i++) { 
//         theString = theItems[i].variations;
//         arrayOfWords = theString.split(",");
//         //console.log(arrayOfWords);
//         wordCount = arrayOfWords.length;

//         for (s = 0; s < wordCount; s++) { 
//             theBigArray.push(arrayOfWords[s])
//             }

//         }
//         callback(theBigArray);
//     }

// This one is used without variations
// function getTheItems(theItems, callback){

//     for (i=0;i<length;i++){
//         tempString = theItems[i].item;
//         //tempString = "{\"name\":{\"value\":" + tempString + "}}, \n";
//         theArray.push(tempString)

//     }
// callback(theArray);
// }



// #6 Required Function
// ***************************************************************************
// CONVERT DATES TO UTC PACIFIC TIME +7 HOURS

// var dateFormat = require('dateformat');
// var sessionData = require('./speakers.json');
// var jsonfile = require('jsonfile');
// var theLength = sessionData.length;
// var today = "June, 06 2018 19:00:00";
// var x = null;
// var start = null;
// var end = null;
// //var newPTDate = null;

// getNewTimes((sessionData)=>{
//     saveIt(sessionData,(allDone)=>{
//         console.log(allDone)
//     })

// });

// function getNewTimes(callback){
//     for(x=0;x<theLength;x++){
//         start = new Date(sessionData[x].startTime);
//         //end = new Date(sessionData[x].endtime);
//         // get the hours and the day
//         var year = start.getFullYear();
//         var month = start.getMonth();
//         var minutes = start.getMinutes();
//         //var seconds = start.getSeconds();
//         var hours = start.getHours();
//         var days = start.getDate();

//         // Add 3 hours
//         hours = hours +3;
//         //console.log(newHours);

//         // Check to be sure not greater than 23
//         // Need to make sure that days is appropriate for month!!

//         if(hours>=24){
//             hours = hours-24;
//             days = days + 1;
            
//         }

//         // Create the new PT Zulu formatted date
//         sessionData[x].startZuluTime = new Date(year, month, days, hours, minutes)

//         }

// callback(sessionData)
// }


//#10 Required Function
//************************************************
// THIS ROUTINE GRABS THE session name AND INSERTS A VARIATIONS FIELD
// var i=0;
// var itemResult = require('./sessions.json');
// var itemResultCount = itemResult.length;
// var resultName = "";
// var tempVariations = [];
// var jsonfile = require('jsonfile');
// var arrayOfWords = [];
// var wordCount = 0;
// arrayOfWords[wordCount] = "";
// var variation = "";

// var myString = "";
// var s= 0;
// theArray = [];

// getString((itemResult)=>{
//     saveIt(itemResult,(allDone)=>{
//         console.log(allDone)
//     })

// });


// function getString(callback){

//     for (i = 0; i < itemResultCount; i++) { 
//         resultName = itemResult[i].title;
//         arrayOfWords = resultName.split(" ");
//         wordCount = arrayOfWords.length;
//         myString = "";
//         variation = "";
//         arrayOfWords[wordCount] = "";

//         for (s = 0; s < wordCount; s++) { 
//             if(variation == ""){
//                 variation = variation + arrayOfWords[s];
//             } else {
//                 variation = variation +" "+arrayOfWords[s];}
            
//                 arrayOfWords[wordCount] = arrayOfWords[wordCount]+variation;
//                 if(s+1< wordCount){
//                     arrayOfWords[wordCount] = arrayOfWords[wordCount]+",";
//                     }
//             myString = arrayOfWords[wordCount];
//             }
//             myString = myString.toLowerCase();
//             itemResult[i].variations = myString
//         }
        
//         callback(itemResult);
//     }


//**************************************************************
//#11 REQUIRED FN
//THIS FUNCTION CREATES A SESSION KEYWORDS ARRAY FOR ALEXA JSON EDITOR
// var stripCommon = require('strip-common-words');

// var theItems = require('./speakers.json');
// var jsonfile = require('jsonfile');
// var i = 0;
// var length = theItems.length;
// var arrayOfWords = [];
// var theBigArray = [];

// getString(theItems, (theBigArray)=>{
//     //console.log(theBigArray);
//     saveIt(theBigArray,(theResult)=>{
//        console.log(theResult)
//     })
// })

// function getString(theItems, callback){

//     for (i = 0; i < length; i++) { 
//         //theString = theItems[i].name;
//         theBigArray.push(theItems[i].sessionNumber);
//         //arrayOfWords = theString.split(",");
//         //console.log(arrayOfWords);
//         //wordCount = arrayOfWords.length;

//         // for (s = 0; s < wordCount; s++) { 
//         //     theBigArray.push(arrayOfWords[s])
//         //     }

//         }
//         callback(theBigArray);
//     }



// Required Function #0: SAVE
// function saveIt(newData, callback){

//     var file = './sessionNumberArray.json';
//     var obj = newData;
 
//     jsonfile.writeFile(file, obj, {spaces: 2},function (err) {
//         if(err){console.error(err)};
//     });
//     callback('I saved it');
// }

// // FOR TEST
// // Convert a PT Date Time to just time component
// var dateFormat = require('dateformat');
// var theItems = require('./speakersTemp.json');
// var jsonfile = require('jsonfile');
// var theLength = theItems.length;
// var today = "June 06, 2018 19:05:00";
// var x = null;
// var start = null;
// var end = null;



// Required Function #12: Pull time from date / time
// *************************************************
// getString(theItems, (theItems)=>{
//     saveIt(theItems,(theResult)=>{
//        console.log(theResult)
//     })
// })

// function getString(theItems, callback){

//     for (i = 0; i < theLength; i++) { 
//         theString = theItems[i].startTime;
//         theString2 = theItems[i].endTime;
//         theItems[i].start = dateFormat(theString,"hh:MM TT");
//         theItems[i].end = dateFormat(theString2,"hh:MM TT");
//         }
//         callback(theItems);
//     }

// ***********************************************************
// Function sort an array with dates
// var speakers = [

//         {
//           "firstname": "Aaron",
//           "lastname": "Obstfeld",
//           "name": "Aaron Obstfeld",
//           "startTime": "June 07, 2018 10:30:00",
//           "endTime": "June 07, 2018 12:00:00",
//           "title": "ZeroClick User Interface",
//           "sessionNumber": "IS075",
//           "start": "10:30 AM",
//           "end": "12:00 PM",
//           "startZuluTime": "2018-06-07T17:30:00.000Z"
//         },
//         {
//           "firstname": "Abhay",
//           "lastname": "Bhorkar",
//           "name": "Abhay Bhorkar",
//           "startTime": "June 05, 2018 08:00:00",
//           "endTime": "June 05, 2018 12:00:00",
//           "title": "Integrated Life Day Part 1",
//           "sessionNumber": "IUX09",
//           "start": "08:00 AM",
//           "end": "12:00 PM",
//           "startZuluTime": "2018-06-05T15:00:00.000Z"
//         },
//         {
//           "firstname": "Alan",
//           "lastname": "Brawn",
//           "name": "Alan Brawn",
//           "startTime": "June 07, 2018 13:00:00",
//           "endTime": "June 07, 2018 14:00:00",
//           "title": "Broadcast Standards, HDR, and Color Space Demystified",
//           "sessionNumber": "IS085",
//           "start": "01:00 PM",
//           "end": "02:00 PM",
//           "startZuluTime": "2018-06-07T20:00:00.000Z"
//         },
//         {
//           "firstname": "Alesia",
//           "lastname": "Hendley",
//           "name": "Alesia Hendley",
//           "startTime": "June 06, 2018 13:00:00",
//           "endTime": "June 06, 2018 14:00:00",
//           "title": "Dante The Divine Digital Audio Networking Protocol",
//           "sessionNumber": "IS056",
//           "start": "01:00 PM",
//           "end": "02:00 PM",
//           "startZuluTime": "2018-06-06T20:00:00.000Z"
//         }

// ]


// sortResult(speakers,(speakers)=>{
//     console.log(speakers);
// })
// // *********************************************************************
// function sortResult(searchResults, callback){
//     if(searchResults.length>0){
//     searchResults.sort(function(a, b){
//     var dateA=new Date(a.startTime), dateB=new Date(b.endTime);
//     return dateA-dateB });
//     console.log('at sort and found ',searchResults.length);
//     }
//     callback(searchResults);
// }

// ************************************************************************
// Required Function #23
// PULL LOCAL TIME FROM ZULU FORMAT
    // var dateFormat = require('dateformat');
    // var theStart = null;
    // var theEnd = null;

    // theStart =  "2018-06-05T15:00:00.000Z";
    // theEnd =  "2018-06-05T19:00:00.000Z";
    // // theStart = dateFormat(theStart,"hh:MM TT");
    // // theEnd = dateFormat(theEnd,"hh:MM TT");
    // // console.log(theStart, theEnd);

    // var today = new Date(theStart).toLocaleTimeString('en-US', {
    //     timeZone: 'America/Los_Angeles'
    // })

    // console.log(today);

    // ********************************************************************
    // Required function #24
    // Reduce character count to 140 characters

    // var title = "the big dog runs very quickly and smoothly but super fast and too fast for the little brown fox to keep up with im";

    // var sliced = title.slice(0,1100);
    // console.log(sliced);

    // var temp = "an AV provider is good with they are an av provider";
    // temp = temp.replace(/av/g, 'a.v.');
    // console.log(temp);


// #24 Required Function
// ********************************************************************
// THIS ROUTINE GRABS THE SESSION TITLE AND GIVES THE PERMUTATIONS BY WORD

var x = 0;
var y=0;
var z=0;
var editorArray = [];
result = null;
thePhrase = "";
//var sessions = require('./sessionsCleanedUp2.json');
var numberOfWords = null;
var arrayOfWords = [];

var jsonfile = require('jsonfile'); // for saving to JSON

var sessions = require('./sessionsCleanedUp2.json')
console.log(sessions[0].title);
goThrough(sessions, (result)=>{
    console.log('went through go through');
    saveIt(result, (theMessage)=>{
        console.log(theMessage)
})
})

// for the number of Words in the array
function goThrough(sessions, callback){
    //console.log(sessions.length);
  
//for(z=0;z<2;z++){
for(z=0;z<sessions.length;z++){
    //console.log('****', sessions[z].title);
    arrayOfWords = sessions[z].title;
    arrayOfWords = arrayOfWords.split(" ");
    numberOfWords= arrayOfWords.length;
    for(x=0;x<numberOfWords;x++){
        editorArray.push(arrayOfWords[x]);
    if((x+1)<numberOfWords){
        thePhrase = arrayOfWords[x];
        for(y=x+1;y<numberOfWords;y++){
            thePhrase = thePhrase + " " + arrayOfWords[y];
        editorArray.push(thePhrase);
        }
    }
    thePhrase = "";
}
}
callback(editorArray)
}


function saveIt(result, callback){

    var file = './sessionsIterationArray.json';
    var obj = result;
 
    jsonfile.writeFile(file, obj, {spaces: 2},function (err) {
        if(err){console.error(err)};
    });
    callback('I saved it');
}