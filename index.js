// PCMA 2020 Lambda
// Recommendations Engine

'use strict';

const request = require('request');
const http = require('http');

// Weather API Call
var theUrl = null;
//var theWeather = null;
var weatherResponse = null;

var library = require('./recipe.json');
var hotels = require('./hotels.json');
var howLibrary = require('./recipeHow.json');
var whatLibrary = require('./recipeWhat.json');
var whenLibrary = require('./recipeWhen.json');
var whereLibrary = require('./recipeWhere.json');
var whoLibrary = require('./recipeWho.json');

var briefings = require('./briefing.json');
var speakers = require('./cleanResults.sessions.json');
var speakersArray = require('./speakerArray.json');

//var sessions = require('./sessions.json');
var sessions = require('./cleanResults.sessions.json');

var exhibitors = require('./exhibitors.json');
var jokes = require('./jokes.json');
var orderedResponse = null;
var notFound = require('./recipe.json'); // search through variations of item when not found
const arrayUniq = require('array-unique'); // removes dupes from an array
//var theRandomIntro = null;
var theJoke = ""; // the specific joke
var jokeSelect = 0; // the number of the specific joke randomly selected
var sessionsFound = 0; // this saves the number of sessions found in search
var sessionsKept = 0; // tells you how many we are going to tell you about
var lowerItem = "";
var sessionItem = "";
var sessionItemTwo = "";
var sessionItemThree = "NoInputs";
var speakerItem = "";
var spellItem = null;
var deviceId = null;

var newTime = new Date();
var timeId = newTime.getTime();
var theRandom = String(Math.floor((Math.random() * 999)));
var stationId = timeId + theRandom;

//console.log('STATION ID: ', stationId);

// Twilio
// var accountSid = 'AC5135dca6d5e9739df7bec6b9f91e6d53';
// var authToken = '5918869b275d817e651d02e545307f3c';
// var twilio = require('twilio');
// var client = new twilio(accountSid, authToken);

var similarity = require('similarity');
var stringSimilarity = require('string-similarity');

var stuff = "nada";
var AWS = require("aws-sdk");
var saveIntent = "nada";
var saveItem = "nada";
var params = {};

var helperPhrase = [
    "what's going on today?",
    "Find Sessions about event storytelling",
    "what's going on today",
    "where is the keynote session",
    "what's going on today",
    "Find sessions about consumer trends",
    "whats my flash briefing"
    // "where is the exhibit hall"

];

// Setup Dynamo
// AWS.config.update({
//     region: "us-east-1",
//     endpoint: "https://dynamodb.us-east-1.amazonaws.com"
//     });

//     var docClient = new AWS.DynamoDB.DocumentClient();


// Starts Here!
exports.handler = function(event,context) {

    try {
    var request  = event.request;
    var session = event.session;

    var deviceId = null;
    deviceId = event.context.System.device.deviceId.slice(-10);
    //console.log('full device id ', deviceId);


    if(!event.session.attributes){
        event.session.attributes = {};
    }

    if(request.type === "LaunchRequest") {
        saveIntent = "Launch Intent";
        saveItem = "Ask PCMA today";
        // analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
        //     handleLaunchRequest(context);
        //     });

        // FOR TEST
        console.log('MADE IT THRU LAUNCH INTENT');
        handleLaunchRequest(context);


// INTENT REQUESTS

    } else if(request.type === "IntentRequest") {

        // GENERAL QUESTIONS
        if(request.intent.name == "RecipeIntent"){
                saveIntent = "General";
                if(request.intent.slots.Item.value){
                    saveItem = request.intent.slots.Item.value; } else {
                        saveItem = "unknown";
                    }

            analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                handleRequestIntent(request, context);
            });

        // HOW INTENT
        } else if(request.intent.name == "howIntent"){
            saveIntent = "How";
            if(request.intent.slots.howItem.value){
                saveItem = request.intent.slots.howItem.value; } else {
                    saveItem = "unknown";
                }

        analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
            handleRequestIntent(request, context);
        });

        // WHAT INTENT
        } else if(request.intent.name == "whatIntent"){
                saveIntent = "What";
                if(request.intent.slots.whatItem.value){
                    saveItem = request.intent.slots.whatItem.value; } else {
                        saveItem = "unknown";
                    }

        analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
            handleRequestIntent(request, context);
        });

    // WHEN INTENT
    } else if(request.intent.name == "whenIntent"){
        saveIntent = "When";
        if(request.intent.slots.whenItem.value){
            saveItem = request.intent.slots.whenItem.value; } else {
                saveItem = "unknown";
            }

        analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
            handleRequestIntent(request, context);
        });


    // WHERE INTENT
    } else if(request.intent.name == "whereIntent"){
        ////console.log('at where intent');
        saveIntent = "Where";
        if(request.intent.slots.whereItem.value){
            ////console.log(request.intent.slots.whereItem.value);
            saveItem = request.intent.slots.whereItem.value; } else {
                saveItem = "unknown";
            }

        analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
            ////console.log('saved to analytics',saveItem);
            handleRequestIntent(request, context);
        });

    // WHO INTENT
    } else if(request.intent.name == "whoIntent"){
        saveIntent = "Who";
        if(request.intent.slots.whoItem.value){
            saveItem = request.intent.slots.whoItem.value; } else {
                saveItem = "unknown";
            }

        analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
            handleRequestIntent(request, context);
        });

    // HOTEL INTENT
    } else if (request.intent.name === "hotelIntent"){

        if(request.intent.slots.Hotels.value){
            let item = request.intent.slots.Hotels.value;
            lowerItem = item.toLowerCase();
        } else {
            lowerItem = "unknown";
        }
        saveItem = lowerItem;
        ////console.log("hotel name$",lowerItem,"$$$");
        saveIntent = "Hotel Intent";
        //stationId = String(Math.floor((Math.random() * 999999999999)));

        analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
        ////console.log('the data: ', stuff);

            findHotel(lowerItem, (response)=>{
                ////console.log('BACK from find hotel with',response);
                handleHotelIntent(response, context);
            });
        });

    // SESSION NUMBER SEARCH
    } else if (request.intent.name === "sessionNumberIntent"){
        //console.log('made it to session number intent');

    if(request.intent.slots.sessionNumber.value){
        ////console.log('it exists');
        spellItem = request.intent.slots.sessionNumber.value;
        spellItem = spellItem.toLowerCase();
        ////console.log('spell item: ',spellItem);

        } else { // If no spellItem
            spellItem = "unknown";
            }

        findSessionNumber(spellItem, (searchResults)=>{
            saveIntent = "find session number";
            saveItem = spellItem;
            console.log('made it back from find session number');
            analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                ////console.log('the data: ', stuff);
                handleSessionNumberIntent(searchResults, context);
                });
        })

    // PRODUCT CATEGORY INTENT
    } else if (request.intent.name === "categoryIntent"){
        console.log('made it to session number intent');

    if(request.intent.slots.productCategory.value){
        ////console.log('it exists');
        spellItem = request.intent.slots.productCategory.value;
        spellItem = spellItem.toLowerCase();
        ////console.log('spell item: ',spellItem);

        } else { // If no spellItem
            spellItem = "unknown";
            }

        findProductCategory(spellItem, (searchResults)=>{
            saveIntent = "find product category";
            saveItem = spellItem;
            //console.log('made it back from find session number');
            analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                handleProductCategoryIntent(spellItem, searchResults, context);
                });
        })

        // FALLBACK INTENT

        } else if (request.intent.name === "AMAZON.FallbackIntent") {
            var options = {};
            //var scoreArray = {};
            options.speechText = "I didn't catch that. Just say, give me my recommendations, to try again.";
            options.readText = options.speechText;
            options.repromptText = "Sorry, we didn’t find that one. Just say, give me my recommendations, to try again.";
            options.endSession = false;
            context.succeed(buildResponse(options))


    // REPEAT INTENT

    } else if (request.intent.name === "AMAZON.RepeatIntent") {
        var options = {};
        //var scoreArray = {};
        options.speechText = "I didn't catch that. Try saying one of the words listed on the board behind me";
        options.readText = options.speechText;
        options.repromptText = "For more help you can visit the help desk on level 2 near registration or say, stop, to end this session";
        options.endSession = false;
        context.succeed(buildResponse(options))



// EXHIBITOR SEARCH
        } else if (request.intent.name === "exhibitorIntent"){
            //console.log('made it to exhibitor intent');

        if(request.intent.slots.exhibitorName.value){
            ////console.log('it exists');
            spellItem = request.intent.slots.exhibitorName.value;
            spellItem = spellItem.toLowerCase();
            //console.log('spell item: ',spellItem);

            } else { // If no spellItem
                spellItem = "unknown";
                }

            findExhibitor(spellItem, (searchResults)=>{
                ////console.log('made it back from find exhibitor');
                saveIntent = "find partner";
                saveItem = spellItem;
                analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                    ////console.log('the data: ', stuff);
                    handleExhibitorIntent(spellItem, searchResults, context);
                    });
            })

