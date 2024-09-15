import { useState } from "react"
import { Animated, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/AntDesign"
import { FormTextInput } from "../shared/form"
import TrashIcon from "~/app/assets/images/trash-icon.svg";
import CheckBoxIconChecked from "~/app/assets/images/checkbox-icon-checked.png";
import CheckBoxIconUnchecked from "~/app/assets/images/checkbox-icon-unchecked.png";
import { FormDropDown } from "../shared/form/formDropDown"
import { CheckBox } from "@rneui/themed"
import { ProductType } from "./InquiryPage"


export const InquiryForm = ({ products, handleAddProduct, updateProduct, deleteProduct, handleSave }: { products: ProductType[], handleAddProduct: () => void, updateProduct: (id: number, field: string, value: string | number | boolean) => void, deleteProduct: (id: number) => void, handleSave: () => void }) => {
  const [remarks, setRemarks] = useState<string>("");

  return <View>
    {products.length > 0 && products?.map((product) =>
      <ProductForm
        onDelete={deleteProduct}
        onChange={updateProduct}
        product={product}
      />
    )}
    <GestureHandlerRootView>
      <TouchableOpacity onPress={handleAddProduct} style={inquiryFormStyles.addButtonContainer}>
        <Icon style={inquiryFormStyles.addButtonIcon} name="plus" />
        <Text style={inquiryFormStyles.addButtonIcon}>
          Add products
        </Text>
      </TouchableOpacity >
    </GestureHandlerRootView>

    {/* remarks section */}
    <View style={inquiryFormStyles.formContainer}>
      {/* <Text style={inquiryFormStyles.formTitles}>Your Remarks</Text> */}
      <FormTextInput
        label="Your Remarks"
        placeholder="Enter remark here"
        value={remarks}
        onChangeText={setRemarks}
        numberOfLines={3}
      />
    </View>

  </View>
}

const ProductForm = ({ product, onDelete, onChange }: { product?: ProductType, onDelete: (id: number) => void, onChange: (id: number, field: string, value: string | number | boolean) => void }) => {
  const productNameOptions = [
    {
      label: "Chemical 1",
      value: "chemical_1",
    },
    {
      label: "Chemical 2",
      value: "chemical_2",
    },
  ];
  const handleClick = () => {
    /* empty */
  };
  const UnitOptions = [
    { label: "Kg", value: "kg" },
    { label: "Litre", value: "litre" },
    { label: "Gram", value: "gram" },
    { label: "Millilitre", value: "ml" },
    { label: "Piece", value: "piece" },
  ];
  return (<Animated.View
    key={product?.id}
    style={inquiryFormStyles.formContainer}>
    {product &&
      <>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Text
            style={inquiryFormStyles.formTitles}
          >
            Product Name
          </Text>
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
        <FormDropDown paddingBottom={false} onValueChange={handleClick} value={product.productName} options={productNameOptions} rightIcon={
          <Icon name="down" />
        } />

        <FormTextInput
          label="Description"
          placeholder="This is description of the product"
          value={product.description}
          onChangeText={(t) => onChange(product.id, "productName", t)}
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
            onChangeText={(t) => onChange(product.id, "make", t)}
          />
          <FormTextInput
            style={{ flex: 1 }}
            label="CAS"
            placeholder="68845-36-3"
            value={product.cas}
            onChangeText={(t) => onChange(product.id, "cas", t)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            gap: 16
          }}
        >
          <FormTextInput
            style={{ flex: 1 }}
            label="Quantity"
            placeholder="0"
            value={product.quantity}
            onChangeText={(t) => onChange(product.id, "quantity", t)}
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
              onValueChange={(t) => onChange(product.id, "unit", t)}
              rightIcon={
                <Icon name="down" />
              }
            />
          </View>
        </View>


        <CheckBox
          checked={product.requestTechnical}
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
          onPress={() => onChange(product.id, "requestTechnical", !product.requestTechnical)}
        />
        <CheckBox
          checked={product.requestSample}
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
          onPress={() => onChange(product.id, "requestSample", !product.requestSample)}
        />
      </>
    }
  </Animated.View>)
}


const inquiryFormStyles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 16,
    borderRadius: 8
  },
  formTitles: {
    color: "#344054",
    fontSize: 14,
    fontFamily: "Avenir",
    fontWeight: 500
  },
  addButtonContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
    alignItems: "center"
  },
  addButtonIcon: {
    color: "#2f80f5",
    fontSize: 14,
    fontFamily: "AvenirHeavy",
    fontWeight: 500
  }
})


