import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { usersApi } from "@repo/logto-admin";

import { protectedProcedure } from "../trpc.js";

export const authRouter = {
  getSession: protectedProcedure.query(async ({ ctx }) => {
    const uid = ctx.claims.sub;
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, uid),
    });
    const { status } = await usersApi.apiUsersUserIdGet(uid, "true");
    if (status !== 200) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Failed to fetch user",
      });
    }
    return user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
