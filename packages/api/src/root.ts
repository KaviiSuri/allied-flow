import { authRouter } from "./router/auth.js";
import { teamsRouter } from "./router/teams.js";
import { usersRouter } from "./router/users.js";
import { createTRPCRouter } from "./trpc.js";
import { productsRotuer } from "./router/products.js";
import { ordersRouter } from "./router/order.js";
import { inquiryRouter } from "./router/inquiry.js";
import { notificationsRouter } from "./router/notifications.js";
import { filesRouter } from "./router/files.js";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  products: productsRotuer,
  orders: ordersRouter,
  inquiry: inquiryRouter,
  teams: teamsRouter,
  notifications: notificationsRouter,
  files: filesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
