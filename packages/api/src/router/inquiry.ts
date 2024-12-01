import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc.js";
import { z } from "zod";
import type { Inquiry, Quote } from "@repo/db/schema";
import { inquiries } from "@repo/db/schema";
import { nanoid } from "nanoid";
import { productRequestSchema, quotesService } from "../services/quote.js";
import { and, eq, or, lt, like, inArray, notInArray } from "@repo/db";
import { db } from "@repo/db/client";
import type { Notification } from "../services/pubsub.js";
import { createNotification, sendNotifications } from "../services/pubsub.js";

const getStakeholdersForRaiseInquiry = async (
  trx: typeof db,
  inquiry: Inquiry,
) => {
  const users = await trx.query.users.findMany({
    where: (users) =>
      and(
        eq(users.teamId, inquiry.sellerId),
        inArray(users.role, ["SALES", "MANAGEMENT"]),
      ),
  });
  return users;
};

const sendInquiryRaisedNotifications = async (
  trx: typeof db,
  inquiry: Inquiry,
) => {
  const stakeholders = await getStakeholdersForRaiseInquiry(trx, inquiry);
  const notifications = stakeholders.map(
    (stakeholder) =>
      ({
        id: "",
        userId: stakeholder.id,
        message: `Inquiry ${inquiry.id} has been raised`,
        type: "INQUIRY_RECEIVED",
        inquiryId: inquiry.id,
        createdAt: new Date().toISOString(),
        read: false,
      }) satisfies Notification,
  );

  const persistedNotifications = await Promise.all(
    notifications.map((n) => createNotification(trx, n)),
  );

  await sendNotifications(
    trx,
    persistedNotifications.filter((n) => !!n) as Notification[],
  );
};

const stakehodlersForInquiryNegotation = async (
  trx: typeof db,
  inquiry: Inquiry,
) => {
  const users = await trx.query.users.findMany({
    where: (users) =>
      or(
        and(
          eq(users.teamId, inquiry.sellerId),
          notInArray(users.role, ["LOGISTICS"]),
        ),
        eq(users.teamId, inquiry.buyerId),
      ),
  });
  return users;
};

const sendInquiryNegotiationNotifications = async (
  trx: typeof db,
  inquiry: Inquiry,
  quoteId: string,
  type: "NEW_QUOTE_RECEIVED" | "QUOTE_ACCEPTED" | "QUOTE_REJECTED",
) => {
  const stakeholders = await stakehodlersForInquiryNegotation(trx, inquiry);
  let message = `New quote received for inquiry ${inquiry.id}`;
  switch (type) {
    case "NEW_QUOTE_RECEIVED":
      message = `New quote received for inquiry ${inquiry.id}`;
      break;

    case "QUOTE_ACCEPTED":
      message = `Quote ${quoteId} has been accepted for inquiry ${inquiry.id}`;
      break;
    case "QUOTE_REJECTED":
      message = `Quote ${quoteId} has been rejected for inquiry ${inquiry.id}`;
      break;
  }
  const notifications = stakeholders.map(
    (stakeholder) =>
      ({
        id: "",
        userId: stakeholder.id,
        message,
        type,
        inquiryId: inquiry.id,
        quoteId,
        createdAt: new Date().toISOString(),
        read: false,
      }) satisfies Notification,
  );

  const persistedNotifications = await Promise.all(
    notifications.map((n) => createNotification(trx, n)),
  );

  await sendNotifications(
    trx,
    persistedNotifications.filter((n) => !!n) as Notification[],
  );
};

// Define the schema for raising an inquiry
const raiseInquiryInput = z.object({
  buyerId: z.string(),
  sellerId: z.string(),
  tnc: z.string(),
  remarks: z.string(),
  productRequests: z.array(productRequestSchema),
});

