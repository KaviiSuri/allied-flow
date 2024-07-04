import React, { useState } from "react";
import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native";
import type { ViewStyle } from "react-native";

function RightDrawerLayout(props: PropsWithChildren<{ style?: ViewStyle }>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [drawerVisible, setDrawerVisible] = useState(false);
  return (
    <SafeAreaView style={{ backgroundColor: "#F9F9F9", position: "relative" }}>
      {props.children}
    </SafeAreaView>
  );
}

export default RightDrawerLayout;
