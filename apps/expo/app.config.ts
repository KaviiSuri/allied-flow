import type { LogtoConfig } from "@logto/rn";
import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "allied-flow",
  slug: "allied-flow",
  scheme: "io.allied-flow",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/0aaaf26f-31c5-4b15-8019-c50ec1e4d772",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.aacipl.alliedflow",
    supportsTablet: true,
  },
  android: {
    package: "com.aacipl.alliedflow",
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  // extra: {
  //   eas: {
  //     projectId: "your-eas-project-id",
  //   },
  // },
  extra: {
    logtoConfig: {
      endpoint: "https://qnd1sc.logto.app/",
      appId: "1uxzjtcfyjxs5ecwebhu7",
      resources: ["https://api.allied-flow.com"],
      scopes: ["email", "profile"],
    } satisfies LogtoConfig,
    eas: {
      projectId: "0aaaf26f-31c5-4b15-8019-c50ec1e4d772",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router", "expo-secure-store"],
});
