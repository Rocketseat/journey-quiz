import superjson from "superjson";

import { createRouter } from "./context";
import { exampleRouter } from "./example";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)

export type AppRouter = typeof appRouter;
