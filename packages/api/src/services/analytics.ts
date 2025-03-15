import type { TransactionType } from "@repo/db/client";
import { and, eq, gte, lte, inArray, desc, sum, count, sql, asc } from "@repo/db";
import { orders, orderItems, inquiries, quotes, quoteItems, products } from "@repo/db/schema";

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

export interface ProductMetrics {
  id: string;
  name: string;
  make: string;
  cas: string;
  metrics: {
    revenue?: number;
    orders?: number;
  };
}

export type SortBy = "revenue" | "orders";
export type SortOrder = "asc" | "desc";

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

const getProductRankings = async (
  tx: TransactionType,
  dateRange: DateRange,
  options: {
    sortBy: SortBy;
    sortOrder: SortOrder;
    limit?: number;
    filters?: {
      productIds?: string[];
      clientIds?: string[];
    };
  }
): Promise<ProductMetrics[]> => {
  const query = tx
    .select({
      id: products.id,
      name: products.name,
      make: products.make,
      cas: products.cas,
      revenue: sql<number>`CAST(COALESCE(SUM(CASE WHEN ${orders.type} = 'REGULAR' AND ${orders.status} IN ('PLACED', 'DISPATCHED', 'DELIVERED') THEN ${orderItems.price} * ${orderItems.quantity} ELSE 0 END), 0) AS INTEGER)`,
      orders: sql<number>`CAST(COUNT(DISTINCT CASE WHEN ${orders.type} = 'REGULAR' AND ${orders.status} IN ('PLACED', 'DISPATCHED', 'DELIVERED') THEN ${orders.id} END) AS INTEGER)`,
    })
    .from(products)
    .leftJoin(orderItems, eq(products.id, orderItems.productId))
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        gte(orders.createdAt, dateRange.start_date.toISOString()),
        lte(orders.createdAt, dateRange.end_date.toISOString()),
        options.filters?.clientIds ? inArray(orders.buyerId, options.filters.clientIds) : undefined,
        options.filters?.productIds ? inArray(products.id, options.filters.productIds) : undefined
      )
    )
    .groupBy(products.id, products.name, products.make, products.cas)
    .orderBy(
      options.sortBy === "revenue" 
        ? options.sortOrder === "desc" ? desc(sql`revenue`) : asc(sql`revenue`)
        : options.sortOrder === "desc" ? desc(sql`orders`) : asc(sql`orders`)
    )
    .limit(options.limit ?? 10);

  const results = await query;

  return results.map(result => ({
    id: result.id,
    name: result.name,
    make: result.make,
    cas: result.cas,
    metrics: {
      revenue: result.revenue,
      orders: result.orders
    }
  }));
};

export const analyticsService = {
  getSalesMetrics,
  getInquiryMetrics,
  getProductRankings
}; 