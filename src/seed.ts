import { PrismaClient } from '@prisma/client';
import faker from 'faker';

const prisma = new PrismaClient();

// A `main` function so that we can use async/await
const main = async () => {
  await prisma.courseEnrollment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.test.deleteMany();
  await prisma.course.deleteMany();

  const grace = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: 'Grace',
      lastName: faker.name.lastName(),
      social: {
        facebook: faker.internet.userName(),
        twitter: faker.internet.userName(),
      },
    },
  });

  const course = await prisma.course.create({
    data: {
      courseDetails: faker.random.words(15),
      name: 'CRUD with prisma + hapi',
      tests: {
        createMany: {
          data: [
            {
              date: faker.datatype.datetime(),
              name: 'the first test',
            },
            {
              date: faker.datatype.datetime(),
              name: 'the second test',
            },
            {
              date: faker.datatype.datetime(),
              name: 'the last test',
            },
          ],
        },
      },
      members: {
        create: {
          role: 'TEACHER',
          userId: grace.id,
        },
      },
    },
    include: {
      tests: true,
      members: {
        include: { user: true },
      },
    },
  });

  const jason = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: 'Jason',
      lastName: faker.name.lastName(),
      social: {
        instagram: faker.internet.userName(),
      },
      courses: {
        create: {
          courseId: course.id,
          role: 'STUDENT',
        },
      },
    },
  });

  const mark = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: 'Mark',
      lastName: faker.name.lastName(),
      social: {
        facebook: faker.internet.userName(),
      },
      courses: {
        create: {
          courseId: course.id,
          role: 'STUDENT',
        },
      },
    },
  });

  for (const test of course.tests) {
    const markTestResult = await prisma.testResult.create({
      data: {
        gradedBy: { connect: { id: grace.id } },
        student: { connect: { id: mark.id } },
        test: { connect: { id: test.id } },
        result: faker.datatype.number(1000),
      },
    });
  }

  const results = await prisma.testResult.aggregate({
    where: { studentId: mark.id },
    avg: { result: true },
    max: { result: true },
    min: { result: true },
    count: { result: true },
  });

  console.log(results);
};

main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
