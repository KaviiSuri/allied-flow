import { TRPCError, TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { inquiries } from "@repo/db/schema";
import { nanoid } from "nanoid";
import { productRequestSchema, quotesService } from "../services/quote";
import { eq } from "@repo/db";

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
            status: "NEGOTIATING",
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
        items: z.array(productRequestSchema),
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
} satisfies TRPCRouterRecord;