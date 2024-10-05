import { StyleSheet, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export const SearchBox = ({
  placeholder,
  setValue,
  value,
}: {
  placeholder: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
}) => {
  return (
    <View style={styles.searchBoxContainer}>
      <Icon name="search1" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.placeholder}
        value={value}
        onChangeText={(e) => setValue(e)} // Update the value when text changes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBoxContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
  },
  placeholder: {
    color: "#1E293B",
    borderWidth: 0,
    flex: 1, // Ensures the TextInput takes up the available space
  },
});
