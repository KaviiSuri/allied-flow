import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import { FormTextInput } from "../shared/form";
import TrashIcon from "~/app/assets/images/trash-icon.svg";
import CheckBoxIconChecked from "~/app/assets/images/checkbox-icon-checked.png";
import CheckBoxIconUnchecked from "~/app/assets/images/checkbox-icon-unchecked.png";
import { FormDropDown } from "../shared/form/formDropDown";
import { CheckBox } from "@rneui/themed";
import type { ProductRequest } from "./InquiryPage";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { useUser } from "~/providers/auth";
import { useProductList } from "~/hooks/useProductById";
import { SearchBox } from "../shared/searchComponent";
import { SearchClientBox } from "../shared/searchComponent/searchClients";

export const InquiryForm = ({
  productRequests,
  handleAddProductRequest,
  updateProductRequest,
  deleteProductRequest,
  remarks,
  updateRemarks,
  clientId,
  setClientId,
}: {
  productRequests: ProductRequest[];
  handleAddProductRequest: () => void;
  updateProductRequest: (product: ProductRequest) => void;
  deleteProductRequest: (id: string) => void;
  remarks: string;
  updateRemarks: (_: string) => void;
  clientId: string | null;
  setClientId: (_: string) => void;
}) => {
  const { user } = useUser();
  const { data: clientList } = api.teams.readTeams.useQuery(
    {
      type: "CLIENT",
    },
    {
      enabled: user?.team.type === "SELLER",
    },
  );

  const clientNameOptions = useMemo(() => {
    return (
      clientList?.map((client) => ({
        label: client.name,
        value: client.id,
      })) ?? []
    );
  }, [clientList]);

  useEffect(() => {
    if (!user) return;
    if (user.team.type === "CLIENT") setClientId(user.teamId);
  }, [user]);

  const [selectedClient, setSelectedClient] = useState<string>("");


  return (
    <View
      style={{
        paddingBottom: 150,
      }}
    >
      {user?.team.type === "SELLER" && (
        <View style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
          <FormDropDown
            label="Client"
            paddingBottom={false}
            onValueChange={(value) => {
              setClientId(value as string);
            }}
            value={clientId}
            options={clientNameOptions}
            rightIcon={<Icon name="down" />}
          />
        </View>
      )}
      {productRequests.length > 0 &&
        productRequests.map((product,index) => (
          <ProductForm
            onDelete={deleteProductRequest}
            onChange={updateProductRequest}
            product={product}
            key={index}
          />
        ))}
      <GestureHandlerRootView>
        <TouchableOpacity
          onPress={handleAddProductRequest}
          style={inquiryFormStyles.addButtonContainer}
        >
          <Icon style={inquiryFormStyles.addButtonIcon} name="plus" />
          <Text style={inquiryFormStyles.addButtonIcon}>Add products</Text>
        </TouchableOpacity>
      </GestureHandlerRootView>

      {/* remarks section */}
      <View style={inquiryFormStyles.formContainer}>
        {/* <Text style={inquiryFormStyles.formTitles}>Your Remarks</Text> */}
        <FormTextInput
          label="Your Remarks"
          placeholder="Enter remark here"
          value={remarks}
          onChangeText={updateRemarks}
          numberOfLines={3}
        />
      </View>
    </View>
  );
};

const ProductForm = ({
  product,
  onDelete,
  onChange,
}: {
  product: ProductRequest;
  onDelete: (id: string) => void;
  onChange: (_: ProductRequest) => void;
}) => {
  // TODO: implement search

  const { productList } = useProductList();
  const productNameOptions = useMemo(() => {
    return (
      productList?.map((product) => ({
        label: product.name,
        value: product.id,
      })) ?? []
    );
  }, [productList]);

  const [selectedProduct, setSelectedProduct] = useState<
    RouterOutputs["products"]["read"][0] | null
  >(null);

  useEffect(() => {
    if (!product.productId) return;
    const selectedProduct = productList?.find(
      (p) => p.id === product.productId,
    );
    setSelectedProduct(selectedProduct ?? null);
  }, [productList]);

  useEffect(() => {
    if (!selectedProduct) return;
    onChange({
      ...product,
      productName: selectedProduct.name,
      productId: selectedProduct.id,
    });
  }, [selectedProduct]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProductChange = (value: any) => {
    const selectedProduct = productList?.find((p) => p.id === value);
    setSelectedProduct(selectedProduct ?? null);
    if (!selectedProduct) return;
  };
  const UnitOptions = [
    { label: "Kg", value: "kg" },
    { label: "Litre", value: "litre" },
    { label: "Gram", value: "gram" },
    { label: "Millilitre", value: "ml" },
    { label: "Piece", value: "piece" },
  ];

  const [productName, setProductName] = useState<string>("");
  return (
    <Animated.View
      key={product.productId}
      style={inquiryFormStyles.formContainer}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
      {product && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text style={inquiryFormStyles.formTitles}>Product Name</Text>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={() => onDelete(product.id)}
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
            </TouchableOpacity>
          </View>
          <View style={{
            position: "relative",
            zIndex: 1,
          }}>
            <SearchClientBox
              placeholder="Search product"
              value={productName}
              setValue={setProductName}
              list={productList?.map((product) => product.name)}
            />
          </View>
          <FormTextInput
            label="Description"
            placeholder="This is description of the product"
            value={selectedProduct?.desc ?? ""}
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
              value={selectedProduct?.make ?? ""}
            />
            <FormTextInput
              style={{ flex: 1 }}
              label="CAS"
              placeholder="68845-36-3"
              value={selectedProduct?.cas ?? ""}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <FormTextInput
              style={{ flex: 1 }}
              label="Quantity"
              placeholder="0"
              value={
                isNaN(product.quantity)
                  ? "0"
                  : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    product.quantity.toString() ?? "0"
              }
              onChangeText={(t) => {
                const quantity = parseFloat(t);
                onChange({
                  ...product,
                  quantity: isNaN(quantity) ? 0 : quantity,
                });
              }}
            />

            <View
              style={{
                flex: 1,
                height: "100%",
              }}
            >
              <FormDropDown
                label="Unit"
                paddingBottom={true}
                options={UnitOptions}
                value={product.unit}
                onValueChange={(t) => {
                  onChange({
                    ...product,
                    unit: t as string,
                  });
                }}
                rightIcon={<Icon name="down" />}
              />
            </View>
          </View>

          <CheckBox
            checked={product.techDocumentRequested}
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
                source={CheckBoxIconUnchecked}
                style={{
                  width: 18,
                  height: 18,
                }}
                resizeMode={"contain"}
              />
            }
            onPress={() =>
              onChange({
                ...product,
                techDocumentRequested: !product.techDocumentRequested,
              })
            }
          />
          <CheckBox
            checked={product.sampleRequested}
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
                source={CheckBoxIconUnchecked}
                style={{
                  width: 18,
                  height: 18,
                }}
                resizeMode={"contain"}
              />
            }
            onPress={() =>
              onChange({
                ...product,
                sampleRequested: !product.sampleRequested,
              })
            }
          />
        </>
      )}
    </Animated.View>
  );
};

const inquiryFormStyles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  formTitles: {
    color: "#344054",
    fontSize: 14,
    fontFamily: "Avenir",
    fontWeight: 500,
  },
  addButtonContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
    alignItems: "center",
  },
  addButtonIcon: {
    color: "#2f80f5",
    fontSize: 14,
    fontFamily: "AvenirHeavy",
    fontWeight: 500,
  },
});
