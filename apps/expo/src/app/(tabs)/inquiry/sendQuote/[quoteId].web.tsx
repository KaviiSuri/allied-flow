import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "~/components/core/button";
import { HistoryPanelTable } from "~/components/historyPanel";
import { QuotePanel } from "~/components/historyPanel/quotePanel";
import { api, RouterOutputs } from "~/utils/api";

const windowHeight = Dimensions.get("window").height - 64;
export default () => {
  const { quoteId } = useLocalSearchParams();
  const { data, isLoading } = api.inquiry.getDetails.useQuery(
    {
      inquiryId: quoteId as string,
    },
    {},
  );

  const screenHeight = Dimensions.get("window").height;
  return (
    <View style={[styles.pageContainer, { minHeight: screenHeight }]}>
      {/* quote details */}
      <QuoteDetails latestQuote={data?.latestQuote} inquiryDetails={data?.inquiry} />
      {/* order history */}
      <OrderHistory />
    </View>
  );
};

const QuoteDetails = ({latestQuote,inquiryDetails}:{
  latestQuote:RouterOutputs["inquiry"]["getDetails"]["latestQuote"],
  inquiryDetails: any
 }) => {
  useEffect(()=>{
    console.log(latestQuote,inquiryDetails)
  },[latestQuote,inquiryDetails])


  const { data: clientList } = api.teams.readTeams.useQuery(
    {
      type: "CLIENT",
    },
  );
  const clientName = useMemo(() => {
     const clientDetails = clientList?.find((client) => (client.id === inquiryDetails.buyerId)) 
     if(clientDetails){
      return clientDetails.name;
     }
     return "";
  }, [clientList]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.leftHeader]}>
        <Text style={styles.header}>{clientName}</Text>
        <PrimaryButton text="Send Quote" />
      </View>
      <ScrollView style={styles.quotePanel}>
        <QuotePanel latestQuote={latestQuote} />
      </ScrollView>
    </View>
  );
};

const OrderHistory = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.rightHeader]}>
        <Text style={styles.header}>OrderHistory</Text>
        <Text>{">>"}</Text>
      </View>
      <View style={styles.historyPanel}>
        <View></View>
        <View>
          <HistoryPanelTable />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontFamily: "Avenir",
  },
  leftHeader: {
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  rightHeader: {
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  historyPanel: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",
  },
  quotePanel: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",
    height: windowHeight,
    paddingBottom :200,
  },
});
