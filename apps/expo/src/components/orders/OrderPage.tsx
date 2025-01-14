import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SearchBox } from "../shared/searchComponent";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MobileTab } from "../core/mobileTab";
import { Badge } from "../core/badge";
import Icon from "react-native-vector-icons/FontAwesome5";
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { PrimaryButton } from "../core/button";
import type { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { LoadingState } from "../shared/displayStates/LoadingState";
import { ErrorState } from "../shared/displayStates/ErrorState";
import { router } from "expo-router";

export const OrderPage = ({
  type,
  inquiryId,
  showHeader = true,
}: {
  type: "REGULAR" | "SAMPLE";
  inquiryId?: string;
  showHeader?: boolean;
}) => {
  const [filter, setFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] =
    useState<RouterInputs["orders"]["list"]["status"]>(undefined);

  useEffect(() => {
    switch (filter) {
      case "All":
        setStatusFilter(undefined);
        break;
      case "Order placed":
        setStatusFilter("PLACED");
        break;
      case "Order dispatched":
        setStatusFilter("DISPATCHED");
        break;
      default:
        setStatusFilter(undefined);
        break;
    }
  }, [filter]);

  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.orders.list.useInfiniteQuery(
      {
        type,
        status: statusFilter,
        inquiryId,
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

  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

  const [searchResult, setSearchResult] = useState<string>("");

  useEffect(() => {
    if (data?.pages && data.pages?.length < 2) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [data]);

  const scrollViewRef = useRef(null);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isScrolledToBottom && hasNextPage) {
      fetchNextPage();
    }
  };
  return (
    <View style={styles.container}>
      {/* Fixed SearchBox at the top */}
      {showHeader && (
        <View style={styles.searchBoxContainer}>
          <SearchBox
            placeholder={
              type === "SAMPLE"
                ? "Search product, Sample ID"
                : "Search product, Order ID"
            }
            setValue={setSearchResult}
            value={searchResult}
          />
        </View>
      )}

      {/* Scrollable content below the fixed SearchBox */}

      {isLoading ? (
        <LoadingState stateContent={"Please wait... Loading orders"} />
      ) : isError ? (
        <ErrorState errorMessage={"Something went wrong, please try again."} />
      ) : (
        <ScrollView
          style={[
            styles.orderBodyContainer,
            showHeader && { backgroundColor: "#f9f9f9" },
          ]}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <OrderBody
            style={[showHeader && { padding: 16 }]}
            filter={filter}
            setFilter={setFilter}
            orders={orders}
            type={type}
          />

          {hasNextPage && (
            <GestureHandlerRootView
              style={{ alignItems: "center", marginVertical: 16 }}
            >
              <PrimaryButton
                style={{ maxWidth: 100 }}
                onPress={() => fetchNextPage()}
                text="Load more"
              />
            </GestureHandlerRootView>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const OrderBody = ({
  filter,
  setFilter,
  orders,
  style,
  type,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  orders: RouterOutputs["orders"]["list"];
  style?: ViewProps["style"];
  type: string;
}) => {
  return (
    <View style={[styles.orderBodyContent, style]}>
      <GestureHandlerRootView style={styles.container}>
        {/* tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Hide the scroll indicator
          contentContainerStyle={styles.filterTabsContainer}
        >
          <View style={styles.filterTabsContainer}>
            <MobileTab
              activeFilter={filter === "All" ? true : false}
              setFilter={setFilter}
              currentFilter="All"
            />
            <MobileTab
              activeFilter={filter === "Order placed" ? true : false}
              setFilter={setFilter}
              currentFilter="Order placed"
            />
            <MobileTab
              activeFilter={filter === "Order dispatched" ? true : false}
              setFilter={setFilter}
              currentFilter="Order dispatched"
            />
          </View>
        </ScrollView>

        {/* orders */}

        {orders.map((order, index) => (
          <OrderCard key={order.id} order={order} type={type} />
        ))}
      </GestureHandlerRootView>
    </View>
  );
};

function OrderCard({
  order,
  type,
}: {
  order: RouterOutputs["orders"]["list"][0];
  type: string;
}) {
  return (
    <View style={orderStyles.orderCard}>
      <View style={orderStyles.innerSection}>
        {order.status === "DISPATCHED" && (
          <Badge
            IconName="checkcircleo"
            badgeText={
              type === "Sample" ? "Sample Dispatched" : "Order Dispatched"
            }
            bg="#f0f9f6"
            accentColor="#047857"
          />
        )}
        {order.status === "PLACED" && (
          <Badge
            IconName="checkcircleo"
            badgeText={type === "Sample" ? "Sample placed" : "Order placed"}
            bg="#f1f5f9"
            accentColor="#334155"
          />
        )}
      </View>
      <View style={orderStyles.innerSection}>
        <Text style={orderStyles.headerText}>
          {order.orderItems.map((oi) => oi.product.name).join(", ")}
        </Text>
      </View>
      {type === "SAMPLE" ? (
        <Pressable
          style={orderStyles.innerSectionFlexStart}
          onPress={() => router.push(`/sample/${order.id}`)}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={orderStyles.orderHeader}>Order ID</Text>
            <Text style={orderStyles.orderMainText}>{order.id}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={orderStyles.orderHeader}>Inquiry Number</Text>
            <Text style={orderStyles.orderMainText}>{order.inquiryId}</Text>
          </View>
        </Pressable>
      ) : (
        <Pressable
          style={orderStyles.innerSectionFlexStart}
          onPress={() => router.push(`/order/${order.id}`)}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={orderStyles.orderHeader}>Order ID</Text>
            <Text style={orderStyles.orderMainText}>{order.id}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={orderStyles.orderHeader}>Inquiry Number</Text>
            <Text style={orderStyles.orderMainText}>{order.inquiryId}</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}

export const orderStyles = StyleSheet.create({
  orderCard: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  orderBodyContainer: {
    flex: 1,
  },
  orderBodyContent: {},
  filterTabsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 16,
  },
});
