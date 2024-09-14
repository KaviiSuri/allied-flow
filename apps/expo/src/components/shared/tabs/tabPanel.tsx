import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useTabContext } from "./tabContext";

interface TabPanelProps {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, children, style }) => {
  const { value: activeValue } = useTabContext();

  if (value !== activeValue) return null;

  return <View style={[styles.tabPanel, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  tabPanel: {
    padding: 20,
  },
});
