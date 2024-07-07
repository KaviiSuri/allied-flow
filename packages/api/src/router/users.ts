import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { users } from "@repo/db/schema";
import { protectedProcedure } from "../trpc.js";
import { eq } from "@repo/db";
import { z } from "zod";
import { usersApi } from "@repo/logto-admin";

const createUserInput = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  role: z.enum(["ADMIN", "MANAGEMENT", "LOGISTICS", "SALES"]),
  teamId: z.string(),
});

const updatedUserInput = createUserInput.partial().extend({ id: z.string() });

export const usersRouter = {
  createUser: protectedProcedure
    .input(createUserInput)
    .mutation(async ({ ctx, input }) => {
      const user = await usersApi.apiUsersPost({
        primaryEmail: input.email,
        name: input.name,
        primaryPhone: input.phone,
      });
      if (user.status !== 200) {
        console.error(user);
        throw new TRPCError({
          message: "Failed to create user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const insertedUserId = await ctx.db
        .insert(users)
        .values({
          ...input,
          id: user.data.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      if (!insertedUserId[0]) {
        throw new TRPCError({
          message: "Failed to create user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return insertedUserId[0];
    }),
  readUsers: protectedProcedure
    .meta({
      action: "read",
      subject: "User",
    })
    .query(async ({ ctx }) => {
      const res = await ctx.db.query.users.findMany({
        with: {
          team: true,
        },
      });
      return res;
    }),

  updateUser: protectedProcedure
    .input(updatedUserInput)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, input.id))
        .returning();
      if (!updatedUser[0]) {
        throw new TRPCError({
          message: "Failed to update user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      console.log("updatedUser", updatedUser[0]);

      await usersApi.apiUsersUserIdPatch(input.id, {
        primaryEmail: updatedUser[0].email,
        name: updatedUser[0].name,
        primaryPhone: updatedUser[0].phone,
      });
      return updatedUser[0];
    }),

  deleteUser: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await ctx.db
        .delete(users)
        .where(eq(users.id, input))
        .returning();
      return deletedUser;
    }),
} satisfies TRPCRouterRecord;
