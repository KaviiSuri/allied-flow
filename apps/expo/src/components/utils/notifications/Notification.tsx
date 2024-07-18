import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";

export interface NotificationProps {
  readStatus: "UNREAD" | "READ";
  productNames: string[];
  id: string;
  timePlaced: Date;
  notificationType:
    | "ORDER_PLACED"
    | "NEW_QUOTE_RECIEVED"
    | "QUOTE_ACCEPTED"
    | "QUOTE_EXPIRED"
    | "ORDER_ACCEPTED"
    | "ORDER_DISPATCHED"
    | "ORDER_SHIPPED"
    | "SAMPLE_DISPATCHED"
    | "SAMPLE_SHIPPED"
    | "SAMPLE_ORDER_PLACED"
    | "INQUIRY_RAISED";
}

const notificationIcons: {
  [key in NotificationProps["notificationType"]]: {
    icon: ImageSourcePropType;
    background: string;
  };
} = {
  ORDER_PLACED: {
    icon: require("../../../app/assets/images/notifications/notification-circle-green.png"),
    background: "#ECFDF5",
  },
  NEW_QUOTE_RECIEVED: {
    icon: require("../../../app/assets/images/notifications/notification-coins-yellow.png"),
    background: "#FFF7ED",
  },
  QUOTE_ACCEPTED: {
    icon: require("../../../app/assets/images/notifications/notification-file-green.png"),
    background: "#ECFDF5",
  },
  QUOTE_EXPIRED: {
    icon: require("../../../app/assets/images/notifications/notification-circle-red.png"),
    background: "#FEF2F2",
  },
  ORDER_ACCEPTED: {
    icon: require("../../../app/assets/images/notifications/notification-circle-green.png"),
    background: "#ECFDF5",
  },
  ORDER_DISPATCHED: {
    icon: require("../../../app/assets/images/notifications/notification-package.png"),
    background: "#F1F5F9",
  },
  ORDER_SHIPPED: {
    icon: require("../../../app/assets/images/notifications/notification-truck.png"),
    background: "#ECFDF5",
  },
  SAMPLE_DISPATCHED: {
    icon: require("../../../app/assets/images/notifications/notification-package.png"),
    background: "#F1F5F9",
  },
  SAMPLE_SHIPPED: {
    icon: require("../../../app/assets/images/notifications/notification-truck.png"),
    background: "#ECFDF5",
  },
  INQUIRY_RAISED: {
    icon: require("../../../app/assets/images/notifications/notification-file-yellow.png"),
    background: "#FFF7ED",
  },
  SAMPLE_ORDER_PLACED: {
    icon: require("../../../app/assets/images/notifications/notification-circle-green.png"),
    background: "#ECFDF5",
  },
};

function NotificationContent(props: NotificationProps) {
  if (props.notificationType === "ORDER_PLACED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Order for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been successfully placed.
      </Text>
    );
  } else if (props.notificationType === "NEW_QUOTE_RECIEVED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        New quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has been received.
      </Text>
    );
  } else if (props.notificationType === "QUOTE_ACCEPTED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Negotiated quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has been accepted.
      </Text>
    );
  } else if (props.notificationType === "QUOTE_EXPIRED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has expired.
      </Text>
    );
  } else if (props.notificationType === "ORDER_ACCEPTED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Quote on inquiry number{" "}
        <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has expired.
      </Text>
    );
  } else if (props.notificationType === "ORDER_DISPATCHED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Order for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been dispatched.
      </Text>
    );
  } else if (props.notificationType === "ORDER_SHIPPED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Order for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been shipped successfully.
      </Text>
    );
  } else if (props.notificationType === "SAMPLE_DISPATCHED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Sample for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been dispatched successfully.
      </Text>
    );
  } else if (props.notificationType === "SAMPLE_SHIPPED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Sample for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been shipped successfully.
      </Text>
    );
  } else if (props.notificationType === "SAMPLE_DISPATCHED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Sample for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been dispatched successfully.
      </Text>
    );
  } else if (props.notificationType === "INQUIRY_RAISED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Inquiry for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with inquiry number <Text style={{ fontWeight: 700 }}>#{props.id}</Text>{" "}
        has been raised successfully.
      </Text>
    );
  } else if (props.notificationType === "SAMPLE_ORDER_PLACED") {
    return (
      <Text style={{ fontFamily: "Avenir", fontSize: 14, fontWeight: 500 }}>
        Sample order for{" "}
        <Text style={{ fontWeight: 700 }}>
          {props.productNames.length === 2
            ? props.productNames[0] + ` & 1 other`
            : props.productNames.length > 2
              ? props.productNames[0] +
                ` & ${props.productNames.length - 1} others`
              : props.productNames[0]}
        </Text>{" "}
        with order id <Text style={{ fontWeight: 700 }}>#{props.id}</Text> has
        been placed successfully.
      </Text>
    );
  }
}

function Notification(props: NotificationProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
        borderBottomWidth: 1,
        borderColor: "#E2E8F0",
        backgroundColor: props.readStatus === "UNREAD" ? "#EFF6FF" : "#FFFFFF",
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
          display: props.readStatus === "UNREAD" ? "flex" : "none",
        }}
      />
      <View
        style={{
          padding: 4,
          backgroundColor: notificationIcons[props.notificationType].background,
          borderRadius: 2,
          height: 24,
          width: 24,
        }}
      >
        <Image source={notificationIcons[props.notificationType].icon} />
      </View>
      <View style={{ flex: 1, gap: 2, flexDirection: "column" }}>
        <View>
          <NotificationContent {...props} />
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
