import { StyleSheet } from "react-native";

export const dashboardWebStyles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    gap: 16,
    width: "100%",
    flex: 1,
  },
  boardSection: {
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eaecf0",
    backgroundColor: "white",
    padding: 12,
    flex: 1,
    gap: 8,
  },
  boardTopBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
