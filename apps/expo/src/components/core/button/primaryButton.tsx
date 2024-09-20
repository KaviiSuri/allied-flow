import React from "react";
import { Text } from "react-native";
import type { TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";

function PrimaryButton(props: {
  onPress?: TouchableOpacityProps["onPress"];
  text: string;
  isLoading?: boolean;
  style?: TouchableOpacityProps["style"];
}) {
  return (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: props.isLoading ? "#D0D5DD" : "#2F80F5",
          borderRadius: 8,
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowColor: "#101828",
        },
        props.style,
      ]}
      onPress={props.onPress}
    >
      <Text
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: "white",
          fontFamily: "Avenir",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

export default PrimaryButton;
