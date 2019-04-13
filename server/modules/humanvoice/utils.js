import AWS from 'aws-sdk';
import { accessKeyId, secretAccessKey } from './config';

const S3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'us-east-1',
  accessKeyId,
  secretAccessKey,
})

function deleteAudioFromS3(Bucket, Key) {
  S3.deleteObject({
    Key,
    Bucket,
  }).promise()
  .then(() => {
  })
  .catch((err) => {
    console.log('error deleting audio', err);
  })
}

function uploadS3File(Bucket, Key, Body) {
  return S3.upload({
    Bucket,
    Key,
    Body,
  }).promise();
}

export default {
  deleteAudioFromS3,
  uploadS3File,
}
