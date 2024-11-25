import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { HistoryPanelTable } from "~/components/historyPanel";
import { QuotePanel } from "~/components/historyPanel/quotePanel";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

type QuoteItemMap = Record<string, QuoteItem>;
const windowHeight = Dimensions.get("window").height - 64;
export default () => {
  const { quoteId } = useLocalSearchParams();
  const { data, isLoading } = api.inquiry.getDetails.useQuery(
    {
      inquiryId: quoteId as string,
    },
    {},
  );
  const [terms, setTerms] = useState("");
  const [negoiatedItems, setNegotiatedItems] = useState<QuoteItemMap>({});
  const [showHistory, setShowHistory] = useState(false);

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
            router.push(`../../inquiry/${data?.inquiry.id}`);
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

  const screenHeight = Dimensions.get("window").height;
  return (
    <View style={[styles.pageContainer, { minHeight: screenHeight }]}>
      {/* quote details */}
      {data && (
        <QuoteDetails
          latestQuote={data.latestQuote}
          inquiryDetails={data.inquiry}
          updateQuoteItem={handleQuoteItemUpdate}
          negotiatedItems={negoiatedItems}
          terms={terms}
          setTerms={setTerms}
          handleSave={handleSave}
          handleOrdrHistory={() => {
            setShowHistory(true);
          }}
        />
      )}
      {/* order history */}
      {showHistory && (
        <OrderHistory
          handleOrdrHistory={() => {
            setShowHistory(false);
          }}
        />
      )}
    </View>
  );
};

const QuoteDetails = ({
  latestQuote,
  inquiryDetails,
  updateQuoteItem,
  negotiatedItems,
  terms,
  setTerms,
  handleSave,
  handleOrdrHistory,
}: {
  latestQuote: RouterOutputs["inquiry"]["getDetails"]["latestQuote"];
  inquiryDetails: RouterOutputs["inquiry"]["getDetails"]["inquiry"];
  updateQuoteItem: (quoteItem: QuoteItem) => void;
  negotiatedItems: QuoteItemMap;
  terms: string;
  setTerms: (terms: string) => void;
  handleSave: () => void;
  handleOrdrHistory: () => void;
}) => {
  useEffect(() => {
    console.log(latestQuote, inquiryDetails);
  }, [latestQuote, inquiryDetails]);

  const { data: clientList } = api.teams.readTeams.useQuery({
    type: "CLIENT",
  });
  const clientName = useMemo(() => {
    const clientDetails = clientList?.find(
      (client) => client.id === inquiryDetails.buyerId,
    );
    if (clientDetails) {
      return clientDetails.name;
    }
    return "";
  }, [clientList, inquiryDetails.buyerId]);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.leftHeader]}>
        <View style={{ flexDirection: "row" }}>
          <MaterialCommunityIcons name="office-building" size={24} />
          <Text style={styles.header}>{clientName}</Text>
          <Text
            style={{
              fontFamily: "Avenir",
              fontSize: 16,
              marginLeft: 8,
              color: "#94a3b8",
            }}
          >
            #{inquiryDetails.buyerId}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <SecondaryButton text="Order History" onPress={handleOrdrHistory} />
          <PrimaryButton text="Send Quote" onPress={handleSave} />
        </View>
      </View>
      <ScrollView style={styles.quotePanel}>
        <QuotePanel
          latestQuote={latestQuote}
          negotiatedItems={negotiatedItems}
          terms={terms}
          setTerms={setTerms}
          updateQuoteItem={updateQuoteItem}
        />
      </ScrollView>
    </View>
  );
};

const OrderHistory = ({
  handleOrdrHistory,
}: {
  handleOrdrHistory: () => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.rightHeader]}>
        <Text style={styles.header}>OrderHistory</Text>
        <TouchableOpacity onPress={handleOrdrHistory}>
          <MaterialCommunityIcons name="close" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.historyPanel}>
        <View></View>
        <View>
          <HistoryPanelTable />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    height: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontFamily: "Avenir",
    fontSize: 16,
  },
  leftHeader: {
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  rightHeader: {
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  historyPanel: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",
  },
  quotePanel: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",
    height: windowHeight,
    paddingBottom: 200,
  },
});
