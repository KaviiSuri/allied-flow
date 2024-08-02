import { NotificationProps } from "~/components/utils/notifications/Notification";
import NotificationList from "~/components/utils/notifications/NotificationList";

import { api } from "~/utils/api";
function Notifications() {
  const { data } = api.notifications.readNotifications.useQuery();
  if (data) {
    return (
      <>
        <NotificationList data={data} />
      </>
    );
  } else {
    return <></>;
  }
}

export default Notifications;
