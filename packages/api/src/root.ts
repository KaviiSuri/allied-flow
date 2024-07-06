import { an, defineAbilityFor } from "@repo/permissions";
import { authRouter } from "./router/auth.js";
import { teamsRouter } from "./router/teams.js";
import { usersRouter } from "./router/users.js";
import { createTRPCRouter } from "./trpc.js";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  teams: teamsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

const user = {
  id: "1",
  role: "SALES",
  teamId: "1",
  name: "User",
  email: "test@admin.com",
  phone: "123",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  team: {
    id: "1",
    type: "SELLER",
    name: "Seller Team",
    gstNo: "123",
    address: "Seller Team Address",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
} as const;

const ability = defineAbilityFor(user);

console.log("Ability", ability);
