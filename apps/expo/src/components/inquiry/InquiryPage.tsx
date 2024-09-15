import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native"
import { SearchBox } from "../shared/searchComponent"
import React, { useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MobileTab } from "../core/mobileTab"
import { Badge } from "../core/badge"
import Icon from "react-native-vector-icons/FontAwesome5"
import { SafeAreaView } from "react-native-safe-area-context"
import { InquiryForm } from "./InquiryFormMobile"

export type ProductType = {
  id: number,
  productName: string;       // Name of the product
  description: string;       // Product description
  make: string;              // Make (manufacturer or brand)
  cas?: string;         // CAS number (Chemical Abstracts Service number)
  quantity?: string;          // Quantity of the product
  unit?: string;              // Unit of measurement (e.g., kg, liters, etc.)
  requestTechnical: boolean;      // Checkbox: Is the product hazardous?
  requestSample: boolean;      // Checkbox: Is the product currently available?
};
export const InquiryPage = () => {
  const [searchResult, setSearchResult] = useState<string>("")
  const [filter, setFilter] = useState<string>("All")
  const [openCreateForm, setOpenCreateForm] = useState<boolean>(false)
  const [expand, setExpand] = useState<boolean>(true)
  const [products, setProducts] = useState<ProductType[]>([])

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), productName: "", description: "", make: "", requestSample: false, requestTechnical: false },
    ]);
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const updateProduct = (id: number, field: string, value: number | string | boolean) => {
    setProducts(
      products.map((product: any) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  async function handleSave() {

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
        <OrderBody filter={filter} setFilter={setFilter} />
      </ScrollView>

      {/* create flow */}
      <View style={createStyles.createButtonContainer}>
        <GestureHandlerRootView style={styles.container}>
          <TouchableOpacity style={createStyles.createButton} onPress={() => setOpenCreateForm(true)}>
            <Text style={createStyles.text}>
              +
            </Text>
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
          <View style={createStyles.modalBackground}>
          </View>
        </TouchableWithoutFeedback>

        {/* Modal content: white section */}
        <View style={createStyles.modalContainer}>
          {/* Your modal content goes here */}
          <View style={createStyles.formHeader} >
            <Text style={createStyles.formHeaderText}>Raise an inquiry</Text>
            <TouchableOpacity onPress={() => setOpenCreateForm(false)} style={createStyles.closeButtonContainer}>
              <Icon style={createStyles.closeButtonIcon} name="times" />
            </TouchableOpacity>
          </View>
          <ScrollView style={createStyles.formBody}>
            <View>
              <InquiryForm products={products} handleAddProduct={handleAddProduct} deleteProduct={deleteProduct} updateProduct={updateProduct} handleSave={handleSave} />
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
                flex: 1
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: "Avenir",
                  color: "#344054",
                  flex: 1,
                  textAlign: "center"
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
                flex: 1
              }}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "white",
                  fontFamily: "Avenir",
                  flex: 1,
                  textAlign: "center"
                }}
              >
                Raise inquiry
              </Text>
            </TouchableOpacity>
          </GestureHandlerRootView>
        </View>
      </Modal>
    </View>
  )
}

const createStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: "red"
  },
  createButtonContainer: {
    height: 46,
    width: 46,
    borderRadius: 24,
    position: "absolute",
    right: 16,
    bottom: 50
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
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // translucent background
    justifyContent: 'flex-end',  // content sticks to the bottom
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
    fontSize: 14
  },
  formBody: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9"
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
    gap: 16
  },
})

const OrderBody = ({ filter, setFilter }: { filter: string, setFilter: React.Dispatch<React.SetStateAction<string>> }) => {
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
            <MobileTab activeFilter={filter === "All" ? true : false} setFilter={setFilter} currentFilter="All" />
            <MobileTab activeFilter={filter === "Quotes received" ? true : false} setFilter={setFilter} currentFilter="Quotes received" />
            <MobileTab activeFilter={filter === "Pending" ? true : false} setFilter={setFilter} currentFilter="Pending" />
            <MobileTab activeFilter={filter === "Quote expired" ? true : false} setFilter={setFilter} currentFilter="Quote expired" />
          </View>
        </ScrollView>

        {/* orders */}

        <View style={orderStyles.orderCardContainer}>
          <View style={orderStyles.orderCard}>
            <View style={orderStyles.innerSection}>
              <Badge IconName="checkcircleo" badgeText="Quote Received" bg="#f0f9f6" accentColor="#047857" />
              <Pressable>
                <Icon name="ellipsis-v"></Icon>
              </Pressable>
            </View>
            <View style={orderStyles.innerSection}>
              <Text style={orderStyles.headerText}>Ketone</Text>
            </View>
            <View style={orderStyles.innerSectionFlexStart}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Inquiry Number</Text>
                <Text style={orderStyles.orderMainText}>#AC-3066</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Quantity</Text>
                <Text style={orderStyles.orderMainText}>3 Kg</Text>
              </View>
            </View>
            <View style={orderStyles.innerSectionFlexStart}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Date</Text>
                <Text style={orderStyles.orderMainText}>23/04/2024</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Make</Text>
                <Text style={orderStyles.orderMainText}>Spicy</Text>
              </View>
            </View>
          </View>

          <View style={orderStyles.actionContainer}>
            <Text>Price:Rs 1,171 per kg</Text>

          </View>
        </View>
        <View style={orderStyles.orderCardContainer}>
          <View style={orderStyles.orderCard}>
            <View style={orderStyles.innerSection}>
              <Badge IconName="checkcircleo" badgeText="Quote Received" bg="#f0f9f6" accentColor="#047857" />
              <Pressable>
                <Icon name="ellipsis-v"></Icon>
              </Pressable>
            </View>
            <View style={orderStyles.innerSection}>
              <Text style={orderStyles.headerText}>Ketone</Text>
            </View>
            <View style={orderStyles.innerSectionFlexStart}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Inquiry Number</Text>
                <Text style={orderStyles.orderMainText}>#AC-3066</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Quantity</Text>
                <Text style={orderStyles.orderMainText}>3 Kg</Text>
              </View>
            </View>
            <View style={orderStyles.innerSectionFlexStart}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Date</Text>
                <Text style={orderStyles.orderMainText}>23/04/2024</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={orderStyles.orderHeader}>Make</Text>
                <Text style={orderStyles.orderMainText}>Spicy</Text>
              </View>
            </View>
          </View>

          <View style={orderStyles.actionContainer}>
            <Text>Price:Rs 1,171 per kg</Text>

          </View>
        </View>
        {/* action */}
      </GestureHandlerRootView>
    </View>
  )
}

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
    justifyContent: "space-between"
  },
  innerSectionFlexStart: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 4
  },
  headerText: {
    color: "#1e293b",
    fontFamily: "AvenirHeavy",
    fontSize: 16,
    fontWeight: 800
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
    backgroundColor: "linear-gradient(180deg, rgba(241, 245, 249, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)",
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 16
  }
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBoxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
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
})
