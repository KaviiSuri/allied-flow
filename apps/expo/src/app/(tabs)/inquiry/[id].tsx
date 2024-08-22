import { useEffect, useState } from "react";
import { Dimensions, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InnerScreen } from "react-native-screens";
import Toast from "react-native-toast-message";
import { DetailsTabs } from "~/components/detailsTabs";
import { InquiryDetailsPage } from "~/components/inquiryDetailsPage";


const windowHeight = Dimensions.get("window").height - 64;

export default function InquiriesDetails() {
  const [activeNestedTab, setActiveNestedTab] = useState("Details");

  const renderNestedScreen = () => {
    switch (activeNestedTab) {
      case "Details":
        return <InquiryDetails />;
      case "Sample":
        return <Sample />;
      case "Order":
        return <Sample />;
      default:
        return <InquiryDetails />;
    }
  };
  useEffect(() => {
    Toast.show({
      position: 'bottom',
      type: 'error',
      text1: 'Hello Error',
      text2: 'This is some something 👋'
    })
  }, [])
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#FFF",
        position: "relative",
      }}
    >
      <View style={{ paddingVertical: 12, height: windowHeight }}>
        <View
          style={styles.tabContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={
                activeNestedTab === "Details" ? styles.activeTab : styles.tab
              }
              onPress={() => setActiveNestedTab("Details")}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color: activeNestedTab == "Details" ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
                Inquiry Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeNestedTab === 'Sample' ?
                  styles.activeTab : styles.tab
              }
              onPress={() => setActiveNestedTab("Sample")}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color: activeNestedTab == "Sample" ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
                Sample
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                activeNestedTab === 'Order' ?
                  styles.activeTab : styles.tab
              }
              onPress={() => setActiveNestedTab("Order")}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color: activeNestedTab == "Order" ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
                Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {renderNestedScreen()}
      </View>
    </SafeAreaView >
  );
}


const InquiryDetails = () => {
  return (
    <View style={styles.tabContentContainer}>
      <View style={{ height: "100%", width: "75%", padding: 20, backgroundColor: "#f9f9f9" }} >
        <InquiryDetailsPage />
        {/* Customers Remarks */}
        <View
          style={styles.extraContainers}
        >
          <Text style={{ paddingBottom: 8, fontWeight: 500, lineHeight: 24, fontFamily: 'Avenir', color: "#475569" }}>
            Customer Remarks
          </Text>
          <Text style={{ color: "#334155", fontWeight: 500, lineHeight: 24, fontFamily: 'Avenir' }}>
            Terms of service are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.
          </Text>

        </View>

        <View
          style={styles.extraContainers}
        >
          <Text style={{ paddingBottom: 8, fontWeight: 500, lineHeight: 24, fontFamily: 'Avenir', color: "#475569" }}>
            Terms and conditions
          </Text>
          <Text style={{ color: "#334155", fontWeight: 500, lineHeight: 24, fontFamily: 'Avenir' }}>
            Terms of service are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.
          </Text>
          <Text style={{ color: "#334155", fontWeight: 500, lineHeight: 24, fontFamily: 'Avenir', paddingTop: 8 }}>
            Inco Terms - ABCD
          </Text>
          <Text style={{ color: "#334155", fontWeight: 500, lineHeight: 24, fontFamily: 'Avenir', paddingTop: 8 }}>
            Payment Terms - ABCD
          </Text>

        </View>

      </View>
      <View style={{
        height: "100%",
        width: "25%"
      }}>
        <DetailsTabs />
      </View>
    </View>
  )
}

const Sample = () => {
  return (
    <View style={styles.tabContentContainer}>
      Sample
    </View>
  )
}

const Order = () => {
  return (
    <View style={styles.tabContentContainer}>
      Sample
    </View>
  )
}

//styles
const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 12,
    marginRight: 4,
  },
  activeTab: {
    borderColor: "#2F80F5",
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginRight: 4,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    paddingHorizontal: 20,
  },
  tabContentContainer: {
    flexDirection: 'row',
    width: "100%",
    height: "100%"
  },
  extraContainers: {
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: 20,
    borderWidth: 1,
    padding: 16,
    borderColor: "#DCDFEA"
  }
})