// SPELL INTENT

        } else if (request.intent.name === "spellIntent"){
                console.log('made it to spell intent');
            if(request.intent.slots.spellSlot.value){
                spellItem = request.intent.slots.spellSlot.value;
                spellItem = spellItem.toLowerCase();

                spellItem = spellItem.replace(/\s+/g, '');
                spellItem = spellItem.replace(/\./g, '');

                ////console.log(spellItem);


            } else { // If no spellItem
                    spellItem = "unknown";
                }

                findSpelling(spellItem, (searchResults)=>{

                    saveIntent = "find by spelling";
                    saveItem = spellItem;
                    analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                        handleSpellIntent(spellItem, searchResults, context);
                        });



                })



// JOKES **********************************************************************************
            } else if (request.intent.name == "JokeIntent"){
                ////console.log('made it to jokes intent');
                jokeSelect = String(Math.floor((Math.random() * 23)));
                saveIntent = "tell me a joke";
                saveItem = jokeSelect;
                ////console.log('headed to analytics');
            analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                ////console.log('back from analytics');
                theJoke = jokes[jokeSelect].question + "<break time=\"1.5s\"/>" + jokes[jokeSelect].answer;
                ////console.log(theJoke);
                ////console.log('going to handle');
                handleJokeIntent(theJoke, context);
                });

            // HELP
            } else if (request.intent.name === "AMAZON.HelpIntent"){

                var options = {};
                options.speechText = "You can say, give me my recommendations, to get started."
                options.readText = options.speechText;
                options.repromptText = "You can say, give me my recommendations, or say, stop, to end this session.";
                options.endSession = false;
                options.searchResults = "none";
                context.succeed(buildResponse(options));

        // Flash Briefing
        } else if (request.intent.name === "BriefingIntent"){
            console.log('at briefing intent');
            //stationId = String(Math.floor((Math.random() * 999999999999)));
            saveIntent = "Briefing Intent";
            saveItem = "briefing";
            //console.log('briefing headed to analytics');
            // analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
            //     console.log('returned from analytics briefing');
                theUrl = 'https://api.darksky.net/forecast/10a80edf46132b3dd0a29c0bbe7a5264/40.4406248,-79.9958864';
                getWeather(theUrl,(weatherResponse)=>{
                    // console.log('Weather Response:', weatherResponse);
                    findBriefing((response)=>{

                        handleBriefingIntent(response, context);
                    });
                })
            // });

// Search BY SESSION INTENT ***********************************
    } else if (request.intent.name === "SessionIntent"){
            if(request.intent.slots.Session.value){
                sessionItem = request.intent.slots.Session.value;
                sessionItem = sessionItem.toLowerCase();
                //console.log('SESSION ITEM IS', sessionItem);

              } else {
                    sessionItem = "unknown";
                }

            if(request.intent.slots.SessionTwo.value){
                sessionItemTwo = request.intent.slots.SessionTwo.value;
                sessionItemTwo = sessionItemTwo.toLowerCase();
            }
            else{
                sessionItemTwo = "unknown";
            }

            if(request.intent.slots.SessionThree.value){
                sessionItemThree = request.intent.slots.SessionThree.value;
                sessionItemThree = sessionItemThree.toLowerCase();
            }
            else{
                sessionItemThree = "unknown";
            }

                //console.log('finding session title: ', sessionItem);
                //stationId = String(Math.floor((Math.random() * 999999999999)));
                saveIntent = "Session Intent";
                saveItem = sessionItem + ", " + sessionItemTwo + ", " + sessionItemThree;
                ////console.log('SAVED ITEM: ',saveItem, '*****')

                //analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                    ////console.log('returned from analytics');
                findSession(sessionItem,sessionItemTwo,sessionItemThree, (searchResults)=>{
                    //console.log('i found '+searchResults.length+' sessions NOT sorted');
                    //console.log('***FOUND THIS ONE: ',session.attributes.searchResults[0]);
                    sortResult(searchResults,(orderedResponse)=>{
                        //console.log('i found '+orderedResponse.length+' sessions SORTED ');
                        removeOld(orderedResponse,(cleaned)=>{
                            ////console.log('i found '+cleaned.length+' sessions CLEANED');
                            // Create a text friendly list
                            prepareList(cleaned,(textList)=>{
                                //console.log('back from prepareList with: ',textList);
                                analyticsSession(stationId, deviceId, saveIntent, saveItem, textList, (stuff)=>{

                            handleSessionIntent(sessionItem, cleaned, textList, context);
                            })
                        })
                    })

                });
            });

// SPEAKER INTENT ******************************
    } else if (request.intent.name === "SpeakerIntent"){
        ////console.log('made it to speaker intent');

            if(request.intent.slots.Speaker.value){
                speakerItem = request.intent.slots.Speaker.value;
                //console.log('in speaker intent', speakerItem);
                speakerItem = speakerItem.toLowerCase(); } else {
                    speakerItem = "unknown";
                }

                //stationId = String(Math.floor((Math.random() * 999999999999)));
                saveIntent = "Speaker Intent";
                saveItem = speakerItem;

                analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{

                bestMatch(speakerItem,(theBestMatch)=>{
                    ////console.log('here is the best match: ',theBestMatch);
                    findSpeaker(theBestMatch, (searchResults)=>{
                        ////console.log('made it back from find speaker headed to sort result');
                        //console.log(searchResults);
                        sortResult(searchResults,(orderedResponse)=>{
                            //console.log('back from sort results on 168');
                            handleSpeakerIntent(theBestMatch, orderedResponse, context);
                        })
                    })
                });

                });

        // ****** COOLEST THING INTENT *****************************

        } else if (request.intent.name === "shareIntent") {

            ////console.log('at SHARE intent');

        if (request.dialogState === "STARTED"){

            context.succeed(buildResponseDelegate(session));

        } else if (request.dialogState != "COMPLETED"){

            context.succeed(buildResponseDelegate(session));

        } else {
            // COMPLETED
            var options ={};
            ////console.log('at completed');

            if(request.intent.slots.coolestThing.value){
                var item = request.intent.slots.coolestThing.value;

                options.speechText = "you rock ... thanks for sharing. Catch you later."
                options.readText = options.speechText;
                options.repromptText = "Just say, give me my recommendations.";
                options.endSession = "true"
                options.searchResults = "";
                //options.directions = "";

                saveIntent = "share";
                saveItem = item;
                analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                    context.succeed(buildResponse(options));
                })


        } else {
            var noGoodStuff = "Sorry, I couldn't fulfill your request. Just say, I want to share, and I'll try again."
            options.speechText = "Bummer ... i did not catch that. Try saying one of the words on the board behind me ";
            options.readText = options.speechText;
            options.repromptText = "Just say stop to end this session";
            options.endSession = "false";

            context.succeed(buildResponse(options));


        }

        }



    // NEXT INTENT **********************************************************************

    } else if (request.intent.name === "NextIntent"){
        if(session.attributes){

            if(session.attributes.searchResults){
                let searchResults = session.attributes.searchResults;

                saveIntent = "Next Intent";
                saveItem = "next";
                ////console.log('HERE SEARCH RESULTS:', searchResults);
                analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                    getNext(searchResults,(nextOne)=>{
                        //console.log('back from NEXT');
                        handleNextIntent(session, nextOne, context);
                    });
                });

            } else {
                    handleThanksIntent(context); // handing the case where no next
            }

        } else { // handling case where session.attributes doesn't exist
                handleThanksIntent(nextOne, context);
        }
// TEXT ME INTENT *******************************************************************
// SEND THE TEXT *********************************************************************************************
} else if (request.intent.name === "textMeIntent") {
    //console.log('at text me intent');

        if (request.dialogState === "STARTED"){
            //console.log('i am at STARTED');
            //var options = {};
            context.succeed(buildResponseDelegate(session));
            //console.log(buildResponseDelegate(options));
            //buildResponseDelegate(options);

        } else if (request.dialogState != "COMPLETED"){
            //console.log('at not compoleted');
            item =request.intent.slots.phoneSlot.value;
            //console.log('the phone: ', item);
            if(request.intent.slots.phoneSlot.confirmationStatus == "NONE"){
                //console.log('i am here');
                context.succeed(confirmResponseDelegate(item, session));
            }
                context.succeed(buildResponseDelegate(session));

        } else {
            //console.log('at completed');
            if(request.intent.slots.phoneSlot.value){
                console.log('in text intent ready to send');
                item = request.intent.slots.phoneSlot.value;

                // var theMessage = "Thanks for visiting! Here is more information on what you saw today ... https://freemantoday.s3.amazonaws.com/wilsonUfiDeck.pdf";
                if(session.attributes.textList){
                    //var theMessage1 = session.attributes.searchResults[0].title;
                    //var theMessage2 = session.attributes.searchResults[0].date;
                    //var theMessage3 = session.attributes.searchResults[0].startTime;
                    //var theMessage4 = session.attributes.searchResults[0].location;
                    //var theMessage = theMessage1+" is on "+theMessage2+" starting at "+theMessage3+" in "+theMessage4;
                    var theMessage = session.attributes.textList + " ... Want a Chatbot for your event? Visit us here: https://www.freeman.chat/#contact ... ";

                } else {
                    var theMessage = "No results found"
                }

                if(theMessage){

                    sendTheText(item,theMessage, (stuff)=>{

                        saveIntent = "send text";
                        saveItem = item;

                            handlePhoneIntent(stuff,(options)=>{

                                analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                                    context.succeed(buildResponse(options));
                                    })

                                });
                })

            } else {
                // there is no message to send
                //console.log('NONE dirs');
                var options = {};
                options.speechText = "Sorry, nothing to send. Let's try again. Say, Text Me, or say, stop, to end this session. ";
                options.readText = options.speechText;
                options.endSession = false;
                options.repromptText = "Say Stop to end this session or say, I want to share, to share your thoughts. ";

                //context.succeed(buildNoResponse(options));
                ocntext.succeed(buildResponse(options));
            }


        } else {
            var noGoodStuff = "I couldn't fulfill your request. Goodbye."
            // Do something if no phone number
            handlePhoneIntent(noGoodStuff,(options)=>{
                context.succeed(buildResponse(options));

            });
        }

}


