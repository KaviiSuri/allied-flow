import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface MobileTabProps {
  currentFilter: string;
  activeFilter: boolean;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

export const MobileTab: React.FC<MobileTabProps> = ({
  currentFilter,
  activeFilter,
  setFilter,
}) => {
  return (
    <Pressable
      onPress={() => setFilter(currentFilter)}
      style={[
        activeFilter ? styles.activeButton : styles.inactiveButton,
        styles.button,
      ]}
    >
      <Text style={[activeFilter ? styles.activeText : styles.inactiveText]}>
        {currentFilter}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  activeButton: {
    borderColor: "#2f80f5",
    shadowColor: "#101828", // Base color without alpha
    shadowOffset: {
      width: 0,
      height: 1, // Vertical offset
    },
    shadowOpacity: 0.05, // Convert #1018280D (hex with opacity) to decimal
    shadowRadius: 2, // Blur radius
  },
  activeText: {
    color: "#2f80f5",
  },
  inactiveText: {
    color: "#475569",
  },
  inactiveButton: {
    borderColor: "#E2E8F0",
    backgroundColor: "white",
  },
});
