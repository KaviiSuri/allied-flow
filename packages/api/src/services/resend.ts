import { Resend } from 'resend';
import { env } from "@repo/server-config";
import { Notification } from './pubsub';

const resend = new Resend(env.RESEND_API_KEY);

function getNotificationTitle(notification: Notification) {
  switch(notification.type) {
    case "ORDER_PLACED":
      return notification.orderType === "REGULAR" ? "Order placed" : "Sample placed";
    case "ORDER_DISPATCHED":
      return notification.orderType === "REGULAR" ? "Order dispatched" : "Sample dispatched";
    case "ORDER_SHIPPED":
      return notification.orderType === "REGULAR" ? "Order shipped" : "Sample shipped";
    case "INQUIRY_RECEIVED":
      return "Inquiry received";
    case "NEW_QUOTE_RECEIVED":
      return "New quote received";
    case "QUOTE_ACCEPTED":
      return "Quote accepted";
    case "QUOTE_REJECTED":
      return "Quote rejected";
  }
}

function getNotificationHtml(notification: Notification) {
  switch(notification.type) {
    case "ORDER_PLACED":
      return `
        <h1>Order Placed</h1>
        <p>Your ${notification.orderType === "REGULAR" ? "order" : "sample"} has been placed.</p>
        <p>Order ID: ${notification.orderId}</p>
      `;
    case "ORDER_DISPATCHED":
      return `
        <h1>Order Dispatched</h1>
        <p>Your ${notification.orderType === "REGULAR" ? "order" : "sample"} has been dispatched.</p>
        <p>Order ID: ${notification.orderId}</p>
      `;
    case "ORDER_SHIPPED":
      return `
        <h1>Order Shipped</h1>
        <p>Your ${notification.orderType === "REGULAR" ? "order" : "sample"} has been shipped.</p>
        <p>Order ID: ${notification.orderId}</p>
      `;
    case "INQUIRY_RECEIVED":
      return `
        <h1>Inquiry Received</h1>
        <p>You have received an inquiry.</p>
        <p>Inquiry ID: ${notification.inquiryId}</p>
      `;
    case "NEW_QUOTE_RECEIVED":
      return `
        <h1>New Quote Received</h1>
        <p>You have received a new quote.</p>
        <p>Quote ID: ${notification.quoteId}</p>
        <p>For Inquiry: ${notification.inquiryId}</p>
      `;
    case "QUOTE_ACCEPTED":
      return `
        <h1>Quote Accepted</h1>
        <p>Your quote has been accepted.</p>
        <p>Quote ID: ${notification.quoteId}</p>
        <p>For Inquiry: ${notification.inquiryId}</p>
      `;
    case "QUOTE_REJECTED":
      return `
        <h1>Quote Rejected</h1>
        <p>Your quote has been rejected.</p>
        <p>Quote ID: ${notification.quoteId}</p>
        <p>For Inquiry: ${notification.inquiryId}</p>
      `;
  }
}

export async function sendEmailNotifications(
  to: string[],
  notification: Notification
) {
  const subject = getNotificationTitle(notification);
  const html = getNotificationHtml(notification);
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    return console.error({ error });
  }
}
