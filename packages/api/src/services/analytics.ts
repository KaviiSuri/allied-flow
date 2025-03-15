import type { TransactionType } from "@repo/db/client";
import { and, eq, gte, lte, inArray, desc, sum, count, sql } from "@repo/db";
import { orders, orderItems, inquiries, quotes, quoteItems } from "@repo/db/schema";

export interface DateRange {
  start_date: Date;
  end_date: Date;
}

export interface SalesMetrics {
  revenue: {
    value: number;
    currency: string;
  };
  samples: {
    count: number;
  };
}

export interface InquiryMetrics {
  received: {
    total: number;
    winPercentage: number;
  };
  value: {
    total: number;
    currency: string;
    winPercentage: number;
  };
}

const getSalesMetrics = async (
  tx: TransactionType,
  dateRange: DateRange,
  filters?: {
    productIds?: string[];
    clientIds?: string[];
  }
): Promise<SalesMetrics> => {
  const [revenueResult, samplesResult] = await Promise.all([
    // Get total revenue from regular orders
    tx
      .select({
        total: sql<number>`CAST(COALESCE(SUM(${orderItems.price} * ${orderItems.quantity}), 0) AS INTEGER)`,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(
        and(
          eq(orders.type, "REGULAR"),
          gte(orders.createdAt, dateRange.start_date.toISOString()),
          lte(orders.createdAt, dateRange.end_date.toISOString()),
          filters?.clientIds ? inArray(orders.buyerId, filters.clientIds) : undefined,
          filters?.productIds ? 
            inArray(orderItems.productId, filters.productIds) : undefined,
          inArray(orders.status, ["PLACED", "DISPATCHED", "DELIVERED"])
        )
      ),

    // Get count of sample orders
    tx
      .select({
        count: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.type, "SAMPLE"),
          gte(orders.createdAt, dateRange.start_date.toISOString()),
          lte(orders.createdAt, dateRange.end_date.toISOString()),
          filters?.clientIds ? inArray(orders.buyerId, filters.clientIds) : undefined,
          inArray(orders.status, ["PLACED", "DISPATCHED", "DELIVERED"])
        )
      )
  ]);

  return {
    revenue: {
      value: revenueResult[0]?.total ?? 0,
      currency: "Rs."
    },
    samples: {
      count: samplesResult[0]?.count ?? 0
    }
  };
};

const getInquiryMetrics = async (
  tx: TransactionType,
  dateRange: DateRange,
  filters?: {
    productIds?: string[];
    clientIds?: string[];
  }
): Promise<InquiryMetrics> => {
  // Get total inquiries and accepted inquiries
  const inquiryStats = await tx
    .select({
      total: sql<number>`CAST(COUNT(*) AS INTEGER)`,
      accepted: sql<number>`CAST(SUM(CASE WHEN ${inquiries.status} = 'ACCEPTED' THEN 1 ELSE 0 END) AS INTEGER)`,
    })
    .from(inquiries)
    .where(
      and(
        gte(inquiries.createdAt, dateRange.start_date.toISOString()),
        lte(inquiries.createdAt, dateRange.end_date.toISOString()),
        filters?.clientIds ? inArray(inquiries.buyerId, filters.clientIds) : undefined
      )
    );

  // Get latest quotes for each inquiry using a correlated subquery
  const valueStats = await tx
    .select({
      total: sql<number>`CAST(COALESCE(SUM(${quoteItems.price} * ${quoteItems.quantity}), 0) AS INTEGER)`,
      accepted: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${inquiries.status} = 'ACCEPTED' THEN ${quoteItems.price} * ${quoteItems.quantity} ELSE 0 END), 0) AS INTEGER)`,
    })
    .from(inquiries)
    .innerJoin(quotes, eq(inquiries.id, quotes.inquiryId))
    .innerJoin(quoteItems, eq(quotes.id, quoteItems.quoteId))
    .where(
      and(
        gte(inquiries.createdAt, dateRange.start_date.toISOString()),
        lte(inquiries.createdAt, dateRange.end_date.toISOString()),
        filters?.clientIds ? inArray(inquiries.buyerId, filters.clientIds) : undefined,
        filters?.productIds ? inArray(quoteItems.productId, filters.productIds) : undefined,
        eq(quotes.id, tx
          .select({ id: quotes.id })
          .from(quotes)
          .where(eq(quotes.inquiryId, inquiries.id))
          .orderBy(desc(quotes.createdAt))
          .limit(1)
        )
      )
    );

  const total = inquiryStats[0]?.total ?? 0;
  const accepted = inquiryStats[0]?.accepted ?? 0;
  const totalValue = valueStats[0]?.total ?? 0;
  const acceptedValue = valueStats[0]?.accepted ?? 0;

  return {
    received: {
      total,
      winPercentage: total > 0 ? (accepted / total) * 100 : 0
    },
    value: {
      total: totalValue,
      currency: "Rs.",
      winPercentage: totalValue > 0 ? (acceptedValue / totalValue) * 100 : 0
    }
  };
};

export const analyticsService = {
  getSalesMetrics,
  getInquiryMetrics
}; 