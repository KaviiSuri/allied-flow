import { useEffect } from "react";
import Notification from "./Notification";
import { useNotifications } from "~/providers/notifications";

function NotificationList() {
  const { currentNotification, refresh } = useNotifications();
  useEffect(() => {
    refresh().catch(console.error);
  }, [refresh]);
  return (
    <>
      {currentNotification.map((element) => (
        <Notification notification={element} />
      ))}
    </>
  );
}

export default NotificationList;
