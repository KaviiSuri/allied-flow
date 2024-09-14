import { SafeAreaView, Text } from "react-native";
import { SamplePage } from "~/components/sample/SamplesPage";

export default function Samples() {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "white"
      }}
    >
      <SamplePage />
    </SafeAreaView>
  );
}
