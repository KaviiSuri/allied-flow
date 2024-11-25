import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/AntDesign";
import { DetailsSectionMobile } from "~/components/inquiryDetails/mobile/Details";
import { orderStyles } from "~/components/inquiryDetails/mobile/Order";
import { BottomDrawer } from "~/components/layouts/BottomDrawerLayout";
import { OrderPage } from "~/components/order/OrderPage";
import { BadgeStatus } from "~/components/shared/badge";
import { FormTextInput } from "~/components/shared/form";
import { SearchBox } from "~/components/shared/searchComponent";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

type QuoteItemMap = Record<string, QuoteItem>;

export default function InquiriesDetails() {
  const { inquiryNumber } = useLocalSearchParams();
  const { data, isLoading, isError } = api.inquiry.getDetails.useQuery(
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

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeNestedTab, setActiveNestedTab] = useState("Details");
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [remark, setRemark] = useState<string>("");

  const [negoiatedItems, setNegotiatedItems] = useState<QuoteItemMap>({});

  useEffect(() => {
    setNegotiatedItems({});
  }, [inquiryNumber]);

  const handleQuoteItemUpdate = (quoteItem: QuoteItem) => {
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
    setOpenCreateForm(false);
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
    setOpenCreateForm(false);
    rejectInquiry({ inquiryId: data.inquiry.id, quoteId: data.latestQuote.id });
  };

  const renderNestedScreen = () => {
    if (isLoading || !data) {
      return <Text>Loading...</Text>;
    }
    switch (activeNestedTab) {
      case "Details":
        return (
          <DetailsSectionMobile
            quote={data.latestQuote}
            remarks={data.inquiry.remarks ?? ""}
          />
        );
      case "Sample":
        return (
          <OrderPage
            showHeader={false}
            type="SAMPLE"
            inquiryId={inquiryNumber as string}
          />
        );
      case "Order":
        return (
          <OrderPage
            showHeader={false}
            type="REGULAR"
            inquiryId={inquiryNumber as string}
          />
        );
      default:
        return (
          <DetailsSectionMobile
            quote={data.latestQuote}
            remarks={data.inquiry.remarks ?? ""}
          />
        );
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
              router.push("/inquiries");
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
            <BadgeStatus
              status={data?.inquiry.status ? data.inquiry.status : "RAISED"}
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
        <TouchableOpacity
          style={[
            bottomStyles.primaryButton,
            isFinalized && {
              backgroundColor: "lightgrey",
              borderColor: "lightgrey",
            },
          ]}
          onPress={handleOrder}
          disabled={isFinalized}
        >
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
        <>
          {data?.latestQuote?.quoteItems.map((quoteItem) => (
            <ProductsCard
              key={quoteItem.productId}
              quoteItem={quoteItem}
              updateQuoteItem={handleQuoteItemUpdate}
              negotiatedItem={negoiatedItems[quoteItem.productId]}
            />
          ))}
        </>

        <RemarksForm remark={remark} setRemark={setRemark} />
      </BottomDrawer>
    </View>
  );
}

export const RemarksForm = ({
  remark,
  setRemark,
}: {
  remark: string;
  setRemark: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View
      style={{
        marginBottom: 100,
      }}
    >
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
export const ProductsCard = ({
  quoteItem,
  updateQuoteItem,
  negotiatedItem,
}: {
  quoteItem: QuoteItem;
  negotiatedItem?: QuoteItem;
  updateQuoteItem: (quoteItem: QuoteItem) => void;
}) => {
  const { data: productList, isLoading } = api.products.read.useQuery();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  const product = productList?.find(
    (product) => product.id === quoteItem.productId,
  );
  if (!product) {
    return null;
  }
  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <Text style={orderStyles.headerText}>{product.name}</Text>
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
              <Text style={orderStyles.orderMainText}>{product.cas}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Quantity</Text>
              <Text style={orderStyles.orderMainText}>
                {quoteItem.quantity}
              </Text>
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
                value={
                  negotiatedItem?.price ? negotiatedItem.price.toString() : ""
                }
                onChangeText={(value) => {
                  const newPrice = parseFloat(value);
                  console.log("newPrice", newPrice);
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
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <FormTextInput
                placeholder="Enter target  quantity"
                label="Target Quatity (Per Unit)"
                value={
                  negotiatedItem?.quantity
                    ? negotiatedItem.quantity.toString()
                    : ""
                }
                onChangeText={(value) => {
                  const newQuantity = parseFloat(value);
                  if (isNaN(newQuantity)) {
                    return;
                  }
                  updateQuoteItem({
                    ...quoteItem,
                    ...negotiatedItem,
                    quantity: newQuantity,
                  });
                }}
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
