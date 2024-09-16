import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export const SampleSectionMobile = () => {
  return (
    <View style={{ paddingBottom: 100 }}>
      <ProductCard />
    </View>
  );
};

const ProductCard = () => {
  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <Text style={orderStyles.headerText}>Ketone</Text>
            <Icon name="ellipsis-v"></Icon>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>CAS</Text>
              <Text style={orderStyles.orderMainText}>68845-36-3</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Quantity</Text>
              <Text style={orderStyles.orderMainText}>-</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Make</Text>
              <Text style={orderStyles.orderMainText}>Spicy</Text>
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Description</Text>
              <Text style={orderStyles.orderMainText}>
                A ketone is a compound with the structure R-C-R where R and R
                can be carbon
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const orderStyles = StyleSheet.create({
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
