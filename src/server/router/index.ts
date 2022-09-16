import superjson from 'superjson'

import { createRouter } from './context'
import { quizRouter } from './quiz'
import { submissionRouter } from './submission'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('quiz.', quizRouter)
  .merge('submission.', submissionRouter)

export type AppRouter = typeof appRouter
