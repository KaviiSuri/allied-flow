import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import { BoardSection } from "./boardSection";
import { ScrollView } from "react-native-gesture-handler";
import { GraphComponent } from "./graphBasedComponent";
import { TableSection } from "./TableSection";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

export const DashboardPage = () => {
  const [end_date, setEndDate] = useState(new Date());
  const [start_date, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });

  const { data: summaryData } = api.analytics.getSummary.useQuery({
    start_date,
    end_date,
  });

  useEffect(() => {
    console.log(summaryData);
  }, [summaryData]);

  return (
    <View style={dashboardWebStyles.container}>
      {/* dashboard body */}
      <View>Header</View>
      <ScrollView style={dashboardWebStyles.dashboardBody}>
        <View style={dashboardWebStyles.singleSection}>
          <Text style={dashboardWebStyles.sectionHeader}>Summary</Text>
          <View style={dashboardWebStyles.boardSectionContainer}>
            <BoardSection
              title="Total Revenue"
              score={summaryData?.sales.revenue.value.toString() ?? "0"}
            />
            <BoardSection
              title="Sample Orders"
              score={summaryData?.sales.samples.count.toString() ?? "0"}
            />
            <BoardSection
              title="Total Inquiries"
              score={summaryData?.inquiries.received.total.toString() ?? "0"}
            />
            <BoardSection
              title="Win Rate"
              score={`${Math.round(summaryData?.inquiries.received.winPercentage ?? 0)}%`}
            />
            <BoardSection
              title="Inquiry Value"
              score={summaryData?.inquiries.value.total.toString() ?? "0"}
            />
            <BoardSection
              title="Value Win Rate"
              score={`${Math.round(summaryData?.inquiries.value.winPercentage ?? 0)}%`}
            />
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
