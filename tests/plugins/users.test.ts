import { Prisma } from '.prisma/client';
import { Server } from '@hapi/hapi';
import faker from 'faker';
import { createServer } from '../../src/server';
import { CreateUserInput } from '../../src/users/users.types';

describe('/users routes', () => {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  let userId: Prisma.UserWhereUniqueInput['id'];

  test('should create user', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        email: faker.internet.email(),
        firstName: 'a',
        lastName: 'b',
        social: {
          twitter: 'c',
          website: faker.internet.url(),
        },
      } as CreateUserInput,
    });

    expect(res.statusCode).toEqual(201);
    userId = JSON.parse(res.payload)?.id;

    expect(userId).toBeTruthy();
  });

  test('should delete user', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: `/users/${userId}`,
    });

    expect(res.statusCode).toEqual(204);
  });
});
