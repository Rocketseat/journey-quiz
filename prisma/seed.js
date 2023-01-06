const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker')

const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.quiz.deleteMany()

    for (let qi = 0; qi <= 1; qi++) {
      const quiz = await prisma.quiz.create({
        data: {
          title: qi % 2 === 0 ? 'Desenvolvimento web' : 'React',
          description: 'Quiz sobre fundamentos da web',
          imageUrl: qi % 2 === 0 ? 'javascript' : 'react',
          slug: qi % 2 === 0 ? `desenvolvimento-web-${qi}` : `react-${qi}`,

          activeCampaignQuizFinishedTagId: qi % 2 === 0 ? '77' : '73',
          activeCampaignMasterclassInterestedTagId: qi % 2 === 0 ? '78' : '74',
          activeCampaignMasterclassCompletedTagId: qi % 2 === 0 ? `79` : '75',
          activeCampaignMasterclassCertifiedTagId: qi % 2 === 0 ? `82` : '81',
          activeCampaignMasterclassHotTagId: qi % 2 === 0 ? `80` : '76',
          
          activeCampaignLastSubmissionIdFieldId: qi % 2 === 0 ? `36` : '34',
          activeCampaignLastResultFieldId: qi % 2 === 0 ? `37` : '35',
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
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
