import React from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import type { TouchableOpacityProps } from "react-native-gesture-handler";

function SecondaryButton(props: {
  onPress?: TouchableOpacityProps["onPress"];
  text: string;
  isLoading?: boolean;
  style?: TouchableOpacityProps["style"];
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[{
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: props.isLoading ? "#D0D5DD" : "#FFFFFF",
        borderRadius: 8,
        borderColor: "#D0D5DD",
        borderWidth: 1,
        shadowOffset: { height: 1, width: 0 },
        shadowOpacity: 0.05,
        shadowColor: "#101828",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }]}
      onPress={props.onPress}
      disabled={props.disabled ?? props.isLoading}
    >
      <Text
        style={{
          fontWeight: 600,
          fontSize: 14,
          fontFamily: "Avenir",
          color: "#344054  ",
        }}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}

export default SecondaryButton;
