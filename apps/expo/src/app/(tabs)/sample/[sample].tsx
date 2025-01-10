import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { BadgeStatus } from "~/components/shared/badge";
import {
  Table,
  TableData,
  TableHeading,
  TableRow,
} from "~/components/shared/table";
import { Can } from "~/providers/auth";
import { api } from "~/utils/api";

const windowHeight = Dimensions.get("window").height - 64;
export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const {
    data: OrderData,
    isError,
    isLoading,
  } = api.orders.read.useQuery(
    {
      id: orderId as string,
    },
    {},
  );

  const { mutateAsync: updateOrder } = api.orders.update.useMutation({
    onSuccess: () => {
      console.log("Order updated successfully");
    },
  });

  const handleUpdateOrder = (orderStatus: string) => {
    updateOrder({
      id: orderId as string,
      status: orderStatus as "PLACED" | "DISPATCHED" | "DELIVERED" | "REJECTED",
    }).catch(console.error);
  };

  useEffect(() => {
    console.log("OrderData", OrderData);
  }, [OrderData]);
  const order = useMemo(() => {
    return OrderData;
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (isError || !order) {
    return <Text style={styles.errorText}>Error loading sample details</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerComponent}>
        <View style={{ display: "flex", flexDirection: "row", flex: 1 }}>
          <Text style={styles.titleSecondary}>Samples /</Text>
          {order && (
            <Text style={styles.titlePrimary}>Sample Number #{order.id}</Text>
          )}
          <View style={{ marginLeft: 4 }}>
            {order && <BadgeStatus status={order.status} />}
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          {order.status !== "DISPATCHED" && (
            <OrderActionButton
              btnText="Dispatched"
              bgColor="#EFEBFE"
              accentColor="#21134E"
              onPress={() => handleUpdateOrder("DISPATCHED")}
              isLoading={isError || isLoading}
            />
          )}

          {order.status !== "DELIVERED" && (
            <OrderActionButton
              btnText="Delivered"
              bgColor="#F0F9F6"
              accentColor="#047857"
              onPress={() => handleUpdateOrder("DELIVERED")}
              isLoading={isError || isLoading}
            />
          )}

          {order.status !== "REJECTED" && (
            <OrderActionButton
              btnText="Reject Sample"
              bgColor="#FAF1F2"
              accentColor="#B91C1C"
              isLoading={isError || isLoading}
              onPress={() => handleUpdateOrder("REJECTED")}
            />
          )}
        </View>
      </View>
      <View style={orderStyles.viewContainer}>
        <Table
          style={{
            borderRadius: 8,
            backgroundColor: "white",
          }}
        >
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
              Product ID
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
              Price
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
                Last updated
              </TableData>
            </Can>
          </TableHeading>
          {/* random data  */}
          {order.orderItems.map((product) => (
            <ProductItem productInfo={product} />
          ))}
        </Table>
      </View>
    </ScrollView>
  );
}
const orderStyles = StyleSheet.create({
  viewContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    width: "100%",
  },
});

const ProductItem = ({
  productInfo,
}: {
  productInfo: {
    createdAt: string;
    updatedAt: string;
    productId: string;
    price: number;
    quantity: number;
    unit: string;
    orderId: string;
  };
}) => {
  const [productName, setProductName] = useState("");
  const {
    data: productData,
    isLoading,
    isError,
  } = api.products.read.useQuery();
  const productList = useMemo(() => {
    return productData;
  }, [productData]);
  useEffect(() => {
    const curr_product = productList?.find(
      (product) => product.id === productInfo.productId,
    );
    if (curr_product) setProductName(curr_product?.name);
  }, [productList]);
  return (
    <TableRow
      style={{ flex: 1 }}
      id={productInfo.productId}
      key={productInfo.productId}
    >
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
        {productInfo.productId}
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
        {productName}
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
        {productInfo.quantity} {productInfo.unit}
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
        {productInfo.price}
      </TableData>
      <TableData
        style={{
          fontSize: 14,
          color: "#1E293B",
          fontWeight: 500,
          flex: 1 / 3,
        }}
      >
        {new Date(productInfo.updatedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
        })}
      </TableData>
    </TableRow>
  );
};

const OrderActionButton = ({
  bgColor,
  btnText,
  accentColor,
  onPress,
  isLoading,
}: {
  bgColor: string;
  btnText: string;
  accentColor: string;
  onPress: () => void;
  isLoading: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          borderColor: accentColor,
          borderWidth: 1,
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.05,
          shadowColor: "#101828",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor,
          cursor: "pointer",
        },
      ]}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text
        style={{
          fontWeight: 600,
          fontSize: 14,
          fontFamily: "Avenir",
          color: accentColor,
        }}
      >
        {btnText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    height: windowHeight,
  },
  headerComponent: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleSecondary: {
    fontFamily: "Avenir",
    color: "#64748B",
    fontSize: 14,
    fontWeight: 500,
  },
  titlePrimary: {
    fontFamily: "Avenir",
    color: "#1E293B",
    fontSize: 14,
    fontWeight: 500,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
  },
  value: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  itemText: {
    marginBottom: 4,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
