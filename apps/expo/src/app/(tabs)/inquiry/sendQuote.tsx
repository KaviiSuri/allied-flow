import { ScreenHeight } from "@rneui/themed/dist/config"
import { Dimensions, StyleSheet, Text, View } from "react-native"
import { PrimaryButton } from "~/components/core/button"
import { HistoryPanelTable } from "~/components/historyPanel";
import { QuotePanel } from "~/components/historyPanel/quotePanel";

export default () => {
  const screenHeight = Dimensions.get('window').height;
  return (
    <View style={[styles.pageContainer, { minHeight: screenHeight }]}>
      {/* quote details */}
      <QuoteDetails />
      {/* order history */}
      <OrderHistory />
    </View>
  )
}



const QuoteDetails = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.leftHeader]}>
        <Text style={styles.header}>John Enterprises</Text>
        <PrimaryButton text="Send Quote" />
      </View>
      <View style={styles.quotePanel}>
        <QuotePanel />
      </View>
    </View>
  )
}

const OrderHistory = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.rightHeader]}>
        <Text style={styles.header}>OrderHistory</Text>
        <Text>{'>>'}</Text>
      </View>
      <View style={styles.historyPanel}>
        <View>
        </View>
        <View>
          <HistoryPanelTable />
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create(({
  pageContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white"
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
    fontFamily: 'Avenir',
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
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",

  }
}))
