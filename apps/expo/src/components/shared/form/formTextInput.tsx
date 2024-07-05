import React from "react";
import { View, Text, TextInput } from "react-native";
import type { TextInputProps, ViewStyle } from "react-native";

interface FormTextInputProps extends TextInputProps {
  label: string;
  placeholder: string;
  numberOfLines?: number;
  style?: ViewStyle;
}

function FormTextInput({ style, numberOfLines, label, ...props }: FormTextInputProps) {
  return (
    <View style={style}>
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
      <TextInput
        style={{
          fontFamily: "Avenir",
          fontSize: 14,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          borderRadius: 8,
          paddingHorizontal: 14,
          paddingVertical: 12,
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowColor: "#101828",
        }}
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={numberOfLines ? numberOfLines : 1}
        {...props}
      />
    </View>
  );
}

export default FormTextInput;
