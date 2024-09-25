import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/AntDesign";
import { QuotePanel } from "~/components/historyPanel/quotePanel";
import { BottomDrawer } from "~/components/layouts/BottomDrawerLayout";
import { SearchBox } from "~/components/shared/searchComponent";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { PrimaryButton } from "~/components/core/button";

const windowHeight = Dimensions.get("window").height - 185;

type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

type QuoteItemMap = Record<string, QuoteItem>;

export default function SendQuote() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const { quoteId } = useLocalSearchParams();
  const { data, isLoading } = api.inquiry.getDetails.useQuery(
    {
      inquiryId: quoteId as string,
    },
    {},
  );
  const [negoiatedItems, setNegotiatedItems] = useState<QuoteItemMap>({});

  const [terms, setTerms] = useState("");

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
            router.navigate(`/inquiry/${data?.inquiry.id}`);
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
  return (
    <View style={{ height: windowHeight }}>
      <SafeAreaView
        edges={["left", "right"]}
        style={styles.titleHeaderContainer}
      >
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={() => {
              router.back();
              router.push("/inquiries");
            }}
          >
            <Icon name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Send quote</Text>
          <View style={{ width: 118 }}></View>
        </View>
        <View
          style={{
            paddingHorizontal: 4,
            paddingVertical: 12,
          }}
        >
          <SearchBox
            placeholder="Search Product"
            setValue={setSearchQuery}
            value={searchQuery}
          />
        </View>
      </SafeAreaView>

      <ScrollView
        style={{
          flex: 1,
          height: "100%",
        }}
      >
        {data && (
          <QuoteDetails
            latestQuote={data.latestQuote}
            negotiatedItems={negoiatedItems}
            updateQuoteItem={handleQuoteItemUpdate}
            terms={terms}
            setTerms={setTerms}
            handleSave={handleSave}
          />
        )}
      </ScrollView>
      {/* Modal Negotiation */}
      <BottomDrawer
        openCreateForm={openCreateForm}
        setOpenCreateForm={setOpenCreateForm}
        header="Attached documents"
      >
        <Text>Bottom</Text>
      </BottomDrawer>
    </View>
  );
}

const QuoteDetails = ({
  latestQuote,
  updateQuoteItem,
  negotiatedItems,
  terms,
  setTerms,
  handleSave,
}: {
  latestQuote: RouterOutputs["inquiry"]["getDetails"]["latestQuote"];
  updateQuoteItem: (quoteItem: QuoteItem) => void;
  negotiatedItems: QuoteItemMap;
  terms: string;
  setTerms: (terms: string) => void;
  handleSave: () => void;
}) => {
  return (
    <>
      <View style={styles.quotePanel}>
        <QuotePanel
          latestQuote={latestQuote}
          updateQuoteItem={updateQuoteItem}
          negotiatedItems={negotiatedItems}
          terms={terms}
          setTerms={setTerms}
        />
        <PrimaryButton text="Submit" onPress={handleSave} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  quotePanel: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#E2E8F0",
  },
  activeTab: {
    borderColor: "#2F80F5",
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginRight: 4,
  },
  tab: {
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 12,
    marginRight: 4,
  },
  tabContentContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  extraContainers: {
    borderRadius: 8,
    backgroundColor: "white",
    marginTop: 20,
    borderWidth: 1,
    padding: 16,
    borderColor: "#DCDFEA",
  },
  ...StyleSheet.create({
    titleHeaderContainer: {
      backgroundColor: "white",
      paddingTop: 8,
      paddingHorizontal: 16,
      gap: 8,
    },
    titleHeader: {
      fontFamily: "AvenirHeavy",
      fontWeight: 800,
      fontSize: 18,
      color: "#1e293b",
    },
    titleRow: {
      flexDirection: "row",
      gap: 4,
    },
  }),
  titleHeaderContainer: {
    backgroundColor: "white",
    paddingTop: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  titleHeader: {
    fontFamily: "AvenirHeavy",
    fontWeight: 800,
    fontSize: 18,
    color: "#1e293b",
  },
  titleRow: {
    flexDirection: "row",
    gap: 4,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2E8F0",
    borderBottomWidth: 1,
    borderTopWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "white",
  },
});
