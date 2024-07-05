import React from "react";
import type { PropsWithChildren } from "react";
import { View } from "react-native";
import type { ViewStyle } from "react-native";

function TableRow(
  props: PropsWithChildren<{ style?: ViewStyle; id?: string }>,
) {
  const defaultStyles: ViewStyle = {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#EAECF0",
  };
  return (
    <View style={{ ...defaultStyles, ...props.style }} key={props.id}>
      {props.children}
    </View>
  );
}

export default TableRow;
