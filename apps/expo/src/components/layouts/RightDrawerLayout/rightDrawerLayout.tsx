import React from "react";
import type { PropsWithChildren } from "react";
import { Animated, Dimensions, Pressable, View } from "react-native";
import type { ViewStyle } from "react-native";

const windowHeight = Dimensions.get("window").height ;
function RightDrawerLayout(props: PropsWithChildren<{ style?: ViewStyle,
  visible: boolean,
  toggleVisible: () => void
  }>) {
   
  return (
    <Animated.View
      style={{
        zIndex: 1,
        position: "absolute",
        right: props.visible ? 0 : "-100%",
        width: "100%",
        height: windowHeight,
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            opacity: 0.1,
          }}
          onPress={props.toggleVisible}
        ></Pressable>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          flexDirection: "column",
          backgroundColor: "#F9F9F9",
        }}
      >
          {props.children}
      </View>
      </Animated.View>
  );
}

export default RightDrawerLayout;
