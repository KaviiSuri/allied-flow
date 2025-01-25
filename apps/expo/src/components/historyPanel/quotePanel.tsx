import { StyleSheet, Text, TextInput, View } from "react-native";
import { Badge } from "../core/badge";
import type { RouterOutputs } from "@repo/api";
import { api } from "~/utils/api";
import FilePicker from "../shared/filePicker";
import Toast from "react-native-toast-message";
import { useUser } from "~/providers/auth";

type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

export const QuotePanel = ({
  latestQuote,
  updateQuoteItem,
  negotiatedItems,
  terms,
  setTerms,
}: {
  latestQuote: RouterOutputs["inquiry"]["getDetails"]["latestQuote"];
  updateQuoteItem: (quoteItem: QuoteItem) => void;
  negotiatedItems: Record<string, QuoteItem>;
  terms: string;
  setTerms: (terms: string) => void;
}) => {
  return (
    <View
      style={{
        width: "100%",
        maxWidth: 600,
        alignSelf: "center",
      }}
    >
      {/* map this */}
      {latestQuote?.quoteItems.map((quoteItem) => (
        <QuoteTableList
          quoteItem={quoteItem}
          negotiationItem={negotiatedItems[quoteItem.productId]}
          updateQuoteItem={updateQuoteItem}
        />
      ))}

      {/* static for tandC remarks */}
      <View style={styles.quoteCard}>
        <Text style={styles.termsText}>Terms &amp; Conditions</Text>
        <TextInput
          style={styles.termsInput}
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setTerms(text)}
          value={terms}
          placeholder="Enter remark here..."
        />
      </View>
    </View>
  );
};

const QuoteTableList = ({
  quoteItem,
  updateQuoteItem,
  negotiationItem,
}: {
  quoteItem: QuoteItem;
  updateQuoteItem: (quoteItem: QuoteItem) => void;
  negotiationItem?: QuoteItem;
}) => {
  const { data: productList, isLoading } = api.products.read.useQuery();
  const { user } = useUser();
  if (isLoading || !user) {
    return <Text>Loading...</Text>;
  }

  const product = productList?.find(
    (product) => product.id === quoteItem.productId,
  );
  if (!product) {
    return null;
  }

  return (
    <View
      key={quoteItem.productId}
      style={[styles.quoteCard, { marginBottom: 16 }]}
    >
      <View style={styles.quoteCardHeader}>
        <Text style={styles.quoteCardHeaderText}>{product.name}</Text>
        {quoteItem.sampleRequested && (
          <Badge
            IconName={"checkcircleo"}
            bg={"#FDF3EA"}
            accentColor={"#6B4323"}
            badgeText="Sample requested"
          />
        )}
      </View>

      <View style={styles.quoteCardInfo}>
        <View style={styles.quoteCardInfoTextContainer}>
          <Text style={styles.quoteCardInfoHeaderText}>CAS</Text>
          <Text style={styles.quoteCardInfoText}>{product.cas}</Text>
        </View>
        <View style={styles.quoteCardInfoTextContainer}>
          <Text style={styles.quoteCardInfoHeaderText}>Quantity</Text>
          <Text style={styles.quoteCardInfoText}>
            {quoteItem.quantity} {quoteItem.unit}
          </Text>
        </View>
        <View style={styles.quoteCardInfoTextContainer}>
          <Text style={styles.quoteCardInfoHeaderText}>Make</Text>
          <Text style={styles.quoteCardInfoText}>{product.make}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <FilePicker 
          onUploadComplete={({ downloadUrl, storagePath, name }) => {
            updateQuoteItem({
              ...quoteItem,
              ...negotiationItem,
              techDocumentName: name,
              techDocumentUrl: downloadUrl,
              techDocumentStoragePath: storagePath,
              techDocumentUploadedAt: new Date().toISOString(),
              techDocumentUploadedBy: user.id,
            });
          }}
          onUploadError={() => {
            Toast.show({
              type: "error",
              text1: "Error uploading file",
              text2: "Please try again",
            });
          }}
          folderName="technical-documents"
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter quote here"
          style={styles.inputForm}
          value={negotiationItem?.price ? negotiationItem.price.toString() : ""}
          keyboardType="numeric"
          onChangeText={(value) => {
            const newPrice = parseFloat(value);
            if (isNaN(newPrice)) {
              return;
            }
            updateQuoteItem({
              ...quoteItem,
              ...negotiationItem,
              price: newPrice,
            });
          }}
        />
        <Text>/{quoteItem.unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    width: "100%",
    padding: 16,
    rowGap: 12,
  },
  quoteCardHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  quoteCardHeaderText: {
    fontWeight: 800,
    fontFamily: "Avenir",
    fontSize: 18,
  },
  termsInput: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: "#D0D5DD",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  termsText: {
    color: "#344054",
    fontFamily: "Avenir",
    fontWeight: 500,
    fontSize: 14,
  },
  quoteCardInfo: {
    flexDirection: "row",
    width: "100%",
    columnGap: 4,
  },
  quoteCardInfoTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  quoteCardInfoHeaderText: {
    fontWeight: 500,
    fontFamily: "Avenir",
    fontSize: 14,
    color: "#94A3B8",
  },
  quoteCardInfoText: {
    fontWeight: 500,
    fontFamily: "Avenir",
    fontSize: 14,
    color: "#334155",
  },
  formContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 12,
  },
  inputForm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    flex: 1,
    borderRadius: 8,
  },
});