// MORE INTENT **********************************************************************

} else if (request.intent.name === "moreIntent"){
    if(session.attributes){
    if(session.attributes.searchResults){
        let searchResults = session.attributes.searchResults;

            saveIntent = "More Intent";
            saveItem = "more";

            analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                getNext(searchResults,(nextOne)=>{
                    handleMoreIntent(nextOne, context);
                    });
                });

    } else {
            handleThanksIntent(context); // handing the case where no next
            }

    } else { // handling case where session.attributes doesn't exist
            handleThanksIntent(nextOne, context);

    }

// STOP AND CANCEL INTENTS ***********************************************************************************

    } else if (request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent") {
            handleStopIntent(context);

        }

    } // ENDS INTENT REQUEST

    else if (request.type === "SessionEndedRequest") {
        // added this to handle session end
        handleEndIntent(context);


    } else {
        // we are trying this out
        handleEndIntent(context);
        //handleUnknownIntent(context);
        throw "Unknown Intent";
    }

} catch(e) {
    //context.fail("Exception: "+e);
    context.fail("Sorry. I don't know the answer to that one.")
    //handleEndIntent(context);
    //throw "Unknown Intent";
}
}


// *********************************************************************
function getNext(searchResults,callback){
    if(searchResults){
        if(searchResults != "none" && searchResults != "no more results to share"){
            if(searchResults.length > 0){
                searchResults.shift();
            }
            callback(searchResults);
        } else {
            callback(searchResults);
        };
    } else {
        searchResults = "none";
        callback(searchResults);
    };
};


// *********************************************************************
function findSpeaker(item, callback){
    //console.log('find speaker, THE ITEM', item);
    var i=0;
    var searchResults = [];
    var theSpeaker = "";

    while (i < speakers.length){
        theSpeaker = speakers[i].speakers;
        if(theSpeaker.includes(item)){
            searchResults.push(speakers[i]);
        }

    i++;

}

callback(searchResults);

}

// **********************************************************************
function handlePhoneIntent(stuff,callback) {
    //console.log('in the handle phone intent function');
     var options = {};
         options.speechText = stuff;
         options.readText = options.speechText;
         options.repromptText = "To find another exhibitor, say, Find, and the exhibitor name. Or say, what's going on, to hear the current N.A.B. flash briefing.";
         options.endSession = false;
         options.searchResults = "none";
         callback(options)

     }

// *********************************************************************
function sortResult(searchResults, callback){
        if(searchResults.length>0){
        searchResults.sort(function(a, b){
        var dateA=new Date(a.startTime), dateB=new Date(b.endTime);
        return dateA-dateB });
        //console.log('at sort and found ',searchResults.length);
        }
        callback(searchResults);
}
// *********************************************************************
function findSession(sessionItem,sessionItemTwo,sessionItemThree, callback){
  //console.log('made it to find session fn with: ', sessionItem);
  //console.log('sessions length is: ',sessions.length);
    var i=0;
    var searchResults = [];
    var title = "nothingHere";
    var titleVars = "nothingHere";
    var keywords = "nothingHere";

    // console.log('item: ', sessionItem);
    sessionItem = sessionItem.toLowerCase();
    sessionItemTwo = sessionItemTwo.toLowerCase();
    sessionItemThree = sessionItemThree.toLowerCase();
    //console.log('LOOKING FOR: ', sessionItem, sessionItemTwo, sessionItemThree);

    //while (i < 10){
    while (i < sessions.length){
        title = "";
        //titleVars = "";
        keywords = "";
        //grab the session title
        title = sessions[i].searchData;
        title = title.toLowerCase();
        //titleVars = sessions[i].titleVariations;
        //console.log('TITLE: ', title);

        // check if keywords exist
        if(title){
            //keywords = title;
            //console.log('searching through this: ', title)

        // Now check to see if Title or Keywords include the item
        //if(title.includes(item) || keywords.includes(item)){
        if(title.includes(sessionItem) || title.includes(sessionItemTwo) || title.includes(sessionItemThree)){
        //if(title.includes(sessionItem)){
            searchResults.push(sessions[i]);
            //console.log('Found one!!!!!!!');
        }

        // else if (titleVars.includes(sessionItem)) {
        //     searchResults.push(sessions[i]);
        //     console.log('YES');
        // }


    }
    i++;
}

//console.log('here are the search results: ', searchResults);
callback(searchResults);

}
// *********************************************************************
function buildResponse(options) {
    //console.log('OPTIONS:', options);
        if(!options.textList){
        options.textList = "No List Available"
    }
    var response = {
        version: "1.0",
        sessionAttributes: {
            searchResults: options.attributes,
            textList: options.textList
        },
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>" + options.speechText.replace(/\marquis/g, 'marquee') + "</speak>"
                },

        card: {
            type: "Standard",
            title: "PCMA 2020",
            text: options.readText
        },
        shouldEndSession: options.endSession,
        }
    };

    if (options.repromptText) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromptText
            }
        };
    }

    if(options.session && options.session.attributes){
        response.sessionAttributes = options.session.attributes;
    }
    return response;
}

// *********************************************************************
function buildExhibitorResponse(options) {

    var response = {
        version: "1.0",
        sessionAttributes: {
            searchResults: options.searchResults
        },
        response: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>"+options.speechText+"</speak>"
                },

        card: {
            type: "Standard",
            title: "PCMA 2020",
            text: options.readText
        },
        shouldEndSession: options.endSession,
        }
    };

    if (options.repromptText) {
        response.response.reprompt = {
            outputSpeech: {
                type: "PlainText",
                text: options.repromptText
            }
        };
    }
    if(options.session && options.session.attributes){
        response.sessionAttributes = options.session.attributes;
    }
    return response;
}

// **********************************************************************

function sendTheText(theNumber,theMessage, callback){
    //console.log('at send the text function');
    //console.log(theNumber);
    //console.log(theMessage);
    console.log('in send the text');

    client.messages.create({
        body: theMessage,
        to: theNumber,
        from: '+12524894062' // From a valid Twilio number
    })

    .then(function itWorked(message){
        //console.log('i sent it now returning');
        callback('Your text message is on the way ... Meanwhile, say, I want to share, if you\'d like to give us your opinion about how the show\'s going so far. ')
    }, function(error){
        var theError = 'Sorry. I was unable to send a text message to that number ';
        callback(theError)
    })
    // } else {
    //     callback('Try saying, find and the exhibitor name so that we can get your directions.')
    // }
}

