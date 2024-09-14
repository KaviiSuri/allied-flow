import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { api } from "~/utils/api";
import { useAbility } from "~/providers/auth";
import {
  Table,
  TableHeading,
  TableRow,
  TableData,
} from "~/components/shared/table";
import { useState } from "react";
import { router } from "expo-router";
const windowHeight = Dimensions.get("window").height - 64;





export default function SentInquiries() {
  const ability = useAbility();

  const [quoteVisible, setQuoteVisible] = useState(false);
  // const [drawerVisible, setDrawerVisible] = useState(false);

  // const toggleDrawer = () => {
  //   setDrawerVisible(!drawerVisible);
  // };
  const toggleQuoteVisible = () => {
    setQuoteVisible(!quoteVisible);
  };
  function viewQuote(): void {
    console.log("View Quote");
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F9F9F9",
        position: "relative",
      }}
    >
      {/* <CreateInquiryForm open={drawerVisible} toggleOpen={toggleDrawer} /> */}
      <Modal visible={quoteVisible}>
        <View
          style={{
            backgroundColor: "#fff",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            padding: 16,
          }}
        >
          <Text>Quote</Text>
          <Pressable onPress={toggleQuoteVisible}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </Modal>

      <View style={{ padding: 16, height: windowHeight }}>
        <Table style={{ backgroundColor: "#fff" }}>
          <TableHeading>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Inquiry Number
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Date
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Client Name
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Product Name
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Quote
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Status
            </TableData>
          </TableHeading>
          <Pressable
            onPress={() => {
              //push Inquiry details screen
              router.push("inquiry/123");
            }}
          >
            <TableRow>
              <TableData>#AC-3066</TableData>
              <TableData>23/03/2024</TableData>
              <TableData>John Enterprise</TableData>
              <TableData>Chemical 1, Chemical 2 and others</TableData>

              <Pressable
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  justifyContent: "center",
                  gap: 16,
                  flex: 1,
                }}
                onPress={toggleQuoteVisible}
              >
                <Text
                  style={{
                    color: "#2F80F5",
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "Avenir",
                  }}
                >
                  View Quote
                </Text>
              </Pressable>

              <TableData>Quote Received</TableData>
            </TableRow>
          </Pressable>
        </Table>
      </View>
    </SafeAreaView>
  );
}

