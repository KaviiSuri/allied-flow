import { authRouter } from "./router/auth.js";
import { usersRouter } from "./router/users.js";
import { createTRPCRouter } from "./trpc.js";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
