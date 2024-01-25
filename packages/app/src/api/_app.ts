import { router } from "../lib/server/trpc"

import { authRouter } from "./auth/_router"
import { meRouter } from "./me/_router"
import { nodeRouter } from "./node/_router"
import { uploadRouter } from "./upload/_router"

export const appRouter = router({
  auth: authRouter,
  me: meRouter,
  upload: uploadRouter,
  node: nodeRouter,
})

export type AppRouter = typeof appRouter
