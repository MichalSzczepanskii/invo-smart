import axios from 'axios';
import prisma from './prisma/prisma-client';

describe('Users', () => {
  let newUser;
  it('should create new user', async () => {
    const user = {
      email: 'johh.doe@gmail.com',
      name: 'john doe',
      password: 'secret',
    };
    const res = await axios.post(`/api/users`, user);

    newUser = await prisma.user.findUnique({
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

  afterAll(async () => {
    if (newUser)
      await prisma.user.delete({
        where: {
          id: newUser?.id,
        },
      });
  });
});
