import superjson from 'superjson'

import { createRouter } from './context'
import { quizRouter } from './quiz'
import { submissionRouter } from './submission'
import { submissionSessionRouter } from './submission-session'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('quiz.', quizRouter)
  .merge('submission.', submissionRouter)
  .merge('submissionSession.', submissionSessionRouter)

export type AppRouter = typeof appRouter
