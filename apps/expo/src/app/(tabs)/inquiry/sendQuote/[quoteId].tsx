import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import { QuotePanel } from "~/components/historyPanel/quotePanel";
import {
  BottomDrawer,
  createStyles,
} from "~/components/layouts/BottomDrawerLayout";
import { SearchBox } from "~/components/shared/searchComponent";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { PrimaryButton } from "~/components/core/button";
import { MobileDrawerModal } from "~/components/layouts/MobileModal";
import { BadgeStatus } from "~/components/shared/badge";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

type QuoteItemMap = Record<string, QuoteItem>;

export default function SendQuote() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const { quoteId } = useLocalSearchParams();
  const { data, isLoading } = api.inquiry.getDetails.useQuery(
    {
      inquiryId: quoteId as string,
    },
    {},
  );
  const [negoiatedItems, setNegotiatedItems] = useState<QuoteItemMap>({});

  const [terms, setTerms] = useState("");

  useEffect(() => {
    if (!data?.latestQuote) {
      return;
    }

    const negotiatedItems: QuoteItemMap = {};
    data.latestQuote.quoteItems.forEach((quoteItem) => {
      negotiatedItems[quoteItem.productId] = quoteItem;
    });

    setNegotiatedItems(negotiatedItems);
  }, [data]);

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
          .invalidate({ inquiryId: quoteId as string })
          .then(() => {
            Toast.show({
              type: "success",
              text1: "Negotiation successful",
            });
            router.push(`/inquiry/${data?.inquiry.id}`);
          })
          .catch();
      },
    });
  const handleSave = () => {
    if (isPending || !data) {
      return;
    }
    negotiate({
      inquiryId: data.inquiry.id,
      items: Object.values(negoiatedItems),
      tnc: terms,
    }).catch(() => {
      Toast.show({
        type: "error",
        text1: "Negotiation failed",
      });
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleHeaderContainer}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={() => {
              router.back();
              router.push("/inquiries");
            }}
          >
            <Icon name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Send quote</Text>
          <View style={{ width: 118 }}></View>
        </View>
        <View style={styles.searchContainer}>
          <SearchBox
            placeholder="Search Product"
            setValue={setSearchQuery}
            value={searchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {data && (
          <QuoteDetails
            latestQuote={data.latestQuote}
            negotiatedItems={negoiatedItems}
            updateQuoteItem={handleQuoteItemUpdate}
            terms={terms}
            setTerms={setTerms}
            handleSave={handleSave}
          />
        )}
      </ScrollView>

      <View style={styles.createButtonContainer}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              setShowDrawer(true);
            }}
          >
            <Text style={styles.createButtonText}>+</Text>
          </TouchableOpacity>
        </GestureHandlerRootView>
      </View>

      <MobileDrawerModal
        isVisible={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Order History"
      >
        <View style={styles.drawerContent}>
          {data ? (
            <OrderHistory
              buyerId={data.inquiry.buyerId}
              productIds={Object.keys(negoiatedItems)}
            />
          ) : (
            <Text style={styles.emptyText}>No order history available</Text>
          )}
        </View>
      </MobileDrawerModal>

      <BottomDrawer
        openCreateForm={openCreateForm}
        setOpenCreateForm={setOpenCreateForm}
        header="Attached documents"
      >
        <Text>Bottom Drawer Content</Text>
      </BottomDrawer>
    </SafeAreaView>
  );
}

const QuoteDetails = ({
  latestQuote,
  updateQuoteItem,
  negotiatedItems,
  terms,
  setTerms,
  handleSave,
}: {
  latestQuote: RouterOutputs["inquiry"]["getDetails"]["latestQuote"];
  updateQuoteItem: (quoteItem: QuoteItem) => void;
  negotiatedItems: QuoteItemMap;
  terms: string;
  setTerms: (terms: string) => void;
  handleSave: () => void;
}) => {
  return (
    <View style={styles.quotePanel}>
      <QuotePanel
        latestQuote={latestQuote}
        updateQuoteItem={updateQuoteItem}
        negotiatedItems={negotiatedItems}
        terms={terms}
        setTerms={setTerms}
      />
      <PrimaryButton text="Send Quote" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },

  searchContainer: {
    paddingHorizontal: 4,
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: windowHeight - 120, // Adjust this value based on your header height
    paddingBottom: 80, // Add some bottom padding for the create button
  },
  createButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2F80F5",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 32,
    color: "white",
  },
  quotePanel: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    gap: 16,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",
  },
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
  drawerContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

