import React from "react";
import { Image, Text } from "react-native";
import { Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useMediaQuery } from "react-responsive";

import DrawerItems from "~/constants/DrawerItems";

const Drawer = createDrawerNavigator();

export default function TabLayout() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 105,
        },
      }}
    >
      {DrawerItems.map((drawer) => (
        <Tabs.Screen
          key={drawer.path}
          name={drawer.path}
          options={{
            tabBarLabelPosition: "below-icon",
            tabBarLabelStyle: {
              fontFamily: "Avenir",
              fontSize: 12,
              fontWeight: "800",
              lineHeight: 18,
            },
            title: drawer.name,
            tabBarIcon: ({ color }) => (
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={drawer.icon}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  tintColor: color,
                  marginBottom: -10,
                }}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
