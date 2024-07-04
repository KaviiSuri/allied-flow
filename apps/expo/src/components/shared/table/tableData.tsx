import React from "react";
import type { PropsWithChildren } from "react";
import { Text } from "react-native";
import type { TextStyle } from "react-native";
import { StyleSheet } from "react-native";

function TableData(props: PropsWithChildren<{ style?: TextStyle }>) {
  const defaultStyles: TextStyle = {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
  };
  return (
    <Text style={StyleSheet.compose(defaultStyles, props.style)}>
      {props.children}
    </Text>
  );
}

export default TableData;
