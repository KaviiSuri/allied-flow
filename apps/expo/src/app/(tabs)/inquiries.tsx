import { useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";
import {
  Table,
  TableData,
  TableHeading,
  TableRow,
} from "~/components/shared/table";
const tempData = [
  {
    cas: "991",
    product: "Ketone",
    quantity: 3,
    price: -1,
    description: "This is a test description",
    make: "Sweet",
  },
  {
    cas: "12-21",
    product: "Aldehyde",
    quantity: 30,
    price: -1,
    description: "aaais a test description",
    make: "Salty",
  },
  {
    cas: "112122-21",
    product: "Ethanol",
    quantity: 13,
    price: 200,
    description: "This is a test description",
    make: "Sour",
  },
];

export default function Inquiries() {
  const [stateData, setData] = useState(tempData);
  const [currentSort, setCurrentSort] = useState({ key: "cas", order: "asc" });
  function handleTableSort(
    key: "cas" | "product" | "quantity" | "price" | "description" | "make",
  ) {
    const dummyStateData = [...stateData];
    if (currentSort.key === key) {
      if (currentSort.order === "asc") {
        setCurrentSort({ key, order: "desc" });
        dummyStateData.sort((a, b) => {
          return a[key] < b[key] ? 1 : -1;
        });
        setData(dummyStateData);
        return;
      }
      setCurrentSort({ key, order: "asc" });
      dummyStateData.sort((a, b) => {
        return a[key] > b[key] ? 1 : -1;
      });
      setData(dummyStateData);
    } else {
      setCurrentSort({ key, order: "asc" });
      dummyStateData.sort((a, b) => {
        return a[key] > b[key] ? 1 : -1;
      });
      setData(dummyStateData);
    }
  }
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        padding: 32,
      }}
    >
      <Table
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#DCDFEA",
          width: "100%",
        }}
      >
        <TableHeading style={{ backgroundColor: "#F1F5F9" }}>
          <TableData
            style={{
              fontSize: 12,
              color: "#475467",
              borderRightWidth: 1,
              borderColor: "#DCDFEA",
            }}
            onPress={() => {
              handleTableSort("product");
            }}
          >
            CAS
          </TableData>
          <TableData
            style={{
              fontSize: 12,
              color: "#475467",
              borderRightWidth: 1,
              borderColor: "#DCDFEA",
            }}
            onPress={() => {
              handleTableSort("product");
            }}
          >
            Product Name
          </TableData>
          <TableData
            style={{
              fontSize: 12,
              color: "#475467",
              borderRightWidth: 1,
              borderColor: "#DCDFEA",
            }}
            onPress={() => {
              handleTableSort("quantity");
            }}
          >
            Quantity
          </TableData>
          <TableData
            style={{
              fontSize: 12,
              color: "#475467",
              borderRightWidth: 1,
              borderColor: "#DCDFEA",
            }}
            onPress={() => {
              handleTableSort("price");
            }}
          >
            Price
          </TableData>
          <TableData
            style={{
              fontSize: 12,
              color: "#475467",
              borderRightWidth: 1,
              borderColor: "#DCDFEA",
            }}
            onPress={() => {
              handleTableSort("description");
            }}
          >
            Description
          </TableData>
          <TableData
            style={{ fontSize: 12, color: "#475467" }}
            onPress={() => {
              handleTableSort("make");
            }}
          >
            Make
          </TableData>
        </TableHeading>
        {stateData.map((data) => (
          <TableRow
            id={data.cas}
            key={data.cas}
            style={{ borderColor: "#DCDFEA" }}
          >
            <TableData style={{ borderRightWidth: 1, borderColor: "#DCDFEA" }}>
              {data.cas}
            </TableData>
            <TableData style={{ borderRightWidth: 1, borderColor: "#DCDFEA" }}>
              {data.product}
            </TableData>
            <TableData style={{ borderRightWidth: 1, borderColor: "#DCDFEA" }}>
              {data.quantity}
            </TableData>
            <TableData style={{ borderRightWidth: 1, borderColor: "#DCDFEA" }}>
              {data.price === -1 ? "-" : data.price}
            </TableData>
            <TableData style={{ borderRightWidth: 1, borderColor: "#DCDFEA" }}>
              {data.description}
            </TableData>
            <TableData>{data.make}</TableData>
          </TableRow>
        ))}
      </Table>
    </SafeAreaView>
  );
}
