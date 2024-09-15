import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SearchBox } from "../shared/searchComponent";
import React, { useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MobileTab } from "../core/mobileTab";
import { Badge } from "../core/badge";
import Icon from "react-native-vector-icons/FontAwesome5";
import { InquiryForm } from "./InquiryFormMobile";
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useAbility, useUser } from "~/providers/auth";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export type ProductRequest =
  RouterInputs["inquiry"]["raise"]["productRequests"][0] & {
    id: string;
  };

export const InquiryPage = () => {
  const [searchResult, setSearchResult] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const { user } = useUser();
  const ability = useAbility();
  const utils = api.useUtils();
  const { data } = api.inquiry.list.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.items.length === 0) return null;
        return lastPage.nextCursor;
      },
      enabled: ability.can("list", "Inquiry"),
    },
  );
  const inquiries = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const [remarks, setRemarks] = useState<string>("");

  const [productRequests, setProductRequests] = useState<ProductRequest[]>([]);

  const handleAddProductRequest = () => {
    setProductRequests([
      ...productRequests,
      {
        id: Date.now().toString(),
        productName: "",
        productId: "",
        price: 0,
        quantity: 0,
        unit: "",
        sampleRequested: false,
        techDocumentRequested: false,
      },
    ]);
  };

  const deleteProductRequest = (id: string) => {
    setProductRequests(productRequests.filter((product) => product.id !== id));
  };

  const updateProductRequest = (productRequest: ProductRequest) => {
    setProductRequests(
      productRequests.map((product: any) =>
        product.id === productRequest.id
          ? {
              ...product,
              ...productRequest,
            }
          : product,
      ),
    );
  };
  const [clientId, setClientId] = useState<string | null>(null);

  const { mutateAsync: raiseInquiry } = api.inquiry.raise.useMutation({
    onSuccess: () => {
      setOpenCreateForm(false);
      utils.inquiry.list.invalidate();
      Toast.show({
        position: "bottom",
        type: "success",
        text1: "Raised Inquiry Successfully",
      });
    },
  });

  async function handleSave() {
    if (!user) return;
    if (!clientId) return;
    const sellers = await utils.teams.readTeams.fetch({
      type: "SELLER",
    });
    const seller = sellers[0];
    if (!seller) {
      return;
    }
    let sellerId = user.team.id;
    await raiseInquiry({
      tnc: "",
      remarks,
      productRequests,
      buyerId: clientId,
      sellerId,
    });
  }
  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      {/* Fixed SearchBox at the top */}
      <View style={styles.searchBoxContainer}>
        <SearchBox
          placeholder="Search inquiry external"
          setValue={setSearchResult}
          value={searchResult}
        />
      </View>

      {/* Scrollable content below the fixed SearchBox */}
      <ScrollView style={styles.orderBodyContainer}>
        <InquiryList
          filter={filter}
          setFilter={setFilter}
          inquiries={inquiries}
        />
      </ScrollView>

      {/* create flow */}
      <View style={createStyles.createButtonContainer}>
        <GestureHandlerRootView style={styles.container}>
          <TouchableOpacity
            style={createStyles.createButton}
            onPress={() => setOpenCreateForm(true)}
          >
            <Text style={createStyles.text}>+</Text>
          </TouchableOpacity>
        </GestureHandlerRootView>
      </View>
      {/* create form modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={openCreateForm}
        onRequestClose={() => setOpenCreateForm(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpenCreateForm(false)}>
          <View style={createStyles.modalBackground}></View>
        </TouchableWithoutFeedback>

        {/* Modal content: white section */}
        <View style={createStyles.modalContainer}>
          {/* Your modal content goes here */}
          <View style={createStyles.formHeader}>
            <Text style={createStyles.formHeaderText}>Raise an inquiry</Text>
            <TouchableOpacity
              onPress={() => setOpenCreateForm(false)}
              style={createStyles.closeButtonContainer}
            >
              <Icon style={createStyles.closeButtonIcon} name="times" />
            </TouchableOpacity>
          </View>
          <ScrollView style={createStyles.formBody}>
            <View>
              <InquiryForm
                productRequests={productRequests}
                handleAddProductRequest={handleAddProductRequest}
                deleteProductRequest={deleteProductRequest}
                updateProductRequest={updateProductRequest}
                remarks={remarks}
                updateRemarks={setRemarks}
                clientId={clientId}
                setClientId={setClientId}
              />
            </View>
          </ScrollView>

          <GestureHandlerRootView style={createStyles.formSubmitContainer}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                borderColor: "#D0D5DD",
                borderWidth: 1,
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowColor: "#101828",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: "Avenir",
                  color: "#344054",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: "#2F80F5",
                borderRadius: 8,
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowColor: "#101828",
                flex: 1,
              }}
              onPress={handleSave}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "white",
                  fontFamily: "Avenir",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                Raise inquiry
              </Text>
            </TouchableOpacity>
          </GestureHandlerRootView>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: "red",
  },
  createButtonContainer: {
    height: 46,
    width: 46,
    borderRadius: 24,
    position: "absolute",
    right: 16,
    bottom: 50,
  },
  createButton: {
    height: "100%",
    borderRadius: 24,
    width: "100%",
    backgroundColor: "#2f80f5",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
  },
  modalContainer: {
    height: 669,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // translucent background
    justifyContent: "flex-end", // content sticks to the bottom
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#E2E8F0",
    padding: 16,
    borderBottomWidth: 1,
  },
  formHeaderText: {
    fontWeight: 800,
    fontFamily: "AvenirHeavy",
    fontSize: 14,
  },
  closeButtonContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonIcon: {
    fontSize: 14,
  },
  formBody: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  formSubmitContainer: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    paddingBottom: 46,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderColor: "#E2E8F0",
    borderTopWidth: 1,
    gap: 16,
  },
});

