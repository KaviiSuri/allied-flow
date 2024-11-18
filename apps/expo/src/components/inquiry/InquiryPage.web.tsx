import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
  Dimensions,
} from "react-native";
const windowHeight = Dimensions.get("window").height - 64;
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { api } from "~/utils/api";
import SentInquiries from "~/app/screens/sentInquiries";
import { InquiryForm } from "./InquiryFormMobile";
import { useAbility, useUser } from "~/providers/auth";
import type { ProductRequest } from "./InquiryPage";
import { SearchBox } from "../shared/searchComponent";
import Toast from "react-native-toast-message";
import { LoadingState } from "../shared/displayStates/LoadingState.web";
import { ErrorState } from "../shared/displayStates/ErrorState";

export const InquiryPage = () => {
  const [activeNestedTab, setActiveNestedTab] = useState<"NEGOTIATING" | "ACCEPTED" | "REJECTED" | undefined>(undefined);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<"NEGOTIATING" | "ACCEPTED" | "REJECTED" | undefined>(undefined);
  const [searchResult, setSearchResult] = useState<string>("");
  const { user } = useUser();
  const ability = useAbility();
  const utils = api.useUtils();
  const { data, isError, isLoading } = api.inquiry.list.useInfiniteQuery(
    {status: currentStatus},
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
      setDrawerVisible(false);
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

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const renderNestedScreen = () => {
    return <SentInquiries currentTab={activeNestedTab} inquiries={inquiries} />;
  };

  useEffect(() => {setCurrentStatus(activeNestedTab)},[activeNestedTab]);
  return (
    <View>
      <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <CreateInquiryForm
          open={drawerVisible}
          toggleOpen={toggleDrawer}
          productRequests={productRequests}
          handleAddProductRequest={handleAddProductRequest}
          deleteProductRequest={deleteProductRequest}
          updateProductRequest={updateProductRequest}
          remarks={remarks}
          updateRemarks={setRemarks}
          clientId={clientId}
          setClientId={setClientId}
          handleSave={handleSave}
        />
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                },
                activeNestedTab === undefined && {
                  borderBottomWidth: 2,
                  borderColor: "#2F80F5",
                },
              ]}
              onPress={() => setActiveNestedTab(undefined)}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color: activeNestedTab === undefined ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                },
                activeNestedTab === "NEGOTIATING" && {
                  borderBottomWidth: 2,
                  borderColor: "#2F80F5",
                },
              ]}
              onPress={() => setActiveNestedTab("NEGOTIATING")}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color: activeNestedTab == "NEGOTIATING" ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
              Negotiation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                },
                activeNestedTab === "ACCEPTED" && {
                  borderBottomWidth: 2,
                  borderColor: "#2F80F5",
                },
              ]}
              onPress={() => setActiveNestedTab("ACCEPTED")}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color: activeNestedTab == "ACCEPTED" ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
                Accepted
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                },
                activeNestedTab === "REJECTED" && {
                  borderBottomWidth: 2,
                  borderColor: "#2F80F5",
                },
              ]}
              onPress={() => setActiveNestedTab("REJECTED")}
            >
              <Text
                style={{
                  fontFamily: "Avenir",
                  color:
                    activeNestedTab == "REJECTED" ? "#475569" : "#64748B",
                  fontSize: 16,
                  fontWeight: 400,
                  marginHorizontal: 6,
                }}
              >
              Rejected
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 10 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
              }}
            >
              <SearchBox
                placeholder="Search by products"
                setValue={setSearchResult}
                value={searchResult}
              />
              <PrimaryButton text="Raise an inquiry" onPress={toggleDrawer} />
            </View>
          </View>
        </View>
        {isLoading ? (
          <LoadingState stateContent={"Please wait... Loading inquiries"} />
        ) : isError ? (
          <ErrorState
            errorMessage={"Something went wrong, please try again."}
          />
        ) : (
          renderNestedScreen()
        )}
      </ScrollView>
    </View>
  );
};

function CreateInquiryForm(props: {
  open: boolean;
  toggleOpen: () => void;
  productRequests: ProductRequest[];
  handleAddProductRequest: () => void;
  deleteProductRequest: (id: string) => void;
  updateProductRequest: (ProductRequest: ProductRequest) => void;
  remarks: string;
  updateRemarks: React.Dispatch<React.SetStateAction<string>>;
  clientId: string | null;
  setClientId: React.Dispatch<React.SetStateAction<string | null>>;
  handleSave: () => void;
}) {
  return (
    <Animated.View
      style={{
        zIndex: 1,
        position: "absolute",
        right: props.open ? 0 : "-100%",
        width: "100%",
        height: windowHeight,
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            opacity: 0.1,
          }}
          onPress={props.toggleOpen}
        ></Pressable>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          flexDirection: "column",
          backgroundColor: "#F9F9F9",
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          <InquiryForm
            productRequests={props.productRequests}
            handleAddProductRequest={props.handleAddProductRequest}
            deleteProductRequest={props.deleteProductRequest}
            updateProductRequest={props.updateProductRequest}
            remarks={props.remarks}
            updateRemarks={props.updateRemarks}
            clientId={props.clientId}
            setClientId={props.setClientId}
          />
        </ScrollView>
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#E2E8F0",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <SecondaryButton text="Cancel" onPress={props.toggleOpen} />
          <PrimaryButton
            text="Raise Inquiry"
            onPress={props.handleSave}
            // isLoading={props.isLoading}
          />
        </View>
      </View>
    </Animated.View>
  );
}
