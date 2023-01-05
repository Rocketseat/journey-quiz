import { TRPCError } from '@trpc/server'
import axios from 'axios'
import { parseCookies } from 'nookies'
import { z } from 'zod'
import { addExistingUserToInterestedActiveCampaignList } from '../lib/add-existing-user-to-interested-active-campaign-list'
import { addExistingUserToMasterclassCompletedActiveCampaignList } from '../lib/add-existing-user-to-masterclass-completed-active-campaign-list copy'
import { createRouter } from './context'

const masterclassSchema = z.object({
  submissionId: z.string().cuid(),
})

export const masterclassRouter = createRouter()
  .middleware(async ({ ctx, next, rawInput }) => {
    const result = masterclassSchema.safeParse(rawInput)

    if (!result.success) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }

    const { sessionId, userId } = parseCookies({ req: ctx.req })

    const submission = await ctx.prisma.submission.findUnique({
      where: {
        id: result.data.submissionId,
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
  .query('interested', {
    input: masterclassSchema,
    async resolve({ ctx }) {
      const { submission } = ctx

      const [user, quiz] = await Promise.all([
        ctx.prisma.user.findUnique({
          where: {
            id: submission.userId,
          },
        }),
        ctx.prisma.quiz.findUnique({
          where: {
            id: ctx.submission.quizId,
          },
        }),
      ])

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User does not exist',
        })
      }

      if (!quiz) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Quiz was not found',
        })
      }

      const { activeCampaignMasterclassInterestedListId } = quiz

      await addExistingUserToInterestedActiveCampaignList({
        email: user.email,
        listId: activeCampaignMasterclassInterestedListId,
      })

      return { success: true }
    },
  })
  .mutation('generateCertificate', {
    input: masterclassSchema.extend({
      name: z.string().min(1),
      phone: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const { submission } = ctx
      const { name, phone } = input

      const [user, quiz] = await Promise.all([
        ctx.prisma.user.findUnique({
          where: {
            id: submission.userId ?? undefined,
          },
        }),
        ctx.prisma.quiz.findUnique({
          where: {
            id: ctx.submission.quizId,
          },
        }),
      ])

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User does not exist',
        })
      }

      if (!quiz) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Quiz was not found',
        })
      }

      const { activeCampaignMasterclassCompletedListId } = quiz

      await addExistingUserToMasterclassCompletedActiveCampaignList({
        email: user.email,
        listId: activeCampaignMasterclassCompletedListId,
        name,
        phone,
      })

      const response = await axios.get(
        'http://localhost:3000/api/generate/certificateImage',
        {
          params: {
            name,
            masterclassSlug: 'react',
          },
          responseType: 'text',
          responseEncoding: 'base64',
        },
      )

      return { certificate: response.data, success: true }
    },
  })
