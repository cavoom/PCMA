var AWS = require("aws-sdk");
//var fs = require('fs');

// Setup Dynamo
// You will need to setup AWS CLI and run "aws configure"
// You will need the Key ID and Secret Access Key
// Once you have setup credentials in the CLI, you are good to go

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();



console.log("Deleting from Dynamo ... Sit Tight ... ");
var allExhibitors = require('./exhibitorsTestFile.json');
allExhibitors.forEach(function(exhibitor) {
    var params = {
        TableName: "necaExhibitors", // this is the table name for NECA exhibitors
        Key: {
            "boothID":  exhibitor.boothID
        }
    };

    
    docClient.delete(params, function(err, data) {
       if (err) {
           console.error("Unable to delete exhibitor", exhibitor.boothID, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("Delete succeeded:", exhibitor.boothID);
       }
    });
});