// *********************************************************************
function handleNextIntent(session, response, context){
    let options = {};
    var theSessionTitle = "";
    var theSessionTitleRead = "";
    if(session.attributes){
        if(session.attributes.textList){
        options.textList = session.attributes.textList;
        }
    }
    ////console.log('THE DATE', response[0].date);
    // ******** check for no results
    if (response != "none" && response != "no more results to share"){
        if(response){
            if(response.length > 1){
                ////console.log('response length greater than 1');
                var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
                var theDay = new Date(response[0].date);
                theDay = theDay.getDay();
                theDay = daysOfWeek[theDay];

                //var theSessionTitle = "";
                theSessionTitle = response[0].title;
                theSessionTitleRead = response[0].titleChatBot;
                if (response[0].startTime === "none") {
                    options.speechText = "On " + theDay + ", " + theSessionTitle + " is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                    options.readText = "On " + theDay + ", \"" + theSessionTitleRead + "\" is in " + response[0].locationChatBot + ". Say \"Next\" to hear another, or \"Text me\" for a complete list.";
                    //in booth number, <say-as interpret-as=\"spell-out\">" + response[0].location + "</say-as>. say next to hear another, or, text me, for a complete list.";
                    options.repromptText = "Just say next . You can exit by saying Stop.";
                    options.endSession = false;
                    options.attributes = response;
                } else {
                    options.speechText = "On " + theDay + " at " + response[0].startTime + " , " + theSessionTitle + " is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                    options.readText = "On " + theDay + " at " + response[0].startTime + " , \"" + theSessionTitleRead + "\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another, or \"Text me\" for a complete list.";
                    //in booth number, <say-as interpret-as=\"spell-out\">" + response[0].location + "</say-as>. say next to hear another, or, text me, for a complete list.";
                    options.repromptText = "Just say next . You can exit by saying Stop.";
                    options.endSession = false;
                    options.attributes = response;
                }

            } else if(response.length==1){
                var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
                var theDay = new Date(response[0].date);
                ////console.log(theDay);
                theDay = theDay.getDay();
                ////console.log(theDay);
                theDay = daysOfWeek[theDay];
                theSessionTitle = response[0].title;
                theSessionTitleRead = response[0].titleChatBot;
                ////console.log('the session title: ', response[0].title);
                if (response[0].startTime === "none"){
                    options.speechText = "On " + theDay + ", " + theSessionTitle + " is in " + response[0].location + " ... Say, text me, to receive a complete list. Or, say, I want to share, and give us feedback on the event so far.";
                    options.readText = "On " + theDay + ", \"" + theSessionTitleRead + "\" is in " + response[0].locationChatBot + ". Say, \"Say, text me, to receive a complete list. Or, say, I want to share, and give us feedback on the event so far.";
                    options.repromptText = "You can search for another session or ask me a different question.";
                    options.endSession = false;
                    options.attributes = response;

                } else {
                    options.speechText = "On " + theDay + " at " + response[0].startTime + " , " + theSessionTitle + " is in " + response[0].location + "... Say, text me, to receive a complete list. Or, say, I want to share, and give us feedback on the event so far.";
                    options.readText = "On " + theDay + " at " + response[0].startTime + " , \"" + theSessionTitleRead + "\" is in " + response[0].locationChatBot + ". Say, text me, to receive a complete list. Or, say, I want to share, and gave us feedback on the event so far.";
                    options.repromptText = "You can search for another session or ask me a different question.";
                    options.endSession = false;
                    options.attributes = response;
                }
                ////console.log('made it through equal1');

            } else {

                    options.speechText = "There are no other sessions that match your search. You can ask me another question or just say stop.";
                    options.readText = options.speechText;
                    options.repromptText = "You can search for another session or ask me a different question.";
                    options.endSession = false;
                    options.attributes = "no more results to share";

            }

            context.succeed(buildResponse(options));

        } else {
            options.speechText = "There are no other sessions that match your search. You can ask me another question or just say stop.";
            options.readText = "There are no other sessions that match your search. You can ask me another question or just say \"Stop.\"";
            options.repromptText = "You can search for another session or ask me a different question.";
            options.endSession = false;
            options.attributes = "no more results to share";
            context.succeed(buildResponse(options));
        }
    // This handles situation when search results = "none"
    } else {
        options.speechText = "I'm here to help. You can ask me another question or just say stop.";
        options.readText = options.speechText;
        options.repromptText = "I'm here to help. You can ask me another question or just say stop.";
        options.endSession = false;
        options.attributes = "no more results to share";
        context.succeed(buildResponse(options));
    }
}

// *********************************************************************

function handleMoreIntent(response, context){
    let options = {};
    //var oneLetter = null;
   ////console.log('i hot to handle next intent');
    // ******** check for no results
    if (response != "none" && response != "no more results to share"){
    if(response){
        // if(response[0].companyName == "neca"){
        //     response[0].companyName = "kneeka"
        // }
        if(response.length > 1){

            options.speechText = "Next up is " + response[0].partnerName + ", located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". <break time=\"1s\"/> Say, more, to hear another.";
            options.readText = "Next up is " + response[0].partnerName + ", located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". Say, more, to hear another.";
            options.repromptText = "You can say, more, to continue.";
            options.endSession = false;
            options.attributes = response;
            options.searchResults = response;

    } else if(response.length==1){

        options.speechText = "Next up is " + response[0].partnerName + ", located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". <break time=\"1s\"/>Say, locate, and the partner name to find another.";
        options.readText = "Next up is " + response[0].partnerName + ", located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". Say, locate, and the partner name to find another.";
        options.repromptText = "You can say, locate, and the Partner Name to find another partner.";
        options.endSession = false;
        //options.attributes = response;
        options.searchResults = response;

        } else {

        options.speechText = "There are no other exhibitors that match your search";
        options.readText = options.speechText;
        //If you didn't hear your exhibitor, say, Search and tell me the first four letters of your exhibitor name.";
        options.repromptText = "Just say Find and the partner name to find another partner.";
        options.endSession = false;
        //options.attributes = "no more results to share";
        options.searchResults = "no more to share";

        }

        context.succeed(buildResponse(options));

    } else {
        options.speechText = "There are no other partners that match your search";
        options.readText = options.speechText;
        //If you didn't hear your exhibitor, say, Search and tell me the first four letters of your exhibitor name";
        options.repromptText = "Just say Find and the partner name to find another partner.";
        options.endSession = false;
        //options.attributes = "no more results to share";
        options.searchResults = "no more to share";
        context.succeed(buildResponse(options));
    }
    // This handles situation when search results = "none"
    } else {
        options.speechText = "I didn't find any other exhibitors that matched your search";
        options.readText = options.speechText;
        //Say, Search, and tell me the first four letters of your exhibitor name.";
        options.repromptText = "I'm here to help. Just say Find and the partner name to find another partner.";
        options.endSession = false;
        //options.attributes = "no more results to share";
        options.searchResults = "no more to share";
        context.succeed(buildResponse(options));
    }
}

// **********************************************************************
function findHotel(item, callback){
    //console.log('made it to find hotel', item);
    var result = "Hmmm ... I didn't find that one. Try asking again with the full hotel name. Many of the hotel brands have multiple locations, and I don't want to route you to the wrong one.";
    var i = 0;

    while (i<hotels.length){
        if (item === "hyatt" || item === "hyatt hotel") {
          result = "I found 3 hyatt hotels. The la jolla hyatt regency at aventine is on bus route # 12. the hyatt regency mission bay spa and marina is on bus route # 16. and the manchester grand hyatt san diego is on bus route # 4";
        } else if (item === "hyatt regency") {
          result = "I found 2 hyatt regency hotels. The la jolla hyatt regency at aventine is on bus route # 12. and the hyatt regency mission bay spa and marina is on bus route # 16.";
        } else if (item === "marriott" || item === "marriott hotel") {
          result = "I found 5 marriott hotels. The coronado island marriott resort and spa is on bus route # 10. the marriott san diego la jolla is on bus route # 12. the marriott san diego mission valley is on bus route # 3. and both the marriott marquee san diego hotel and marina and the marriott san diego gaslamp quarter are both in walking distance. There is no need to grab a shuttle. Enjoy the short walk!.";
        } else if (item === "best western" || item === "best western hotel") {
          result = "I found 4 best western hotels. The Best Western Plus Bayside Inn is on bus route # 6. the Best Western Plus Hacienda Hotel Old Town is on bus route # 11. the Best Western Plus Island Palms Hotel and Marina is on bus route # 9. and the Best Western Seven Seas is on bus route # 13.";
        } else if (item == hotels[i].hotelNameLower || item == "the "+ hotels[i].hotelNameLower){
            ////console.log('found a hotel match!');
            // result = item + " is on bus route # " + hotels[i].routeNumber + ". Your boarding location is ";;
            result = item + " is on bus route # " + hotels[i].routeNumber;
            if(hotels[i].routeNumber == "Walk"){
                result = "This hotel is in walking distance. There is no need to grab a shuttle. Enjoy the short walk!"
            }
            // if (hotels[i].routeNumber == "multiple"){
            //     result = item + " has multiple locations. Try asking again with the full hotel name. I don't want to send you on a wild goose chase!"
            // }
            break;
        }
        i++;

    }
    callback(result);
}

// **********************************************************************

