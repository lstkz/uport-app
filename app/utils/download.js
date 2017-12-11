import https from 'https';
import fs from 'fs';

export default function downloadUrl(path, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path);
    https.get(url, (res) => {
      res.pipe(file);
      res.on('end', resolve);
      res.on('error', reject);
    });
  });
}
