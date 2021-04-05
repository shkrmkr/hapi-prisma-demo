import Boom from '@hapi/boom';
import { Lifecycle, Plugin, RouteOptionsValidate } from '@hapi/hapi';
import Joi from 'joi';
import { CreateUserInput } from './users.types';

export const usersPlugin: Plugin<null> = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: (server) => {
    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: handlers.create,
        options: {
          validate: validators.create,
        },
      },
      {
        method: 'GET',
        path: '/users/{id}',
        handler: handlers.readById,
        options: {
          validate: validators.readById,
        },
      },
      {
        method: 'DELETE',
        path: '/users/{id}',
        handler: handlers.delete,
        options: {
          validate: validators.delete,
        },
      },
    ]);
  },
};

const validators: Record<string, RouteOptionsValidate> = {
  create: {
    payload: Joi.object<CreateUserInput>({
      email: Joi.string().trim().email().required(),
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      social: Joi.object<CreateUserInput['social']>({
        facebook: Joi.string().trim().optional(),
        twitter: Joi.string().trim().optional(),
        github: Joi.string().trim().optional(),
        website: Joi.string().trim().uri().optional(),
      }),
    }),
    failAction: (req, h, err) => {
      throw err;
    },
  },
  readById: {
    params: Joi.object({ id: Joi.string().pattern(/^[1-9][0-9]*$/) }),
  },
  delete: {
    params: Joi.object({ id: Joi.string().pattern(/^[1-9][0-9]*$/) }),
  },
};

const handlers: Record<string, Lifecycle.Method> = {
  create: async (req, h) => {
    const { prisma } = req.server.app;

    const createUserInput = req.payload as CreateUserInput;

    try {
      const newUser = await prisma.user.create({
        data: createUserInput,
      });

      return h.response({ id: newUser.id }).code(201);
    } catch (error) {
      const boom = Boom.badImplementation('@ POST /users');
      boom.output.payload.message = 'Something went wrong :(';
      throw boom;
    }
  },
  readById: async (req, h) => {
    const { prisma } = req.server.app;
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return Boom.notFound(`User #${id} not found`);
    }

    return h.response({ user }).code(200);
  },
  delete: async (req, h) => {
    const { prisma } = req.server.app;
    const id = parseInt(req.params.id);

    try {
      await prisma.user.delete({ where: { id } });
      return h.response().code(204);
    } catch (error) {
      return Boom.badImplementation(`Failed to delete User #${id}`);
    }
  },
};
