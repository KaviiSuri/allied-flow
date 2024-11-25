import { SafeAreaView } from "react-native";
import { DashboardPage } from "~/components/dashboard/DashboardPage.web";

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
      <DashboardPage />
      {/* <SkeletonLoader rows={1} columns={1} itemHeight={700} itemWidth={700} /> */}
    </SafeAreaView>
  );
}
