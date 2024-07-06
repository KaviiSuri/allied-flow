import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { nanoid } from "nanoid";
import { teams, insertTeamSchema } from "@repo/db/schema";
import { protectedProcedure } from "../trpc.js";
import { eq } from "@repo/db";
import { z } from "zod";

const updatedTeamInput = insertTeamSchema
  .partial()
  .extend({ id: z.string() })
  .omit({
    type: true,
    createdAt: true,
    updatedAt: true,
  });

export const usersRouter = {
  createTeam: protectedProcedure
    .input(
      insertTeamSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Create a POC user
      const insertedUserId = await ctx.db
        .insert(teams)
        .values({
          ...input,
          id: nanoid(),
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
  readTeams: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.teams.findMany({
      with: {
        poc: true,
      },
    });
    return res;
  }),

  updateTeam: protectedProcedure
    .input(updatedTeamInput)
    .mutation(async ({ ctx, input }) => {
      const updatedTeam = await ctx.db
        .update(teams)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(teams.id, input.id))
        .returning();
      if (!updatedTeam[0]) {
        throw new TRPCError({
          message: "Failed to update user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      console.log("updatedUser", updatedTeam[0]);

      return updatedTeam[0];
    }),

  deleteTeam: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deletedTeam = await ctx.db
        .delete(teams)
        .where(eq(teams.id, input))
        .returning();
      return deletedTeam;
    }),
} satisfies TRPCRouterRecord;
