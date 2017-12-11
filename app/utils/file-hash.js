import crypto from 'crypto';
import fs from 'fs';


// Algorithm depends on availability of OpenSSL on platform
// Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
const algorithm = 'sha1';

export function getHash(path) {
  return new Promise(resolve => {
    const shasum = crypto.createHash(algorithm);
    const s = fs.ReadStream(path);
    s.on('data', (data) => {
      shasum.update(data);
    });
    s.on('end', () => {
      const hash = shasum.digest('hex');
      resolve(hash);
    });
  });
}
