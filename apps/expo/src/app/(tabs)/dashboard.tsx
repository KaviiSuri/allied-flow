import { SafeAreaView, Text } from "react-native";
import { SingleSelectExample } from "~/components/layouts/singleSelectExample";

export default function Dashboard() {

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
      <Text>Dashboard</Text>
      <SingleSelectExample />

    </SafeAreaView>
  );
}
