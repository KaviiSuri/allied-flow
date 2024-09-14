import { useEffect } from "react";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { LogtoProvider } from "@logto/rn";

import { logtoService } from "~/config/logto";
import { TRPCProvider } from "~/utils/api";

import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { toastConfig } from "~/components/shared/toast";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Avenir: require("./assets/fonts/Avenir-Regular.ttf"),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    AvenirHeavy: require("./assets/fonts/Avenir-Heavy.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  if (!loaded) {
    return null;
  }
  return (
    <LogtoProvider config={logtoService.config}>
      <TRPCProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} />
        <StatusBar />
      </TRPCProvider>
    </LogtoProvider>
  );
}
