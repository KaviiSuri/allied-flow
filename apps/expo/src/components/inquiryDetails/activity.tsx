import { StyleSheet, Text, View } from "react-native";

export const ActivitySection = () => {
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeader}>
              Order has been placed for Ketone and 3 more items.
            </Text>
            <Text style={styles.time}>2 mins ago</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeader}>Henry accepted the price.</Text>
            <Text style={styles.time}>2 mins ago</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeader}>
              ABC Chemicals sent a new offer price.
            </Text>
            <Text style={styles.time}>2 mins ago</Text>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {},
  section: {
    marginBottom: 12,
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
    padding: 12,
  },
  headerContainer: {
    justifyContent: "space-between",
  },
  time: {
    fontWeight: 500,
    color: "#64748B",
    fontSize: 12,
  },
  sectionHeader: {
    color: "#1E293",
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Avenir",
    fontWeight: 800,
  },
  sectionContent: {
    fontSize: 14,
    paddingTop: 4,
    fontWeight: 500,
    lineHeight: 20,
    fontFamily: "Avenir",
    color: "#1E293B",
  },
});
