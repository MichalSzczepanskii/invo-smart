import * as crypto from 'crypto';
import * as _ from 'lodash';
import { isBase64 } from 'class-validator';

export class DerivedKey {
  constructor(private value: string) {
    if (!DerivedKey.isBase64(value)) {
      throw new Error('Invalid derived key');
    }
  }

  static fromTextNoRandom(text: string): DerivedKey {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return new DerivedKey(hash.digest().toString('base64'));
  }

  static fromTextRandom(text: string): DerivedKey {
    const salt = crypto.randomBytes(16);
    const iterations = 100000;
    const keyLength = 32;
    const value = crypto
      .pbkdf2Sync(text, salt, iterations, keyLength, 'sha256')
      .toString('base64');
    return new DerivedKey(value);
  }

  private static isBase64(value: string) {
    if (value.trim() === '') return false;
    try {
      return btoa(atob(value)) === value;
    } catch {
      return false;
    }
  }

  encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(this.value, 'base64'), iv);
    return `${Buffer.concat([cipher.update(text), cipher.final()]).toString(
      'base64',
    )}:${iv.toString('base64')}`;
  }

  getValue(): string {
    return this.value;
  }

  decrypt(encryptedKey: string): string {
    const values = encryptedKey.split(':');
    if (_.some(values, val => !isBase64(val))) throw new Error('Invalid decrypted text');
    const [key, iv] = values;
    const decipher = crypto.createDecipheriv(
      'aes-256-ctr',
      Buffer.from(key, 'base64'),
      Buffer.from(iv, 'base64'),
    );
    let decryptedKey = decipher.update(encryptedKey, 'base64', 'utf-8');
    decryptedKey += decipher.final('utf-8');
    return decryptedKey;
  }
}
