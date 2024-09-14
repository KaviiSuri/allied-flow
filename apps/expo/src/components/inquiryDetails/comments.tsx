import { StyleSheet, Text, View } from "react-native"

export const CommentsSection = () => {
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeader}>Henry</Text>
            <Text style={styles.time}>2 mins ago</Text>
          </View>
          <Text style={styles.sectionContent}>What price should we quote this time? @johndoe</Text>
        </View>


        <View style={styles.section}>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeader}>You</Text>
            <Text style={styles.time}>1 mins ago</Text>
          </View>
          <Text style={styles.sectionContent}>Same as last time @henry</Text>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
  },
  section: {
    marginBottom: 12,
    borderBottomColor: "#E2E8F0",
    borderBottomWidth: 1,
    padding: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
    color: "#1E293B"
  }

})
