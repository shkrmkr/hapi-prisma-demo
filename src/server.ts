import Hapi, { Server } from '@hapi/hapi';
import { prismaPlugin } from './plugins/prisma';
import { statusPlugin } from './plugins/status';
import { usersPlugin } from './users/users.plugin';

const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
});

export const createServer = async () => {
  await server.register([statusPlugin, prismaPlugin, usersPlugin]);
  await server.initialize();
  return server;
};

export const startServer = async (server: Server) => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
