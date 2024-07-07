import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { insertProductSchema, products } from "@repo/db/schema";
import { z } from "zod";
import { eq } from "@repo/db";

export const productsRotuer = {
  create: protectedProcedure
    .meta({
      action: "create",
      subject: "Product",
    })
    .input(
      insertProductSchema.omit({
        createdAt: true,
        updatedAt: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const insertedProductId = await ctx.db
        .insert(products)
        .values({
          ...input,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      if (!insertedProductId[0]) {
        throw new TRPCError({
          message: "Failed to create product",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return insertedProductId[0];
    }),
  read: protectedProcedure
    .meta({
      action: "read",
      subject: "Product",
    })
    .query(async ({ ctx }) => {
      const products = await ctx.db.query.products.findMany();

      return products;
    }),
  update: protectedProcedure
    .meta({
      action: "update",
      subject: "Product",
    })
    .input(
      insertProductSchema
        .partial()
        .omit({
          createdAt: true,
          updatedAt: true,
        })
        .extend({
          id: z.string(),
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedProduct = await ctx.db
        .update(products)
        .set({
          ...input,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(products.id, input.id))
        .returning();

      if (!updatedProduct[0]) {
        throw new TRPCError({
          message: "Failed to update product",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return updatedProduct[0];
    }),
  delete: protectedProcedure
    .meta({
      action: "delete",
      subject: "Product",
    })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.db
        .delete(products)
        .where(eq(products.id, input.id))
        .returning();

      if (!deletedProduct[0]) {
        throw new TRPCError({
          message: "Failed to delete product",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return deletedProduct[0];
    }),
} satisfies TRPCRouterRecord;
