import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { api } from "~/utils/api";


export default function OrderDetails() {
  const { orderId } = useLocalSearchParams();
  const { data, isError, isLoading } = api.orders.read.useQuery(
    {
      id: orderId as string,
    },
    {},
  );

  const {mutateAsync: updateOrder} = api.orders.update.useMutation({
    onSuccess: () => {
      console.log("Order updated successfully");
    },
  })

  const handleUpdateOrder = (orderStatus: string) => {
    updateOrder({
      id: orderId as string,
      status: orderStatus as "PLACED" | "DISPATCHED" | "DELIVERED" | "REJECTED",
    }).catch(console.error);
  }

  useEffect(() => {
    console.log("orderId",data,orderId);
  }, [orderId,data]);
  const order = useMemo(() => {
    return data;
  }, [data]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (isError || !order) {
    return <Text style={styles.errorText}>Error loading order details</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{order.id}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{order.status}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>
          {new Date(order.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.subtitle}>Order Items:</Text>
      {/* {order.orderItems.map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.itemText}>
            {index + 1}. {item.product.name}
          </Text>
          <Text style={styles.itemText}>
            Quantity: {item.quantity} {item.unit}
          </Text>
          <Text style={styles.itemText}>Price: Rs. {item.price}</Text>
        </View>
      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
