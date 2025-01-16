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
import { InquirySamples } from "~/components/inquiry/InquiryItems";
import { InquiryDetailsPage } from "~/components/inquiryDetailsPage";
import { CenterModalComponent } from "~/components/layouts/CenterModal";
import { FormTextInput } from "~/components/shared/form";
import {
  Table,
  TableData,
  TableHeading,
  TableRow,
} from "~/components/shared/table";
import { useProductById } from "~/hooks/useProductById";
import { useUser } from "~/providers/auth";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

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
  const [createdBy, setCreatedBy] = useState("SELLER");
  const [currentUser, setCurrentUser] = useState("SELLER");
  const [updateQuoteActive, setUpdateQuoteActive] = useState(false);

  const [negotiatedItems, setNegotiatedItems] = useState<QuoteItemMap>({});
  const [sampleItems, setSampleItems] = useState<any>();
  const [orderItems, setOrderItems] = useState<any>()

  const handleQuoteItemUpdate = (quoteItem: QuoteItem) => {
    setNegotiatedItems((prev) => ({
      ...prev,
      [quoteItem.productId]: quoteItem,
    }));
  };

  useEffect(() => {
    setNegotiatedItems({});
  }, [inquiryNumber]);

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
    if (!updateQuoteActive) {
      setUpdateQuoteActive(true);
      return;
    }
    console.log("negotiatedItems", negotiatedItems);
    if (isPending || !data) {
      return;
    }
    negotiate({
      inquiryId: data.inquiry.id,
      items: Object.values(negotiatedItems),
    }).catch(() => {
      Toast.show({
        type: "error",
        text1: "Negotiation failed",
      });
    });
    setNegotiationVisible(false);
  };

  const { mutate: createOrderFromInquiry } =
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
    if (!data?.inquiry || !data.latestQuote || isFinalized) {
      return;
    }
    createOrderFromInquiry({
      inquiryId: data.inquiry.id,
      quoteId: data.latestQuote.id,
      type: "REGULAR",
    });
  };

  const { mutate: rejectInquiry } = api.inquiry.reject.useMutation({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Inquiry Rejected",
      });
      utils.inquiry.getDetails.invalidate({
        inquiryId: inquiryNumber as string,
      });
    },
  });

  const handleCancel = () => {
    if (!data?.inquiry || !data.latestQuote || isFinalized) {
      return;
    }
    setNegotiatedItems({});
    setNegotiationVisible(false);
    rejectInquiry({ inquiryId: data.inquiry.id, quoteId: data.latestQuote.id });
  };

  const { user } = useUser();
  useEffect(() => {
    if (data && data?.latestQuote?.createdByTeam) {
      if (data.latestQuote.createdByTeam === "ADMIN") {
        setCreatedBy("SELLER");
      } else {
        setCreatedBy("CLIENT");
      }
    }

    if (user && user.team.type) {
      if (user.team.type === "SELLER") {
        setCurrentUser("SELLER");
      } else {
        setCurrentUser("CLIENT");
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data?.latestQuote?.createdBy) {
      if (currentUser !== createdBy) {
        setNegotiationVisible(true);
      } else {
        setNegotiationVisible(false);
      }
    }
    console.log(
      currentUser,
      createdBy,
      data?.latestQuote?.createdByTeam,
      user?.team.type,
      "DATA HERE",
    );

    const sampleList = data?.latestQuote?.quoteItems.filter((quoteItem)=> quoteItem.sampleRequested)
    setSampleItems(sampleList)
    setOrderItems(data?.latestQuote?.quoteItems)
  }, [data, createdBy, currentUser]);

  const renderNestedScreen = () => {
    switch (activeNestedTab) {
      case "Details":
        return (
          <InquiryDetails
            quote={data?.latestQuote}
            remarks={data?.inquiry.remarks ?? ""}
            tnc={data?.inquiry.tnc ?? ""}
          />
        );
      case "Sample":
        return <InquirySamples items={sampleItems} type="SAMPLE"/>;
      case "Order":
        return <InquirySamples items={orderItems} type="ORDERS"/>;
      default:
        return (
          <InquiryDetails
            quote={data?.latestQuote}
            remarks={data?.inquiry.remarks ?? ""}
            tnc={data?.inquiry.tnc ?? ""}
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
        onUpdateRequest={handleNegotiate}
        onAcceptRequest={handleOrder}
        onRejectRequest={handleCancel}
        time={data?.latestQuote?.createdAt}
        isClient={currentUser === "CLIENT"}
        createdByClient={createdBy === "CLIENT"}
        buyerName={data?.buyerTeam !== undefined ? data?.buyerTeam.name : ""}
        updateQuoteActive={updateQuoteActive}
      >
        <NegotiationTable
          quoteItems={data?.latestQuote?.quoteItems ?? []}
          negotiationItems={negotiatedItems}
          handleQuoteItemUpdate={handleQuoteItemUpdate}
          updateQuoteActive={updateQuoteActive}
        />
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

            {data?.inquiry.status === "ACCEPTED" && (
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
            )}
          </View>

          <View
            style={{
              paddingBottom: 12,
              flexDirection: "row",
              gap: 16,
            }}
          >
            <SecondaryButton
              text={user?.team.type === "CLIENT" ? "Negotiate" : "Update Quote"}
              onPress={() => {
                setUpdateQuoteActive(true);
                setNegotiationVisible(true);
              }}
            />
            <PrimaryButton
              text="Place Order"
              disabled={!(data?.inquiry.status !== "ACCEPTED")}
              onPress={handleOrder}
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
  tnc,
}: {
  tnc: string;
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
            {tnc}
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

const NegotiationTable = ({
  negotiationItems,
  quoteItems,
  handleQuoteItemUpdate,
  updateQuoteActive,
}: {
  negotiationItems: QuoteItemMap;
  quoteItems: QuoteItem[];
  handleQuoteItemUpdate: (quoteItem: QuoteItem) => void;
  updateQuoteActive: boolean;
}) => {
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
          {updateQuoteActive ? "Target Price" : "Previous Price"}
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
          {updateQuoteActive ? "Target Price" : "Revised Price"}
        </TableData>
      </TableHeading>
      {/* random data  */}

      {quoteItems.map((quoteItem) => (
        <ProductRow
          key={quoteItem.productId}
          quoteItem={quoteItem}
          negotiatedItem={negotiationItems[quoteItem.productId]}
          updateQuoteItem={handleQuoteItemUpdate}
          updateQuoteActive={updateQuoteActive}
        />
      ))}
    </Table>
  );
};

function ProductRow({
  quoteItem,
  negotiatedItem,
  updateQuoteItem,
  updateQuoteActive,
}: {
  quoteItem: QuoteItem;
  negotiatedItem?: QuoteItem;
  updateQuoteItem: (quoteItem: QuoteItem) => void;
  updateQuoteActive: boolean;
}) {
  const { product } = useProductById(quoteItem.productId);
  if (!product) {
    return null;
  }
  return (
    <TableRow style={styles.tableRow} id={"1"} key={quoteItem.productId}>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 400,
          flex: 1,
          borderRightWidth: 1,
          borderColor: "#DCDFEA",
        }}
      >
        {product.name}
      </TableData>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 400,
          flex: 1,
          borderRightWidth: 1,
          borderColor: "#DCDFEA",
        }}
      >
        {quoteItem.quantity} {quoteItem.unit}
      </TableData>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 400,
          flex: 1,
          borderRightWidth: 1,
          borderColor: "#DCDFEA",
        }}
      >
        {updateQuoteActive
          ? "Rs " + quoteItem.price
          : "Rs " + quoteItem.prevPrice}
      </TableData>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 400,
          flex: 1,
          borderRightWidth: 1,
          borderColor: "#DCDFEA",
        }}
      >
        {updateQuoteActive ? (
          <FormTextInput
            placeholder="Price"
            label=""
            value={negotiatedItem?.price ? negotiatedItem.price.toString() : ""}
            keyboardType="numeric"
            style={{
              maxWidth: 100,
              padding: 0,
              borderWidth: 0,
            }}
            onChangeText={(value) => {
              const newPrice = parseFloat(value);
              if (isNaN(newPrice)) {
                return;
              }
              updateQuoteItem({
                ...quoteItem,
                ...negotiatedItem,
                price: newPrice,
              });
            }}
          />
        ) : (
          "Rs " + quoteItem.price
        )}
      </TableData>
    </TableRow>
  );
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
