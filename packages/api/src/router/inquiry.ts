import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc.js";
import { z } from "zod";
import { inquiries } from "@repo/db/schema";
import { nanoid } from "nanoid";
import { productRequestSchema, quotesService } from "../services/quote.js";
import { and, eq, or, lt, like } from "@repo/db";

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
              .map((productRequest) => productRequest.productName.toLowerCase().trim())
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
        );

        return inquiry;
      });

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
      const quote = await ctx.db.transaction(async (trx) => {
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
        return quote;
      });

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
        status: z.enum(["NEGOTIATING", "ACCEPTED", "REJECTED"]).optional(),
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
            input.search ? like(
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
