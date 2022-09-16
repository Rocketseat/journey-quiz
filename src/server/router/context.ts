import * as trpc from '@trpc/server'
import { prisma } from '../db/client'

export const createContextInner = async () => {
  return { prisma }
}

export const createContext = async () => {
  return await createContextInner()
}

type Context = trpc.inferAsyncReturnType<typeof createContext>

export const createRouter = () => trpc.router<Context>()
