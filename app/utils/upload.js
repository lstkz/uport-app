import fs from 'fs';
import path from 'path';
import {s3, BUCKET, REGION} from '../aws-setup';

export default async function upload(hash, filePath) {
  const key = `${Date.now() % 1000}_${hash}_${path.basename(filePath)}`;
  await s3.putObjectAsync({
    Key: key,
    Body: fs.ReadStream(filePath),
  });
  return `https://s3-${REGION}.amazonaws.com/${BUCKET}/${key}`;
}
