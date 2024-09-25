import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { DetailsTabs } from "~/components/detailsTabs";
import { InquiryDetailsPage } from "~/components/inquiryDetailsPage";
import { CenterModalComponent } from "~/components/layouts/CenterModal";
import { FormTextInput } from "~/components/shared/form";
import { Table, TableData, TableHeading, TableRow } from "~/components/shared/table";
import { api, RouterOutputs } from "~/utils/api";

const windowHeight = Dimensions.get("window").height - 64;

type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

type QuoteItemMap = Record<string, QuoteItem>;
export default function InquiriesDetails() {
  const { inquiryNumber } = useLocalSearchParams();
  const { data, isLoading } = api.inquiry.getDetails.useQuery(
    {
      inquiryId: inquiryNumber as string,
    },
    {},
  );
  const isFinalized =
    data?.inquiry &&
    data.latestQuote &&
    (["ACCEPTED", "REJECTED"].includes(data.inquiry.status) ||
      ["ACCEPTED", "REJECTED"].includes(data.latestQuote.status));

  console.log("isFinalized", isFinalized);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeNestedTab, setActiveNestedTab] = useState("Details");
  const [negotiationVisible, setNegotiationVisible] = useState(false);

  const [negoiatedItems, setNegotiatedItems] = useState<QuoteItemMap>({});

  const handleQuoteItemUpdate = (quoteItem: QuoteItem) => {
    console.log("quoteItem", quoteItem);
    setNegotiatedItems((prev) => ({
      ...prev,
      [quoteItem.productId]: quoteItem,
    }));
  };

  const utils = api.useUtils();
  const { mutateAsync: negotiate, isPending } =
    api.inquiry.negotiate.useMutation({
      onSuccess: () => {
        void utils.inquiry.getDetails
          .invalidate({ inquiryId: inquiryNumber as string })
          .then(() => {
            Toast.show({
              type: "success",
              text1: "Negotiation successful",
            });
          })
          .catch();
      },
    });

  const handleNegotiate = () => {
    if (isPending || !data) {
      return;
    }
    negotiate({
      inquiryId: data.inquiry.id,
      items: Object.values(negoiatedItems),
    }).catch(() => {
      Toast.show({
        type: "error",
        text1: "Negotiation failed",
      });
    });
    setNegotiationVisible(false);
  };

  const { mutateAsync: createOrderFromInquiry } =
    api.orders.createFromInquiry.useMutation({
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Order placed successfully",
          onPress: () => {
            router.push("/orders");
          },
        });
        utils.orders.invalidate().catch(console.error);
      },
    });

  const handleOrder = () => {
    if (!data || !data.inquiry || !data.latestQuote || isFinalized) {
      return;
    }
    createOrderFromInquiry({
      inquiryId: data.inquiry.id,
      quoteId: data.latestQuote.id,
      type: "REGULAR",
    });
  };
  const handleCancel = () => {
    setNegotiatedItems({});
    setNegotiationVisible(false);
  };

  const renderNestedScreen = () => {
    switch (activeNestedTab) {
      case "Details":
        return (
          <InquiryDetails
            quote={data?.latestQuote}
            remarks={data?.inquiry.remarks ?? ""}
          />
        );
      case "Sample":
        return <Sample />;
      case "Order":
        return <Sample />;
      default:
        return (
          <InquiryDetails
            quote={data?.latestQuote}
            remarks={data?.inquiry.remarks ?? ""}
          />
        );
    }
  };
  useEffect(() => {
    Toast.show({
      position: "bottom",
      type: "error",
      text1: "Hello Error",
      text2: "This is some something 👋",
    });
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#FFF",
        position: "relative",
      }}
    >
      <CenterModalComponent
        visible={negotiationVisible}
        setVisible={setNegotiationVisible}
      >
        <NegotiationTable />
        <FormTextInput label="Remarks" placeholder="Enter remarks here" />
      </CenterModalComponent>
      <View style={{ paddingVertical: 12, height: windowHeight }}>
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
                activeNestedTab === "Sample" ? styles.activeTab : styles.tab
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
                activeNestedTab === "Order" ? styles.activeTab : styles.tab
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

          <View
            style={{
              paddingBottom: 12,
              flexDirection: "row",
              gap: 16,
            }}
          >
            <SecondaryButton
              text="Update Quote"
              onPress={() => {
                setNegotiationVisible(true);
              }}
            />
            <PrimaryButton
              text="Place Order"
              disabled={!(data?.inquiry.status === "ACCEPTED")}
              onPress={() => {
                router.navigate(`/inquiry/sendQuote/${data?.inquiry.id}`);
              }}
            />
          </View>
        </View>
        {renderNestedScreen()}
      </View>
    </SafeAreaView>
  );
}

