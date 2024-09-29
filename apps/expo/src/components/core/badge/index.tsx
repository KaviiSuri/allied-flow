import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export const Badge = ({
  IconName,
  badgeText,
  bg,
  accentColor,
}: {
  IconName: string;
  badgeText: string;
  bg: string;
  accentColor: string;
}) => {
  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: bg,
          borderColor: accentColor,
        },
      ]}
    >
      <Icon
        name={IconName}
        style={[
          {
            color: accentColor,
            fontWeight: 500,
          },
        ]}
      />
      <Text style={[styles.badgeText, { color: accentColor }]}>
        {badgeText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
    columnGap: 4,
  },
  badgeText: {
    fontWeight: 500,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Avenir",
  },
});
