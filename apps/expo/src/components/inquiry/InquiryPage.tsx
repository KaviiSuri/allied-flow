import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native"
import { SearchBox } from "../shared/searchComponent"
import React, { useState } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { MobileTab } from "../core/mobileTab"
import { Badge } from "../core/badge"
import Icon from "react-native-vector-icons/FontAwesome5"

export const InquiryPage = () => {
  const [searchResult, setSearchResult] = useState<string>("")
  const [filter, setFilter] = useState<string>("All")

  return (
    <View style={styles.container}>
      {/* Fixed SearchBox at the top */}
      <View style={styles.searchBoxContainer}>
        <SearchBox
          placeholder="Search inquiry"
          setValue={setSearchResult}
          value={searchResult}
        />
      </View>

      {/* Scrollable content below the fixed SearchBox */}
      <ScrollView style={styles.orderBodyContainer}>
        <OrderBody filter={filter} setFilter={setFilter} />
      </ScrollView>
    </View>
  )
}

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
