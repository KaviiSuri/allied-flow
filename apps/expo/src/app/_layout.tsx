import "@bacons/text-decoder/install";
import { LogtoProvider } from '@logto/rn';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from "expo-router";
import 'react-native-reanimated';
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../hooks/useColorScheme";

import { TRPCProvider } from "~/utils/api";

import { logtoService } from "~/config/logto";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(console.warn); 
// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const  colorScheme  = useColorScheme();
  return (
    <LogtoProvider
      config={logtoService.config}
    >
      <TRPCProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#f472b6",
            },
            contentStyle: {
              backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
            },
          }}
        />
        <StatusBar />
      </TRPCProvider>
    </LogtoProvider>
  );
}
