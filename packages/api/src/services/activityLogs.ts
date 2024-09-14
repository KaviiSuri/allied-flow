import { eq } from "@repo/db";
import type { TransactionType } from "@repo/db/client";
import type { InquiryAuditLog, InquiryAuditLogData } from "@repo/db/schema";
import { inquiryAuditLogs } from "@repo/db/schema";
import { nanoid } from "nanoid";

export type InquiryAuditLogParsed = Omit<InquiryAuditLog, "jsonData"> & {
  jsonData: InquiryAuditLogData;
};

export async function logInquiryAction(
  tx: TransactionType,
  inquiryId: string,
  userId: string,
  jsonData: InquiryAuditLogData,
  message?: string,
): Promise<void> {
  await tx
    .insert(inquiryAuditLogs)
    .values({
      id: nanoid(),
      inquiryId,
      performedBy: userId,
      type: jsonData.action,
      jsonData: JSON.stringify(jsonData), // Store JSON data as a string
      message: message ?? null, // Optional message
      createdAt: new Date().toISOString(), // Timestamp the action
    })
    .execute();
}

// Function to get all logs for an inquiry, parsing the JSON data back to an object
export async function getInquiryLogs(
  tx: TransactionType,
  inquiryId: string,
): Promise<InquiryAuditLogParsed[]> {
  const logs = await tx
    .select()
    .from(inquiryAuditLogs)
    .where(eq(inquiryAuditLogs.inquiryId, inquiryId))
    .all();

  // Parse the jsonData string back into the appropriate structure
  return logs.map((log) => ({
    ...log,
    jsonData: JSON.parse(log.jsonData) as InquiryAuditLogData,
  }));
}

// Helper functions to log specific types of actions

export async function logRaiseAction(
  tx: TransactionType,
  inquiryId: string,
  userId: string,
  newQuoteId: string,
  message?: string,
): Promise<void> {
  await logInquiryAction(
    tx,
    inquiryId,
    userId,
    { action: "RAISE", newQuoteId },
    message,
  );
}

export async function logAcceptAction(
  tx: TransactionType,
  inquiryId: string,
  userId: string,
  acceptedQuoteId: string,
  message?: string,
): Promise<void> {
  await logInquiryAction(
    tx,
    inquiryId,
    userId,
    { action: "ACCEPT", acceptedQuoteId },
    message,
  );
}

export async function logRejectAction(
  tx: TransactionType,
  inquiryId: string,
  userId: string,
  rejectedReason: string,
  message?: string,
): Promise<void> {
  await logInquiryAction(
    tx,
    inquiryId,
    userId,
    { action: "REJECT", rejectedReason },
    message,
  );
}

export async function logNegotiateAction(
  tx: TransactionType,
  inquiryId: string,
  userId: string,
  previousQuoteId: string,
  newQuoteId: string,
  message?: string,
): Promise<void> {
  await logInquiryAction(
    tx,
    inquiryId,
    userId,
    { action: "NEGOTIATE", previousQuoteId, newQuoteId },
    message,
  );
}