function handleHotelIntent(hotelInfo, context) {
    let options = {};
    options.speechText = hotelInfo;
    options.readText = options.speechText;
    options.repromptText = "Ask me another question or say stop to end this session.";
    options.endSession = false;
    options.attributes = "none";
    context.succeed(buildResponse(options));

}
// *********************************************************************
function handleSessionNumberIntent(response, context){
    ////console.log('there are this many: '+ response.length);
    let options = {};
    let number = response.length;
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
    var theDayValue = "";
    if(response.length != 0){
//console.log('RESPONSE:', response);
//console.log(response[0].startTimeZulu);
    var theDay = new Date(response[0].date);
    theDayValue = theDay.getDay();
    //console.log('the day value is: ', theDayValue);
    theDayValue = daysOfWeek[theDayValue];
    //console.log('the day value is: ', theDayValue);

    var theSessionTitle = "";
    var theSessionTitleRead = "";
        if(response){
        if(response[0].title !=""){
            theSessionTitle = response[0].title;
            theSessionTitleRead = response[0].titleChatBot;
            } else {
                theSessionTitle = "No session title provided";
                theSessionTitleRead = "No session title provided";
                }
            }

                if(response){
                options.speechText = "Session number "+response[0].sessionNumber + " is on " + theDayValue + " at " + response[0].startTime + ". The session is titled, "  + theSessionTitle + ", and is located in " + response[0].location + "<break time=\"1s\"/>Say, give me my recommendations for more.";
                options.readText = "Session number "+response[0].sessionNumber + " is on " + theDayValue + " at " + response[0].startTime + ". The session is titled, \"" + theSessionTitleRead + ",\" and is located in " + response[0].locationChatBot + " ... Say, give me my recommendations for more.";
                options.repromptText = "Ask me another question or say, stop, to end this session.";
                options.endSession = false;
                options.attributes = response;
                context.succeed(buildResponse(options));

            }

            } else {
            options.speechText = "I didn't find your session number. Try saying, find session number, and the number of your session";
            options.readText = options.speechText;
            options.repromptText = "Say, find, and the title of your session, or say, find, and a keyword";
            options.endSession = false;
            options.attributes = response;
            context.succeed(buildResponse(options));
    }

}

// *********************************************************************
function handleProductCategoryIntent(spellItem, response, context){
    //console.log('In handle product category with response: ',response[0]);
    let options = {};
    let number = response.length;
    //var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
   //var theDayValue = "";
    if(response.length != 0){


            if(response.length>10){
                sessionsFound = response.length;
                var sliced = response.slice(0,10);
                sessionsKept = sliced.length;
                options.speechText = "I found " + number + " exhibitors in the " + spellItem +" product category. Check out: " + sliced[0].companyName + " in booth number, <say-as interpret-as=\"spell-out\">" + sliced[0].boothNumber+ "</say-as>. <break time=\"1s\"/>Say, more, to hear another";
                options.readText = "I found " + number + " exhibitors in the " + spellItem +" product category. Check out: " + sliced[0].companyName + " in booth number, " + sliced[0].boothNumber+ ". Say, more, to hear another";
                options.repromptText = "Just say next . You can exit by saying Stop.";
                options.endSession = false;
                options.attributes = sliced;

                context.succeed(buildResponse(options));

            // More than 1 session but less than 10
            } else if(response.length <= 10 && response.length > 1){
                options.speechText = "I found " + number + " exhibitors in the " + spellItem +" product category. Check out: " + sliced[0].companyName + " in booth number, <say-as interpret-as=\"spell-out\">" + sliced[0].boothNumber+ "</say-as>. <break time=\"1s\"/>Say, more, to hear another.";
                options.readText = "I found " + number + " exhibitors in the " + spellItem +" product category. Check out: " + sliced[0].companyName + " in booth number, " + sliced[0].boothNumber+ ". Say, more, to hear another.";
                options.repromptText = "Just say next . You can exit by saying Stop.";
                options.endSession = false;
                options.attributes = response;
                ////console.log('session attrs: ',options.attributes);
                context.succeed(buildResponse(options));
            }

            else if(response.length == 1){
                options.speechText = "I found 1 exhibitor in the " + spellItem +" product category. Check out: " + sliced[0].companyName + " in booth number, <say-as interpret-as=\"spell-out\">" + sliced[0].boothNumber+ "</say-as>. <break time=\"1s\"/>. Say, locate, and the exhibitor name, to do another search.";
                options.readText = "I found 1 exhibitor in the " + spellItem +" product category. Check out: " + sliced[0].companyName + " in booth number, " + sliced[0].boothNumber+ ". Say, locate, and the exhibitor name, to do another search.";
                options.repromptText = "Ask me another question or exit by saying stop.";
                options.endSession = false;
                options.attributes = response;
                context.succeed(buildResponse(options));

            }

            } else {

            options.speechText = "I didn't find any exhibitors in product category, " + spellItem + ", try saying, locate, and an exhibitor name.";
            options.readText = options.speechText;
            options.repromptText = "Ask me another question or exit by saying stop";
            options.endSession = false;
            options.attributes = response;
            context.succeed(buildResponse(options));
    }

}
// ************ PREPARE LIST *******************************************

