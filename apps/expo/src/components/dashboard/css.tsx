import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const getBoardWidth = () => {
  if (width > 1200) return "23%"; // 4 items per row (for large screens)
  if (width > 800) return "31%"; // 3 items per row (for tablets)
  if (width > 500) return "48%"; // 2 items per row (for medium screens)
  return "48%"; // 1 item per row (for mobile)
};

export const dashboardWebStyles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    width: "100%",
    flex: 1,
  },
  dashboardBody: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    gap: 16,
    height: "100%",
    width: "100%",
  },
  singleSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffffff",
    gap: 20,
    padding: 16,
  },
  sectionHeader: {
    fontFamily: "Avenir",
    color: "#1E293B",
    fontWeight: 800,
    fontSize: 16,
  },
  boardTopBarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Ensures uniform gap instead of spreading out
    alignItems: "flex-start",
    width: "100%",
    gap: 10, // Adds a uniform spacing between elements (React Native 0.71+)
    paddingBottom: 10, // Ensures bottom spacing consistency
  },
  boardSectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Ensures uniform gap instead of spreading out
    alignItems: "flex-start",
    width: "100%",
    gap: 10, // Adds a uniform spacing between elements (React Native 0.71+)
    paddingBottom: 10, // Ensures bottom spacing consistency
  },
  boardSection: {
    minHeight: 90,
    width: getBoardWidth(), // Dynamic width based on screen size
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eaecf0",
    backgroundColor: "white",
    padding: 12,
    marginBottom: 10, // Ensures spacing between rows
  },
  graphSectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    gap: 10,
    paddingBottom: 10,
  },
  titleText: {
    fontFamily: "Avenir",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#334154",
  },
  indicator: {
    fontFamily: "AvenirHeavy",
    fontWeight: 500,
    fontSize: 24,
  },
});

export const graphStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    gap: 16,
  },
});
