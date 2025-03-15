import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { analyticsService } from "../services/analytics";
import type { TRPCRouterRecord } from "@trpc/server";

const dateRangeSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
});

const filtersSchema = z.object({
  productIds: z.array(z.string()).optional(),
  clientIds: z.array(z.string()).optional(),
});

export const analyticsRouter = {
  getSummary: protectedProcedure
    .input(
      z.object({
        dateRange: dateRangeSchema,
        filters: filtersSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        const [salesMetrics, inquiryMetrics] = await Promise.all([
          analyticsService.getSalesMetrics(tx, input.dateRange, input.filters),
          analyticsService.getInquiryMetrics(tx, input.dateRange, input.filters),
        ]);

        return {
          sales: salesMetrics,
          inquiries: inquiryMetrics,
        };
      });
    }),

  getProductRankings: protectedProcedure
    .input(
      z.object({
        dateRange: dateRangeSchema,
        sortBy: z.enum(["revenue", "orders"]),
        sortOrder: z.enum(["asc", "desc"]),
        limit: z.number().min(1).max(100).optional(),
        filters: filtersSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction(async (tx) => {
        return analyticsService.getProductRankings(
          tx,
          input.dateRange,
          {
            sortBy: input.sortBy,
            sortOrder: input.sortOrder,
            limit: input.limit,
            filters: input.filters,
          }
        );
      });
    }),
} satisfies TRPCRouterRecord; 