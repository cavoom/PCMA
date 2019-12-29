rm index.zip
zip -X -r ../index.zip *
aws lambda update-function-code --function-name pcma_Alexa_2020 --zip-file fileb://../index.zip
