import { useEffect } from "react";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LogtoProvider } from "@logto/rn";

import { logtoService } from "~/config/logto";
import { TRPCProvider } from "~/utils/api";

import "react-native-reanimated";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Avenir: require("./assets/fonts/Avenir-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <LogtoProvider config={logtoService.config}>
      <TRPCProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar />
      </TRPCProvider>
    </LogtoProvider>
  );
}
