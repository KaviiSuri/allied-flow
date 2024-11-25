import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { insertUserSchema, users } from "@repo/db/schema";
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
    .meta({
      action: "create",
      subject: "User",
    })
    .input(
      insertUserSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
          teamId: true,
        })
        .extend({
          teamId: z.string().optional(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await usersApi.createUser({
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
      console.log("user", user.data);

      const insertedUserId = await ctx.db
        .insert(users)
        .values({
          ...input,
          id: user.data.id,
          teamId: input.teamId ?? ctx.user.teamId,
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
    .input(
      z.object({
        scope: z.enum(["ALL", "TEAM"]).optional().default("TEAM"),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.team.type !== "SELLER" && input.scope === "TEAM") {
        throw new TRPCError({
          message: "You are not authorized to view all members",
          code: "FORBIDDEN",
        });
      }
      const res = await ctx.db.query.users.findMany({
        with: {
          team: true,
        },
        where: (users, { eq }) => {
          if (input.scope === "TEAM") {
            return eq(users.teamId, ctx.user.teamId);
          }
        },
      });
      return res;
    }),

  updateUser: protectedProcedure
    .meta({
      action: "update",
      subject: "User",
    })
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

      await usersApi.updateUser(input.id, {
        primaryEmail: updatedUser[0].email,
        name: updatedUser[0].name,
        primaryPhone: updatedUser[0].phone,
      });
      return updatedUser[0];
    }),

  deleteUser: protectedProcedure
    .meta({
      action: "delete",
      subject: "User",
    })
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const logtoResponse = await usersApi.deleteUser(input);

        if (logtoResponse.status !== 200) {
          console.error("Failed to delete user from Logto:", logtoResponse);
          throw new TRPCError({
            message: "Failed to delete user from Logto",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        console.log(
          "User successfully deleted from Logto:",
          logtoResponse.data,
        );

        const deletedUser = await ctx.db
          .delete(users)
          .where(eq(users.id, input))
          .returning();

        if (!deletedUser[0]) {
          throw new TRPCError({
            message: "Failed to delete user from the database",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        console.log(
          "User successfully deleted from the database:",
          deletedUser[0],
        );

        return deletedUser[0];
      } catch (error) {
        console.error("Error during user deletion process:", error);
        throw new TRPCError({
          message: "Failed to delete user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
} satisfies TRPCRouterRecord;
