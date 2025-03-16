import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import { BoardSection } from "./boardSection";
import { ScrollView } from "react-native-gesture-handler";
import { GraphComponent } from "./graphBasedComponent";
import { TableSection } from "./TableSection";

export const DashboardPage = () => {
  return (
    <View style={dashboardWebStyles.container}>
      {/* dashboard body */}
      <View>Header</View>
      <ScrollView style={dashboardWebStyles.dashboardBody}>
        <View style={dashboardWebStyles.singleSection}>
          <Text style={dashboardWebStyles.sectionHeader}>Summary</Text>
          <View style={dashboardWebStyles.boardSectionContainer}>
            <BoardSection title="Sales revenue" score="1275" />
            <BoardSection title="Sales revenue" score="1275" />
            <BoardSection title="Sales revenue" score="1275" />
            <BoardSection title="Sales revenue" score="1275" />
            <BoardSection title="Sales revenue" score="1275" />
            <BoardSection title="Sales revenue" score="1275" />
          </View>

          <View style={dashboardWebStyles.boardSectionContainer}>
            <GraphComponent />
          </View>
        </View>

        <TableSection />
      </ScrollView>
    </View>
  );
};
