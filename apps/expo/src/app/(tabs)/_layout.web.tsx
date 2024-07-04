import React from "react";
import { Drawer } from 'expo-router/drawer'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerItems from "~/constants/DrawerItems";
import { Image, Text } from "react-native";
import { useLogto } from "@logto/rn";
import { Redirect } from "expo-router";
import CustomDrawerContent from "../components/CustomDrawerContent";

export default function WebLayout() {
  const { isAuthenticated } = useLogto()

  if (!isAuthenticated) {
    return <Redirect href={'/login'} />
  }

  return (
    <GestureHandlerRootView>
      <Drawer
        initialRouteName="index"
        screenOptions={{
          drawerType: "permanent",
          headerStyle: {
            backgroundColor: '#F9F9F9',
          },
          drawerStyle: {
            width: 250,
          },
          headerTitleStyle: {
            fontFamily: 'Avenir',
            fontWeight: 800,
            fontSize: 18,
          },
          headerLeft: () => null
        }}
        drawerContent={CustomDrawerContent}
      >
        {DrawerItems.map((drawer) => (
          <Drawer.Screen
            key={drawer.path}
            name={drawer.path}
            options={{
              title: drawer.name,
              headerTitle: drawer.name,
              headerTitleStyle: {
                fontFamily: 'Avenir',
                fontWeight: 800,
                fontSize: 18,
              },
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
            }}
          />
        ))}

      </Drawer>
    </GestureHandlerRootView>
  );
}
