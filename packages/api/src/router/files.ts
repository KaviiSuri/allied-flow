import { z } from "zod";
import { protectedProcedure } from "../trpc";
import { generateUploadUrls, StorageFolderName } from "../services/s3";
import { TRPCRouterRecord } from "@trpc/server";

export const filesRouter = {
  getUploadUrls: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        folderName: z.enum([
          "technical-documents",
          "product-images",
          "user-documents",
          "company-documents",
        ] as const),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { fileName, folderName } = input;
      const { id: userId, teamId } = ctx.user;

      return generateUploadUrls(
        fileName,
        folderName as StorageFolderName,
        teamId,
        userId
      );
    }),
} satisfies TRPCRouterRecord; 