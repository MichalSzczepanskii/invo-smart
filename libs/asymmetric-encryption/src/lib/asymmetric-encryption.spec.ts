import * as crypto from 'crypto';
import { AsymmetricEncryption } from './asymmetric-encryption';

describe('asymmetricEncryption', () => {
  const mockText = Buffer.from('test');

  it('should encrypt with public key', () => {
    const publicKey = 'publicKey';
    jest.spyOn(crypto, 'publicEncrypt').mockReturnValue(mockText);
    const output = AsymmetricEncryption.publicEncrypt('text', publicKey);
    expect(crypto.publicEncrypt).toHaveBeenCalledWith(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from('text'),
    );
    expect(output).toEqual(mockText);
  });

  it('should decrypt with private key', () => {
    const encryptedText = Buffer.from('text');
    const privateKey = 'privateKey';
    jest.spyOn(crypto, 'privateDecrypt').mockReturnValue(mockText);
    const output = AsymmetricEncryption.privateDecrypt(encryptedText, privateKey);
    expect(crypto.privateDecrypt).toHaveBeenCalledWith(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      encryptedText,
    );
    expect(output).toEqual(mockText);
  });

  describe('integration test', () => {
    it('should return the same text after encryption and decryption', () => {
      const text = 'very secret text to encrypt';
      const publicKey = Buffer.from(process.env.AE_PUBLIC_KEY, 'base64').toString('ascii');
      const privateKey = Buffer.from(process.env.AE_PRIVATE_KEY, 'base64').toString('ascii');
      const encryptedText = AsymmetricEncryption.publicEncrypt(text, publicKey);
      const decryptedText = AsymmetricEncryption.privateDecrypt(encryptedText, privateKey);
      expect(encryptedText.toString()).not.toEqual(text);
      expect(decryptedText.toString()).toEqual(text);
    });
  });
});
