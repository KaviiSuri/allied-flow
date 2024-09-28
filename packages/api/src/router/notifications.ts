import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { on } from "events";
import { protectedProcedure } from "../trpc.js";
import type { Notification } from "../services/pubsub.js";
import { devices } from "@repo/db/schema";
import {
  getAllNotifications,
  markNotificationAsRead,
  subscribeToNotifications,
} from "../services/pubsub.js";

export const notificationsRouter = {
  onNotificationSent: protectedProcedure.subscription(async function* ({
    ctx,
  }) {
    const { emitter, cleanup } = await subscribeToNotifications(ctx.user.id);
    for await (const [data] of on(emitter, `notification`)) {
      yield data as Notification;
    }
    await cleanup();
  }),
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const { limit, cursor } = input;
      return ctx.db.transaction(async (trx) => {
        return getAllNotifications(trx, ctx.user.id, {
          limit,
          cursor,
        });
      });
    }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.transaction(async (trx) => {
        return markNotificationAsRead(trx, ctx.user.id, input.notificationId);
      });
    }),

  registerDevice: protectedProcedure
    .input(
      z.object({
        expoPushToken: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(devices)
        .values({
          userId: ctx.user.id,
          expoPushToken: input.expoPushToken,
        })
        .execute();
    }),
} satisfies TRPCRouterRecord;
