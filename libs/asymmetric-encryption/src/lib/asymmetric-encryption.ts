import * as crypto from 'crypto';

export class AsymmetricEncryption {
  static publicEncrypt(text: string, publicKey: string) {
    return crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(text),
    );
  }

  static privateDecrypt(text: Buffer, privateKey: string) {
    return crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      text,
    );
  }
}
