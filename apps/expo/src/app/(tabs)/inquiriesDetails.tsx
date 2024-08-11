import { Dimensions, Pressable, SafeAreaView, Text, View } from "react-native";
const windowHeight = Dimensions.get("window").height - 64;
import {
  Table,
  TableHeading,
  TableRow,
  TableData,
} from "~/components/shared/table";

export default function InquiriesDetails() {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F9F9F9",
        position: "relative",
      }}
    >
      <View style={{ padding: 16, height: windowHeight }}>
        <Table style={{ backgroundColor: "#fff"

        }}>
          <TableHeading>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              CAS
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Product Name
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Quantity
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467"}}>
              Price
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467"}}>
              Description
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Make
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
            </TableData>
          </TableHeading>
          
            <TableRow>
              <TableData >#AC-3066</TableData>
              <TableData>Ketone</TableData>
              <TableData >3 kg</TableData>
              <TableData >-</TableData>
              <TableData style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            
                textAlign: "left",
              }}>A ketone is a compound with the scary tail and funny head</TableData>
              <TableData >Chemical</TableData>
              <Pressable >
              <TableData >:</TableData>
              </Pressable>
            </TableRow>
          
        </Table>
      </View>
    </SafeAreaView>
  );
}