function prepareList(cleaned, callback){
    var textList = "";
    var x = 0;
    for(x=0;x<cleaned.length;x++){
        textList = textList + cleaned[x].title + " is on " + cleaned [x].date + " starting at " + cleaned[x].startTime + " in " + cleaned[x].location + " .... " + "\n";
    }
    callback(textList)
}
// *********************************************************************
function handleSessionIntent(sessionItem, response, textList, context){
    //console.log('the RESPONSE: ',response[0]);
    let options = {};
    options.textList = textList;
    let number = response.length;
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
    var theDayValue = "";
    if(response.length != 0){
        if(response[0].location == "none" || response[0].location == "cancelled"){
            response[0].location = "Not Assigned"
        }

        var theDay = new Date(response[0].date);
        theDayValue = theDay.getDay();
        ////console.log('the day value is: ', theDayValue);
        theDayValue = daysOfWeek[theDayValue];
        ////console.log('the day value is: ', theDayValue);

        var theSessionTitle = "";
        var theSessionTitleRead = "";

        if(response[0].title !=""){
            theSessionTitle = response[0].title;
            theSessionTitleRead = response[0].titleChatBot;
            } else {
                theSessionTitle = "No title provided";
                theSessionTitleRead = "No title provided";
                }


            if(response.length>10){
                sessionsFound = response.length; // this is saved for the response feedback
                var sliced = response.slice(0,10);
                sessionsKept = sliced.length;
                if (response[0].startTime === "none") {
                        options.speechText = "I found " + number + " sessions that matched your search. Here are the " + sessionsKept + " sessions coming up next. On " + theDayValue + ", " + theSessionTitle + ", is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                        options.readText = "I found " + number + " sessions that matched your search. Here are the " + sessionsKept + " sessions coming up next. On " + theDayValue + ", \"" + theSessionTitleRead + ",\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another, or \"Text Me\" for a complete list.";
                        options.repromptText = "Just say next . You can exit by saying Stop.";
                        options.endSession = false;
                        options.attributes = sliced;

                        context.succeed(buildResponse(options));

                } else {
                        options.speechText = "I found " + number + " sessions that matched your search. Here are the " + sessionsKept + " sessions coming up next. On "+ theDayValue + " at " + response[0].startTime + ", " + theSessionTitle + ", is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                        options.readText = "I found " + number + " sessions that matched your search. Here are the " + sessionsKept + " sessions coming up next. On "+ theDayValue + " at " + response[0].startTime + ", \"" + theSessionTitleRead + ",\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another, or \"Text Me\" for a complete list.";
                        options.repromptText = "Just say next . You can exit by saying Stop.";
                        options.endSession = false;
                        options.attributes = sliced;

                        context.succeed(buildResponse(options));
                }
                // Else if response.length = 1
                // do stuff

            // More than 1 session but less than 10
            } else if(response.length <= 10 && response.length > 1){
                    if (response[0].startTime === "none") {
                            options.speechText = "I found " + number + " sessions that matched your search. here are the " + response.length + " sessions coming up next. On " + theDayValue + ", " + theSessionTitle + ", is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                            options.readText = "I found " + number + " sessions that matched your search. Here are the " + response.length + " sessions coming up next. On " + theDayValue + ", \"" + theSessionTitleRead + ",\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another, or \"Text Me\" for a complete list.";
                            options.repromptText = "Just say next . You can exit by saying Stop.";
                            options.endSession = false;
                            options.attributes = response;
                            ////console.log('session attrs: ',options.attributes);
                            context.succeed(buildResponse(options));
                    } else {
                            options.speechText = "I found " + number + " sessions that matched your search. here are the " + response.length + " sessions coming up next. On " + theDayValue + " at " + response[0].startTime + ", " + theSessionTitle + ", is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                            options.readText = "I found " + number + " sessions that matched your search. Here are the " + response.length + " sessions coming up next. On " + theDayValue + " at " + response[0].startTime + ", \"" + theSessionTitleRead + ",\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another, or \"Text Me\" for a complete list.";
                            options.repromptText = "Just say next . You can exit by saying Stop.";
                            options.endSession = false;
                            options.attributes = response;
                            ////console.log('session attrs: ',options.attributes);
                            context.succeed(buildResponse(options));
                    }
            }

            else if(response.length == 1){
                    if (response[0].startTime === "none") {
                            options.speechText = "I found 1 session that matched your search. On " + theDayValue + ", "  + theSessionTitle + ", is in " + response[0].location + " ... Say, text me, to receive this information on your phone. Or, say, I want to share, and tell us what you think of the show so far.";
                            options.readText = "I found 1 session that matched your search. On " + theDayValue + ", \""  + theSessionTitleRead + ",\" is in " + response[0].locationChatBot + " ... Say, \"Text Me\" to receive this information on your phone. Or, say, I want to share, and tell us what you think of the show so far.";
                            options.repromptText = "Ask me another question or exit by saying stop.";
                            options.endSession = false;
                            options.attributes = response;
                            context.succeed(buildResponse(options));
                    } else {
                            options.speechText = "I found 1 session that matched your search. On " + theDayValue + " at " + response[0].startTime + ", " + theSessionTitle + ", is in " + response[0].location + "... Say, text me, to receive this information on your phone. Or, say, I want to share, and tell us what you think of the show so far.";
                            options.readText = "I found 1 session that matched your search. On " + theDayValue + " at " + response[0].startTime + ", \"" + theSessionTitleRead + ",\" is in " + response[0].locationChatBot + "... Say \"Text Me\" to receive this information on your phone. Or, say, \"I want to share\", and tell us what you think of the show so far.";
                            options.repromptText = "Ask me another question or exit by saying stop.";
                            options.endSession = false;
                            options.attributes = response;
                            context.succeed(buildResponse(options));

                    }

            }

            } else {
            //options.speechText = "I didn't find any sessions about, " + sessionItem + sessionitemTwo + " or " + sessionItemThree + ", try saying, find, and a few keywords of your session";
            options.speechText = "I didn't find any sessions that matched your search. Let's try again. Just say, Give me my recommendations.";
            options.readText = options.speechText;
            options.repromptText = "Let's try again. I didn't find any sessions that matched your search. Just say, Give me my recommendations.";
            options.endSession = false;
            options.attributes = response;
            context.succeed(buildResponse(options));
    }

}
// *********************************************************************
function sliceIt(response, callback){
    var sliced = response.slice(0,2);
    ////console.log('in the sliceit function: '+sliced.length);
    callback(sliced);
}
// *********************************************************************
//"I found " + number + " sessions where " + response[0].combinedName + " is speaking. On "+ theDay + " at "+response[0].start + " , " + response[0].sessionTitle + " is going on at " + response[0].sessionLocation + ". say next to hear another, or, text me, for a complete list.";
function handleSpeakerIntent(theBestMatch, response, context){
    let options = {};
    let number = response.length;
    ////console.log('in handle speaker intent RESPONSE: ', response);
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];

    if(response.length != 0){

    var theDay = new Date(response[0].date);
    theDay = theDay.getDay();
    theDay = daysOfWeek[theDay];

            if(response.length>10){
                sessionsFound = response.length; // this is saved for the response feedback
                var sliced = response.slice(0,10);
                sessionsKept = sliced.length;
                options.speechText = "I found " + number + " sessions where " + theBestMatch + " is speaking. On " + theDay + " at " + response[0].startTime + " , " + response[0].title + " is in " + response[0].location + " ... Say, next to hear another.";
                options.readText = "I found " + number + " sessions where " + theBestMatch + " is speaking. On " + theDay + " at " + response[0].startTime + " , \"" + response[0].titleChatBot + "\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another.";
                options.repromptText = "Just say next . You can exit by saying Stop.";
                options.endSession = false;
                options.attributes = sliced;
                context.succeed(buildResponse(options));
            } else if(response.length==1){
                options.speechText = "I found " + number + " session where " + theBestMatch + " is speaking. On " + theDay + " at " + response[0].startTime + " , " + response[0].title + " is in " + response[0].location + " ... Say text me to receive this information.";
                options.readText = "I found " + number + " session where " + theBestMatch + " is speaking. On " + theDay + " at " + response[0].startTime + " , \"" + response[0].titleChatBot + "\" is in " + response[0].locationChatBot + "... Say \"Text Me\" to receive this information. Or, say, \"I want to share\", and tell us what you think of the show so far.";
                options.repromptText = "You can ask me another question or exit by saying Stop.";
                options.endSession = false;
                options.attributes = response;
                context.succeed(buildResponse(options));
            } else if(response.length<=10 && response.length>1){
                options.speechText = "I found " + number + " sessions where " + theBestMatch + " is speaking. On "+ theDay + " at " + response[0].startTime + " , " + response[0].title + " is in " + response[0].location + ". say next to hear another, or, text me, for a complete list.";
                options.readText = "I found " + number + " sessions where " + theBestMatch + " is speaking. On "+ theDay + " at " + response[0].startTime + " , \"" + response[0].titleChatBot + "\" is in " + response[0].locationChatBot + "... Say \"Next\" to hear another, or \"Text Me\" for a complete list.";
                options.repromptText = "You can ask me another question or exit by saying Stop.";
                options.endSession = false;
                options.attributes = response;
                context.succeed(buildResponse(options));

            }

    } else {
        options.speechText = "I found no results that matched your search. How else may I help you?";
        options.readText = options.speechText;
        options.repromptText = "Ask me another question or say stop to end this session.";
        options.endSession = false;
        options.attributes = response;
        context.succeed(buildResponse(options));
    }

}

// *********************************************************************
function handleLaunchRequest(context) {
    let options = {};
    //theRandomIntro = Math.floor((Math.random() * 6));
    options.speechText = "Hi there. Welcome to the Convening Leaders Recommendation station. I'm here to give you personal recommendations based on your interests. Just say, give me my recommendations.";
    options.readText = "Hi there. Welcome to the Convening Leaders Recommendation Station. I'm here to give you personal recommendations based on your interests. Just say, give me my recommendations.";
    // options.speechText = "Hi Megan";
    //theRandomIntro = Math.floor((Math.random() * 6));
    options.repromptText = "... Say, give me my recommendations for today.";
    options.endSession = false;
    options.attributes = "none";
    context.succeed(buildResponse(options));
}


// *********************************************************************
function handleStopIntent(context){
            let options = {};
                options.speechText = "Goodbye";
                options.readText = options.speechText;
                options.repromptText = "";
                options.endSession = true;
                options.attributes = "none";
                context.succeed(buildResponse(options));
}

// *********************************************************************
function handleThanksIntent(context){
            let options = {};
                options.speechText = "There are no more results to share. Ask me another question or say stop to exit.";
                options.readText = "There are no more results to share. Ask me another question or say \"Stop\" to exit.";
                options.repromptText = "Anything else that I can help you with today?";
                options.endSession = false;
                options.attributes = "none";
                context.succeed(buildResponse(options));
}

// *********************************************************************
function handleEndIntent(context){
            let options = {};
                options.speechText = "Catch you later";
                options.readText = options.speechText;
                options.repromptText = "";
                options.endSession = true;
                options.attributes = "";
                context.succeed(buildResponse(options));
}


// **********************************************************************
function handleRequestIntent(request, context) {
    var bestPosition = 0;
    let options = {};
    //console.log(request);
    //if(request.intent.slots.Item.value){
    if(saveItem){
        var item = saveItem;
        item = item.toLowerCase();

        console.log('in handle request intent',item);
        tryVariations(item, (foundResult, itemResults)=>{
        ////console.log('after try variations: ', item);

        if (foundResult.length == ""){

            saveIntent = "Item Not Found in Library";
            saveItem = item;

            analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                //theRandomIntro = Math.floor((Math.random() * 6));
                options.speechText = "Not sure what you said there. Just say, give me my recommendations, to get started.";
                options.readText = "Not sure what you said there. Just say \"Give me my recommendations\" to get started.";
                //options.speechText = "I’m sorry, I wasn’t given anything for "+item +", but I would be happy to learn it for your event. <break time=\"0.75s\"/> You can ask me a question like, " + helperPhrase[theRandomIntro];
                options.repromptText = "Ask me another question or say stop to end this session. Say, I want to share, to give us your thoughts about this event.";
                options.endSession = false;
                options.attributes = ", but there's nothing to repeat right now. Ask me another another question or say stop to end this session.";
                context.succeed(buildResponse(options));
                });
            } else {
                scoreIt(item, itemResults,(scored)=>{
                    ////console.log('SCORES: ',scored);
                    // find the position of the highest score
                    // return the result of that position
                    bestPosition = scored.indexOf(Math.max.apply(null,scored));
                    ////console.log('POS OF BEST MATCH: ', bestPosition);


                    foundResult = foundResult[bestPosition];
                    saveIntent = "General Q&A";
                    saveItem = item;

                    analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                        options.speechText = foundResult + "<break time=\"0.75s\"/> You can ask me another question or say, I want to share, to share your thoughts about this event.";
                        options.readText = foundResult + " You can ask me another question or say \"I want to share\" to share your thoughts about this event.";
                        options.repromptText = "Ask me another question or say stop to end this session. Say, I want to share, to give us your thoughts about this event.";
                        options.endSession = false;
                        options.attributes = foundResult + "<break time=\"0.75s\"/> Try asking me another question or say, I want to share, to share your thoughts about this event.";
                        context.succeed(buildResponse(options));
                    }); // analytics
                }) // score it
            } // else
        }) //  try variations

} else {

    options.speechText = "Oh no. I don't have an answer for that one. Ask me another question or say stop to end this session.";
    options.readText = "Oh no. I don't have an answer for that one. Ask me another question or say \"Stop\" to end this session.";
    options.repromptText = "Ask me another question or say stop to end this session. Say, I want to share, to give us your thoughts about this event.";

    options.endSession = false;
    options.attributes = "none";
    saveIntent = "Item Not Found No Library";
    saveItem = "No item presented"
    analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
        context.succeed(buildResponse(options));
    })

}

}

