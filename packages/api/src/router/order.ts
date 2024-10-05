import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc.js";
import { inquiries, orderItems, orders } from "@repo/db/schema";
import { nanoid } from "nanoid";
import { and, eq, lt } from "@repo/db";
import { z } from "zod";
import { createNotification, sendNotifications } from "../services/pubsub.js";

export const ordersRouter = {
  createFromInquiry: protectedProcedure
    .meta({
      action: "create",
      subject: "Order",
    })
    .input(
      z.object({
        inquiryId: z.string(),
        quoteId: z.string(),
        type: z.enum(["REGULAR", "SAMPLE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // takes in an inquiry id and quote id and creates an order, with a status of "PLACED"
      // each quoteItem in the quote is added to the order as an orderItem
      // returns the created order
      const order = await ctx.db.transaction(async (trx) => {
        const inquiry = await trx.query.inquiries.findFirst({
          where: (inquiry) => eq(inquiry.id, input.inquiryId),
        });
        if (!inquiry) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Inquiry not found",
          });
        }
        const quote = await trx.query.quotes.findFirst({
          where: (quote) => eq(quote.id, input.quoteId),
          with: {
            quoteItems: true,
          },
        });
        if (!quote) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Quote not found",
          });
        }
        const insertedOrders = await trx
          .insert(orders)
          .values({
            ...input,
            buyerId: inquiry.buyerId,
            sellerId: inquiry.sellerId,
            id: nanoid(),
            status: "PLACED",
          })
          .returning();

        const order = insertedOrders[0];

        if (!order) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create order",
          });
        }

        await trx.insert(orderItems).values(
          quote.quoteItems.map((quoteItem) => ({
            orderId: order.id,
            productId: quoteItem.productId,
            price: quoteItem.price,
            quantity: quoteItem.quantity,
            unit: quoteItem.unit,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        );
        await trx
          .update(inquiries)
          .set({
            status: "ACCEPTED",
          })
          .where(eq(inquiries.id, input.inquiryId));

        const notification = await createNotification(trx, {
          userId: ctx.user.id,
          id: "",
          read: false,
          type: "ORDER_PLACED",
          orderType: input.type,
          orderId: order.id,
          message: `Order ${order.id} has been placed`,
          createdAt: new Date().toISOString(),
        });
        if (notification) {
          await sendNotifications(trx, [notification]);
        }
        return order;
      });
      return order;
    }),

  list: protectedProcedure
    .meta({
      action: "list",
      subject: "Order",
    })
    .input(
      z.object({
        status: z
          .enum(["PLACED", "DISPATCHED", "DELIVERED", "REJECTED"])
          .optional(),
        inquiryId: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        type: z.enum(["REGULAR", "SAMPLE"]),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const teamType = ctx.user.team.type;
      const teamId = ctx.user.team.id;

      const orders = await ctx.db.query.orders.findMany({
        where: (orders) =>
          and(
            teamType === "CLIENT"
              ? eq(orders.buyerId, teamId)
              : eq(orders.sellerId, teamId),
            eq(orders.type, input.type),
            input.inquiryId ? eq(orders.inquiryId, input.inquiryId) : undefined,
            input.status ? eq(orders.status, input.status) : undefined,
            input.cursor ? lt(orders.createdAt, input.cursor) : undefined,
          ),
        orderBy: (orders, { desc }) => desc(orders.createdAt),
        with: {
          orderItems: {
            with: {
              product: true,
            },
          },
        },
        limit: input.limit,
      });

      return orders;
    }),

  read: protectedProcedure
    .meta({
      action: "read",
      subject: "Order",
    })
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.query.orders.findFirst({
        where: (orders) => eq(orders.id, input.id),
        with: {
          orderItems: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),

  update: protectedProcedure
    .meta({
      action: "update",
      subject: "Order",
    })
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PLACED", "DISPATCHED", "DELIVERED", "REJECTED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedOrder = await ctx.db
        .update(orders)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(eq(orders.id, input.id), eq(orders.sellerId, ctx.user.team.id)),
        )
        .returning();

      if (!updatedOrder[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order",
        });
      }

      return updatedOrder[0];
    }),

  delete: protectedProcedure
    .meta({
      action: "delete",
      subject: "Order",
    })
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deletedOrder = await ctx.db
        .delete(orders)
        .where(
          and(eq(orders.id, input.id), eq(orders.sellerId, ctx.user.team.id)),
        )
        .returning();

      if (!deletedOrder[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete order",
        });
      }

      return deletedOrder[0];
    }),
} satisfies TRPCRouterRecord;