const InquiryDetails = ({
  quote,
  remarks,
}: {
  quote: RouterOutputs["inquiry"]["getDetails"]["latestQuote"];
  remarks: string;
}) => {
  return (
    <View style={styles.tabContentContainer}>
      <ScrollView
        style={{
          height: "100%",
          width: "75%",
          padding: 20,
          paddingBottom: 100,
          backgroundColor: "#f9f9f9",
        }}
      >
        <InquiryDetailsPage quote={quote} />
        {/* Customers Remarks */}
        <View style={styles.extraContainers}>
          <Text
            style={{
              paddingBottom: 8,
              fontWeight: 500,
              lineHeight: 24,
              fontFamily: "Avenir",
              color: "#475569",
            }}
          >
            Customer Remarks
          </Text>
          <Text
            style={{
              color: "#334155",
              fontWeight: 500,
              lineHeight: 24,
              fontFamily: "Avenir",
            }}
          >
            {remarks}
          </Text>
        </View>

        <View style={styles.extraContainers}>
          <Text
            style={{
              paddingBottom: 8,
              fontWeight: 500,
              lineHeight: 24,
              fontFamily: "Avenir",
              color: "#475569",
            }}
          >
            Terms and conditions
          </Text>
          <Text
            style={{
              color: "#334155",
              fontWeight: 500,
              lineHeight: 24,
              fontFamily: "Avenir",
            }}
          >
            Terms of service are the legal agreements between a service provider
            and a person who wants to use that service. The person must agree to
            abide by the terms of service in order to use the offered service.
            Terms of service can also be merely a disclaimer, especially
            regarding the use of websites.
          </Text>
          <Text
            style={{
              color: "#334155",
              fontWeight: 500,
              lineHeight: 24,
              fontFamily: "Avenir",
              paddingTop: 8,
            }}
          >
            Inco Terms - ABCD
          </Text>
          <Text
            style={{
              color: "#334155",
              fontWeight: 500,
              lineHeight: 24,
              fontFamily: "Avenir",
              paddingTop: 8,
            }}
          >
            Payment Terms - ABCD
          </Text>
        </View>
      </ScrollView>
      <View
        style={{
          height: "100%",
          width: "25%",
        }}
      >
        <DetailsTabs />
      </View>
    </View>
  );
};

const Sample = () => {
  return (
    <View style={styles.tabContentContainer}>
      <ScrollView
        style={{
          height: "100%",
          width: "75%",
          padding: 20,
          paddingBottom: 100,
          backgroundColor: "#f9f9f9",
        }}
      >
        <InquiryDetailsPage />
        {/* Customers Remarks */}
      </ScrollView>
      <View
        style={{
          height: "100%",
          width: "25%",
        }}
      >
        <DetailsTabs />
      </View>
    </View>
  );
};

const NegotiationTable = () => {
  return (
    <Table style={styles.tableContainer}>
      <TableHeading style={{ backgroundColor: "#F1F5F9" }}>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Product Name
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Quantity
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Target Price
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Revised Price
        </TableData>
      </TableHeading>
      {/* random data  */}

        <TableRow style={styles.tableRow} id={'1'} key={1}>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Ketone
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            3kg
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Rs 1000 
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            <TextInput></TextInput>
          </TableData>
        </TableRow>
    </Table>
  );
};

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
  tableContainer: {
    borderRadius: 8,
    backgroundColor: "white",
  },
  tableRow: {
    flex: 1,
  },
});
