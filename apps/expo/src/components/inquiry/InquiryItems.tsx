import { StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";

export const InquirySamples = ({
  items,
  type,
}: {
  items: [
    {
      createdAt: string;
      prevPrice: number;
      prevQuantity: number;
      productId: string;
      price: number;
      quantity: number;
      sampleRequested: boolean;
      technicalDocumentRequested: boolean;
      quoteId: string;
      unit: string;
      updatedAt: string;
    },
  ];
  type: "SAMPLE" | "ORDERS";
}) => {
  return (
    <View
      style={{
        paddingVertical: 0,
        paddingHorizontal: 0,
      }}
    >
      {items?.length ? (
        items?.map((product) => (
          <ProductItem productInfo={product} type={type} />
        ))
      ) : (
        <Text>No items yet</Text>
      )}
    </View>
  );
};

const ProductItem = ({
  productInfo,
  type,
}: {
  productInfo: {
    createdAt: string;
    prevPrice: number;
    prevQuantity: number;
    productId: string;
    price: number;
    quantity: number;
    sampleRequested: boolean;
    technicalDocumentRequested: boolean;
    quoteId: string;
    unit: string;
    updatedAt: string;
  };
  type: "SAMPLE" | "ORDERS";
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
    <View style={orderStyles.orderCard}>
      <View style={orderStyles.innerSection}>
        <Text style={orderStyles.headerText}>{productName}</Text>
      </View>
      <View style={orderStyles.innerSectionFlexStart}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={orderStyles.orderHeader}>Product Id</Text>
          <Text style={orderStyles.orderMainText}>{productInfo.productId}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={orderStyles.orderHeader}>Last Updated</Text>
          <Text style={orderStyles.orderMainText}>
            {new Date(productInfo.updatedAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
            })}
          </Text>
        </View>
      </View>
      {
        type==="ORDERS" &&
      <View style={orderStyles.innerSectionFlexStart}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={orderStyles.orderHeader}>Price</Text>
          <Text style={orderStyles.orderMainText}>{productInfo.price}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={orderStyles.orderHeader}>Quantity</Text>
          <Text style={orderStyles.orderMainText}>
            {productInfo.quantity} {productInfo.unit}
          </Text>
        </View>
      </View>
      }
    </View>
  );
};

const orderStyles = StyleSheet.create({
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
