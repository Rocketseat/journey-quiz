import { createRouter } from './context'
// import { z } from "zod";

export const quizRouter = createRouter().query('getAll', {
  async resolve({ ctx }) {
    return await ctx.prisma.quiz.findMany()
  },
})
