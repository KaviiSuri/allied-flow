import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { notifications, insertNotificationSchema } from "@repo/db/schema";
import { protectedProcedure } from "../trpc.js";
import { eq, inArray } from "@repo/db";
import { z } from "zod";

export const notificationsRouter = {
  createNotification: protectedProcedure
    .meta({
      action: "create",
      subject: "User",
    })
    .input(
      insertNotificationSchema.omit({
        readStatus: true,
        id: true,
        createdAt: true,
      }).extend({
        products: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertedNotificationId = await ctx.db
        .insert(notifications)
        .values({
          ...input,
          readStatus: "UNREAD",
          id: nanoid(),
          createdAt: new Date().toISOString(),
        })
        .returning();
      if (!insertedNotificationId[0]) {
        throw new TRPCError({
          message: "Failed to create notification",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return insertedNotificationId[0];
    }),

  readNotifications: protectedProcedure
    .meta({
      action: "read",
      subject: "User",
    })
    .query(async ({ ctx }) => {
      const allNotifications = await ctx.db.query.notifications.findMany({
        where: eq(notifications.userId, ctx.user.id),
      });
      return allNotifications;
    }),

  markNotificationAsRead: protectedProcedure
    .meta({
      action: "update",
      subject: "User",
    })
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedNotification = await ctx.db
        .update(notifications)
        .set({
          readStatus: "READ",
        })
        .where(eq(notifications.id, input.id))
        .returning();
      if (!updatedNotification[0]) {
        throw new TRPCError({
          message: "Failed to update notification",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return updatedNotification[0];
    }),

  markNotificationsAsRead: protectedProcedure
    .meta({
      action: "update",
      subject: "User",
    })
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedNotifications = await ctx.db
        .update(notifications)
        .set({
          readStatus: "READ",
        })
        .where(inArray(notifications.id, input.ids))
        .returning();
      if (!updatedNotifications[0]) {
        throw new TRPCError({
          message: "Failed to update notifications",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return updatedNotifications;
    }),

  // TODO - Add update notification

  // TODO - Add delete notification
} satisfies TRPCRouterRecord;
