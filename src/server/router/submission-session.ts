import { createRouter } from './context'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { isAfter, addMinutes, differenceInSeconds, sub } from 'date-fns'
import { trackEvent } from '../lib/active-campaign'

const submissionSessionSchema = z.object({
  submissionId: z.string().cuid(),
})

export const submissionSessionRouter = createRouter()
  .middleware(async ({ ctx, next, rawInput }) => {
    const result = submissionSessionSchema.safeParse(rawInput)

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

    return next({
      ctx: {
        ...ctx,
        submission,
        sessionId,
        userId,
      },
    })
  })
  .query('get', {
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          quiz: true,
        },
      })

      return submission
    },
  })
  .mutation('giveUp', {
    input: submissionSessionSchema,
    async resolve({ ctx }) {
      await ctx.prisma.submission.update({
        where: {
          id: ctx.submission.id,
        },
        data: {
          gaveUpAt: new Date(),
        },
      })
    },
  })
  .mutation('sendAnswer', {
    input: submissionSessionSchema.extend({
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

      if (isAnswerLate) {
        await ctx.prisma.submissionQuestionAnswer.update({
          where: {
            id: submissionQuestionAnswer.id,
          },
          data: {
            answerId: null,
            answeredAt: new Date(),
            answered: true,
          },
        })
      } else {
        await ctx.prisma.submissionQuestionAnswer.update({
          where: {
            id: submissionQuestionAnswer.id,
          },
          data: {
            answerId: input.answerId,
            answeredAt: new Date(),
            answered: true,
          },
        })
      }
    },
  })
  .query('fetchQuestion', {
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      const questionAnswers =
        await ctx.prisma.submissionQuestionAnswer.findMany({
          where: {
            submissionId: input.submissionId,
          },
        })

      const alreadyFetchedQuestionIds = questionAnswers.map((question) => {
        return question.questionId
      })

      const inProgressQuestion = questionAnswers.find((questionAnswer) => {
        return questionAnswer.answered === false
      })

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
            quizId: ctx.submission.quizId,
            id: {
              notIn: alreadyFetchedQuestionIds,
            },
          },
          include: {
            answers: true,
          },
        })

        if (!nextQuestion) {
          await ctx.prisma.submission.update({
            where: {
              id: input.submissionId,
            },
            data: {
              finishedAt: new Date(),
            },
          })

          if (ctx.userId) {
            const [user, quiz] = await Promise.all([
              ctx.prisma.user.findUnique({
                where: {
                  id: ctx.userId,
                },
              }),
              ctx.prisma.quiz.findUnique({
                where: {
                  id: ctx.submission.quizId,
                },
              }),
            ])

            if (user) {
              await trackEvent('quiz_done', user.email, { name: quiz?.title })
            }
          }

          return {
            status: 'finished',
          }
        }

        const submissionQuestionAnswer =
          await ctx.prisma.submissionQuestionAnswer.create({
            data: {
              submissionId: input.submissionId,
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
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      if (!ctx.submission.finishedAt) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Submission not finished.',
        })
      }

      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: ctx.submission.quizId,
        },
      })

      let result = ctx.submission.result

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
              quizId: ctx.submission.quizId,
              result: {
                not: null,
              },
            },
          }),
          ctx.prisma.submission.count({
            where: {
              quizId: ctx.submission.quizId,
              result: {
                not: null,
                lt: result,
              },
            },
          }),
        ])

      const betterThanPercentage =
        quizApplicantsAmount > 1
          ? Math.round(
              (quizApplicantsWithLowerResultAmount * 100) /
                (quizApplicantsAmount - 1),
            )
          : 100

      return {
        result,
        quiz,
        betterThanPercentage,
      }
    },
  })
  .mutation('sendReport', {
    input: submissionSessionSchema.extend({
      email: z.string().email(),
    }),
    async resolve({ input, ctx }) {
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

      if (!user) {
        user = await ctx.prisma.user.create({
          data: {
            email: input.email,
          },
        })

        await trackEvent('quiz_done', user.email, { name: quiz?.title })
      }

      await ctx.prisma.submission.updateMany({
        where: {
          sessionId: ctx.sessionId,
        },
        data: {
          sessionId: null,
          userId: user.id,
        },
      })

      await trackEvent('quiz_report_request', user.email, { name: quiz?.title })

      destroyCookie({ res: ctx.res }, 'sessionId', {
        path: '/',
      })

      setCookie({ res: ctx.res }, 'userId', user.id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 15, // 15 days
      })
    },
  })
  .query('report', {
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          user: true,
          quiz: true,
          questionAnswers: {
            include: {
              answer: true,
              question: {
                include: {
                  answers: {
                    where: {
                      isRightAnswer: true,
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      })

      if (!submission?.reportViewedAt && submission?.user) {
        await Promise.all([
          ctx.prisma.submission.update({
            where: {
              id: input.submissionId,
            },
            data: {
              reportViewedAt: new Date(),
            },
          }),
          trackEvent('quiz_report_view', submission.user.email, {
            name: submission.quiz.title,
          }),
        ])
      }

      if (!ctx.submission.result) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Submission not finished.',
        })
      }

      const report = submission?.questionAnswers.map((questionAnswer) => {
        return {
          question: {
            id: questionAnswer.questionId,
            description: questionAnswer.question.description,
          },
          userAnswer: questionAnswer.answer,
          rightAnswer: questionAnswer.question.answers[0],
        }
      })

      return {
        result: ctx.submission.result,
        quiz: submission?.quiz,
        report,
      }
    },
  })
