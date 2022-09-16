import { NextApiRequest, NextApiResponse } from 'next'
import { randomUUID } from 'node:crypto'
import { setCookie, parseCookies } from 'nookies'

import { prisma } from '../../../../server/db/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const quizId = String(req.query.id)
  let { sessionId } = parseCookies({ req })

  if (!sessionId) {
    sessionId = randomUUID()

    setCookie({ res }, 'sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 15, // 15 days
    })
  }

  const submission = await prisma.submission.create({
    data: {
      quizId,
    },
  })

  const submissionId = submission.id

  return res.redirect(`/submissions/${submissionId}`)
}
