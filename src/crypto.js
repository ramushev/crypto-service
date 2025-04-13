const crypto = require('crypto');

if (!process.env.CRYPTO_KEY || !/^[0-9a-f]{64}$/i.test(process.env.CRYPTO_KEY)) {
  console.error('CRYPTO_KEY must be a 64-hex-char string');
  process.exit(1);
}
const KEY = Buffer.from(process.env.CRYPTO_KEY, 'hex');

const encrypt = (text, aad) => {
  if (typeof text !== 'string') {
    throw new Error('Missing or invalid "text"');
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  if (aad) cipher.setAAD(Buffer.from(aad, 'utf8'));

  const ciphertext = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    algorithm: 'aes-256-gcm',
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}

const decrypt = (ivB64, authTagB64, ciphertextB64, aad) => {
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error('Missing one of iv/authTag/ciphertext');
  }
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const ciphertext = Buffer.from(ciphertextB64, 'base64');

  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  if (aad) decipher.setAAD(Buffer.from(aad, 'utf8'));
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

module.exports = { encrypt, decrypt };
