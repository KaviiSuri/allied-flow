import { StyleSheet } from "react-native";
import { Colors } from "~/constants/Color";

export const dropDownStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    flex: 1,
    width: "100%",
  },
  dropdownItem: { width: "100%", flex: 1, flexDirection: "row", alignItems: "center" },
  icon: {
    width: 16,
    height: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  itemText: {
    fontFamily: "Avenir",
    fontSize: 14,
  },
  trailingIcon: {
    width: 20,
    height: 20,
    marginRight: 40,
  },
});
