import { expressRouter } from "./router/routes.js";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: expressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