const InquiryList = ({
  filter,
  setFilter,
  inquiries,
}: {
  inquiries: RouterOutputs["inquiry"]["list"]["items"];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View style={styles.orderBodyContent}>
      <GestureHandlerRootView style={styles.container}>
        {/* tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Hide the scroll indicator
          contentContainerStyle={styles.filterTabsContainer}
        >
          <View style={styles.filterTabsContainer}>
            <MobileTab
              activeFilter={filter === "All" ? true : false}
              setFilter={setFilter}
              currentFilter="All"
            />
            <MobileTab
              activeFilter={filter === "Quotes received" ? true : false}
              setFilter={setFilter}
              currentFilter="Quotes received"
            />
            <MobileTab
              activeFilter={filter === "Pending" ? true : false}
              setFilter={setFilter}
              currentFilter="Pending"
            />
            <MobileTab
              activeFilter={filter === "Quote expired" ? true : false}
              setFilter={setFilter}
              currentFilter="Quote expired"
            />
          </View>
        </ScrollView>

        {/* orders */}
        {inquiries.map((inquiry) => (
          <InquiryCard inquiry={inquiry} key={inquiry.id} />
        ))}
      </GestureHandlerRootView>
    </View>
  );
};

const InquiryCard = ({
  inquiry,
}: {
  inquiry: RouterOutputs["inquiry"]["list"]["items"][0];
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/inquiry/${inquiry.id}`);
        console.log("Inquiry Details", inquiry.id);
      }}
    >
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <Badge
              IconName="checkcircleo"
              badgeText="Quote Received"
              bg="#f0f9f6"
              accentColor="#047857"
            />
            <Icon name="ellipsis-v"></Icon>
          </View>
          <View style={orderStyles.innerSection}>
            <Text style={orderStyles.headerText}>{inquiry.productNames}</Text>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Inquiry Number</Text>
              <Text style={orderStyles.orderMainText}>{inquiry.id}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Quantity</Text>
              <Text style={orderStyles.orderMainText}>-</Text>
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Date</Text>
              <Text style={orderStyles.orderMainText}>
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Make</Text>
              <Text style={orderStyles.orderMainText}>-</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  orderBodyContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  orderBodyContent: {
    padding: 16,
  },
  filterTabsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 16,
  },
});
