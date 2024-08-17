import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  SingleSelectDropdown,
  DropDownLabel,
  SingleSelect,
  MenuItem,
} from "../shared/dropdown/singleSelect";

interface AgeOption {
  label: string;
  value: number;
}

const ageOptions: AgeOption[] = [
  { label: "Ten", value: 10 },
  { label: "Twenty", value: 20 },
  { label: "Thirty", value: 30 },
  { label: "Forty", value: 40 },
  { label: "Fifty", value: 50 },
];

export const SingleSelectExample: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<number | string>("");

  const handleAgeChange = (value: number | string) => {
    setSelectedAge(value);
  };

  return (
    <View style={styles.container}>
      <SingleSelectDropdown fullWidth style={styles.dropdown}>
        <DropDownLabel id="1" style={styles.label}>
          Age
        </DropDownLabel>
        <SingleSelect
          value={selectedAge}
          defaultValue="Select age"
          onChange={handleAgeChange}
          style={styles.select}
        >
          {ageOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              style={styles.menuItem}
            >
              {option.label}
            </MenuItem>
          ))}
        </SingleSelect>
      </SingleSelectDropdown>
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
