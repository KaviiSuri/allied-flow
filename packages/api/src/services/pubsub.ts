import { z } from "zod";
import Redis from "ioredis";
const redis = new Redis();
import EventEmitter from "events";
import type { TransactionType } from "@repo/db/client";
import { notifications } from "@repo/db/schema";
import { nanoid } from "nanoid";
import { and, eq, lt } from "@repo/db";

export const getNotificationChanelForUser = (userId: string) => {
  return `notification:user:${userId}`;
};

const baseNotificationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  message: z.string(),
  read: z.boolean().optional(),
  userId: z.string(),
});

export const notificationSchema = z.discriminatedUnion("type", [
  baseNotificationSchema.extend({
    type: z.literal("ORDER_PLACED"),
    orderId: z.string(),
    orderType: z.enum(["REGULAR", "SAMPLE"]),
  }),
  baseNotificationSchema.extend({
    type: z.literal("ORDER_DISPATCHED"),
    orderId: z.string(),
    orderType: z.enum(["REGULAR", "SAMPLE"]),
  }),
  baseNotificationSchema.extend({
    type: z.literal("ORDER_SHIPPED"),
    orderId: z.string(),
    orderType: z.enum(["REGULAR", "SAMPLE"]),
  }),
  baseNotificationSchema.extend({
    type: z.literal("INQUIRY_RECEIVED"),
    inquiryId: z.string(),
  }),
  baseNotificationSchema.extend({
    type: z.literal("NEW_QUOTE_RECEIVED"),
    quoteId: z.string(),
    inquiryId: z.string(),
  }),
  baseNotificationSchema.extend({
    type: z.literal("QUOTE_ACCEPTED"),
    quoteId: z.string(),
    inquiryId: z.string(),
  }),
  baseNotificationSchema.extend({
    type: z.literal("QUOTE_REJECTED"),
    quoteId: z.string(),
    inquiryId: z.string(),
  }),
]);

export type Notification = z.infer<typeof notificationSchema>;

// use ioredis to publish notifications to the chanel for a given userId
export const sendNotification = async (
  tx: TransactionType,
  notification: Notification,
) => {
  console.log("Sending notification", {
    ...notification,
    id: nanoid(),
    read: false,
  });
  const n = await tx
    .insert(notifications)
    .values({
      ...notification,
      id: nanoid(),
      read: false,
    })
    .returning();
  if (n.length === 0) {
    return;
  }
  await redis.publish(
    getNotificationChanelForUser(notification.userId),
    JSON.stringify(n[0]),
  );
};

export const subscribeToNotifications = async (userId: string) => {
  const channel = getNotificationChanelForUser(userId);
  const sub = new Redis();
  await sub.subscribe(channel);

  // Create an EventEmitter to handle notifications
  const emitter = new EventEmitter();

  sub.on("message", (_channel, message) => {
    const notification = notificationSchema.parse(JSON.parse(message));
    emitter.emit("notification", notification);
  });

  // Return a function to unsubscribe and quit
  return {
    emitter,
    cleanup: () => Promise.all([sub.unsubscribe(channel), sub.quit()]),
  };
};

export const getAllNotifications = async (
  tx: TransactionType,
  userId: string,
  { limit, cursor }: { limit: number; cursor?: string },
) => {
  const notifications = await tx.query.notifications.findMany({
    where: (notifications) =>
      and(
        eq(notifications.userId, userId),
        cursor ? lt(notifications.createdAt, cursor) : undefined,
      ),
    orderBy: (notifications, { desc }) => desc(notifications.createdAt),
    limit,
  });

  return notifications
    .map((notification) => {
      const { success, data } = notificationSchema.safeParse(notification);
      if (!success) {
        console.error("Failed to parse notification", notification);
        return null;
      }
      return data;
    })
    .filter(Boolean) as Notification[];
};

export const markNotificationAsRead = async (
  tx: TransactionType,
  userId: string,
  notificationId: string,
) => {
  await tx
    .update(notifications)
    .set({ read: true })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.id, notificationId),
      ),
    );
};
