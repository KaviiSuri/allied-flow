import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc.js";
import { z } from "zod";
import { analyticsService } from "../services/analytics.js";

export const analyticsRouter = {
  getSummary: protectedProcedure
    .meta({
      action: "read",
      subject: "Analytics",
    })
    .input(
      z.object({
        dateRange: z.object({
          start_date: z.coerce.date(),
          end_date: z.coerce.date(),
        }),
        productIds: z.array(z.string()).optional(),
        clientIds: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { dateRange, productIds, clientIds } = input;
      const filters = { productIds, clientIds };

      return ctx.db.transaction(async (tx) => {
        const [salesMetrics, inquiryMetrics] = await Promise.all([
          analyticsService.getSalesMetrics(tx, dateRange, filters),
          analyticsService.getInquiryMetrics(tx, dateRange, filters),
        ]);

        return {
          sales: salesMetrics,
          inquiries: inquiryMetrics,
        };
      });
    }),
} satisfies TRPCRouterRecord; 