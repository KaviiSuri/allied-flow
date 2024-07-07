
import { View, Text, StyleSheet, Image } from "react-native"
import { useState } from "react"
import { SingleSelectDropdown } from "../dropdown"
import { MenuItem, SingleSelect } from "../dropdown/singleSelect"

interface FormDropDownProps {
  label: string,
  options: {
    label: string,
    value: string
  }[],
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormDropDown: React.FC<FormDropDownProps> = ({ label, options, leftIcon, rightIcon }) => {
  const [selectedValue, setSelectedValue] = useState("ADMIN")

  return (
    <View >
      <SingleSelectDropdown >
        <Text
          style={{
            fontSize: 14,
            fontWeight: 400,
            paddingBottom: 8,
            fontFamily: "Avenir",
            color: "#475467",
          }}
        >
          {label}
        </Text>
        <SingleSelect
          value={selectedValue}
          defaultValue={selectedValue}
          onChange={(e) => console.log(e)}
          changeLabel={true}
          rightIcon={rightIcon}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </SingleSelect>
      </SingleSelectDropdown>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 8, // Adjust spacing as needed
    width: 20,
    height: 20
  },
})
