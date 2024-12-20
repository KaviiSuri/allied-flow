import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import { BoardSection } from "./boardSection";

export const DashboardPage = () => {
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
