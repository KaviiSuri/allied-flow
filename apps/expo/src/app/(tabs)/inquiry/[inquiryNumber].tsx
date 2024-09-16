import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";
import { Badge } from "~/components/core/badge";
import { DetailsSectionMobile } from "~/components/inquiryDetails/mobile/Details";
import {
  orderStyles,
  SampleSectionMobile,
} from "~/components/inquiryDetails/mobile/Order";
import { BottomDrawer } from "~/components/layouts/BottomDrawerLayout";
import { FormTextInput } from "~/components/shared/form";
import { SearchBox } from "~/components/shared/searchComponent";

export default function InquiriesDetails() {
  const { inquiryNumber } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeNestedTab, setActiveNestedTab] = useState("Details");
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [remark, setRemark] = useState<string>("");

  const handleNegotiate = () => {
    setOpenCreateForm(false);
  };
  const handleCancel = () => {
    setOpenCreateForm(false);
  };

  const renderNestedScreen = () => {
    switch (activeNestedTab) {
      case "Details":
        return <DetailsSectionMobile />;
      case "Sample":
        return <SampleSectionMobile />;
      case "Order":
        return <SampleSectionMobile />;
      default:
        return <DetailsSectionMobile />;
    }
  };

  const windowHeight = Dimensions.get("window").height - 185;

  return (
    <View style={{ height: windowHeight }}>
      <SafeAreaView
        edges={["left", "right"]}
        style={styles.titleHeaderContainer}
      >
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Icon name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          {inquiryNumber && typeof inquiryNumber === "string" && (
            <Text style={styles.titleHeader}>
              Inquiry #
              {inquiryNumber.length > 4
                ? inquiryNumber.substring(0, 4) + "..."
                : inquiryNumber}
            </Text>
          )}
          <View style={{ width: 118 }}>
            <Badge
              IconName="checkcircleo"
              badgeText="QuoteReceived"
              bg="#f0f9f6"
              accentColor="#047857"
            />
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 4,
            paddingVertical: 12,
          }}
        >
          <SearchBox
            placeholder="Search Product"
            setValue={setSearchQuery}
            value={searchQuery}
          />
        </View>
      </SafeAreaView>

      <View style={styles.tabContainer}>
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
                color: activeNestedTab == "Details" ? "#2f80f5" : "#475569",
                fontSize: 16,
                fontWeight: 500,
                marginHorizontal: 6,
              }}
            >
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeNestedTab === "Sample" ? styles.activeTab : styles.tab}
            onPress={() => setActiveNestedTab("Sample")}
          >
            <Text
              style={{
                fontFamily: "Avenir",
                color: activeNestedTab == "Sample" ? "#2f80f5" : "#475569",
                fontSize: 16,
                fontWeight: 500,
                marginHorizontal: 6,
              }}
            >
              Sample
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeNestedTab === "Order" ? styles.activeTab : styles.tab}
            onPress={() => setActiveNestedTab("Order")}
          >
            <Text
              style={{
                fontFamily: "Avenir",
                color: activeNestedTab == "Order" ? "#2f80f5" : "#475569",
                fontSize: 16,
                fontWeight: 500,
                marginHorizontal: 6,
              }}
            >
              Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          flex: 1,
          height: "100%",
        }}
      >
        {renderNestedScreen()}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          backgroundColor: "white",
          bottom: 0,
          left: 0,
          borderColor: "#e2e8f0",
          borderWidth: 1,
          width: "100%",
          borderTopWidth: 1,
          padding: 16,
          gap: 16,
        }}
      >
        <TouchableOpacity
          style={[bottomStyles.secondaryButton]}
          onPress={() => setOpenCreateForm(true)}
        >
          <Text
            style={{
              color: "#334155",
              fontFamily: "AvenirHeavy",
              fontWeight: 500,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Negotiate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[bottomStyles.primaryButton]}>
          <Text
            style={{
              color: "#fff",
              fontFamily: "AvenirHeavy",
              fontWeight: 500,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Place Order
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Negotiation */}
      <BottomDrawer
        openCreateForm={openCreateForm}
        setOpenCreateForm={setOpenCreateForm}
        header="Negotiate quote"
        primaryButtonText="Negotiate"
        secondaryButtonText="Cancel"
        onPrimaryButtonPress={handleNegotiate}
        onSecondaryButtonPress={handleCancel}
      >
        <ProductsCard />

        <RemarksForm remark={remark} setRemark={setRemark} />
      </BottomDrawer>
    </View>
  );
}

const RemarksForm = ({
  remark,
  setRemark,
}: {
  remark: string;
  setRemark: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <Text style={orderStyles.headerText}>Remarks</Text>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <FormTextInput
                label="Your Remarks"
                placeholder="Enter remark here"
                value={remark}
                onChangeText={setRemark}
                numberOfLines={3}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const ProductsCard = () => {
  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <Text style={orderStyles.headerText}>Ketone</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon name="delete" color={"red"}></Icon>
              <Text style={{ color: "red" }}>Delete</Text>
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>CAS</Text>
              <Text style={orderStyles.orderMainText}>68845-36-3</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Quantity</Text>
              <Text style={orderStyles.orderMainText}>-</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Make</Text>
              <Text style={orderStyles.orderMainText}>Spicy</Text>
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <FormTextInput
                placeholder="Enter target  price"
                label="Target Price (Per Unit)"
              />
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <FormTextInput
                placeholder="Enter target  quantity"
                label="Target Quatity (Per Unit)"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const bottomStyles = StyleSheet.create({
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#2f80f5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2f80f5",
    flex: 1,
  },
});

const styles = StyleSheet.create({
  activeTab: {
    borderColor: "#2F80F5",
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginRight: 4,
  },
  tab: {
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 12,
    marginRight: 4,
  },
  tabContentContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  extraContainers: {
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: 20,
    borderWidth: 1,
    padding: 16,
    borderColor: "#DCDFEA",
  },
  ...StyleSheet.create({
    titleHeaderContainer: {
      backgroundColor: "white",
      paddingTop: 8,
      paddingHorizontal: 16,
      gap: 8,
    },
    titleHeader: {
      fontFamily: "AvenirHeavy",
      fontWeight: 800,
      fontSize: 18,
      color: "#1e293b",
    },
    titleRow: {
      flexDirection: "row",
      gap: 4,
    },
  }),
  titleHeaderContainer: {
    backgroundColor: "white",
    paddingTop: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  titleHeader: {
    fontFamily: "AvenirHeavy",
    fontWeight: 800,
    fontSize: 18,
    color: "#1e293b",
  },
  titleRow: {
    flexDirection: "row",
    gap: 4,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "white",
  },
});
