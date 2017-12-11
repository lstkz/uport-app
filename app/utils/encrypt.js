import crypto from 'crypto';


function getFullKey(publicKey) {
  return `-----BEGIN RSA PUBLIC KEY-----\r\n${publicKey}\r\n-----END RSA PUBLIC KEY-----\n`;
}

/**
 * RSA can encrypt only short text.
 * Create a random AES key and encrypt it with public RSA key.
 */
export function encryptSubmissionData(uploadDetails, publicKey) {
  const aesKey = crypto.randomBytes(64).toString('hex');
  const cipher = crypto.createCipher('aes192', aesKey);

  let encrypted = cipher.update(JSON.stringify(uploadDetails), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const fullKey = getFullKey(publicKey);
  const data = {
    encryptedKey: crypto.publicEncrypt(fullKey, new Buffer(aesKey, 'hex')).toString('hex'),
    encryptedData: encrypted,
  };
  return JSON.stringify(data);
}

export function decryptSubmissionData(str, privateKey) {
  const data = JSON.parse(str);
  const aesKey = crypto.privateDecrypt(privateKey, new Buffer(data.encryptedKey, 'hex')).toString('hex');
  const cipher = crypto.createDecipher('aes192', aesKey);
  let encrypted = cipher.update(data.encryptedData, 'hex', 'utf8');
  encrypted += cipher.final('utf8');
  return JSON.parse(encrypted);
}

export function checkKeyValid(publicKey, privateKey) {
  const fullKey = getFullKey(publicKey);
  const data = 'foo';
  try {
    const encrypted = crypto.publicEncrypt(fullKey, new Buffer(data)).toString('hex');
    const decrypted = crypto.privateDecrypt(privateKey, new Buffer(encrypted, 'hex')).toString('utf8');
    return decrypted === data;
  } catch (e) {
    return false;
  }
}
