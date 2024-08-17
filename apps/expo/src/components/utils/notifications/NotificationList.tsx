import Notification from "./Notification";
import type { NotificationProps } from "./Notification";

function NotificationList(props: { data: NotificationProps[] }) {
  return props.data.map((element) => <Notification {...element} />);
}

export default NotificationList;
