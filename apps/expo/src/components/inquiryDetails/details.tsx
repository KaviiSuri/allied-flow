import { StyleSheet, Text, View } from "react-native";

export const DetailsSection = () => {
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Company Name</Text>
          <Text style={styles.sectionContent}>John Enterprise PVT LTD</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Company Address</Text>
          <Text style={styles.sectionContent}>
            39 avenue street - 06310 - grasse - Associate allied chemicals
            europe- Alpes-maritime, France
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Inquiry number</Text>
          <Text style={styles.sectionContent}>3066</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>GST Number</Text>
          <Text style={styles.sectionContent}>9AAACH7409R1ZZ</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {},
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Avenir",
    fontWeight: 400,
  },
  sectionContent: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
    fontFamily: "Avenir",
    color: "#1E293B",
  },
});
