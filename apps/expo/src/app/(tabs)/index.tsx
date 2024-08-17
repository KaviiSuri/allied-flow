import { SafeAreaView, Text } from "react-native";
import SkeletonLoader from "~/components/shared/skelton";

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
      {/* <SkeletonLoader rows={1} columns={1} itemHeight={700} itemWidth={700} /> */}
    </SafeAreaView>
  );
}
