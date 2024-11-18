import { useEffect, useState } from "react";
import { Badge } from "~/components/core/badge";

type StatusType = "EXPIRED"| "RAISED" | "REJECTED" | "RECEIVED" | "ACCEPTED" | "PLACED" | "NEGOTIATING";

export const BadgeStatus = ({ status }: { status: string }) => {
  const defaultConfig = {
    iconName: "checkcircleo",
    badgeText: "Quote Received",
    bg: "#f0f9f6",
    accentColor: "#047857",
  };

  const [statusConfig, setStatusConfig] = useState(defaultConfig);

  useEffect(() => {
    const statusSettings: Record<StatusType, typeof defaultConfig> = {
      EXPIRED: {
        iconName: "closecircleo",
        badgeText: "Quote expired",
        bg: "#faf1f2",
        accentColor: "#b91c1c",
      },
      REJECTED: {
        iconName: "closecircleo",
        badgeText: "Quote rejected",
        bg: "#faf1f2",
        accentColor: "#b91c1c",
      },
      RECEIVED: {
        iconName: "checkcircleo",
        badgeText: "Quote received",
        bg: "#f0f9f6",
        accentColor: "#047857",
      },
      ACCEPTED: {
        iconName: "checkcircleo",
        badgeText: "Quote accepted",
        bg: "#f0f9f6",
        accentColor: "#047857",
      },
      PLACED: {
        iconName: "checkcircleo",
        badgeText: "Order placed",
        bg: "#f1f5f9",
        accentColor: "#334155",
      },
      NEGOTIATING : {
        iconName: "checkcircleo",
        badgeText: "Negotiation",
        bg: "#efebfe",
        accentColor: "#21134e",
      },
      RAISED:{
        iconName: "checkcircleo",
        badgeText: "Raised",
        bg: "#f0f9f6",
        accentColor: "#047857",
      }
    };

    // Debugging: Log the received status and check if it matches the expected keys
    console.log("Received status prop:", status, typeof status);
    const newConfig = statusSettings[status as StatusType] || defaultConfig;

    // Check if the newConfig was found in statusSettings or fell back to defaultConfig
    setStatusConfig(newConfig);
  }, []);

  return (
          <>
              {statusConfig.badgeText && 
                  <Badge
                    IconName={statusConfig.iconName}
                    badgeText={statusConfig.badgeText}
                    bg={statusConfig.bg}
                    accentColor={statusConfig.accentColor}
                  />
              }
          </>
  );
};
