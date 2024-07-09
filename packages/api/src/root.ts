import { authRouter } from "./router/auth.js";
import { teamsRouter } from "./router/teams.js";
import { usersRouter } from "./router/users.js";
import { createTRPCRouter } from "./trpc.js";
import { productsRotuer } from "./router/products.js";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  products: productsRotuer,
  teams: teamsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
