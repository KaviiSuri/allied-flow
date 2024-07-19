import type { NotificationProps } from "~/components/utils/notifications/Notification";
import NotificationList from "~/components/utils/notifications/NotificationList";

import { api } from "~/utils/api";

export const dummyNotificationData: NotificationProps[] = [
  {
    id: "3",
    notificationType: "ORDER_PLACED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "5",
    notificationType: "NEW_QUOTE_RECIEVED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "1",
    notificationType: "QUOTE_ACCEPTED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "2",
    notificationType: "QUOTE_EXPIRED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },

  {
    id: "4",
    notificationType: "ORDER_ACCEPTED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "READ",
    timePlaced: new Date(),
  },

  {
    id: "6",
    notificationType: "ORDER_DISPATCHED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "7",
    notificationType: "ORDER_SHIPPED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "READ",
    timePlaced: new Date(),
  },
  {
    id: "8",
    notificationType: "SAMPLE_DISPATCHED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "9",
    notificationType: "SAMPLE_SHIPPED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "10",
    notificationType: "INQUIRY_RAISED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
  {
    id: "11",
    notificationType: "SAMPLE_ORDER_PLACED",
    productNames: ["ketone", "aldehyde"],
    readStatus: "UNREAD",
    timePlaced: new Date(),
  },
];

function Notifications() {
  const { data } = api.notifications.readNotifications.useQuery();
  console.log(data);
  return (
    <>
      <NotificationList data={dummyNotificationData} />
    </>
  );
}

export default Notifications;
