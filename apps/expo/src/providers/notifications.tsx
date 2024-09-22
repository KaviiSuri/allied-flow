import type { RouterOutputs } from "@repo/api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "~/utils/api";
import { useUser } from "./auth";
import Toast from "react-native-toast-message";

type Notification = NonNullable<
  RouterOutputs["notifications"]["getAll"][number]
>;

export interface NotificationContext {
  currentNotification: Notification[];
  refresh: () => Promise<void>;
}

const notificationContext = createContext<NotificationContext>({
  currentNotification: [],
  refresh: async () => {
    /* noop */
  },
});

export const useNotifications = () => {
  return useContext(notificationContext);
};

export const NotificationProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();

  const { data } = api.notifications.getAll.useInfiniteQuery(
    {},
    {
      enabled: user !== null,
      getNextPageParam: (lastPage) => {
        if (lastPage.length === 0) return null;
        return lastPage[lastPage.length - 1]?.id;
      },
    },
  );

  useEffect(() => {
    if (data) {
      setNotifications(data.pages.flat());
    }
  }, [data, user]);

  api.notifications.onNotificationSent.useSubscription(undefined, {
    onData: (notification) => {
      if (!notification) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!notifications.find((n) => n.id === notification.id)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        setNotifications((prev) => [notification, ...prev]);
        Toast.show({
          type: "success",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          text1: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          text2: notification.message,
        });
      }
    },
    enabled: user !== null,
  });
  const utils = api.useUtils();
  const refresh = useCallback(
    () => utils.notifications.getAll.invalidate(),
    [utils.notifications.getAll],
  );

  return (
    <notificationContext.Provider
      value={{
        currentNotification: notifications,
        refresh,
      }}
    >
      {children}
    </notificationContext.Provider>
  );
};