export const inquiryRouter = {
  raise: protectedProcedure
    .meta({
      action: "raise",
      subject: "Inquiry",
    })
    .input(raiseInquiryInput)
    .mutation(async ({ ctx, input }) => {
      const inquiry = await ctx.db.transaction(async (trx) => {
        // create inquiry
        const createdInquiries = await trx
          .insert(inquiries)
          .values({
            id: nanoid(),
            tnc: input.tnc,
            remarks: input.remarks,
            buyerId: input.buyerId,
            sellerId: input.sellerId,
            status: "RAISED",
            productNames: input.productRequests
              .map((productRequest) => productRequest.productName)
              .join(", "),
            searchQuery: input.productRequests
              .map((productRequest) =>
                productRequest.productName.toLowerCase().trim(),
              )
              .join(" "),
          })
          .returning();
        const inquiry = createdInquiries[0];
        if (!inquiry) {
          trx.rollback();
          throw new TRPCError({
            message: "Failed to create inquiry",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        await quotesService.create(
          trx,
          inquiry.id,
          input.productRequests,
          ctx.user.id,
          ctx.user.teamId,
            input.buyerId,
            input.sellerId,
        );

        return inquiry;
      });

      sendInquiryRaisedNotifications(ctx.db, inquiry).catch(console.error);
      return {
        id: inquiry.id,
      };
    }),
  negotiate: protectedProcedure
    .meta({
      action: "negotiate",
      subject: "Inquiry",
    })
    .input(
      z.object({
        inquiryId: z.string(),
        items: z.array(productRequestSchema.omit({ productName: true })),
        tnc: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { quote, inquiry } = await ctx.db.transaction(async (trx) => {
        const inquiry = await trx.query.inquiries.findFirst({
          where: (inquiries) => eq(inquiries.id, input.inquiryId),
        });
        if (!inquiry) {
          throw new TRPCError({
            message: "Inquiry not found",
            code: "NOT_FOUND",
          });
        }
        const existingQuote = await trx.query.quotes.findFirst({
          where: (quotes, { eq }) => eq(quotes.inquiryId, input.inquiryId),
          orderBy: (quotes, { desc }) => desc(quotes.createdAt),
        });
        if (!existingQuote) {
          throw new TRPCError({
            message: "Quote not found",
            code: "NOT_FOUND",
          });
        }

        const quote = await quotesService.negotiate(
          trx,
          {
            quoteId: existingQuote.id,
            updatedProductRequests: input.items,
          },
          ctx.user.id,
          ctx.user.teamId,
        );

        await trx
          .update(inquiries)
          .set({
            tnc: input.tnc,
            status: "NEGOTIATING",
          })
          .where(eq(inquiries.id, input.inquiryId));
        return {
          inquiry,
          quote,
        };
      });

      sendInquiryNegotiationNotifications(
        ctx.db,
        inquiry,
        quote.id,
        "NEW_QUOTE_RECEIVED",
      ).catch(console.error);

      return quote;
    }),
  accept: protectedProcedure
    .meta({
      action: "accept",
      subject: "Inquiry",
    })
    .input(
      z.object({
        inquiryId: z.string(),
        quoteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        const inquiry = await trx.query.inquiries.findFirst({
          where: (inquiries) => eq(inquiries.id, input.inquiryId),
        });
        if (!inquiry) {
          throw new TRPCError({
            message: "Inquiry not found",
            code: "NOT_FOUND",
          });
        }
        await trx
          .update(inquiries)
          .set({
            status: "ACCEPTED",
          })
          .where(eq(inquiries.id, input.inquiryId));

        await quotesService.accept(trx, input.quoteId);
        sendInquiryNegotiationNotifications(
          ctx.db,
          inquiry,
          input.quoteId,
          "QUOTE_ACCEPTED",
        ).catch(console.error);
      });
    }),
  reject: protectedProcedure
    .meta({
      action: "reject",
      subject: "Inquiry",
    })
    .input(
      z.object({
        inquiryId: z.string(),
        quoteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        const inquiry = await trx.query.inquiries.findFirst({
          where: (inquiries) => eq(inquiries.id, input.inquiryId),
        });
        if (!inquiry) {
          throw new TRPCError({
            message: "Inquiry not found",
            code: "NOT_FOUND",
          });
        }
        await trx
          .update(inquiries)
          .set({
            status: "REJECTED",
          })
          .where(eq(inquiries.id, input.inquiryId));

        await quotesService.reject(trx, input.quoteId);
        sendInquiryNegotiationNotifications(
          ctx.db,
          inquiry,
          input.quoteId,
          "QUOTE_REJECTED",
        ).catch(console.error);
      });
    }),
  getDetails: protectedProcedure
    .meta({
      action: "getDetails",
      subject: "Inquiry",
    })
    .input(z.object({ inquiryId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.transaction(async (trx) => {
        const inquiry = await trx.query.inquiries.findFirst({
          where: (inquiries) => eq(inquiries.id, input.inquiryId),
        });

        if (!inquiry) {
          throw new TRPCError({
            message: "Inquiry not found",
            code: "NOT_FOUND",
          });
        }

        const latestQuote = await trx.query.quotes.findFirst({
          where: (quotes) => eq(quotes.inquiryId, input.inquiryId),
          orderBy: (quotes, { desc }) => desc(quotes.createdAt),
          with: {
            quoteItems: true,
          },
        });

        const buyerTeam = await trx.query.teams.findFirst({
          where: (teams) => eq(teams.id, inquiry.buyerId),
        });

        const sellerTeam = await trx.query.teams.findFirst({
          where: (teams) => eq(teams.id, inquiry.sellerId),
        });

        return {
          inquiry,
          latestQuote,
          buyerTeam,
          sellerTeam,
        };
      });

      return result;
    }),
  list: protectedProcedure
    .meta({
      action: "list",
      subject: "Inquiry",
    })
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        status: z
          .enum(["NEGOTIATING", "ACCEPTED", "REJECTED", "RAISED"])
          .optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status } = input;

      const accessibleInquiries = await ctx.db.query.inquiries.findMany({
        where: (inquiries) =>
          and(
            or(
              eq(inquiries.buyerId, ctx.user.team.id),
              eq(inquiries.sellerId, ctx.user.team.id),
            ),
            cursor ? lt(inquiries.createdAt, cursor) : undefined,
            status ? eq(inquiries.status, status) : undefined,
            input.search
              ? like(
                  inquiries.searchQuery,
                  `%${input.search.toLowerCase().trim()}%`,
                )
              : undefined,
          ),
        orderBy: (inquiries, { desc }) => desc(inquiries.createdAt),
        limit: limit + 1,
        with: {
          buyer: true,
          seller: true,
        },
      });

      let nextCursor: string | undefined = undefined;
      if (accessibleInquiries.length > limit) {
        const nextItem = accessibleInquiries.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: accessibleInquiries,
        nextCursor,
      };
    }),
} satisfies TRPCRouterRecord;
