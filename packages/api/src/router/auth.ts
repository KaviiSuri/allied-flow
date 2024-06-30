import type { TRPCRouterRecord } from "@trpc/server";
import { usersApi } from "@repo/logto-admin";

import { protectedProcedure } from "../trpc.js";

export const authRouter = {
  getSession: protectedProcedure.query(async ({ ctx }) => {
    const uid = ctx.claims.sub;
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, uid),
    });
    const { data: logtoUser } = await usersApi.apiUsersUserIdGet(uid, "true");
    return {
      claims: ctx.claims,
      logtoUser,
      user,
    };
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
