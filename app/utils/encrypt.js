import crypto from 'crypto';

/**
 * RSA can encrypt only short text.
 * Create a random AES key and encrypt it with public RSA key.
 */
export function encryptSubmissionData(uploadDetails, publicKey) {
  const aesKey = crypto.randomBytes(64).toString('hex');
  const cipher = crypto.createCipher('aes192', aesKey);

  let encrypted = cipher.update(JSON.stringify(uploadDetails), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const fullKey = `-----BEGIN RSA PUBLIC KEY-----\r\n${publicKey}\r\n-----END RSA PUBLIC KEY-----\n`;
  const data = {
    encryptedKey: crypto.publicEncrypt(fullKey, new Buffer(aesKey, 'hex')).toString('hex'),
    encryptedData: encrypted,
  };
  return JSON.stringify(data);
}

export function decryptSubmissionData(str, privateKey) {
  const data = JSON.parse(data);
  const aesKey = crypto.privateDecrypt(privateKey, new Buffer(data.encryptedKey, 'hex')).toString('hex');
  crypto.createCipher('aes192', aesKey);
}
