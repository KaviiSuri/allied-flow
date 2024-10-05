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
import { Logout } from "~/components/Logout";
import { logtoService } from "~/config/logto";
import AuthProvider, { AuthConsumer, useAbility } from "~/providers/auth";
import DashboardIcon from "~/app/assets/images/dashboard-icon.png";
import NotificationButton from "~/components/utils/notifications/NotificationButton";
import { NotificationProvider } from "~/providers/notifications";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDrawerContent(props: any) {
  const { isAuthenticated, signOut } = useLogto();

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />;
  }

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Logout />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label="Logout"
        onPress={() => signOut(logtoService.redirectUri)}
        icon={({ focused }) => (
          <Image
            source={DashboardIcon}
            style={{
              width: 20,
              height: 20,
            }}
            resizeMode={"contain"}
            tintColor={focused ? "#2F80F5" : "#475569"}
          />
        )}
      />
    </View>
  );
}

export default function WebLayout() {
  const { isAuthenticated } = useLogto();
  const ability = useAbility();

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <AuthConsumer>
          {(_, ability) => (
            <NotificationProvider>
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
                  headerRight: () => {
                    return (
                      <View style={{ gap: 16, marginRight: 24 }}>
                        <NotificationButton />
                      </View>
                    );
                  },
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
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      drawerItemStyle: {
                        // @ts-expect-error types broken here
                        ...(drawer.action &&
                          // @ts-expect-error types broken here
                          drawer.subject &&
                          // @ts-expect-error types broken here
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                          !ability.can(drawer.action, drawer.subject) && {
                            display: "none",
                          }),
                        ...(drawer.hideDesktop && {
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
                          // @ts-expect-error types broken here
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                          source={drawer.icon}
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          resizeMode={"contain"}
                          tintColor={focused ? "#2F80F5" : "#475569"}
                        />
                      ),
                    }}
                  />
                ))}
              </Drawer>
            </NotificationProvider>
          )}
        </AuthConsumer>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
