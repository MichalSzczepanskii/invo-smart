import axios from 'axios';
import prisma from './prisma/prisma-client';
import _ from 'lodash';
import each from 'jest-each';
import { invalidEmails } from '../support/invalid-emails';

describe('Users', () => {
  const newUserIds = [];

  afterEach(async () => {
    if (_.isEmpty(newUserIds)) return;
    for (const id of newUserIds) {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    }
    newUserIds.length = 0;
  });

  it('should create new user', async () => {
    const user = {
      email: 'johh.doe@gmail.com',
      name: 'john doe',
      password: 'secret',
    };
    const res = await axios.post(`/api/users`, user);
    newUserIds.push(res.data.id);

    const newUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    expect(newUser.email).toEqual(user.email);
    expect(newUser.name).toEqual(user.name);
    expect(newUser.encryptionKey).toBeDefined();
    expect(newUser.emailVerifiedAt).toBeNull();
    expect(newUser.password).not.toEqual(user.password);
    expect(res.status).toBe(201);
  });

  describe('validation', () => {
    const axiosValidation = axios;
    let user;

    beforeEach(() => {
      user = {
        email: 'johh.doe@gmail.com',
        name: 'john doe',
        password: 'secret',
      };
    });

    beforeAll(() => {
      axiosValidation.defaults.validateStatus = () => true;
    });

    describe('required fields', () => {
      it('should require name property', async () => {
        const res = await axiosValidation.post('/api/users', _.omit(user, 'name'));
        expect(res.status).toBe(400);
        expect(res.data.message).toEqual(['name should not be empty']);
      });

      it('should require password property', async () => {
        const res = await axiosValidation.post('/api/users', _.omit(user, 'password'));
        expect(res.status).toBe(400);
        expect(res.data.message).toEqual(['password should not be empty']);
      });

      it('should require email property', async () => {
        const res = await axiosValidation.post('/api/users', _.omit(user, 'email'));
        expect(res.status).toBe(400);
        expect(res.data.message).toEqual(['email must be an email']);
      });
    });

    describe('invalid emails', () => {
      each(invalidEmails).it('catch invalid email %s', async email => {
        const res = await axiosValidation.post('/api/users', _.set(user, 'email', email));
        expect(res.status).toBe(400);
        expect(res.data.message).toEqual(['email must be an email']);
      });
    });

    it('should check if email is unique', async () => {
      const firstUser = await axios.post(`/api/users`, user);
      newUserIds.push(firstUser.data.id);

      const secondUser = await axios.post(`/api/users`, user);
      expect(secondUser.status).toBe(400);
      expect(secondUser.data.message).toEqual(['user with the same email already exists']);
    });
  });
});
