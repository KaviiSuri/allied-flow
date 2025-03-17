import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import { BoardSection } from "./boardSection";
import { ScrollView } from "react-native-gesture-handler";
import { GraphComponent } from "./graphBasedComponent";
import { TableSection } from "./TableSection";
import { api } from "~/utils/api";
import { useEffect } from "react";

export const DashboardPage = () => {
  // Get the current date range (last 30 days)
  const end_date = new Date();
  const start_date = new Date();
  start_date.setDate(start_date.getDate() - 30);

  // Fetch analytics data
  const { data: summaryData } = api.analytics.getSummary.useQuery({
    start_date,
    end_date,
  });

  const { data: revenueData } = api.analytics.getRevenueSeries.useQuery({
    dateRange: {
      start_date,
      end_date,
    },
    comparison: true,
  });

  const { data: productRankings } = api.analytics.getProductRankings.useQuery({
    dateRange: {
      start_date,
      end_date,
    },
    sortBy: "revenue",
    sortOrder: "desc",
    limit: 10,
  });

  useEffect(() => {
    if (summaryData) {
      console.log("Summary Data:", summaryData);
    }
    if (revenueData) {
      console.log("Revenue Data:", revenueData);
    }
    if (productRankings) {
      console.log("Product Rankings:", productRankings);
    }
  }, [summaryData, revenueData, productRankings]);

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
