import { Prisma } from '@prisma/client';

export interface CreateUserInput
  extends Omit<
    Prisma.UserCreateInput,
    'courses' | 'testResults' | 'testsGraded'
  > {
  email: string;
  firstName: string;
  lastName: string;
  social?: {
    facebook?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}
