/* eslint-disable import/prefer-default-export */
import AWS from 'aws-sdk';
import Promise from 'bluebird';

export const REGION = 'eu-central-1';
export const BUCKET = 'topcoder-blockchain';

AWS.config.region = REGION;
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-central-1:2de84f5c-2a3c-4460-af0b-a7308706283e',
});

export const s3 = Promise.promisifyAll(new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: BUCKET},
}));
