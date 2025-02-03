import { env } from "@repo/server-config";
import Wapi from "@wapijs/wapi.js";
import type { Notification } from "./pubsub";

export const whatsappClient = new Wapi.Client({
  apiAccessToken: env.WHATSAPP_API_KEY,
  businessAccountId: env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
  port: env.PORT, // the port you want your webhook to be exposed on
  webhookEndpoint: "/webhook", // the endpoint where the webhook will be exposed
  webhookSecret: env.WHATSAPP_WEBHOOK_SECRET, // the secret key for the webhook, this would later be added to the whatsapp business account to verify the integrity of the webhook.
});

const getNotificationTitle = (n: Notification) => {
  if (n.type === "ORDER_PLACED") {
    const prefix = n.orderType === "REGULAR" ? "Order" : "Sample";
    return `${prefix} placed`;
  }
  if (n.type === "ORDER_DISPATCHED") {
    const prefix = n.orderType === "REGULAR" ? "Order" : "Sample";
    return `${prefix} dispatched`;
  }
  if (n.type === "ORDER_SHIPPED") {
    const prefix = n.orderType === "REGULAR" ? "Order" : "Sample";
    return `${prefix} shipped`;
  }
  if (n.type === "INQUIRY_RECEIVED") {
    return "Inquiry Received";
  }
  if (n.type === "NEW_QUOTE_RECEIVED") {
    return "New Quote Received";
  }
  if (n.type === "QUOTE_ACCEPTED") {
    return "Quote Accepted";
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (n.type === "QUOTE_REJECTED") {
    return "Quote Rejected";
  }
  return "New Notification From Spot!";
};
function getNotificationMessage(notification: Notification) {
  const title = getNotificationTitle(notification);
  const body = notification.message;
  return `#${title}\n${body}`;
}

export async function sendWhatsappNotifications(
  phoneNumbers: string[],
  notification: Notification,
) {
  const textMessage = new Wapi.TextMessage({
    text: getNotificationMessage(notification),
  });

  await Promise.all(
    phoneNumbers.map((num) =>
      whatsappClient.message.send({
        phoneNumber: num,
        message: textMessage,
      }),
    ),
  );
}
