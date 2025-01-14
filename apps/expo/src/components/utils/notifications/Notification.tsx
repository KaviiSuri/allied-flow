import { RouterOutputs } from "@repo/api";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import { View, Text, Image } from "react-native";

type NotificationType = NonNullable<
  RouterOutputs["notifications"]["getAll"][number]
>;

const notificationIcons: {
  [key in NotificationType["type"]]: {
    icon: ImageSourcePropType;
    background: string;
  };
} = {
  ORDER_PLACED: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../../../app/assets/images/notifications/notification-circle-green.png"),
    background: "#ECFDF5",
  },
  NEW_QUOTE_RECEIVED: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../../../app/assets/images/notifications/notification-coins-yellow.png"),
    background: "#FFF7ED",
  },
  QUOTE_ACCEPTED: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../../../app/assets/images/notifications/notification-file-green.png"),
    background: "#ECFDF5",
  },
  // QUOTE_EXPIRED: {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   icon: require("../../../app/assets/images/notifications/notification-circle-red.png"),
  //   background: "#FEF2F2",
  // },
  // ORDER_ACCEPTED: {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //   icon: require("../../../app/assets/images/notifications/notification-circle-green.png"),
  //   background: "#ECFDF5",
  // },
  ORDER_DISPATCHED: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../../../app/assets/images/notifications/notification-package.png"),
    background: "#F1F5F9",
  },
  ORDER_SHIPPED: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../../../app/assets/images/notifications/notification-truck.png"),
    background: "#ECFDF5",
  },
  INQUIRY_RECEIVED: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../../../app/assets/images/notifications/notification-file-yellow.png"),
    background: "#FFF7ED",
  },
  QUOTE_REJECTED: {
    icon: require("../../../app/assets/images/notifications/notification-circle-red.png"),
    background: "#FEF2F2",
  },
};

function NotificationContent({
  notification,
}: {
  notification: NotificationType;
}) {
  if (notification.type === "ORDER_PLACED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Order with order id{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.orderId}</Text> has
        been successfully placed.
      </Text>
    );
  }
  if (notification.type === "NEW_QUOTE_RECEIVED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        New quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.inquiryId}</Text> has
        been received.
      </Text>
    );
  }
  if (notification.type === "QUOTE_ACCEPTED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Negotiated quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.id}</Text> has been
        accepted.
      </Text>
    );
  }
  if (notification.type === "ORDER_DISPATCHED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        {notification.orderType === "REGULAR" ? "Order" : "Sample"}
        with order id{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.id}</Text> has been
        dispatched.
      </Text>
    );
  }
  if (notification.type === "ORDER_SHIPPED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        {notification.orderType === "REGULAR" ? "Order" : "Sample"} for with
        order id{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.orderId}</Text> has
        been shipped successfully.
      </Text>
    );
  }
  if (notification.type === "INQUIRY_RECEIVED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Inquiry for with inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.inquiryId}</Text> has
        been raised successfully.
      </Text>
    );
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  }
  if (notification.type === "QUOTE_REJECTED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Negotiated quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{notification.id}</Text> has been
        rejected.
      </Text>
    );
  }
}

function Notification({ notification }: { notification: NotificationType }) {
  return (
    <View
      key={notification.id}
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
        borderBottomWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: !notification.read ? "#EFF6FF" : "#FFFFFF",
        position: "relative",
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          top: 8,
          right: 8,
          backgroundColor: "#2F80F5",
          position: "absolute",
          display: !notification.read ? "flex" : "none",
        }}
      />
      <View
        style={{
          padding: 4,
          backgroundColor: notificationIcons[notification.type].background,
          borderRadius: 2,
          height: 24,
          width: 24,
        }}
      >
        <Image source={notificationIcons[notification.type].icon} />
      </View>
      <View style={{ flex: 1, gap: 2, flexDirection: "column" }}>
        <View>
          <NotificationContent notification={notification} />
        </View>
        <View>
          <Text
            style={{
              color: "#64748B",
              fontFamily: "Avenir",
              fontWeight: 500,
              fontSize: 12,
            }}
          >
            2 mins ago
          </Text>
        </View>
      </View>
    </View>
  );
}

export default Notification;
