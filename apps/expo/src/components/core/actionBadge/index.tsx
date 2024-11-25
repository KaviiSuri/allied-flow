import { Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { ActionBadgeMobile } from "./actionBadge";

export const ActionBadge = ({
  actionText,
  iconName,
  handleAction,
  materialIcon = false,
}: {
  actionText: string;
  iconName: string;
  handleAction: () => void;
  materialIcon?: boolean;
}) => {
  return (
    <Pressable
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 4,
      }}
      onPress={() => {
        handleAction();
      }}
    >
      <Text
        style={{
          color: "#2F80F5",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "Avenir",
        }}
      >
        {actionText}
      </Text>
      {materialIcon ? (
        <MaterialIcon
          style={{ paddingTop: 4, color: "#2f80f5" }}
          name={iconName}
        />
      ) : (
        <Icon style={{ paddingTop: 4, color: "#2f80f5" }} name={iconName} />
      )}
    </Pressable>
  );
};

export { ActionBadgeMobile };
