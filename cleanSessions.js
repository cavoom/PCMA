// EXHIBITOR CLEAN UP

// **** NEED TO CHANGE VAR SESSIONS SO THAT IT STARTS WITH THE ORIGINAL FILE
// **** THEN CALL THE NEW FILE CREATED FOR THE START AND END TIME FNS

var sessions = require('./sessionsNew2.json');
//var sessionsCleanedUp = require('./sessionsCleanedUp.json')
var jsonfile = require('jsonfile'); // for saving to JSON
//var sessionsNew = require('sessionsCleaned.json');
var sessionsCount = sessions.length;
var i=0;
var temp = null;
var temp2 = null;

var resultName = "";
var arrayOfWords = [];
var wordCount = 0;
var variation = null;
var myString = null;
var s = 0;

arrayOfWords[wordCount] = "";
theArray = [];

var jsonfile = require('jsonfile');
var theLength = sessions.length;
//var today = "June, 06 2018 19:00:00";
var x = null;
var start = null;

//var dateFormat = require('dateformat');

// Remove problem characters and convert to lower for titles
replacer(sessions, (sessions)=>{
    console.log('finished session titles');
    // Same for the hall name
    replacerLocations(sessions, (sessions)=>{
        arrayOfWords[wordCount] = "";
        theArray = [];
        console.log('finished replacing locations');
        // create the session title variations
        titleVariations(sessions, (sessions)=>{
            console.log('finished title variations');
            // CONVERT DATES TO UTC PACIFIC TIME +7 HOURS
            getNewStartTimes((sessions)=>{
                console.log('finished new start zulu times');
                getNewEndTimes((sessions)=>{
                    console.log('finished new end zulu times');
                    // get the start and end times without date
                    getStartAndEndTimes(sessions, (sessions)=>{
                        console.log('got start and end times');

                        combineSpeakers(sessions,(sessions)=>{

                        console.log('combined the speakers');

                        saveIt(sessions,(theResult)=>{
                        console.log(theResult)
                        })
                    })

                })

            })

        })
    })
})
})
// *************************************************************
function replacer(sessions, callback){
    //console.log('here is sessions 5:', sessions[5].keywords);
    for (i = 0; i < sessionsCount; i++) { 
        temp = sessions[i].title;
        //temp = temp.replace(/\s+/g, '');
        temp = temp.replace(/\./g, '');
        temp = temp.replace(/\:/g, '');
        temp = temp.replace(/\;/g, '');
        temp = temp.replace(/\-/g, ' ');
        temp = temp.replace(/\'/g, '');
        temp = temp.replace(/\(/g, '');
        temp = temp.replace(/\)/g, '');
        temp = temp.replace(/\,/g, '');
        temp = temp.replace(/\&/g, '');
        temp = temp.replace(/\vs./g, 'versus');
        temp = temp.replace(/\"/g, '');

        temp = temp.toLowerCase();
        temp = temp.replace(/av/g, 'a.v.');
        temp = temp.slice(0,139);
        sessions[i].title = temp;
    }
    callback(sessions)
}

// *************************************************************
function replacerLocations (sessions, callback){
    //console.log('here is sessions 5:', sessions[5].keywords);
    for (i = 0; i < sessionsCount; i++) { 
        temp = sessions[i].locations;
        //temp = temp.replace(/\s+/g, '');
        temp = temp.replace(/\./g, '');
        temp = temp.replace(/\:/g, '');
        temp = temp.replace(/\;/g, '');
        temp = temp.replace(/\-/g, '');
        temp = temp.replace(/\'/g, '');
        temp = temp.replace(/\(/g, '');
        temp = temp.replace(/\)/g, '');
        temp = temp.replace(/\,/g, '');
        temp = temp.replace(/\&/g, '');
        temp = temp.replace(/\|/g, '');
        temp = temp.replace('Las Vegas', '');
        //temp = temp.replace(/\  /g, '');
        temp = temp.replace('convention center', '');

        temp = temp.toLowerCase();
        sessions[i].locations = temp;
    }
    callback(sessions)
}


// ******************************************************************
function titleVariations(sessions, callback){

    for (i = 0; i < sessionsCount; i++) { 
        resultName = sessions[i].title;
        arrayOfWords = resultName.split(" ");
        wordCount = arrayOfWords.length;
        myString = "";
        variation = "";
        arrayOfWords[wordCount] = "";

        for (s = 0; s < wordCount; s++) { 
            if(variation == ""){
                variation = variation + arrayOfWords[s];
            } else {
                variation = variation +" "+arrayOfWords[s];}
            
                arrayOfWords[wordCount] = arrayOfWords[wordCount]+variation;
                if(s+1< wordCount){
                    arrayOfWords[wordCount] = arrayOfWords[wordCount]+",";
                    }
            myString = arrayOfWords[wordCount];
            }
            myString = myString.slice(0,139);
            sessions[i].variations = myString;

        }
        
        callback(sessions);
    }
// ****************************************************************
function getNewStartTimes(callback){
    for(x=0;x<theLength;x++){
        start = new Date(sessions[x].start_times);
        //end = new Date(sessions[x].end_times);
        // get the hours and the day
        var year = start.getFullYear();
        var month = start.getMonth();
        var minutes = start.getMinutes();
        //var seconds = start.getSeconds();
        var hours = start.getHours();
        var days = start.getDate();

        // Add 3 hours
        hours = hours +3;
        //console.log(newHours);

        // Check to be sure not greater than 23
        // Need to make sure that days is appropriate for month!!

        if(hours>=24){
            hours = hours-24;
            days = days + 1;
            
        }

        // Create the new PT Zulu formatted date
        sessions[x].startTime = new Date(year, month, days, hours, minutes)

        }

callback(sessions)
}

// ***************************************************************************
function getNewEndTimes(callback){
    for(x=0;x<theLength;x++){
        end = new Date(sessions[x].end_times);
        //end = new Date(sessions[x].end_times);
        // get the hours and the day
        var year = end.getFullYear();
        var month = end.getMonth();
        var minutes = end.getMinutes();
        //var seconds = end.getSeconds();
        var hours = end.getHours();
        var days = end.getDate();

        // Add 3 hours
        hours = hours +3;
        //console.log(newHours);

        // Check to be sure not greater than 23
        // Need to make sure that days is appropriate for month!!

        if(hours>=24){
            hours = hours-24;
            days = days + 1;
            
        }

        // Create the new PT Zulu formatted date
        sessions[x].endTime = new Date(year, month, days, hours, minutes)

        }

callback(sessions)
}


// *******************************************************
function getStartAndEndTimes(sessions, callback){
    var theString = null;
    var theString2 = null;

    for (i = 0; i < theLength; i++) { 
        theString = sessions[i].startTime;
        theString2 = sessions[i].endTime;
        sessions[i].start = new Date(theString).toLocaleTimeString('en-US', {
            timeZone: 'America/Los_Angeles'
        })
        sessions[i].end = new Date(theString2).toLocaleTimeString('en-US', {
            timeZone: 'America/Los_Angeles'
        })
        }
        callback(sessions);
    }

// *******************************************************
function combineSpeakers(sessions, callback){
    var theName = null;

    for (i = 0; i < theLength; i++) { 
        theName = sessions[i].speaker_name_1 + " " + sessions[i].speaker_name_2 + " " + sessions[i].speaker_name_3 + " " + sessions[i].speaker_name_4 + " " + sessions[i].speaker_name_5 + " " + sessions[i].speaker_name_6 + " " + sessions[i].speaker_name_7 + " " + sessions[i].speaker_name_8 + " " + sessions[i].speaker_name_9 + " " + sessions[i].speaker_name_10 + " " + sessions[i].speaker_name_11 + " " + sessions[i].speaker_name_12 + " " + sessions[i].speaker_name_13 + " " + sessions[i].speaker_name_14 + " " + sessions[i].speaker_name_15 + " " + sessions[i].speaker_name_16 + " " + sessions[i].speaker_name_17 + " " + sessions[i].speaker_name_18 + " " + sessions[i].speaker_name_19 + " " + sessions[i].speaker_name_20;
        sessions[i].name = theName;
        }
        callback(sessions);
    }


// **************************************************************
function saveIt(newData, callback){

    var file = './sessionsCleanedUp2.json';
    var obj = newData;
 
    jsonfile.writeFile(file, obj, {spaces: 2},function (err) {
        if(err){console.error(err)};
    });
    callback('I saved it');
}