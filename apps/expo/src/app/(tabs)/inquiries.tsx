import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Pressable,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import SentInquiries from "../screens/sentInquiries";
import ClosedInquiries from "../screens/closedInquiries";
const windowHeight = Dimensions.get("window").height - 64;
import SearchIcon from "~/app/assets/images/search-icon.png";
import CloseIcon from "~/app/assets/images/close-icon.png";
import DownArrowIcon from "~/app/assets/images/down-arrow-icon.png";
import TrashIcon from "~/app/assets/images/trash-icon.svg";
import CheckBoxIconChecked from "~/app/assets/images/checkbox-icon-checked.png";
import CheckBoxIconUnchecked from "~/app/assets/images/checkbox-icon-unchecked.png";

import { FormTextInput } from "~/components/shared/form";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { api } from "~/utils/api";
import { FormDropDown } from "~/components/shared/form/formDropDown";
import { CheckBox } from "@rneui/themed";
type Inquiry = RouterOutputs["inquiries"]["readInquiries"][0];
type CreateInquiry = RouterInputs["inquiries"]["createInquiry"];

function ProductContainer({
  id,
  product,
  onDelete,
  onChange,
  isTechnicalDocReq,
  isSampleReq,
  setIsTechnicalDocReq,
  setIsSampleReq,
}) {
  const UnitOptions = [
    { label: "Kg", value: "kg" },
    { label: "Litre", value: "litre" },
    { label: "Gram", value: "gram" },
    { label: "Millilitre", value: "ml" },
    { label: "Piece", value: "piece" },
  ];
  return (
    <View
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 12,
        borderColor: "#E2E8F0",
        borderWidth: 1,
        flexDirection: "column",
        gap: 16,
        backgroundColor: "#FFF",
        marginBottom: 19,
      }}
    >
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 400,
              paddingBottom: 8,
              fontFamily: "Avenir",
              color: "#475467",
            }}
          >
            Product Name
          </Text>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => onDelete(id)}
          >
            <TrashIcon />
            <Text
              style={{
                color: "#EF4444",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "Avenir",
                marginLeft: 4,
              }}
            >
              Delete
            </Text>
          </Pressable>
        </View>

        <TextInput
          style={{
            fontFamily: "Avenir",
            fontSize: 14,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            borderRadius: 8,
            paddingHorizontal: 14,
            paddingVertical: 12,
            shadowOffset: { height: 1, width: 0 },
            backgroundColor: "transparent",
            pointerEvents: "auto",
            shadowOpacity: 0.05,
            shadowColor: "#101828",
          }}
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={1}
          placeholder="Type product name"
          value={product.productName}
          onChangeText={(t) => onChange(id, "productName", t)}
        />
      </View>

      <FormTextInput
        label="Description"
        placeholder="This is description of the product"
        value={product.description}
        onChangeText={(t) => onChange(id, "description", t)}
      />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <FormTextInput
          style={{ flex: 1, marginRight: 16 }}
          label="Make"
          placeholder="Spicy"
          value={product.make}
          onChangeText={(t) => onChange(id, "make", t)}
        />
        <FormTextInput
          style={{ flex: 1 }}
          label="CAS"
          placeholder="68845-36-3"
          value={product.cas}
          onChangeText={(t) => onChange(id, "make", t)}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <FormTextInput
          style={{ flex: 1, marginRight: 16 }}
          label="Quantity"
          placeholder="24"
          value={product.quantity}
          onChangeText={(t) => onChange(id, "make", t)}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <FormDropDown
            label="Unit"
            options={UnitOptions}
            value={product.unit}
            onValueChange={(t) => onChange(id, "unit", t)}
            rightIcon={
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={DownArrowIcon}
                style={{
                  width: 18,
                  height: 18,
                }}
                resizeMode={"contain"}
                tintColor="#64748B"
              />
            }
          />
        </View>
      </View>
      <CheckBox
        checked={isTechnicalDocReq}
        title="Request Technical Documents"
        containerStyle={{ marginLeft: -10, marginBottom: -10 }}
        textStyle={{
          color: "#475467",
          fontSize: 14,
          fontWeight: 400,
          fontFamily: "Avenir",
        }}
        checkedIcon={
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={CheckBoxIconChecked}
            style={{
              width: 18,
              height: 18,
            }}
            resizeMode={"contain"}
          />
        }
        uncheckedIcon={
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={CheckBoxIconUnchecked}
            style={{
              width: 18,
              height: 18,
            }}
            resizeMode={"contain"}
          />
        }
        onPress={() => setIsTechnicalDocReq(!isTechnicalDocReq)}
      />
      <CheckBox
        checked={isSampleReq}
        title="Request sample with the inquiry"
        containerStyle={{ marginLeft: -10, marginBottom: -10 }}
        textStyle={{
          color: "#475467",
          fontSize: 14,
          fontWeight: 400,
          fontFamily: "Avenir",
        }}
        checkedIcon={
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={CheckBoxIconChecked}
            style={{
              width: 18,
              height: 18,
            }}
            resizeMode={"contain"}
          />
        }
        uncheckedIcon={
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={CheckBoxIconUnchecked}
            style={{
              width: 18,
              height: 18,
            }}
            resizeMode={"contain"}
          />
        }
        onPress={() => setIsSampleReq(!isSampleReq)}
      />
    </View>
  );
}

