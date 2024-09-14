import { StyleSheet, View, Image, Dimensions, Text } from "react-native";
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
import { useMemo, useState } from "react";
import type { RouterOutputs } from "@repo/api";
import { api } from "~/utils/api";
import { PrimaryButton } from "../core/button";

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
  return (
    <>
      <HeaderComponent />
      <SampleTable orders={orders} />
      {hasNextPage && (
        <PrimaryButton onPress={() => fetchNextPage} text="Load more" />
      )}
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
      ></TableData>
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
