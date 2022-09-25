import type { AppRouter } from '../server/router'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureOutput, inferProcedureInput } from '@trpc/server'

export const trpc = createReactQueryHooks<AppRouter>()

export type QueryRouteKey = keyof AppRouter['_def']['queries']
export type MutationRouteKey = keyof AppRouter['_def']['mutations']

export type inferQueryOutput<TRouteKey extends QueryRouteKey> =
  inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

export type inferQueryInput<TRouteKey extends QueryRouteKey> =
  inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>

export type inferMutationOutput<TRouteKey extends MutationRouteKey> =
  inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>

export type inferMutationInput<TRouteKey extends MutationRouteKey> =
  inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>
