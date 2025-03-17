import type { RouterOutputs } from "@repo/api";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useProductById } from "~/hooks/useProductById";
import { downloadFile } from "~/utils/files";
import { SecondaryButton } from "~/components/core/button";

export const DetailsSectionMobile = ({
  quote,
  remarks,
}: {
  quote: RouterOutputs["inquiry"]["getDetails"]["latestQuote"];
  remarks: string;
}) => {
  return (
    <View style={{ paddingBottom: 100 }}>
      {quote?.quoteItems.map((quoteItem) => (
        <ProductCard key={quoteItem.productId} quoteItem={quoteItem} />
      ))}
      <RemarksCard remarks={remarks} />
    </View>
  );
};

const RemarksCard = ({ remarks }: { remarks: string }) => {
  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Your Remarks</Text>
              <Text style={orderStyles.orderMainText}>{remarks}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const ProductCard = ({
  quoteItem,
}: {
  quoteItem: NonNullable<
    RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
  >["quoteItems"][0];
}) => {
  const { isLoading, product } = useProductById(quoteItem.productId);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (!product) {
    return null;
  }

  function handleDownload() {
    if (!product || !quoteItem.techDocumentUrl) {
      return;
    }
    downloadFile(quoteItem.techDocumentUrl, `${product.name}.${quoteItem.techDocumentName}`);
  }
  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <Text style={orderStyles.headerText}>{product.name}</Text>
            <Icon name="ellipsis-v"></Icon>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>CAS</Text>
              <Text style={orderStyles.orderMainText}>{product.cas}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Price</Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={orderStyles.orderMainText}>{quoteItem.price}</Text>
                {quoteItem.prevPrice &&
                quoteItem.prevPrice !== quoteItem.price ? (
                  <Text style={{ textDecorationLine: "line-through" }}>
                    {quoteItem.prevPrice}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Quantity</Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                <Text style={orderStyles.orderMainText}>
                  {quoteItem.quantity}
                </Text>
                {quoteItem.prevQuantity &&
                quoteItem.prevQuantity !== quoteItem.quantity ? (
                  <Text style={{ textDecorationLine: "line-through" }}>
                    {quoteItem.prevQuantity}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Make</Text>
              <Text style={orderStyles.orderMainText}>{product.make}</Text>
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Description</Text>
              <Text style={orderStyles.orderMainText}>{product.desc}</Text>
            </View>
          </View>
          {quoteItem.techDocumentUrl && (
            <View style={orderStyles.innerSectionFlexStart}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Tech Docs</Text>
                <SecondaryButton
                  text={"Download"}
                  onPress={handleDownload}
                  disabled={!quoteItem.techDocumentUrl}
                />
              </View>
            </View>
          )}
        </View>
      </View>
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