// *********************************************************************
function scoreIt(item, itemResults,callback){
    //console.log('made it to score it');
    var scored = [];
    var i=0;
    var theSimScore = 0;
    ////console.log('Found Result: ', foundResult);

    for (i = 0; i < itemResults.length; i++) {
        theSimScore = similarity(item, itemResults[i]);
        ////console.log('found result 0', foundResult[i]);
        ////console.log('sim score', theSimScore);
        scored.push(theSimScore);
    }
    //console.log('the scores: ',scored);
    callback(scored);

}
// **********************************************************************
function handleJokeIntent(theJoke, context) {
    var options = {};
    options.speechText = theJoke;
    options.readText = options.speechText;
    options.repromptText = "Say stop to end this session";
    options.endSession = false;
    options.attributes = "none";
    context.succeed(buildResponse(options));

}

// **********************************************************************
function handleBriefingIntent(briefingInfo, context) {
    let options = {};
    ////console.log('handle briefing intent', briefingInfo);
    options.speechText = briefingInfo;
    options.readText = options.speechText;
    options.repromptText = "Say stop to end this session";
    options.endSession = false;
    options.attributes = "none";
    context.succeed(buildResponse(options));

}

// **********************************************************************
function findBriefing(callback){
    ////console.log('made it to find hotel', hotels.length);
    ////console.log(item);
    var result = "There are no briefings available right now.";
    //let weather = '';
    //let weatherResponse = '';
    //let currentTemp = '';
    let nowTime = new Date();
    ////console.log('NOW time ', nowTime);
    var i = 0;

    // Get current weather in San Diego
    const url = 'https://api.darksky.net/forecast/10a80edf46132b3dd0a29c0bbe7a5264/32.707870,-117.162240';


    while (i<briefings.length){
        // var result = '';
        var sessionStart = briefings[i].startTime;
        sessionStart = new Date(sessionStart);
        ////console.log('START time ', sessionStart);
        var sessionEnd = briefings[i].endTime;
        sessionEnd = new Date(sessionEnd);
        ////console.log('END time ', sessionEnd);

        if(nowTime >= sessionStart && nowTime <= sessionEnd) {
            // axios.get(url)
            //   .then((response) => {
            //         weather = JOSN.parse(response.data);
            //         console.log(weather);
            //         weatherResponse = "The current temperature is " + parseInt(weather.currently.temperature) + " degrees and the weather forecast for today is " + weather.hourly.summary;
            //         console.log(weatherResponse);
            //         currentTemp = parseInt(response.data.currently.temperature);
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });

        //weatherResponse = 'no resport';

        result =    briefings[i].greeting +
                    weatherResponse +
                    briefings[i].story1 +
                    briefings[i].story2 +
                    briefings[i].story3 +
                    briefings[i].story4;
                    // briefings[i].story5 +
                    // briefings[i].story6 +
                    // briefings[i].story7 +
                    // briefings[i].story8 +
                    // briefings[i].story9 +
                    // briefings[i].story10;
        ////console.log('found one', briefings[i].date);
        break;
        } else {
            ////console.log('not it')
        }
        i++;
    }
////console.log(result);
    callback(result);
}

// **********************************************************************
function removeOld(orderedResponse, callback){
    var i=0;
    var currentTime = new Date();
    var theEndTime = new Date();
    var cleaned = [];

    ////console.log('CURRENT TIME: ', currentTime);
    ////console.log('ORDERED RESPONSE: ', orderedResponse);

    while(i<orderedResponse.length){
        theEndTime = new Date(orderedResponse[i].endTimeZulu);
        ////console.log(theStartTime.getUTCDate());
        if(theEndTime > currentTime){
            ////console.log('yes');
            cleaned.push(orderedResponse[i]);
            }
            i++;
        }
        callback(cleaned);
    }

// *********************************************************************
// Using this function for speakers to find matches when people don't use
// "doctor" or "middle name"
function bestMatch(toMatch, callback){
    //console.log('in best match', toMatch);
    var matches = stringSimilarity.findBestMatch(toMatch, speakersArray);
    var theBestMatch = toMatch; // just leave it as-is if we don't find anything
    if(matches.bestMatch.rating >= .8){
        theBestMatch = matches.bestMatch.target
    }
    ////console.log('the best match is ',theBestMatch, 'at ', matches.bestMatch.rating);
    callback(theBestMatch)
}

// *********************************************************************
function analytics(stationId, deviceId, saveIntent, saveItem, callback){
    //console.log('!!!analytics!!!: ',stationId, deviceId, saveIntent, saveItem);
    var newTime = new Date();
    var timeId = newTime.getTime();
    var theRandom = String(Math.floor((Math.random() * 9999)));
    stationId = timeId + theRandom;
    var theDate = new Date();
    theDate = theDate.toString();
    params = {
        TableName:"pcmaData2020",
        Item:{
            "id": stationId,
            "deviceId": deviceId,
            "intent": saveIntent,
            "item": saveItem,
            "timeStamp": theDate,
            "from": "Alexa"
        }
    };

    docClient.put(params, function(err, data) {

        if (err) {
            //console.log("Added item:", JSON.stringify(err, null, 2));

            callback(err);
        } else {
                //console.log("Worked:", JSON.stringify(null, data, 2));
                callback(data);

            }
        });
    // callback('nothing');

}

// *********************************************************************
function analyticsSession(stationId, deviceId, saveIntent, saveItem, textList, callback){
    //console.log('!!!analytics!!!: ',stationId, deviceId, saveIntent, saveItem);
    var newTime = new Date();
    var timeId = newTime.getTime();
    var theRandom = String(Math.floor((Math.random() * 9999)));
    stationId = timeId + theRandom;
    var theDate = new Date();
    theDate = theDate.toString();
    params = {
        TableName:"pcmaData2020",
        Item:{
            "id": stationId,
            "deviceId": deviceId,
            "intent": saveIntent,
            "item": saveItem,
            "timeStamp": theDate,
            "from": "Alexa",
            "response": textList
        }
    };

    docClient.put(params, function(err, data) {

        if (err) {
            //console.log("Added item:", JSON.stringify(err, null, 2));

            callback(err);
        } else {
                //console.log("Worked:", JSON.stringify(null, data, 2));
                callback(data);

            }
        });
    // callback('nothing');

}

// **********************************************************************
function getWeather(theUrl, callback){
    var weather = null;
    var currentTemp = null;
    console.log('fetching the weather',theUrl);
    request(theUrl, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        else {
            //console.log(body);
            //weather = JSON.parse(body);
            console.log(weather);
            weatherResponse = " The current temperature is " + parseInt(body.currently.temperature) + " degrees and the weather forecast for today is " + body.currently.summary + ". ";
            //console.log(weatherResponse);
            //currentTemp = parseInt(response.data.currently.temperature);

            callback(weatherResponse)
        }

    });

}
// **********************************************************************
function tryVariations(item, callback){
    var i=0;
    var j=0;
    var theResult = "";
    var searchResults = [];
    var itemResults = [];
    var theSearch = "";
    var uniques = [];

    ////console.log('At Try Variations with ', saveIntent);
    // Figure out which general Q&A json file to search
    if(saveIntent == "How"){
        while (i < howLibrary.length){
            theSearch = howLibrary[i].variations;

            if(theSearch.includes(item)){
                searchResults.push(howLibrary[i].response);
                itemResults.push(howLibrary[i].item);

            } else {
                // Nothing doing
            }
        i++;
        }

    } else if(saveIntent == "What"){
        while (i < whatLibrary.length){
            theSearch = whatLibrary[i].variations;

            if(theSearch.includes(item)){
                searchResults.push(whatLibrary[i].response);
                itemResults.push(whatLibrary[i].item);

            } else {
                ////console.log(item);
            }
            i++;
        }

    } else if(saveIntent == "When"){
        while (i < whenLibrary.length){
            theSearch = whenLibrary[i].variations;

            if(theSearch.includes(item)){
                searchResults.push(whenLibrary[i].response);
                itemResults.push(whenLibrary[i].item);

            } else {
                ////console.log(theSearch);
            }
            i++;
        }
    } else if(saveIntent == "Where"){
        ////console.log('At Try Variations Where', whereLibrary.length);
        while (i < whereLibrary.length){
            theSearch = whereLibrary[i].variations;

            if(theSearch.includes(item)){
                searchResults.push(whereLibrary[i].response);
                itemResults.push(whereLibrary[i].item);

            } else {
                ////console.log(theSearch);
            }
            i++;
        }

    } else if(saveIntent == "Who"){
        while (i < whoLibrary.length){
            theSearch = whoLibrary[i].variations;

            if(theSearch.includes(item)){
                searchResults.push(whoLibrary[i].response);
                itemResults.push(whoLibrary[i].item);

            } else {
                ////console.log(theSearch);
            }
            i++;
        }

    } else { // General Recipe Intent
        while (i < library.length){
            theSearch = library[i].variations;

            if(theSearch.includes(item)){
                searchResults.push(library[i].response);
                itemResults.push(library[i].item);

            } else {
                ////console.log(item);
            }

            i++;
        }
    }
    callback(searchResults, itemResults)

}

