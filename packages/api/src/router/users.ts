import type { TRPCRouterRecord } from "@trpc/server";
import { users } from "@repo/db/schema";
import { publicProcedure } from "../trpc.js";

export const usersRouter = {
  createUser: publicProcedure.query(() => {
    return "create user";
  }),
  readUsers: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.select().from(users).all();
    return res;
  }),
  updateUser: publicProcedure.query(() => {
    return "update user";
  }),
  deleteUser: publicProcedure.query(() => {
    return "delete user";
  }),
} satisfies TRPCRouterRecord;
