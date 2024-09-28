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
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { Alert } from "react-native";

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

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log(token);
      })
      .then(() => {
        Notifications.setNotificationHandler({
          // eslint-disable-next-line @typescript-eslint/require-await
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      })
      .catch(console.error);
  }, [user]);

  api.notifications.onNotificationSent.useSubscription(undefined, {
    onData: (notification) => {
      if (!notification) {
        return;
      }

      if (!notifications.find((n) => n.id === notification.id)) {
        setNotifications((prev) => [notification, ...prev]);
        Toast.show({
          type: "success",

          text1: notification.type,

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

// async function registerForPushNotificationsAsync() {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//     });
//   }
//
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
//   if (finalStatus !== "granted") {
//     Alert.alert("Failed to get push token for push notification!");
//     return;
//   }
//
//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   return token;
// }
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    }).catch(console.error);
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const projectId: string =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}
function handleRegistrationError(errorMessage: string) {
  Alert.alert(errorMessage);
  throw new Error(errorMessage);
}
