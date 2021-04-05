import { Server } from '@hapi/hapi';
import { createServer } from '../../src/server';

describe('Status plugin', () => {
  let server: Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('POST / returns 404 response', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/',
    });

    expect(res.statusCode).toEqual(404);
  });

  test('GET / returns 200 works', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.payload)).toStrictEqual({ up: true });
  });
});
