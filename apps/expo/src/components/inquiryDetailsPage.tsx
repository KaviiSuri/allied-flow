import { StyleSheet, Text } from "react-native"
import { Table, TableData, TableHeading, TableRow } from "./shared/table"
import { useEffect } from "react"
import type { RouterOutputs } from "@repo/api"
import { api } from "~/utils/api"


type QuoteItem = NonNullable<
  RouterOutputs["inquiry"]["getDetails"]["latestQuote"]
>["quoteItems"][0];

export const InquiryDetailsPage = ({quote}:{quote:RouterOutputs["inquiry"]["getDetails"]["latestQuote"] }) => {
  useEffect(()=>{
    console.log(quote)
  },[quote])
  
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
        {
          quote?.quoteItems.map((quoteItem) => (
            <QuoteTableData quoteItem={quoteItem} />
          ))
        }
      </Table>
    </>
  )
}

const QuoteTableData = ({quoteItem}:{quoteItem: QuoteItem}) => {
  const { data: productList, isLoading } = api.products.read.useQuery();
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  const product = productList?.find(
    (product) => product.id === quoteItem.productId,
  );
  if (!product) {
    return null;
  }
  return(
        <TableRow style={styles.tableRow} id={'1'} key={1}>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            {product.cas}
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            {product.name}
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            {quoteItem.quantity} {quoteItem.unit} 
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            Rs. {quoteItem.price} per {quoteItem.unit}
          </TableData>
          <TableData
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 2, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            {product.desc}
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 400, flex: 1, borderRightWidth: 1, borderColor: "#DCDFEA" }}>
            {product.make}
          </TableData>
          <TableData style={{ fontSize: 14, color: "#1E293B", fontWeight: 500, flex: 1 / 3 }}>
          </TableData>
        </TableRow>
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
