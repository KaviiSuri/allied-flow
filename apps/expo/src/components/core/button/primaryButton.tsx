import React from "react";
import { Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";

function PrimaryButton(props: {
  onPress?: PressableProps["onPress"];
  text: string;
}) {
  return (
    <Pressable
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#2F80F5",
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
    </Pressable>
  );
}

export default PrimaryButton;
