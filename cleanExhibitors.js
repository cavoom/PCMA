// EXHIBITOR CLEAN UP
var exhibitors = require('./exhibitorsNew2.json');
var jsonfile = require('jsonfile'); // for saving to JSON
var exhibitorsCount = exhibitors.length;
var i=0;
var temp = null;
var temp2 = null;

var resultName = "";
var arrayOfWords = [];
var wordCount = 0;
var variation = null;
var myString = null;
var s = 0;

// Remove problem characters, go lower case for Exhibitor Name
replacer(exhibitors, (exhibitors)=>{
    console.log('finished exh hall');
    // Same for the hall name
    replacerHall(exhibitors, (exhibitors)=>{
        arrayOfWords[wordCount] = "";
        theArray = [];
        // add in the variations and the first four
        addVariations(exhibitors, (exhibitors)=>{
            console.log('finished variations and first four');
            // save it
            saveIt(exhibitors,(allDone)=>{
                console.log(allDone)
                })
            })
        })
    })

// *************************************************************
function replacer(exhibitors, callback){
    //console.log('here is exhibitors 5:', exhibitors[5].keywords);
    for (i = 0; i < exhibitorsCount; i++) { 
        temp = exhibitors[i].named;
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

        temp = temp.toLowerCase();
        exhibitors[i].name = temp;
    }
    callback(exhibitors)
}

// *************************************************************
function replacerHall (exhibitors, callback){
    //console.log('here is exhibitors 5:', exhibitors[5].keywords);
    for (i = 0; i < exhibitorsCount; i++) { 
        temp = exhibitors[i].hall;
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

        temp = temp.toLowerCase();
        exhibitors[i].hall = temp;
    }
    callback(exhibitors)
}


// ******************************************************************
function addVariations(exhibitors, callback){

    for (i = 0; i < exhibitorsCount; i++) { 
        resultName = exhibitors[i].name;
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
            //theArray[i] = myString;
            exhibitors[i].variations = myString;

            // add first four
            temp2 = exhibitors[i].name;
            temp2 = temp2.slice(0,4);
            exhibitors[i].firstFour = temp2;

        }
        
        callback(exhibitors);
    }

// **************************************************************
function saveIt(newData, callback){

    var file = './exhibitorsCleaned2.json';
    var obj = newData;
 
    jsonfile.writeFile(file, obj, {spaces: 2},function (err) {
        if(err){console.error(err)};
    });
    callback('I saved it');
}