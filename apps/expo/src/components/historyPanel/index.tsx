import { StyleSheet } from "react-native";
import { Table, TableData, TableHeading, TableRow } from "../shared/table";

export const HistoryPanelTable = () => {
  return (
    <Table style={styles.tableContainer}>
      <TableHeading style={{ backgroundColor: "#F1F5F9" }}>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Company name
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 2,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Unit Price
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Quantity
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 500,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Date
        </TableData>
      </TableHeading>
      {/* random data  */}
      <TableRow style={styles.tableRow} id={"1"} key={1}>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          John enterprises
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 2,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Rs. 1022
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          3 kg
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          23/03/2024
        </TableData>
      </TableRow>

      <TableRow style={styles.tableRow} id={"1"} key={1}>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Sam Pvt. limited
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 2,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          Rs. 1022
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          3 kg
        </TableData>
        <TableData
          style={{
            fontSize: 14,
            color: "#1E293B",
            fontWeight: 400,
            flex: 1,
            borderRightWidth: 1,
            borderColor: "#DCDFEA",
          }}
        >
          23/03/2024
        </TableData>
      </TableRow>
    </Table>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: 8,
    backgroundColor: "white",
  },
  tableRow: {
    flex: 1,
  },
  tableDataFlex1: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#DCDFEA",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
  },
  tableDataFlex2: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#DCDFEA",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 20,
  },
});
