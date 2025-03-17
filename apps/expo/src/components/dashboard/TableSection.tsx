import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import Table from "../shared/table/table";
import TableRow from "../shared/table/tableRow";
import TableHeading from "../shared/table/tableHeading";
import { StyleSheet } from "react-native";
import { api } from "~/utils/api";

export const TableSection = () => {
  const end_date = new Date();
  const start_date = new Date();
  start_date.setDate(start_date.getDate() - 30);

  const { data: productRankings } = api.analytics.getProductRankings.useQuery({
    dateRange: {
      start_date,
      end_date,
    },
    sortBy: "revenue",
    sortOrder: "desc",
    limit: 10,
  });

  return (
    <View style={[dashboardWebStyles.singleSection, { marginTop: 16 }]}>
      <Text style={dashboardWebStyles.sectionHeader}>Top Products</Text>
      <Table style={styles.table}>
        <TableHeading style={styles.tableHeader}>
          <View style={styles.cell}>
            <Text style={styles.headerText}>Product Name</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.headerText}>Make</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.headerText}>CAS</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.headerText}>Revenue</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.headerText}>Orders</Text>
          </View>
        </TableHeading>
        {productRankings?.map((product) => (
          <TableRow key={product.id} style={styles.tableRow}>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{product.name}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{product.make}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{product.cas}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>
                Rs. {product.metrics.revenue?.toLocaleString()}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellText}>{product.metrics.orders}</Text>
            </View>
          </TableRow>
        ))}
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    marginTop: 16,
    backgroundColor: "white",
  },
  tableHeader: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
  },
  tableRow: {
    paddingVertical: 12,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  headerText: {
    color: "#64748B",
    fontSize: 12,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
  cellText: {
    color: "#334155",
    fontSize: 14,
    fontFamily: "Avenir",
    fontWeight: "500",
  },
});
