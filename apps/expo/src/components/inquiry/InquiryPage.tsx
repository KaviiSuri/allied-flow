import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SearchBox } from "../shared/searchComponent";
import React, { useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MobileTab } from "../core/mobileTab";
import Icon from "react-native-vector-icons/FontAwesome5";
import { InquiryForm } from "./InquiryFormMobile";
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useAbility, useUser } from "~/providers/auth";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { createStyles } from "../layouts/BottomDrawerLayout";
import { clientFilterList, sellerFilterList } from "~/constants/filterLists";
import { ActionBadgeMobile } from "../core/actionBadge";
import { LoadingState } from "../shared/displayStates/LoadingState";
import { ErrorState } from "../shared/displayStates/ErrorState";
import { BadgeStatus } from "../shared/badge";

export type ProductRequest =
  RouterInputs["inquiry"]["raise"]["productRequests"][0] & {
    id: string;
  };

export const InquiryPage = () => {
  const [searchResult, setSearchResult] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false);
  const [activeNestedTab, setActiveNestedTab] = useState<"NEGOTIATING" | "RAISED" | "ACCEPTED" | "REJECTED" | undefined>(undefined);
  const { user } = useUser();
  const ability = useAbility();
  const utils = api.useUtils();
  const { data, isLoading, isError } = api.inquiry.list.useInfiniteQuery(
    {
      search: searchResult,
      status: activeNestedTab,
    },
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

  useEffect(() => {
    setProductRequests([]);
  }, []);

  useEffect(() => {
    if (filter === "All" || filter === "All Inquiries") {
      setActiveNestedTab(undefined);
    } else if (filter === "Negotiation") {
      setActiveNestedTab("NEGOTIATING");
    } else if (filter === "Quotes Received" || filter === "New") {
      setActiveNestedTab("RAISED");
    } else if (filter === "Accepted" || filter === "Order Placed") {
      setActiveNestedTab("ACCEPTED");
    } else if (filter === "Rejected" || filter === "Quote expired") {
      setActiveNestedTab("REJECTED");
    }
  }, [filter]);

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
      productRequests.map((product) =>
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
      setProductRequests([]);
      utils.inquiry.list.invalidate().catch(console.error);
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
    const sellerId = seller.id;
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
      {user?.team.type === "CLIENT" && (
        <View style={styles.searchBoxContainer}>
          <SearchBox
            placeholder={"Search inquiry "}
            setValue={setSearchResult}
            value={searchResult}
          />
        </View>
      )}

      {/* Scrollable content below the fixed SearchBox */}

      {isLoading ? (
        <LoadingState stateContent={"Please wait... Loading inquiries"} />
      ) : isError ? (
        <ErrorState errorMessage={"Something went wrong, please try again."} />
      ) : (
        <ScrollView style={styles.orderBodyContainer}>
          <InquiryList
            filter={filter}
            setFilter={setFilter}
            inquiries={inquiries}
            filterList={
              user?.team.type === "CLIENT" ? clientFilterList : sellerFilterList
            }
          />
        </ScrollView>
      )}

      {/* create flow */}
      <View style={createStyles.createButtonContainer}>
        <GestureHandlerRootView style={styles.container}>
          <TouchableOpacity
            style={createStyles.createButton}
            onPress={() => {
              setOpenCreateForm(true);
              setProductRequests([]);
            }}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={createStyles.modalContainer}
        >
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
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const InquiryList = ({
  filter,
  setFilter,
  inquiries,
  filterList,
}: {
  inquiries: RouterOutputs["inquiry"]["list"]["items"];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  filterList: string[];
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
            {filterList.map((filterName: string, index: number) => (
              <MobileTab
                activeFilter={filter === filterName ? true : false}
                setFilter={setFilter}
                currentFilter={filterName}
                key={index}
              />
            ))}
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
  const { user } = useUser();

  const formatProducts = (input: string): string => {
    // Split the input string into an array
    const entities = input.split(",").map((entity) => entity.trim());

    // Check the number of entities
    if (entities.length <= 2) {
      return input; // Return original string if 2 or fewer entities
    } else {
      // Return the first two entities and append "& others"
      return `${entities[0]}, ${entities[1]} & ${entities.length - 2}others`;
    }
  };

  return (
    <View>
      <View style={orderStyles.orderCardContainer}>
        <View style={orderStyles.orderCard}>
          <View style={orderStyles.innerSection}>
            <BadgeStatus
              status={inquiry.status}
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
              <Text style={orderStyles.orderHeader}>Products</Text>
              <Text style={orderStyles.orderMainText}>
                {formatProducts(inquiry.productNames)}
              </Text>
            </View>
          </View>
          <View style={orderStyles.innerSectionFlexStart}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={orderStyles.orderHeader}>Date</Text>
              <Text style={orderStyles.orderMainText}>
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {
              user?.team.type !== "CLIENT" && (
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={orderStyles.orderHeader}>Client</Text>
                  <Text style={orderStyles.orderMainText}>
                    {inquiry.buyer.name}
                  </Text>
                </View>
              )
            }
          </View>
        </View>
        <View style={orderStyles.actionContainer}>
          {inquiry.status === "NEGOTIATING" && (
            <ActionBadgeMobile
              iconName="open-in-new"
              actionText="View Quote"
              handleAction={() => router.push(`/inquiry/${inquiry.id}`)}
            />
          )}
          {inquiry.status === "RAISED" && (
            <ActionBadgeMobile
              iconName="open-in-new"
              actionText="Send Quote"
              handleAction={() =>
                router.push(`/inquiry/sendQuote/${inquiry.id}`)
              }
            />
          )}

          {(inquiry.status === "ACCEPTED" || inquiry.status === "REJECTED") && (
            <ActionBadgeMobile
              iconName="open-in-new"
              actionText="View Quote"
              handleAction={() => router.push(`../../app/(tabs)/inquiry/${inquiry.id}`)}
            />
          )}
          {/* (filter === "Negotiation" && (
            <ActionBadgeMobile
              iconName="alarm-light-outline"
              actionText="Follow Up"
              handleAction={() => router.navigate(`inquiry/${inquiry.id}`)}
            />
          )*/}
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
