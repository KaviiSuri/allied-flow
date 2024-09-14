import React from "react";
import type { PropsWithChildren } from "react";
import { Text } from "react-native";
import type { TextStyle } from "react-native";

function TableData(props: PropsWithChildren<{ numberOfLines?: number, ellipsizeMode?: string, style?: TextStyle }>) {
  const defaultStyles: TextStyle = {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
  };

  return <Text numberOfLines={props.numberOfLines} ellipsizeMode={props.ellipsizeMode} style={[defaultStyles, props.style]}>{props.children}</Text>;
}

export default TableData;
