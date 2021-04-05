import { Plugin } from '@hapi/hapi';

export const statusPlugin: Plugin<null> = {
  name: 'app/status',
  register: async (server) => {
    server.route({
      method: 'GET',
      path: '/',
      handler: async (req, h) => {
        return h.response({ up: true });
      },
    });
  },
};
