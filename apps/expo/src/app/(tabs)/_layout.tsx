import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Redirect, Tabs } from "expo-router";
import ClientIcon from "../assets/images/client-icon.png";

import DrawerItems from "~/constants/DrawerItems";
import { useLogto } from "@logto/rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Color";
import AuthProvider, { AuthConsumer } from "~/providers/auth";

export default function TabLayout() {
  const { isAuthenticated, signOut } = useLogto();

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />;
  }
  return (
    <AuthProvider>
      <AuthConsumer>
        {(_, ability) => (
          <Tabs
            screenOptions={{
              headerShown: true,
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
                  tabBarItemStyle: {
                    // @ts-expect-error types broken here
                    ...(drawer.action &&
                      drawer.subject &&
                      !ability.can(drawer.action, drawer.subject) && {
                      display: "none",
                    }),
                  },
                  title: drawer.name,
                  tabBarIcon: ({ color }) => (
                    <Image

                      source={drawer.icon}
                      style={{
                        width: 20,
                        height: 20,
                        marginBottom: -10,
                      }}
                      resizeMode={"contain"}
                      tintColor={color}
                    />
                  ),
                  header: () => (
                    <>
                      {drawer.name === "Dashboard" ?
                        <SafeAreaView>
                          <View style={styles.container}>
                            <Image
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                              source={ClientIcon}
                              style={styles.navImage}
                              tintColor={"#000"}
                              resizeMode={"contain"}
                            />
                            <Text>ABC Chemicals</Text>
                            <TouchableOpacity
                              onPress={() => signOut()}
                              style={styles.logout}
                            >
                              <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                          </View>
                        </SafeAreaView>
                        :
                        <SafeAreaView edges={['top', 'left', 'right']} style={styles.titleHeaderContainer}>
                          <Text style={styles.titleHeader}>{drawer.name}</Text>
                        </SafeAreaView>
                      }
                    </>
                  ),
                }}
              />
            ))}
          </Tabs>
        )}
      </AuthConsumer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  titleHeaderContainer: {
    backgroundColor: "white",
    paddingTop: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 4
  },
  titleHeader: {
    fontFamily: "AvenirHeavy",
    fontWeight: 800,
    fontSize: 18,
    color: "#1e293b",
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 16,
    columnGap: 8,
  },
  navImage: {
    height: 16,
    width: 16,
  },
  logout: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Colors.error,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: "45%",
  },
  logoutText: {
    fontFamily: "AvenirHeavy",
    fontSize: 16,
    fontWeight: 800,
    color: Colors.error,
  },
});
