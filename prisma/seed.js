const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.quiz.deleteMany()

    const quiz = await prisma.quiz.create({
      data: {
        title: 'Fundamentos da Web',
        description: 'Quiz sobre fundamentos da web',
        imageUrl: 'javascript.svg',
        slug: 'fundamentos-da-web',
      },
    })

    for (let i = 0; i < 20; i++) {
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          score: 10,
          description: faker.lorem.paragraph(),
          answers: {
            create: [
              {
                description: faker.lorem.paragraph(),
                isRightAnswer: true,
              },
              {
                description: faker.lorem.paragraph(),
                isRightAnswer: false,
              },
              {
                description: faker.lorem.paragraph(),
                isRightAnswer: false,
              },
              {
                description: faker.lorem.paragraph(),
                isRightAnswer: false,
              },
            ],
          },
        },
      })
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
