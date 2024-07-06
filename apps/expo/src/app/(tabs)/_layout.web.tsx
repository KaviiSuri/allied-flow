import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerItems from "~/constants/DrawerItems";
import { Image, Text, View } from "react-native";
import { DrawerItem } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useLogto } from "@logto/rn";
import { Redirect } from "expo-router";
import { logtoService } from "~/config/logto";
import AuthProvider, { AuthConsumer, useAbility } from "~/providers/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDrawerContent(props: any) {
  const { signOut } = useLogto();
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label="Logout"
        onPress={() => signOut(logtoService.redirectUri)}
        icon={({ focused }) => (
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require("../../app/assets/images/dashboard-icon.png")}
            style={{
              resizeMode: "contain",
              width: 20,
              height: 20,
              tintColor: focused ? "#2F80F5" : "#475569",
            }}
          />
        )}
      />
    </View>
  );
}

export default function WebLayout() {
  const { isAuthenticated } = useLogto();
  const ability = useAbility()

  useEffect(() => {
    console.log('======', ability.can("read", "User"))
  }, [ability])

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <AuthConsumer>
          {(_, ability) => (
            <Drawer
              initialRouteName="index"
              screenOptions={{
                drawerType: "permanent",
                headerStyle: {
                  backgroundColor: "#F9F9F9",
                },
                headerTitleStyle: {
                  fontFamily: "Avenir",
                  fontWeight: 800,
                  fontSize: 18,
                },
                headerLeft: () => null,
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
                      fontFamily: "Avenir",
                      fontWeight: 800,
                      fontSize: 18,
                    },
                    drawerItemStyle: {
                      ...((drawer.action && drawer.subject && !ability.can(drawer.action, drawer.subject)) && {
                        display: "none",
                      }),
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
          )}
        </AuthConsumer>
      </GestureHandlerRootView>
    </AuthProvider >
  );
}