function InquiryForm(
  props: {
    open: boolean;
    toggleOpen: () => void;
    isLoading?: boolean;
  } & {
    handleSave: (_inquiry: CreateInquiry) => Promise<void>;
  },
) {
  //initialize a product array with useState so I can remove and add products
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [make, setMake] = useState<string>("");
  const [isTechnicalDocReq, setIsTechnicalDocReq] = useState<boolean>(false);
  const [isSampleReq, setIsSampleReq] = useState<boolean>(false);

  const [products, setProducts] = useState([]);
  const [remark, setRemark] = useState<string>("");
  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), productName: "", description: "", make: "" },
    ]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateProduct = (id, field, value) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  async function handleSave() {
    await props.handleSave({ productName, description, make });

    props.toggleOpen();
  }

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
            backgroundColor: "#FFF",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 800, fontFamily: "Avenir" }}>
            Raise an inquiry
          </Text>
          <Pressable onPress={props.toggleOpen}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={CloseIcon}
            />
          </Pressable>
        </View>
        <ScrollView>
          <View style={{ flex: 1, padding: 20 }}>
            {products.map((product) => (
              <ProductContainer
                key={product.id}
                id={product.id}
                product={product}
                onDelete={deleteProduct}
                onChange={updateProduct}
                isTechnicalDocReq={isTechnicalDocReq}
                isSampleReq={isSampleReq}
                setIsTechnicalDocReq={setIsTechnicalDocReq}
                setIsSampleReq={setIsSampleReq}
              />
            ))}
            <Pressable onPress={handleAddProduct}>
              <Text
                style={{
                  color: "#2F80F5",
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "Avenir",
                }}
              >
                + Add Product
              </Text>
            </Pressable>

            <View
              style={{
                width: "100%",
                marginTop: 19,
                padding: 16,
                borderRadius: 12,
                borderColor: "#E2E8F0",
                borderWidth: 1,
                flexDirection: "column",
                gap: 16,
                backgroundColor: "#FFF",
              }}
            >
              <FormTextInput
                label="Your Remarks"
                placeholder="Enter remark here"
                value={remark}
                onChangeText={setRemark}
                numberOfLines={3}
              />
            </View>
          </View>
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
            onPress={handleSave}
            isLoading={props.isLoading}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function CreateInquiryForm(props: { open: boolean; toggleOpen: () => void }) {
  const utils = api.useUtils();
  const { mutateAsync: createInquiry, isPending } =
    api.inquiries.createInquiry.useMutation({
      onSuccess: () => {
        utils.inquiries.readInquiries.refetch().catch(console.error);
      },
    });

  async function handleSave(inquiry: CreateInquiry) {
    await createInquiry(inquiry);
    props.toggleOpen();
  }

  return (
    <InquiryForm
      open={props.open}
      toggleOpen={props.toggleOpen}
      handleSave={handleSave}
      isLoading={isPending}
    />
  );
}

const Inquiries = () => {
  const [activeNestedTab, setActiveNestedTab] = useState("Sent");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const renderNestedScreen = () => {
    switch (activeNestedTab) {
      case "Sent":
        return <SentInquiries />;
      case "Closed":
        return <ClosedInquiries />;
      default:
        return <SentInquiries />;
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <CreateInquiryForm open={drawerVisible} toggleOpen={toggleDrawer} />
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={
              activeNestedTab === "Sent" && {
                borderBottomWidth: 2,
                marginHorizontal: 6,
                borderColor: "#2F80F5",
              }
            }
            onPress={() => setActiveNestedTab("Sent")}
          >
            <Text
              style={{
                fontFamily: "Avenir",
                color: activeNestedTab == "Sent" ? "#475569" : "#64748B",
                fontSize: 16,
                fontWeight: 400,
                marginHorizontal: 6,
              }}
            >
              Sent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeNestedTab === "Closed" && {
                borderBottomWidth: 2,
                marginHorizontal: 6,
                borderColor: "#2F80F5",
              }
            }
            onPress={() => setActiveNestedTab("Closed")}
          >
            <Text
              style={{
                fontFamily: "Avenir",
                color: activeNestedTab == "Closed" ? "#475569" : "#64748B",
                fontSize: 16,
                fontWeight: 400,
                marginHorizontal: 6,
              }}
            >
              Closed
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
            <Image source={SearchIcon} style={{ width: 18, height: 18 }} />
            <PrimaryButton text="Raise an inquiry" onPress={toggleDrawer} />
          </View>
        </View>
      </View>
      {renderNestedScreen()}
    </ScrollView>
  );
};

export default Inquiries;
