import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { nanoid } from "nanoid";
import { teams, insertTeamSchema, insertUserSchema } from "@repo/db/schema";
import { protectedProcedure } from "../trpc.js";
import { and, eq, inArray } from "@repo/db";
import { z } from "zod";
import { createCaller } from "../index.js";

const updatedTeamInput = insertTeamSchema
  .partial()
  .extend({ id: z.string() })
  .omit({
    type: true,
    createdAt: true,
    updatedAt: true,
  });

export const teamsRouter = {
  createTeam: protectedProcedure
    .meta({
      action: "create",
      subject: "Team",
    })
    .input(
      insertTeamSchema
        .omit({
          id: true,
          createdAt: true,
          updatedAt: true,
        })
        .extend({
          adminUser: insertUserSchema.omit({
            id: true,
            createdAt: true,
            updatedAt: true,
            teamId: true,
            role: true,
          }),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertedTeamId = await ctx.db
        .insert(teams)
        .values({
          ...input,
          id: nanoid(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();
      if (!insertedTeamId[0]) {
        throw new TRPCError({
          message: "Failed to create team",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      try {
        const user = await createCaller(ctx).users.createUser({
          ...input.adminUser,
          role: "ADMIN",
          teamId: insertedTeamId[0].id,
        });
        console.log("user", user);
      } catch (error) {
        await ctx.db
          .delete(teams)
          .where(eq(teams.id, insertedTeamId[0].id))
          .run();
        throw error;
      }
      return insertedTeamId[0];
    }),
  readTeams: protectedProcedure
    .meta({
      action: "read",
      subject: "Team",
    })
    .input(
      z.object({
        type: z.enum(["SELLER", "CLIENT"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.query.teams.findMany({
        with: {
          poc: true,
        },
        where: (teams, { eq }) => {
          if (input.type) {
            return eq(teams.type, input.type);
          }
        },
      });
      // get admin user for each team
      const teamIds = res.map((team) => team.id);
      const users = await ctx.db.query.users.findMany({
        where: (users) =>
          and(inArray(users.teamId, teamIds), eq(users.role, "ADMIN")),
      });
      const teamToAdmin = users.reduce(
        (acc, user) => {
          acc[user.teamId] = user;
          return acc;
        },
        {} as Record<string, (typeof users)[0]>,
      );
      const teamsWithAdmins = res.map((team) => {
        return {
          ...team,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          adminUser: teamToAdmin[team.id]!,
        };
      });
      return teamsWithAdmins;
    }),

  updateTeam: protectedProcedure
    .meta({
      action: "update",
      subject: "Team",
    })
    .input(
      updatedTeamInput.extend({
        adminUser: insertUserSchema
          .omit({
            id: true,
            createdAt: true,
            updatedAt: true,
            teamId: true,
            role: true,
          })
          .partial()
          .optional(),
      }),
    )
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

      if (input.adminUser) {
        console.log("input.adminUser", input.adminUser);
        const adminUser = await ctx.db.query.users.findFirst({
          where: (users) =>
            and(eq(users.teamId, input.id), eq(users.role, "ADMIN")),
        });
        if (!adminUser) {
          throw new TRPCError({
            message: "Admin user not found",
            code: "INTERNAL_SERVER_ERROR",
          });
        }
        const user = await createCaller(ctx).users.updateUser({
          id: adminUser.id,
          ...input.adminUser,
        });
      }

      return updatedTeam[0];
    }),

  deleteTeam: protectedProcedure
    .meta({
      action: "delete",
      subject: "Team",
    })
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deletedTeam = await ctx.db
        .delete(teams)
        .where(eq(teams.id, input))
        .returning();
      return deletedTeam;
    }),
} satisfies TRPCRouterRecord;
