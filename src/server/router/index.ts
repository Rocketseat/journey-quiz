import superjson from 'superjson'

import { createRouter } from './context'
import { quizRouter } from './quiz'
import { reportRouter } from './report'
import { submissionRouter } from './submission'
import { submissionSessionRouter } from './submission-session'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('quiz.', quizRouter)
  .merge('submission.', submissionRouter)
  .merge('submissionSession.', submissionSessionRouter)
  .merge('report.', reportRouter)

export type AppRouter = typeof appRouter
