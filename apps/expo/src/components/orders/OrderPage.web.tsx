import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import {
  SingleSelect,
  SingleSelectDropdown,
} from "../shared/dropdown/singleSelect";
import DownArrowIcon from "~/app/assets/images/down-arrow-icon.png";
import { Colors } from "~/constants/Color";
import { MenuItem } from "../shared/dropdown/multiSelect";
import { SearchBox } from "../shared/searchComponent";
import { Table, TableData, TableHeading, TableRow } from "../shared/table";
import { Badge } from "../core/badge";
import { useEffect, useMemo, useRef, useState } from "react";
import type { RouterOutputs } from "@repo/api";
import { api } from "~/utils/api";
import { PrimaryButton } from "../core/button";
import { LoadingState } from "../shared/displayStates/LoadingState";
import { ErrorState } from "../shared/displayStates/ErrorState";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EditIcon from "~/app/assets/images/edit-icon.svg";
import TrashIcon from "~/app/assets/images/trash-icon.svg";
import { Can } from "~/providers/auth";
import { router } from "expo-router";
import React from "react";

const windowHeight = Dimensions.get("window").height - 64;

export const OrderPage = () => {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.orders.list.useInfiniteQuery(
      {
        type: "REGULAR",
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
    <>
      <HeaderComponent />
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {isLoading ? (
          <LoadingState stateContent={"Please wait... Loading orders"} />
        ) : isError ? (
          <ErrorState
            errorMessage={"Something went wrong, please try again."}
          />
        ) : (
          <SampleTable orders={orders} />
        )}
      </ScrollView>
    </>
  );
};

const HeaderComponent = () => {
  const [searchResult, setSearchResult] = useState<string>("");
  const handleClick = () => {
    /* empty */
  };

  return (
    <View style={styles.sampleHeader}>
      <SingleSelectDropdown style={styles.dropdown}>
        <SingleSelect
          style={styles.dropdownItem}
          defaultValue="All Orders"
          onChange={handleClick}
          changeLabel={false}
          value={""}
          rightIcon={
            <Image
              source={DownArrowIcon}
              style={styles.icon}
              resizeMode="contain"
              tintColor={Colors.text}
            />
          }
        >
          <MenuItem
            value="Sample 1"
            style={styles.item}
            onPress={() => console.log("Order 1")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ ...styles.itemText, color: Colors.text }}>
                {" "}
                Sample 1
              </Text>
            </View>
          </MenuItem>
        </SingleSelect>
      </SingleSelectDropdown>
      <SearchBox
        placeholder="Search by product, Order ID"
        setValue={setSearchResult}
        value={searchResult}
      />
    </View>
  );
};

const SampleTable = ({
  orders,
}: {
  orders: RouterOutputs["orders"]["list"];
}) => {
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        height: windowHeight,
        backgroundColor: "#f9f9f9",
        width: "100%",
      }}
    >
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
            Order ID
          </TableData>
          <TableData
            style={{
              fontSize: 14,
              color: "#1E293B",
              fontWeight: 500,
              flex: 2,
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
            Status
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
            Inquiry Number
          </TableData>
          <Can I="delete" a="Order">
            <TableData
              style={{
                fontSize: 14,
                color: "#1E293B",
                fontWeight: 500,
                flex: 1 / 3,
              }}
            >
              Actions
            </TableData>
          </Can>
        </TableHeading>
        {/* random data  */}
        {orders.map((order) => (
          <OrderItem order={order} key={order.id} />
        ))}
      </Table>
    </View>
  );
};

function OrderItem({ order }: { order: RouterOutputs["orders"]["list"][0] }) {
  return (
    <TableRow style={styles.tableRow} id={"1"} key={1}>
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
        {order.id}
      </TableData>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 500,
          flex: 2,
          borderRightWidth: 1,
          borderColor: "#DCDFEA",
        }}
      >
        {order.orderItems.map((oi) => oi.product.name).join(", ")}
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
        {order.status === "DISPATCHED" && (
          <Badge
            IconName="checkcircleo"
            badgeText="Order Dispatched"
            bg="#f0f9f6"
            accentColor="#047857"
          />
        )}
        {order.status === "PLACED" && (
          <Badge
            IconName="checkcircleo"
            badgeText="Order placed"
            bg="#f1f5f9"
            accentColor="#334155"
          />
        )}
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
        {order.inquiryId}
      </TableData>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 500,
          flex: 1 / 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            flex: 1,
          }}
        >
          <Pressable
            style={{
              borderColor: "#E2E8F0",
              borderWidth: 1,
              borderRadius: 8,
              maxHeight: 32,
              padding: 8,
              shadowOffset: { height: 1, width: 0 },
              shadowOpacity: 0.05,
              shadowColor: "#101828",
            }}
            onPress={() => router.push(`/order/${order.id}`)}
          >
            <EditIcon />
          </Pressable>
          <Pressable
            style={{
              borderColor: "#E2E8F0",
              borderWidth: 1,
              borderRadius: 8,
              padding: 8,
              maxHeight: 32,
              shadowOffset: { height: 1, width: 0 },
              shadowOpacity: 0.05,
              shadowColor: "#101828",
            }}
          >
            <TrashIcon />
          </Pressable>
        </View>
      </TableData>
    </TableRow>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderColor: Colors.border,
    // borderWidth: 1,
    borderRadius: 10,
  },
  dropdownItem: { width: 200, flexDirection: "row", alignItems: "center" },
  icon: {
    width: 16,
    height: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  itemText: {
    fontFamily: "Avenir",
    fontSize: 14,
  },
  trailingIcon: {
    width: 20,
    height: 20,
    marginRight: 40,
  },
  sampleHeader: {
    width: "100%",
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    columnGap: 12,
  },
  tableContainer: {
    borderRadius: 8,
    backgroundColor: "white",
  },
  tableRow: {
    flex: 1,
  },
  tableDataFlex1: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#DCDFEA",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
  },
  tableDataFlex2: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#DCDFEA",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
  },
});
