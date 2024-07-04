import type { TRPCRouterRecord } from "@trpc/server";
import { users } from "@repo/db/schema";
import { publicProcedure } from "../trpc.js";
import { eq } from "@repo/db";
import { z } from "zod";

const createUserInput = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  role: z.enum(["ADMIN", "MANAGEMENT", "LOGISTICS", "SALES"]),
  teamId: z.string(),
})

const upatedUserInput = createUserInput.partial().extend({id: z.string()});

export const usersRouter = {
  createUser: publicProcedure
    .input(
      createUserInput
    )
    .mutation(async ({ ctx, input }) => {
      const insertedUserId = await ctx.db.insert(users).values(
        {
          ...input, 
          id: '123', // gen id
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
        },
      );
      return insertedUserId;
    }),
  readUsers: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.users.findMany();
    return res;
  }),

  updateUser: publicProcedure.input(upatedUserInput).mutation(async ({ctx, input}) => {
    const upatedUserId = await ctx.db
      .update(users)
      .set({
        ...input,
        updatedAt: new Date().toUTCString()
      })
      .where(eq(users.id, input.id));
    return upatedUserId;
  }),

  deleteUser: publicProcedure.input(z.string()).mutation(async ({ctx, input}) => {
    const deletedUserId = await ctx.db
      .delete(users)
      .where(eq(users.id, input));
    return deletedUserId;
  }),
} satisfies TRPCRouterRecord;
