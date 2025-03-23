import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import { BoardSection } from "./boardSection";
import { api } from "~/utils/api";

export const DashboardPage = () => {
  const { data, isLoading, error } = api.analytics.getSummary.useQuery({
    start_date: new Date(new Date().setMonth(-12)),
    end_date: new Date(),
  });
  console.log("analytics data", data);
  console.log("isLoading", isLoading);
  console.log("error", error);
  return (
    <View style={dashboardWebStyles.container}>
      {/* three small boards with info */}
      <View style={{ flexDirection: "row", flex: 1, gap: 8 }}>
        <BoardSection title="Total Orders" />
        <BoardSection title="Total Orders" />
        <BoardSection title="Total Orders" />
      </View>
    </View>
  );
};
