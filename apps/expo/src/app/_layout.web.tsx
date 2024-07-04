import { useEffect, useState } from "react";
import { Image, SafeAreaView, StatusBar, View } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LogtoProvider } from "@logto/rn";

import { logtoService } from "~/config/logto";
import { TRPCProvider } from "~/utils/api";
import type {StatusBarStyle} from 'react-native';

import "react-native-reanimated";
import Dropdown from "./components/Dropdown";
import { useMediaQuery } from "react-responsive";
import { Colors } from "~/constants/Color";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Avenir: require("./assets/fonts/Avenir-Regular.ttf"),
    AvenirHeavy: require("./assets/fonts/Avenir-Heavy.ttf")
  });

  const isWeb = useMediaQuery({
    minDeviceWidth: 1200,
  });

  const data = [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { label: 'Invite', icon: require('./assets/images/share-icon.png') },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { label: 'Logout', icon: require('./assets/images/logout-icon.png') },
  ];

  const [selected, setSelected] = useState(undefined);
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    'dark-content'
  );
  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log(error)
  }, [error])

  if (!loaded) {
    return null;
  }

  
  return (
    <LogtoProvider config={logtoService.config}>
      <TRPCProvider>
      
        <Stack
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TRPCProvider>
    </LogtoProvider>
  );
}
