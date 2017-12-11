/* eslint-disable import/prefer-default-export */
import AWS from 'aws';

AWS.config.region = 'eu-central-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-central-1:2de84f5c-2a3c-4460-af0b-a7308706283e',
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: 'topcoder-blockchain'},
});

export {s3};
