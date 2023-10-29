import axios from 'axios';
import prisma from './prisma/prisma-client';
import { User } from '@invo-smart/shared/data-access';
import { parseJwt } from '../support/utils/parse-jwt';
import { hashPassword } from '../support/utils/hash-password';
import each from 'jest-each';
import { invalidEmails } from '../support/invalid-emails';

describe('auth', () => {
  beforeAll(() => {
    axios.defaults.validateStatus = () => true;
  });

  it('should not login if user with given email does not exist', async () => {
    const email = 'imnotexits@gmail.com';
    const password = 'secret';

    const res = await axios.post('/api/auth/sign-in', {
      email,
      password,
    });

    expect(res.status).toEqual(401);
    expect(res.data).toEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  describe('tests for existing users', () => {
    const username = 'dev';
    const email = 'dev@gmail.com';
    const password = 'root123';
    const invalidPassword = 'invalidPassword';
    let createdUser: User;

    beforeAll(async () => {
      createdUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword(password),
          name: username,
          emailVerifiedAt: undefined,
          encryptionKey: '',
        },
      });
    });

    afterAll(async () => {
      await prisma.user.delete({
        where: { id: createdUser.id },
      });
    });

    it('should return access token if given valid credentials', async () => {
      const res = await axios.post('/api/auth/sign-in', { email, password });
      expect(res.status).toEqual(201);
      expect(res.data.accessToken).toBeDefined();
      const payload = parseJwt(res.data.accessToken);
      expect(payload).toEqual({
        id: createdUser.id,
        email,
        iat: (new Date().getTime() / 1000) | 0,
        username,
      });
    });

    it('should return unauthorized if invalid password is passed', async () => {
      const res = await axios.post('/api/auth/sign-in', { email, password: invalidPassword });
      expect(res.status).toEqual(401);
      expect(res.data).toEqual({
        message: 'Unauthorized',
        statusCode: 401,
      });
    });
  });

  describe('validation', () => {
    it('should mark email as required', async () => {
      const res = await axios.post('/api/auth/sign-in', { password: 'secret' });
      expect(res.status).toBe(400);
      expect(res.data.message).toEqual(['email must be an email']);
    });

    it('should mark password as required', async () => {
      const res = await axios.post('/api/auth/sign-in', { email: 'test@gmail.com' });
      expect(res.status).toBe(400);
      expect(res.data.message).toEqual(['password should not be empty']);
    });

    each(invalidEmails).it('catch invalid email %s', async email => {
      const res = await axios.post('/api/auth/sign-in', { email, password: 'secret' });
      expect(res.status).toBe(400);
      expect(res.data.message).toEqual(['email must be an email']);
    });
  });
});
