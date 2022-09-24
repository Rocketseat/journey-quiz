import { z } from 'zod'
import { createRouter } from './context'

export const quizRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.quiz.findMany()
    },
  })
  .query('get', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          _count: {
            select: {
              submissions: true,
            },
          },
        },
      })

      return quiz
    },
  })
