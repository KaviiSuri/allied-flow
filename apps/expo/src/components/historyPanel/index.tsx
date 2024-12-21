import { StyleSheet } from "react-native";
import { Table, TableData, TableHeading, TableRow } from "../shared/table";
import { api } from "~/utils/api";
import { useMemo, useState } from "react";

export const HistoryPanelTable = ({
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
          Company name
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
          Product name
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
          Unit Price
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
          Date
        </TableData>
      </TableHeading>
      {fetchedItems.map(({ order, orderItem }) => (
        <TableRow style={styles.tableRow} id={"1"} key={1}>
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
            {order.buyer.name}
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
            {orderItem.product.name}
          </TableData>
          <TableData
            style={{
              fontSize: 14,
              color: "#1E293B",
              fontWeight: 400,
              flex: 2,
              borderRightWidth: 1,
              borderColor: "#DCDFEA",
            }}
          >
            Rs. {orderItem.price}
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
            {orderItem.quantity} {orderItem.unit}
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
            {new Date(order.createdAt).toLocaleDateString()}
          </TableData>
        </TableRow>
      ))}
    </Table>
  );
};

const styles = StyleSheet.create({
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
