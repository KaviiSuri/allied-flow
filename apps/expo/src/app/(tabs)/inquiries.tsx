import { SafeAreaView, Text } from "react-native";
import { MultiSelectExample } from "~/components/layouts/multiSelectExample";

export default function Inquiries() {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Text>Inquiries</Text>
      <MultiSelectExample />
    </SafeAreaView>
  );
}
