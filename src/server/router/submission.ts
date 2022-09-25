import { createRouter } from './context'
import { z } from 'zod'
import { parseCookies, setCookie } from 'nookies'
import { randomUUID } from 'node:crypto'

export const submissionRouter = createRouter().mutation('start', {
  input: z.object({
    quizId: z.string(),
  }),
  async resolve({ input, ctx }) {
    let { sessionId = null, userId = null } = parseCookies({ req: ctx.req })

    if (!sessionId && !userId) {
      sessionId = randomUUID()

      setCookie({ res: ctx.res }, 'sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 15, // 15 days
      })
    }

    const submission = await ctx.prisma.submission.create({
      data: {
        quizId: input.quizId,
        sessionId,
        userId,
      },
    })

    const submissionId = submission.id

    return { submissionId }
  },
})
