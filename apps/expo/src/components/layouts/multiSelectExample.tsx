import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  MultiSelectDropdown,
  DropDownLabel,
  MultiSelect,
  MenuItem,
} from "../shared/dropdown/multiSelect";

interface FruitOption {
  label: string;
  value: string;
}

const fruitOptions: FruitOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
];

export const MultiSelectExample: React.FC = () => {
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);

  const handleFruitChange = (values: (string | number)[]) => {
    setSelectedFruits(values as string[]);
  };

  return (
    <View style={styles.container}>
      <MultiSelectDropdown fullWidth style={styles.dropdown}>
        <DropDownLabel style={styles.label}>Fruits</DropDownLabel>
        <MultiSelect
          value={selectedFruits}
          label="Select fruits"
          onChange={handleFruitChange}
          style={styles.select}
        >
          {fruitOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              style={styles.menuItem}
            >
              {option.label}
            </MenuItem>
          ))}
        </MultiSelect>
      </MultiSelectDropdown>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  dropdown: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  select: {
    backgroundColor: "#ffffff",
    borderColor: "#007AFF",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});
