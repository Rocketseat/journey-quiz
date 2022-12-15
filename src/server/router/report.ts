import { TRPCError } from '@trpc/server'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { z } from 'zod'
import { trackEvent } from '../lib/active-campaign'
import { subscribeEmailToActiveCampaignList } from '../lib/subscribe-email-to-active-campaign-list'
import { createRouter } from './context'

const reportSchema = z.object({
  submissionId: z.string().cuid(),
  email: z.string().email(),
})

export const reportRouter = createRouter()
  .middleware(async ({ ctx, next, rawInput }) => {
    const result = reportSchema.safeParse(rawInput)

    if (!result.success) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }

    const { sessionId, userId } = parseCookies({ req: ctx.req })

    const submission = await ctx.prisma.submission.findUnique({
      where: {
        id: result.data.submissionId,
      },
    })

    if (!submission) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Submission not found.',
      })
    }

    if (sessionId && submission?.sessionId !== sessionId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'This submission was created by another user.',
      })
    }

    if (userId && submission?.userId !== userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'This submission was created by another user.',
      })
    }

    if (submission.gaveUpAt) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You already gave up this submission.',
      })
    }

    if (!submission.finishedAt) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You did not finish this submission.',
      })
    }

    return next({
      ctx: {
        ...ctx,
        submission,
        sessionId,
        userId,
      },
    })
  })
  .mutation('sendReport', {
    input: reportSchema.extend({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const { email, submissionId } = input
      const { submission } = ctx

      let [user, quiz] = await Promise.all([
        ctx.prisma.user.findUnique({
          where: {
            email: input.email,
          },
        }),
        ctx.prisma.quiz.findUnique({
          where: {
            id: ctx.submission.quizId,
          },
        }),
      ])

      if (!quiz) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Quiz was not found',
        })
      }

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            submissions: {
              connect: {
                id: submission.id,
              },
            },
          },
        })

        await ctx.prisma.submission.update({
          where: {
            id: submission.id,
          },
          data: {
            userId: user.id,
            sessionId: null,
          },
        })

        await trackEvent('quiz_done', user.email, { name: quiz?.title })
      }

      await trackEvent('quiz_report_request', user.email, {
        name: quiz?.title,
      })

      const {
        activeCampaignQuizFinishedListId,
        activeCampaignLastSubmissionIdFieldId,
        activeCampaignLastResultFieldId,
      } = quiz

      const customFields = [
        {
          field: activeCampaignLastSubmissionIdFieldId,
          value: submissionId,
        },
        {
          field: activeCampaignLastResultFieldId,
          value: String(submission.result),
        },
      ]

      await subscribeEmailToActiveCampaignList({
        email,
        listId: activeCampaignQuizFinishedListId,
        customFields,
      })

      destroyCookie({ res: ctx.res }, 'sessionId', {
        path: '/',
      })

      setCookie({ res: ctx.res }, 'userId', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 15, // 15 days
      })

      return { success: true }
    },
  })
