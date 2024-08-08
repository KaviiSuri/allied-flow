import React from "react";
import type { PropsWithChildren } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import type { TextStyle } from "react-native";
import { Image } from "react-native";

function TableData(
  props: PropsWithChildren<{
    style?: TextStyle;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
  }>,
) {
  const defaultStyles: TextStyle = {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
    width: "16.66%",
    fontFamily: "Avenir",
  };
  if (props.onPress) {
    return (
      <Pressable
        onPress={props.onPress}
        style={StyleSheet.compose(
          StyleSheet.compose(defaultStyles, props.style),
          { flexDirection: "row", justifyContent: "space-between" },
        )}
      >
        <Text
          style={{
            fontFamily: "Avenir",
            color: props.style?.color,
            fontSize: props.style?.fontSize,
          }}
        >
          {props.children}
        </Text>
        <Image source={require("../../../app/assets/images/sort-icon.png")} />
      </Pressable>
    );
  }
  return <Text style={[defaultStyles, props.style]}>{props.children}</Text>;
}
export default TableData;
