import type { TRPCRouterRecord } from "@trpc/server";
import { users } from "@repo/db/schema";
import { publicProcedure } from "../trpc.js";
import { eq } from "@repo/db";
import { z } from "zod";

export const usersRouter = {
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        role: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertedUserId = await ctx.db.insert(users).values([
        {
          name: input.name,
          email: input.email,
          phone: input.phone,
          role: input.role,
          teamId: input.teamId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      return insertedUserId;
    }),
  readUsers: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findMany();
    return res;
  }),
  updateUser: publicProcedure.mutation(async (ctx) => {
    const upatedUserId = await ctx.db
      .update(users)
      .set({
        name: ctx.input.name,
        email: ctx.input.email,
        phone: ctx.input.phone,
        role: ctx.input.role,
        teamId: ctx.input.teamId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.input.id));
    return upatedUserId;
  }),
  deleteUser: publicProcedure.mutation(async (ctx) => {
    const deletedUserId = await ctx.db
      .delete(users)
      .where(eq(users.id, ctx.input.id));
    return deletedUserId;
  }),
} satisfies TRPCRouterRecord;
