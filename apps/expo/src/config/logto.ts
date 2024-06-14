import type { LogtoConfig } from "@logto/rn";
import { Platform } from "react-native";

const config = {
  endpoint: "https://qnd1sc.logto.app/",
  appId:
    Platform.OS === "web" ? "ql6fr1emxy5sxzimlrxe3" : "1uxzjtcfyjxs5ecwebhu7",
  resources: ["https://api.allied-flow.com"],
  scopes: ["email", "profile"],
} satisfies LogtoConfig;

const redirectUri = Platform.select({
  ios: "io.allied-flow://callback",
  android: "io.allied-flow://callback",
  // @ts-expect-error web is not defined in Platform
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  web: `${window?.location?.origin}/callback`,
});

export const logtoService = {
  config,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  redirectUri: redirectUri!,
};
