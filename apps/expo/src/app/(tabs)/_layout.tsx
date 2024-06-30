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
  const isWeb = useMediaQuery({
    minDeviceWidth: 1200,
  });

  return isWeb ? (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="index"
        screenOptions={{
          drawerType: "permanent",
          headerShown: false,
          drawerStyle: {
            padding: 16,
            maxWidth: 230,
          },
          drawerItemStyle: {
            margin: 0,
            marginBottom: 8,
          },
          drawerContentContainerStyle: {
            margin: 0
          },
        }}
      >
        {DrawerItems.map((drawer) => (
          <Drawer.Screen
            key={drawer.name}
            name={drawer.name}
            component={drawer.component}
            options={{
              drawerIcon: ({ focused }) => (
                <Image
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  source={drawer.icon}
                  style={{
                    resizeMode: "contain",
                    width: 20,
                    height: 20,
                    tintColor: focused ? "#2F80F5" : "#475569",
                  }}
                />
              ),
              title: drawer.name,
              drawerLabel: ({ focused }) => (
                <Text
                  style={{
                    fontFamily: "Avenir",
                    fontSize: 16,
                    lineHeight: 24,
                    fontWeight: focused ? "800" : "500",
                    color: focused ? "#2F80F5" : "#475569",
                  }}
                >
                  {drawer.name}
                </Text>
              ),
            }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  ) : (
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
  );
}
