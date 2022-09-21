import { createRouter } from './context'

export const quizRouter = createRouter().query('getAll', {
  async resolve({ ctx }) {
    return await ctx.prisma.quiz.findMany()
  },
})
