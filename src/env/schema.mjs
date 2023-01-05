// @ts-check

import { z } from 'zod'

export const serverSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  ACTIVE_CAMPAIGN_URL: z.string(),
  ACTIVE_CAMPAIGN_API_KEY: z.string(),
  BASE_URL: z.string(),
})

export const clientSchema = z.object({})

/**
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {}
