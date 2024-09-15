import type { ReactNode } from "react";
import React from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTabContext } from "./tabContext";

interface TabListProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabList: React.FC<TabListProps> = ({ children, style }) => {
  return <View style={[styles.tabContainer, style]}>{children}</View>;
};

interface TabProps {
  label: string;
  value: string;
}

export const Tab: React.FC<TabProps> = ({ label, value }) => {
  const { value: activeValue, setValue } = useTabContext();

  const isActive = activeValue === value;

  return (
    <TouchableOpacity
      style={isActive ? styles.activeTab : styles.tab}
      onPress={() => setValue(value)}
    >
      <Text style={isActive ? styles.activeText : styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 12,
    marginRight: 4,
  },
  activeTab: {
    borderColor: "#2F80F5",
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginRight: 4,
  },
  text: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: "Avenir",
    fontWeight: "400",
  },
  activeText: {
    color: "#475569",
    fontSize: 16,
    fontFamily: "Avenir",
    fontWeight: "400",
  },
});
