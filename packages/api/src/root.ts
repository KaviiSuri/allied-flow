import { authRouter } from "./router/auth.js";
import { createTRPCRouter } from "./trpc.js";

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
