import { StyleSheet } from "react-native"
import { Table, TableData, TableHeading, TableRow } from "./shared/table"

export const InquiryDetailsPage = () => {
  return (
    <>
      <Table style={styles.tableContainer}>
        <TableHeading style={{ backgroundColor: "#F1F5F9" }}>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            CAS
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Product Name
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Quantity
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Price
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Description
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Make
          </TableData>

          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1 / 3 }}>
          </TableData>
        </TableHeading>
        {/* random data  */}
        <TableRow style={styles.tableRow} id={'1'} key={1}>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            68845-36-3
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Ketone
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            3 kg
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Rs. 1,100 per Kg
          </TableData>
          <TableData
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            A ketone is a compound with the structure R−C−R', where R and R' can be carbon.
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Sweet
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1 / 3 }}>
          </TableData>
        </TableRow>


        <TableRow style={styles.tableRow} id={'1'} key={2}>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            68845-36-3
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Ketone
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            3 kg
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Rs. 1,100 per Kg
          </TableData>
          <TableData
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            A ketone is a compound with the structure R−C−R', where R and R' can be carbon.
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Sweet
          </TableData>

          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1 / 3 }}>
          </TableData>
        </TableRow>


        <TableRow style={styles.tableRow} id={'1'} key={3}>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            68845-36-3
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Ketone
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            3 kg
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Rs. 1,100 per Kg
          </TableData>
          <TableData
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            A ketone is a compound with the structure R−C−R', where R and R' can be carbon.
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Sweet
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1 / 3 }}>
          </TableData>
        </TableRow>
      </Table>
    </>
  )
}


const styles = StyleSheet.create({
  tableContainer: {
    borderRadius: 8,
    backgroundColor: "white"
  },
  tableRow: {
    flex: 1
  },
  tableDataFlex1: {
    flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA", fontWeight: 400, fontSize: 14, lineHeight: 20
  },
  tableDataFlex2: {
    flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA", fontWeight: 400, fontSize: 14, lineHeight: 20,
  }
})