const OrderHistory = ({
  buyerId,
  productIds,
}: {
  buyerId: string;
  productIds: string[];
}) => {
  const [filter, setFilter] = useState<"SAME_CUSTOMER" | "SAME_PRODUCTS">(
    "SAME_CUSTOMER",
  );

  return (
    <View style={orderHistoryStyles.historyPanel}>
      <View style={orderHistoryStyles.filterContainer}>
        <TouchableOpacity
          style={[
            orderHistoryStyles.filterButton,
            filter === "SAME_CUSTOMER" && orderHistoryStyles.activeFilterButton,
          ]}
          onPress={() => setFilter("SAME_CUSTOMER")}
        >
          <Text style={[orderHistoryStyles.filterButtonText, 
          filter === "SAME_CUSTOMER" && {color: "#2F80F5"},
          ]}>Client Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            orderHistoryStyles.filterButton,
            filter === "SAME_PRODUCTS" && orderHistoryStyles.activeFilterButton,
          ]}
          onPress={() => setFilter("SAME_PRODUCTS")}
        >
          <Text style={[orderHistoryStyles.filterButtonText,
          filter === "SAME_PRODUCTS" && {color: "#2F80F5"},
          ]}>Past prices</Text>
        </TouchableOpacity>
      </View>
      <OrderHistoryCards
        buyerId={buyerId}
        productIds={productIds}
        filter={filter}
      />
    </View>
  );
};

const OrderHistoryCards = ({
  buyerId,
  productIds,
  filter,
}: {
  buyerId: string;
  productIds: string[];
  filter: "SAME_CUSTOMER" | "SAME_PRODUCTS";
}) => {
  const { data, isLoading, isError } = api.orders.list.useInfiniteQuery(
    {
      type: "REGULAR",
      ...(filter === "SAME_CUSTOMER" && { buyerId }),
      ...(filter === "SAME_PRODUCTS" && { productIds }),
    },
    {
      getNextPageParam: (lastPage) => {
        const lastEntry = lastPage[lastPage.length - 1];
        if (!lastEntry) {
          return null;
        }
        return lastEntry.createdAt;
      },
    },
  );

  const fetchedItems = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.flatMap((order) =>
          order.orderItems.map((orderItem) => ({ order, orderItem })),
        ),
      ) ?? [],
    [data],
  );

  if (isLoading || isError) return null;
  if (!data) return null;

  return (
    <View>
      {fetchedItems.map(({ order, orderItem }) => (
        <View key={order.id}>
          <View style={orderStyles.orderCardContainer}>
            <View style={orderStyles.orderCard}>
              <View style={orderStyles.innerSection}>
                <Text style={orderStyles.headerText}>{order.buyer.name}</Text>
              </View>
              <View style={orderStyles.innerSectionFlexStart}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={orderStyles.orderHeader}>Product name</Text>
                  <Text style={orderStyles.orderMainText}>
                    {orderItem.product.name}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={orderStyles.orderHeader}>Unit Price</Text>
                  <Text style={orderStyles.orderMainText}>
                    Rs. {orderItem.price}
                  </Text>
                </View>
              </View>
              <View style={orderStyles.innerSectionFlexStart}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={orderStyles.orderHeader}>Quatity</Text>
                  <Text style={orderStyles.orderMainText}>
                    {orderItem.quantity} {orderItem.unit}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={orderStyles.orderHeader}>Date</Text>
                  <Text style={orderStyles.orderMainText}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const orderStyles = StyleSheet.create({
  orderCardContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "white",
    marginBottom: 12,
  },
  orderCard: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
    marginBottom: 12,
  },
  innerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerSectionFlexStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 4,
  },
  headerText: {
    color: "#1e293b",
    fontFamily: "AvenirHeavy",
    fontSize: 16,
    fontWeight: 800,
  },
  orderHeader: {
    fontSize: 14,
    fontFamily: "AvenirHeavy",
    color: "#94a3bb",
    fontWeight: 500,
  },
  orderMainText: {
    fontSize: 14,
    fontFamily: "AvenirHeavy",
    color: "#334155",
    fontWeight: 500,
  },
  actionContainer: {
    borderTopWidth: 1,
    backgroundColor:
      "linear-gradient(180deg, rgba(241, 245, 249, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)",
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

const orderHistoryStyles = StyleSheet.create({
  historyPanel: {
    flex: 1,
    padding: 4,
    width: "100%",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeFilterButton: {
    borderBottomColor: "#2F80F5",
    borderBottomWidth: 2,
  },
  filterButtonText: {
    fontFamily: "Avenir",
    fontSize: 14,
    color: "#475569",
  },
  clientId: {
    fontFamily: "Avenir",
    fontSize: 16,
    marginLeft: 8,
    color: "#94a3b8",
  },
});
