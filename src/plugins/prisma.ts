import { PrismaClient } from '.prisma/client';
import { Plugin } from '@hapi/hapi';

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

export const prismaPlugin: Plugin<null> = {
  name: 'prisma',
  register: async (server) => {
    const prisma = new PrismaClient();

    server.app.prisma = prisma;

    server.ext({
      type: 'onPostStop',
      method: async (server) => {
        server.app.prisma.$disconnect();
      },
    });
  },
};