// *********************************************************************
function cleanUp(foundResult,callback){
    var cleanedUp = "";
    var i=0;
    var uniques = arrayUniq(foundResult);

    for (i = 0; i < uniques.length; i++) {
        if(cleanedUp !=""){
        cleanedUp = cleanedUp+"<break time=\"1s\"/>" + uniques[i];
        } else {
            cleanedUp = uniques[i];
        }
    }
    ////console.log('BIG sentance: ', cleanedUp);
    callback(cleanedUp);

}

    // ****************************************************************
function buildResponseDelegate(session) {


    var response = {
        "version":"1.0",
        "response": {
            "directives": [
                {
                    "type":"Dialog.Delegate",

                }
            ],
            "shouldEndSession":false
        },

        "sessionAttributes": {
            searchResults: session.attributes.searchResults,
    }

    }

    return response;
}

// **********************************************************************
function findExhibitor(spellItem, callback){
    // changed out "firstFour" with "exhibName"
        ////console.log('made it to find exhibitor');
        var i=0;
        var searchResults = [];
        var exhibName = "";

        // If spellItem is >4 letters in length
        // Need to truncate spellItem to 4 letters


        while (i < exhibitors.length){
            //firstFour = "";
            exhibName = exhibitors[i].partnerNameVariations;
            exhibName = exhibName.toLowerCase();

            // Now check to see if exhibitor firstFour includes the item
            if(exhibName.includes(spellItem)){
                searchResults.push(exhibitors[i]);
            }

        i++;

    }
    ////console.log(searchResults);
    callback(searchResults);

    }

// **********************************************************************
function findSessionNumber(spellItem, callback){
        console.log('made it to find session number', spellItem);
        var i=0;
        var searchResults = [];
        var exhibName = "";

        // If spellItem is >4 letters in length
        // Need to truncate spellItem to 4 letters


        while (i < speakers.length){
            //firstFour = "";
            exhibName = speakers[i].sessionNumber;
            exhibName = exhibName.toLowerCase();

            // Now check to see if exhibitor firstFour includes the item
            if(exhibName.includes(spellItem)){
                searchResults.push(speakers[i]);
            }

        i++;

    }
    ////console.log(searchResults);
    callback(searchResults);

    }


// **********************************************************************
function findProductCategory(spellItem, callback){
    console.log('made it to find product category function', spellItem);
    var i=0;
    var searchResults = [];
    var exhibName = "";

    while (i < exhibitors.length){
        //firstFour = "";
        exhibName = exhibitors[i].productCategories;
        //exhibName = exhibName.toLowerCase();

        // Now check to see if exhibitor firstFour includes the item
        if(exhibName.includes(spellItem)){
            searchResults.push(exhibitors[i]);
        }

    i++;

}
////console.log(searchResults);
callback(searchResults);

}


// **********************************************************************
function handleExhibitorIntent(spellItem, response, context){

    let options = {};
    let number = response.length;
    var sessionsKept = 0;
    var sessionsFound = 0;

    if(response.length != 0){

        // if(response[0].companyName == "neca"){
        //     response[0].companyName = "kneeka"
        // }
        if (response[0].partnerName.includes('PSAV')){
          response[0].partnerName = 'P S A V Inspiration Café'
        }

        if(response.length>22){

            ////console.log('10 or more');
                sessionsFound = response.length; // this is saved for the response feedback
                ////console.log(sessionsFound);
                var sliced = response.slice(0,10);
                ////console.log(sliced);
                sessionsKept = sliced.length;
                ////console.log(sessionsKept);
                options.speechText = "I found " + number + " partners that matched your search. Here is the first. " + response[0].partnerName + " is located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". <break time=\"1s\"/>Say, more, to hear another.";
                options.repromptText = "Just say, more to hear another, or, locate, and the exhibitor name to start over";
                options.endSession = false;
                //options.attributes = sliced;
                options.searchResults = sliced;
                context.succeed(buildExhibitorResponse(options));


            // More than 1 session but less than 10
            } else if(response.length <= 22 && response.length > 1){

                options.speechText = "I found " + number + " partners that matched your search. Here are the " + response.length + " partners: "+ response[0].partnerName + " is located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". <break time=\"1s\"/>Say, more, to hear another.";
                options.repromptText = "Just say, more to hear another . You can exit by saying Stop.";
                options.endSession = false;
                //options.attributes = response;
                options.searchResults = response;
                context.succeed(buildExhibitorResponse(options));
            }

            else if(response.length == 1){

                options.speechText = response[0].partnerName + " is located in " + response[0].partnerLocation + " on " + response[0].partnerDateTime + ". <break time=\"1s\"/>Say, locate, and the partner name to find another.";
                options.repromptText = "say, locate, and the partner name to find another partner. say stop to end this session.";
                options.endSession = false;
                //options.attributes = response;
                options.searchResults = response;
                context.succeed(buildExhibitorResponse(options));

            }

            } else {
            options.speechText = "Let's try to find your partner by spelling. Say, search, and the first four letters of your partner name";
            //Let's try to find them another way. Say, Search, and the first four letters of your partner.";
            options.repromptText = "Say, search, and the first four letters of your partner name.";
            options.endSession = false;
            //options.attributes = response;
            response = [];
            options.searchResults = response;
            context.succeed(buildExhibitorResponse(options));
    }

}


// **********************************************************************
function findSpelling(spellItem, callback){

    ////console.log('made it to find session');
    var i=0;
    var searchResults = [];
    var firstFour = "";

    // If spellItem is >4 letters in length
    // Need to truncate spellItem to 4 letters


    while (i < exhibitors.length){
        //firstFour = "";
        firstFour = exhibitors[i].firstFour;
        firstFour = firstFour.toLowerCase();

        // Now check to see if exhibitor firstFour includes the item
        if(firstFour.includes(spellItem)){
            searchResults.push(exhibitors[i]);
        }

    i++;

}
////console.log(searchResults);
callback(searchResults);

}
// **********************************************************************
function handleSpellIntent(spellItem, response, context){

    let options = {};
    let number = response.length;
    var sessionsKept = 0;
    var sessionsFound = 0;
    //var oneLetter = null;


    if(response.length != 0){

        if(response.length>22){

                sessionsFound = response.length; // this is saved for the response feedback
                ////console.log(sessionsFound);
                var sliced = response.slice(0,10);
                ////console.log(sliced);
                sessionsKept = sliced.length;
                ////console.log(sessionsKept);
                options.speechText = "I found " + number + " partners that matched your search. Here is the first one. "+ response[0].partnerName + " is located in " + response[0].partnerLocation + " on " + respone[0].partnerDateTime + "<break time=\"1s\"/> Say, more, to hear another.";
                options.repromptText = "Just say, more to hear another, or, locate, and the partner name to start over";
                options.endSession = false;
                options.attributes = sliced;
                options.searchResults = sliced;
                context.succeed(buildResponse(options));


            // More than 1 session but less than 10
            } else if(response.length <= 22 && response.length > 1){

                //oneLetter = response[0].booth;
                //oneLetter = oneLetter.split('').join(' ');

                options.speechText = "I found " + number + " partners that matched your search. Here is the first. "+ response[0].partnerName + " is located in " + response[0].partnerLocation + " on " + respone[0].partnerDateTime + "<break time=\"1s\"/>Say, more, to hear another.";
                options.repromptText = "Just say, more to hear another . You can exit by saying Stop.";
                options.endSession = false;
                options.attributes = response;
                options.searchResults = response;
                context.succeed(buildResponse(options));
            }

            else if(response.length == 1){

                options.speechText = response[0].partnerName + " is located in " + response[0].partnerLocation + " on " + respone[0].partnerDateTime + "<break time=\"1s\"/>Say, give me my recommendations, for more.";
                options.repromptText = "You can ask me another question or say stop to end this session.";
                options.endSession = false;
                //options.attributes = response;
                options.searchResults = response;
                context.succeed(buildResponse(options));

            }

            } else {

            saveIntent = "no results";
            saveItem = spellItem;

                analytics(stationId, deviceId, saveIntent, saveItem, (stuff)=>{
                    options.speechText = "Sorry, we didn’t find that one. Just say, give me my recommendations, to try again.";
                    options.repromptText = "Sorry, we didn’t find that one. Just say, give me my recommendations, to try again.";
                    options.endSession = false;
                    //options.attributes = response;
                    options.searchResults = response;
                    context.succeed(buildResponse(options));
        });
    }

}
