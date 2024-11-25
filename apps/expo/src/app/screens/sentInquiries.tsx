import {
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { RouterOutputs } from "~/utils/api";
import {
  Table,
  TableHeading,
  TableRow,
  TableData,
} from "~/components/shared/table";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { BadgeStatus } from "~/components/shared/badge";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RightDrawerLayout from "~/components/layouts/RightDrawerLayout/rightDrawerLayout";
import { ActionBadge } from "~/components/core/actionBadge";
import { useUser } from "~/providers/auth";
const windowHeight = Dimensions.get("window").height - 64;

interface IClient {
  id: string;
  address: string;
  createdAt: string;
  gstNo: string | null;
  name: string;
  type: "CLIENT" | "SELLER";
  updatedAt: string;
}

export default function SentInquiries({
  inquiries,
}: {
  inquiries: RouterOutputs["inquiry"]["list"]["items"][0][];
}) {
  const [quoteVisible, setQuoteVisible] = useState(false);
  const toggleQuoteVisible = () => {
    setQuoteVisible(!quoteVisible);
  };

  useEffect(() => {
    console.log(inquiries);
  }, [inquiries]);

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
  const [clientDetailsVisible, setClientDetailsVisible] =
    useState<boolean>(false);
  const [currentClientDetails, setCurrentClientDetails] =
    useState<IClient | null>(null);

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
      {currentClientDetails !== null && (
        <RightDrawerLayout
          visible={clientDetailsVisible}
          toggleVisible={() => setClientDetailsVisible(!clientDetailsVisible)}
        >
          <ClientDetails
            currentClientDetails={currentClientDetails}
            setClientDetailsVisible={() => setClientDetailsVisible(false)}
          />
        </RightDrawerLayout>
      )}
      <View style={{ padding: 16, height: windowHeight }}>
        <Table style={{ backgroundColor: "#fff" }}>
          <TableHeading>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Inquiry Number
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Date
            </TableData>

            {user?.team.type !== "CLIENT" && (
              <TableData style={{ fontSize: 12, color: "#475467" }}>
                Client Name
              </TableData>
            )}
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
          <View>
            {inquiries.map(
              (inquiry: RouterOutputs["inquiry"]["list"]["items"][0]) => {
                return (
                  <TableRow>
                    <TableData>
                      <Text style={{ fontFamily: "Avenir" }}>{inquiry.id}</Text>
                    </TableData>
                    <TableData>
                      {/* <Text style={{fontFamily: "Avenir"}}> */}
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                      {/* </Text> */}
                    </TableData>

                    {user?.team.type !== "CLIENT" && (
                      <Pressable
                        style={{
                          flex: 1,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: 4,
                        }}
                        onPress={() => {
                          setClientDetailsVisible(true);
                          setCurrentClientDetails(inquiry.buyer);
                          console.log(currentClientDetails);
                        }}
                      >
                        <Icon
                          style={{ paddingTop: 4 }}
                          name="office-building-outline"
                        />
                        <Text
                          style={{
                            fontFamily: "Avenir",
                            textDecorationColor: "black",
                            textDecorationLine: "underline",
                          }}
                        >
                          {inquiry.buyer.name}
                        </Text>
                      </Pressable>
                    )}
                    <TableData>
                      <Text style={{ fontFamily: "Avenir" }}>
                        {/* {inquiry.productNames} */}
                        {formatProducts(inquiry.productNames)}
                      </Text>
                    </TableData>
                    {inquiry.status === "NEGOTIATING" && (
                      <ActionBadge
                        iconName="open-in-new"
                        actionText="View Quote"
                        handleAction={() =>
                          router.push(`../(tabs)/inquiry/${inquiry.id}`)
                        }
                      />
                    )}
                    {inquiry.status === "RAISED" &&
                      (user?.team.type === "CLIENT" ? (
                        <ActionBadge
                          iconName="notifications-on"
                          actionText="Follow Up"
                          materialIcon={true}
                          handleAction={() =>
                            router.push(`../(tabs)/inquiry/${inquiry.id}`)
                          }
                        />
                      ) : (
                        <ActionBadge
                          iconName="open-in-new"
                          actionText="Send Quote"
                          handleAction={() =>
                            router.push(
                              `../(tabs)/inquiry/sendQuote/${inquiry.id}`,
                            )
                          }
                        />
                      ))}
                    {(inquiry.status === "ACCEPTED" ||
                      inquiry.status === "REJECTED") && (
                      <ActionBadge
                        iconName="open-in-new"
                        actionText="View Quote"
                        handleAction={() =>
                          router.push(`../(tabs)/inquiry/${inquiry.id}`)
                        }
                      />
                    )}
                    <TableData>
                      <BadgeStatus status={inquiry.status} />
                    </TableData>
                  </TableRow>
                );
              },
            )}
          </View>
        </Table>
      </View>
    </SafeAreaView>
  );
}

const ClientDetails = ({
  currentClientDetails,
  setClientDetailsVisible,
}: {
  currentClientDetails: IClient | null;
  setClientDetailsVisible: () => void;
}) => {
  return (
    <>
      <View style={clientDetailsStyles.sectionHeader}>
        <Text style={clientDetailsStyles.sectionHeaderText}>
          {currentClientDetails?.name}
        </Text>
        <Pressable onPress={setClientDetailsVisible}>
          <Icon name="close" style={clientDetailsStyles.sectionHeaderText} />
        </Pressable>
      </View>
      <ScrollView style={clientDetailsStyles.clientBody}>
        <View style={clientDetailsStyles.clientCard}>
          <Text style={clientDetailsStyles.clientCardHeader}>Company Name</Text>
          <Text style={clientDetailsStyles.clientCardHeaderText}>
            {currentClientDetails?.name}
          </Text>
        </View>
        <View style={clientDetailsStyles.clientCard}>
          <Text style={clientDetailsStyles.clientCardHeader}>
            Company Address
          </Text>
          <Text style={clientDetailsStyles.clientCardHeaderText}>
            {currentClientDetails?.address}
          </Text>
        </View>
        {currentClientDetails?.gstNo && (
          <View style={clientDetailsStyles.clientCard}>
            <Text style={clientDetailsStyles.clientCardHeader}>GST Number</Text>
            <Text style={clientDetailsStyles.clientCardHeaderText}>
              {currentClientDetails.gstNo}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const clientDetailsStyles = StyleSheet.create({
  sectionHeader: {
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomColor: "#e2e8f0",
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  sectionHeaderText: {
    fontFamily: "AvenirHeavy",
    fontWeight: 800,
    fontSize: 18,
    color: "#1e293b",
  },
  clientBody: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  clientCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    borderColor: "#e2e8f0",
    gap: 8,
    marginBottom: 16,
  },
  clientCardHeader: {
    fontSize: 16,
    color: "#475467",
    fontFamily: "Avenir",
    fontWeight: 500,
  },
  clientCardHeaderText: {
    fontSize: 18,
    color: "#1e293b",
    fontFamily: "AvenirHeavy",
    fontWeight: 800,
  },
});
