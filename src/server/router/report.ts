import { TRPCError } from '@trpc/server'
import { parseCookies } from 'nookies'
import { z } from 'zod'
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
        code: 'UNAUTHORIZED',
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

      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: submissionId,
        },
        include: {
          quiz: true,
        },
      })

      if (!submission) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Submission not found.',
        })
      }

      const {
        activeCampaignQuizFinishedListId,
        activeCampaignLastSubmissionIdFieldId,
        activeCampaignLastResultFieldId,
      } = submission?.quiz

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

      return { success: true }
    },
  })
