import { createRouter } from './context'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { parseCookies, setCookie } from 'nookies'
import { isAfter, addMinutes, differenceInSeconds } from 'date-fns'
import { randomUUID } from 'node:crypto'

export const submissionRouter = createRouter()
  .mutation('start', {
    input: z.object({
      quizId: z.string(),
    }),
    async resolve({ input, ctx }) {
      let { sessionId } = parseCookies({ req: ctx.req })

      if (!sessionId) {
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
        },
      })

      const submissionId = submission.id

      return { submissionId }
    },
  })
  .query('get', {
    input: z.object({
      submissionId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          quiz: true,
        },
      })

      const { sessionId } = parseCookies({ req: ctx.req })

      if (submission?.sessionId !== sessionId) {
        if (!submission) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'This submission was created by another user.',
          })
        }
      }

      return submission
    },
  })
  .mutation('sendAnswer', {
    input: z.object({
      submissionQuestionAnswerId: z.string().cuid(),
      answerId: z.string().cuid().nullish(),
    }),
    async resolve({ ctx, input }) {
      const submissionQuestionAnswer =
        await ctx.prisma.submissionQuestionAnswer.findUnique({
          where: {
            id: input.submissionQuestionAnswerId,
          },
        })

      if (!submissionQuestionAnswer) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "The question you're trying to answer doesn't exist.",
        })
      }

      if (submissionQuestionAnswer.answerId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This question was already answered.',
        })
      }

      const answerDeadline = addMinutes(submissionQuestionAnswer.createdAt, 2)
      const isAnswerLate = isAfter(new Date(), answerDeadline)

      await ctx.prisma.submissionQuestionAnswer.update({
        where: {
          id: submissionQuestionAnswer.id,
        },
        data: {
          answerId: isAnswerLate ? null : input.answerId,
          answered: true,
        },
      })
    },
  })
  .query('fetchQuestion', {
    input: z.object({
      submissionId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          questionAnswers: true,
        },
      })

      if (!submission) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'The submission with the provided ID was not found.',
        })
      }

      const { sessionId } = parseCookies({ req: ctx.req })

      if (submission?.sessionId !== sessionId) {
        if (!submission) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'This submission was created by another user.',
          })
        }
      }

      const alreadyFetchedQuestionIds = submission.questionAnswers.map(
        (question) => {
          return question.questionId
        },
      )

      const inProgressQuestion = submission.questionAnswers.find(
        (questionAnswer) => {
          return questionAnswer.answered === false
        },
      )

      const currentQuestionNumber = alreadyFetchedQuestionIds.length

      if (inProgressQuestion) {
        const currentQuestion = await ctx.prisma.question.findUnique({
          where: {
            id: inProgressQuestion.questionId,
          },
          include: {
            answers: true,
          },
        })

        const answerDeadline = addMinutes(inProgressQuestion.createdAt, 2)
        const isAnswerLate = isAfter(new Date(), answerDeadline)

        if (isAnswerLate) {
          return {
            status: 'late',
            currentQuestionNumber,
            remainingTimeInSeconds: 0,
            description: currentQuestion?.description,
            submissionQuestionAnswerId: inProgressQuestion.id,
            answers: currentQuestion?.answers.map((answer) => {
              return {
                id: answer.id,
                description: answer.description,
              }
            }),
          }
        }

        return {
          status: 'ongoing',
          currentQuestionNumber,
          remainingTimeInSeconds: differenceInSeconds(
            addMinutes(inProgressQuestion.createdAt, 2),
            new Date(),
          ),
          description: currentQuestion?.description,
          submissionQuestionAnswerId: inProgressQuestion.id,
          answers: currentQuestion?.answers.map((answer) => {
            return {
              id: answer.id,
              description: answer.description,
            }
          }),
        }
      } else {
        const nextQuestion = await ctx.prisma.question.findFirst({
          where: {
            quizId: submission.quizId,
            id: {
              notIn: alreadyFetchedQuestionIds,
            },
          },
          include: {
            answers: true,
          },
        })

        if (!nextQuestion) {
          return {
            status: 'finished',
          }
        }

        const submissionQuestionAnswer =
          await ctx.prisma.submissionQuestionAnswer.create({
            data: {
              submissionId: submission.id,
              questionId: nextQuestion.id,
            },
          })

        const answerDeadline = addMinutes(submissionQuestionAnswer.createdAt, 2)
        const isAnswerLate = isAfter(new Date(), answerDeadline)

        if (isAnswerLate) {
          return {
            status: 'late',
            currentQuestionNumber,
            remainingTimeInSeconds: 0,
            description: nextQuestion?.description,
            submissionQuestionAnswerId: submissionQuestionAnswer.id,
            answers: nextQuestion?.answers.map((answer) => {
              return {
                id: answer.id,
                description: answer.description,
              }
            }),
          }
        }

        return {
          status: 'ongoing',
          currentQuestionNumber: currentQuestionNumber + 1,
          remainingTimeInSeconds: differenceInSeconds(
            addMinutes(submissionQuestionAnswer.createdAt, 2),
            new Date(),
          ),
          description: nextQuestion?.description,
          submissionQuestionAnswerId: submissionQuestionAnswer.id,
          answers: nextQuestion?.answers.map((answer) => {
            return {
              id: answer.id,
              description: answer.description,
            }
          }),
        }
      }
    },
  })
  .query('result', {
    input: z.object({
      submissionId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          quiz: true,
        },
      })

      const { sessionId } = parseCookies({ req: ctx.req })

      if (submission?.sessionId !== sessionId) {
        if (!submission) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'This submission was created by another user.',
          })
        }
      }

      if (!submission) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Submission not found.',
        })
      }

      let result = submission.result

      if (!result) {
        const questionAnswers =
          await ctx.prisma.submissionQuestionAnswer.findMany({
            where: {
              submissionId: input.submissionId,
            },
            include: {
              question: true,
              answer: true,
            },
          })

        result = questionAnswers.reduce((result, questionAnswer) => {
          if (questionAnswer.answer?.isRightAnswer) {
            return result + questionAnswer.question.score
          } else {
            return result
          }
        }, 0)

        await ctx.prisma.submission.update({
          where: {
            id: input.submissionId,
          },
          data: {
            result,
          },
        })
      }

      const [quizApplicantsAmount, quizApplicantsWithLowerResultAmount] =
        await Promise.all([
          ctx.prisma.submission.count({
            where: {
              quizId: submission.quizId,
              result: {
                not: null,
              },
            },
          }),
          ctx.prisma.submission.count({
            where: {
              quizId: submission.quizId,
              result: {
                not: null,
                lt: result,
              },
            },
          }),
        ])

      const betterThanPercentage = Math.round(
        (quizApplicantsWithLowerResultAmount * 100) / quizApplicantsAmount,
      )

      return {
        result,
        quizTitle: submission.quiz.title,
        betterThanPercentage,
      }
    },
  })
  .mutation('sendReport', {
    input: z.object({
      email: z.string().email(),
      submissionId: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
      })

      const { sessionId } = parseCookies({ req: ctx.req })

      if (submission?.sessionId !== sessionId) {
        if (!submission) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'This submission was created by another user.',
          })
        }
      }

      if (!submission) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Submission not found.',
        })
      }

      let user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      })

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: input.email,
          },
        })
      }

      await ctx.prisma.submission.update({
        where: {
          id: input.submissionId,
        },
        data: {
          userId: user.id,
        },
      })

      // TODO: Send email
    },
  })
