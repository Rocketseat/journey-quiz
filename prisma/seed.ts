import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.quiz.deleteMany()

  const quiz = await prisma.quiz.create({
    data: {
      title: 'Fundamentos da Web',
      description: 'Quiz sobre fundamentos da web',
      imageUrl: 'javascript.svg',
    },
  })

  await prisma.question.deleteMany()

  for (let i = 0; i < 20; i++) {
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        score: 10,
        description: `Question ${i}`,
        answers: {
          create: [
            {
              description: 'Answer 01',
              isRightAnswer: true,
            },
            {
              description: 'Answer 02',
              isRightAnswer: false,
            },
            {
              description: 'Answer 03',
              isRightAnswer: false,
            },
            {
              description: 'Answer 04',
              isRightAnswer: false,
            },
          ],
        },
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
