import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import Table from "../shared/table/table";
import TableRow from "../shared/table/tableRow";
import TableHeading from "../shared/table/tableHeading";
import { StyleSheet } from "react-native";

type TableData = {
  id: string;
  name: string;
  status: string;
  amount: string;
  date: string;
};

const sampleTableData = [
  {
    id: '1',
    name: 'John Enterprise',
    status: 'Completed',
    amount: '$1,275',
    date: '2024-03-20',
  },
  {
    id: '2',
    name: 'ABC Chemicals',
    status: 'Pending',
    amount: '$2,450',
    date: '2024-03-19',
  },
  {
    id: '3',
    name: 'Global Industries',
    status: 'Cancelled',
    amount: '$890',
    date: '2024-03-18',
  },
];

export const TableSection = () => {
  return (
    <View style={[dashboardWebStyles.singleSection, { marginTop: 16 }]}>
      <Text style={dashboardWebStyles.sectionHeader}>Recent Orders</Text>
      <Table style={styles.table}>
        <TableHeading style={styles.tableHeader}>
          <View style={styles.cell}><Text style={styles.headerText}>Name</Text></View>
          <View style={styles.cell}><Text style={styles.headerText}>Status</Text></View>
          <View style={styles.cell}><Text style={styles.headerText}>Amount</Text></View>
          <View style={styles.cell}><Text style={styles.headerText}>Date</Text></View>
        </TableHeading>
        {sampleTableData.map((row) => (
          <TableRow key={row.id} style={styles.tableRow}>
            <View style={styles.cell}><Text style={styles.cellText}>{row.name}</Text></View>
            <View style={styles.cell}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(row.status) }]}>
                <Text style={styles.statusText}>{row.status}</Text>
              </View>
            </View>
            <View style={styles.cell}><Text style={styles.cellText}>{row.amount}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{row.date}</Text></View>
          </TableRow>
        ))}
      </Table>
    </View>
  );
};

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return '#DCFCE7';
    case 'pending':
      return '#FEF9C3';
    case 'cancelled':
      return '#FEE2E2';
    default:
      return '#F1F5F9';
  }
};

const styles = StyleSheet.create({
  table: {
    marginTop: 16,
    backgroundColor: 'white',
  },
  tableHeader: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
  },
  tableRow: {
    paddingVertical: 12,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  headerText: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Avenir',
    fontWeight: '500',
  },
  cellText: {
    color: '#334155',
    fontSize: 14,
    fontFamily: 'Avenir',
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: 16,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Avenir',
    fontWeight: '500',
    color: '#334155',
  },
}); 