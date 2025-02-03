import type { TransactionType } from "@repo/db/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { orderItems, orders, quoteItems, quotes } from "@repo/db/schema";
import { nanoid } from "nanoid";
import { eq } from "@repo/db";

export const productRequestSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
  unit: z.string(),
  sampleRequested: z.boolean(),
  techDocumentRequested: z.boolean(),
  techDocumentUrl: z.string().optional(),
  techDocumentName: z.string().optional(),
  techDocumentUploadedAt: z.string().optional(),
});

export type ProductRequest = z.infer<typeof productRequestSchema>;

// function to create quote and associated items
const create = async (
  tx: TransactionType,
  inquiryId: string,
  productRequests: ProductRequest[],
  userId: string,
  teamId: string,
  buyerId: string,
  sellerId: string,
) => {
  const createdQuotes = await tx
    .insert(quotes)
    .values({
      id: nanoid(),
      inquiryId,
      status: "REQUESTED",
      createdBy: userId,
      createdByTeam: teamId,
    })
    .returning();

  const quote = createdQuotes[0];
  if (!quote) {
    throw new TRPCError({
      message: "Failed to create quote",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const createdQuoteItems = await tx
    .insert(quoteItems)
    .values(
      productRequests.map((productRequest) => ({
        quoteId: quote.id,
        productId: productRequest.productId,
        price: productRequest.price,
        quantity: productRequest.quantity,
        prevPrice: 0,
        prevQuantity: 0,
        unit: productRequest.unit,
        sampleRequested: productRequest.sampleRequested,
        techDocumentRequested: productRequest.techDocumentRequested,
        techDocumentUrl: productRequest.techDocumentUrl,
        techDocumentName: productRequest.techDocumentName,
        techDocumentUploadedAt: productRequest.techDocumentUploadedAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    )
    .returning();

  if (
    productRequests.some((productRequest) => productRequest.sampleRequested)
  ) {
    const createdSamples = await tx
      .insert(orders)
      .values({
        id: nanoid(),
        inquiryId,
        quoteId: quote.id,
        type: "SAMPLE",
        buyerId,
        sellerId,
        status: "PLACED",
      })
      .returning();

    const sampleOrder = createdSamples[0];

    if (!sampleOrder) {
      throw new TRPCError({
        message: "Failed to create sample order",
        code: "INTERNAL_SERVER_ERROR",
      });
    }

    const _sampleOrderItems = await tx.insert(orderItems).values(
      createdQuoteItems.map((quoteItem) => ({
        orderId: sampleOrder.id,
        productId: quoteItem.productId,
        price: quoteItem.price,
        quantity: quoteItem.quantity,
        unit: quoteItem.unit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    );
  }

  return {
    ...quote,
    items: createdQuoteItems,
  };
};

export interface NegotiateQuoteInput {
  quoteId: string;
  updatedProductRequests: Omit<ProductRequest, "productName">[];
}

const negotiate = async (
  tx: TransactionType,
  input: NegotiateQuoteInput,
  userId: string,
  teamId: string,
) => {
  const existingQuote = await tx.query.quotes.findFirst({
    where: (quotes, { eq }) => eq(quotes.id, input.quoteId),
    with: {
      quoteItems: true,
    },
  });
  if (!existingQuote) {
    throw new TRPCError({
      message: "Quote not found",
      code: "NOT_FOUND",
    });
  }
  const existingQuoteItems = existingQuote.quoteItems;
  const existingQuoteItemMap = new Map(
    existingQuoteItems.map((item) => [item.productId, item]),
  );

  // set existing quote to stale
  await tx
    .update(quotes)
    .set({
      updatedAt: new Date().toISOString(),
      status: "STALE",
    })
    .where(eq(quotes.id, input.quoteId));

  // create new quote
  const createdQuotes = await tx
    .insert(quotes)
    .values({
      id: nanoid(),
      inquiryId: existingQuote.inquiryId,
      status: "NEGOTIATING",
      createdBy: userId,
      createdByTeam: teamId,
    })
    .returning();

  const quote = createdQuotes[0];

  if (!quote) {
    throw new TRPCError({
      message: "Failed to create quote",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const createdQuoteItems = await tx
    .insert(quoteItems)
    .values(
      input.updatedProductRequests.map((updatedProductRequest) => {
        const existingQuoteItem = existingQuoteItemMap.get(
          updatedProductRequest.productId,
        );
        return {
          quoteId: quote.id,
          productId: updatedProductRequest.productId,
          price: updatedProductRequest.price,
          prevPrice: existingQuoteItem?.price ?? 0,
          quantity: updatedProductRequest.quantity,
          prevQuantity: existingQuoteItem?.quantity ?? 0,
          unit: updatedProductRequest.unit,
          sampleRequested: updatedProductRequest.sampleRequested,
          techDocumentRequested: updatedProductRequest.techDocumentRequested,
          techDocumentUrl:
            updatedProductRequest.techDocumentUrl ??
            existingQuoteItem?.techDocumentUrl,
          techDocumentName:
            updatedProductRequest.techDocumentName ??
            existingQuoteItem?.techDocumentName,
          techDocumentUploadedAt:
            updatedProductRequest.techDocumentUploadedAt ??
            existingQuoteItem?.techDocumentUploadedAt,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }),
    )
    .returning();

  return {
    ...quote,
    items: createdQuoteItems,
  };
};

const accept = async (tx: TransactionType, quoteId: string) => {
  await tx
    .update(quotes)
    .set({
      status: "ACCEPTED",
    })
    .where(eq(quotes.id, quoteId));
};

const reject = async (tx: TransactionType, quoteId: string) => {
  await tx
    .update(quotes)
    .set({
      status: "REJECTED",
    })
    .where(eq(quotes.id, quoteId));
};

export const quotesService = {
  create,
  negotiate,
  accept,
  reject,
};
