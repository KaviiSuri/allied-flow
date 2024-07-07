import React from "react";
import { Text } from "react-native";
import type { TouchableOpacityProps } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";

function PrimaryButton(props: {
  onPress?: TouchableOpacityProps["onPress"];
  text: string;
  isLoading?: boolean;
}) {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: props.isLoading ? "#D0D5DD" : "#2F80F5",
        borderRadius: 8,
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.05,
        shadowColor: "#101828",
      }}
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
