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

  // Summary Analytics
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = api.analytics.getSummary.useQuery({
    start_date,
    end_date,
  });

  // Product Rankings Analytics
  const {
    data: productRankings,
    isLoading: isRankingsLoading,
    error: rankingsError,
  } = api.analytics.getProductRankings.useQuery({
    dateRange: {
      start_date,
      end_date,
    },
    sortBy: "revenue",
    sortOrder: "desc",
    limit: 10,
  });

  // Revenue Series Analytics
  const {
    data: revenueSeries,
    isLoading: isSeriesLoading,
    error: seriesError,
  } = api.analytics.getRevenueSeries.useQuery({
    dateRange: {
      start_date,
      end_date,
    },
    comparison: true,
  });

  // Log all analytics data only when loading is complete
  useEffect(() => {
    if (!isSummaryLoading && !isRankingsLoading && !isSeriesLoading) {
      console.log("=== Analytics Data ===");
      console.log("Summary Data:", summaryData);
      console.log("Product Rankings:", productRankings);
      console.log("Revenue Series:", revenueSeries);
      console.log("=====================");
    }
  }, [
    summaryData,
    productRankings,
    revenueSeries,
    start_date,
    end_date,
    isSummaryLoading,
    isRankingsLoading,
    isSeriesLoading,
  ]);

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

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              width: "100%",
            }}
          >
            <View style={dashboardWebStyles.graphSectionContainer}>
              <GraphComponent />
            </View>
            <View style={dashboardWebStyles.graphSectionContainer}>
              <GraphComponent />
            </View>
          </View>
        </View>

        {/* <TableSection /> */}
      </ScrollView>
    </View>
  );
};
