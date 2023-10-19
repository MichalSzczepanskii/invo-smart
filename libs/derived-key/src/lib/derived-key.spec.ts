import { DerivedKey } from './derived-key';
import * as crypto from 'crypto';

const randomBytesMock = 'uNVNcaVWGfU2ocnDWiyJXg==';
const textToKey = 'secret';
const derivedKeyValue = 'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=';
const decryptedText = 'hello world';
const encryptedText = 'NlE6UIa+l8q8DYY=';

const bufferFromBase64 = (text: string) => Buffer.from(text, 'base64');

const spyOnHash = (hash: crypto.Hash) => {
  jest.spyOn(hash, 'update');
  jest.spyOn(hash, 'digest');
  jest.spyOn(crypto, 'createHash').mockReturnValue(hash);
};

describe('DerivedKey', () => {
  let hash: crypto.Hash;

  beforeEach(() => {
    jest
      .spyOn(crypto, 'randomBytes')
      .mockImplementation(() => bufferFromBase64(randomBytesMock));
    hash = crypto.createHash('sha256');
    spyOnHash(hash);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#fromTextNoRandom', () => {
    it('should create derived key ', () => {
      const derivedKey = DerivedKey.fromTextNoRandom(textToKey);

      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(hash.update).toHaveBeenCalledWith(textToKey);
      expect(hash.update).toHaveBeenCalledTimes(1);
      expect(hash.digest).toHaveBeenCalled();
      expect(derivedKey).toEqual({ value: derivedKeyValue });
    });

    it('should create the same derived key each time', () => {
      const firstKey = DerivedKey.fromTextNoRandom(textToKey);
      jest.restoreAllMocks();
      hash = crypto.createHash('sha256');
      spyOnHash(hash);
      const secondKey = DerivedKey.fromTextNoRandom(textToKey);
      expect(firstKey).toEqual(secondKey);
    });
  });

  describe('#fromTextRandom', () => {
    it('should create derived key', () => {
      jest.spyOn(crypto, 'pbkdf2Sync').mockReturnValue(bufferFromBase64(derivedKeyValue));
      const derivedKey = DerivedKey.fromTextRandom(textToKey);
      expect(crypto.pbkdf2Sync).toHaveBeenCalledWith(
        textToKey,
        bufferFromBase64(randomBytesMock),
        100000,
        32,
        'sha256',
      );
      expect(derivedKey).toEqual({
        value: derivedKeyValue,
      });
    });

    it('should not create the same derived key each time', () => {
      jest.restoreAllMocks();
      const pbkdfSpy = jest.spyOn(crypto, 'pbkdf2Sync');
      const firstDerivedKey = DerivedKey.fromTextRandom(textToKey);
      expect(crypto.pbkdf2Sync).toHaveBeenCalledTimes(1);
      pbkdfSpy.mockClear();
      const secondDerivedKey = DerivedKey.fromTextRandom(textToKey);
      expect(crypto.pbkdf2Sync).toHaveBeenCalledTimes(1);
      expect(firstDerivedKey).not.toEqual(secondDerivedKey);
    });
  });

  it('should get value of derived key', () => {
    const derivedKey = DerivedKey.fromTextNoRandom(textToKey);
    expect(derivedKey.getValue()).toEqual(derivedKeyValue);
  });

  it('should create instance from derivedKey value', () => {
    const output = {
      value: derivedKeyValue,
    };
    expect(new DerivedKey(derivedKeyValue)).toEqual(output);
  });

  it('should throw error if derivedKey is not in base64 format', () => {
    const errorMsg = 'Invalid derived key';
    expect(() => new DerivedKey('This is not a base64 text')).toThrow(errorMsg);
    expect(() => new DerivedKey('')).toThrow(errorMsg);
    expect(() => new DerivedKey('  ')).toThrow(errorMsg);
    expect(() => new DerivedKey('te #124')).toThrow(errorMsg);
  });

  it('should encrypt ', () => {
    const derivedKey = new DerivedKey(derivedKeyValue);
    const cipheriv = crypto.createCipheriv(
      'aes-256-ctr',
      bufferFromBase64(derivedKeyValue),
      bufferFromBase64(randomBytesMock),
    );
    jest.spyOn(cipheriv, 'update');
    jest.spyOn(cipheriv, 'final');
    jest.spyOn(crypto, 'createCipheriv').mockReturnValue(cipheriv);
    expect(derivedKey.encrypt(decryptedText)).toEqual(`${encryptedText}:${randomBytesMock}`);
    expect(crypto.createCipheriv).toHaveBeenCalledWith(
      'aes-256-ctr',
      bufferFromBase64(derivedKeyValue),
      bufferFromBase64(randomBytesMock),
    );
  });

  describe('#decrypt', () => {
    let derivedKey: DerivedKey;

    beforeEach(() => {
      const decipheriv = crypto.createDecipheriv(
        'aes-256-ctr',
        bufferFromBase64(derivedKeyValue),
        bufferFromBase64(randomBytesMock),
      );

      jest.spyOn(decipheriv, 'update');
      jest.spyOn(decipheriv, 'final');
      jest.spyOn(crypto, 'createDecipheriv').mockReturnValue(decipheriv);
      derivedKey = new DerivedKey(derivedKeyValue);
    });

    it('should decrypt', () => {
      expect(derivedKey.decrypt(`${encryptedText}:${randomBytesMock}`)).toEqual(decryptedText);
    });

    it('should throw error on invalid encryptedKey', () => {
      const errorMsg = 'Invalid decrypted text';
      expect(() => derivedKey.decrypt('texdst')).toThrow(errorMsg);
      expect(() => derivedKey.decrypt('texdst:tests')).toThrow(errorMsg);
      expect(() => derivedKey.decrypt(`${encryptedText}:tests`)).toThrow(errorMsg);
      expect(() => derivedKey.decrypt(`tests:${randomBytesMock}`)).toThrow(errorMsg);
    });
  });
});
