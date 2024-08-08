import React from "react";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import type { ViewStyle } from "react-native";

function Table(props: PropsWithChildren<{ style?: ViewStyle }>) {
  const defaultStyles: ViewStyle = {
    borderColor: "#EAECF0",
    borderRadius: 12,
    borderWidth: 1,
  };
  return (
    <View style={StyleSheet.compose(defaultStyles, props.style)}>
      {props.children}
    </View>
  );
}

export default Table;
