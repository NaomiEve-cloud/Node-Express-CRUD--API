const AWS = require('aws-sdk');


AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  const dynamoClient = new AWS.DynamoDB();

  module.exports = dynamoClient;