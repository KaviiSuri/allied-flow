declare global {
  interface window {
    location: {
      origin: string;
    };
  }
}

declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";
  const value: ImageSourcePropType;
  export default value;
}
