var AWS = require("aws-sdk");
var fs = require('fs');

// Setup Dynamo
// You will need to setup AWS CLI and run "aws configure"
// You will need the Key ID and Secret Access Key
// Once you have setup credentials in the CLI, you are good to go

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing into Dynamo ... Sit Tight ... ");

// Just looping through each object and updating Dynamo
// exhibitorsTestFile.json is just a partial on the exhibitors file for test
// Note that I had to drop in "none" for Pavilion code - no blanks permitted
// I changed hallID values to null, and that worked great
var allExhibitors = JSON.parse(fs.readFileSync('exhibitorsTestFile.json', 'utf8'));
allExhibitors.forEach(function(exhibitor) {
    var params = {
        TableName: "necaExhibitors", // this is the table name for NECA exhibitors
        Item: {
            "boothID":  exhibitor.boothID,
            "boothNumber": exhibitor.boothNumber,
            "hallID":  exhibitor.hallID,
            "pavilionCode": "none",
            "companyName": exhibitor.companyName,
            "companyNameVariations": exhibitor.companyNameVariations,
            "firstFour": exhibitor.firstFour,
            "productCategories": exhibitor.productCategories
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add exhibitor", exhibitor.boothID, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", exhibitor.boothID);
       }
    });
});