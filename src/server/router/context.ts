import * as trpc from '@trpc/server'
import { CreateNextContextOptions } from '@trpc/server/adapters/next'

import { prisma } from '../db/client'

export const createContext = async (opts?: CreateNextContextOptions) => {
  return {
    prisma,
    req: opts?.req,
    res: opts?.res,
  }
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
