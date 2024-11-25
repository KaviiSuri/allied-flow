import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useState } from "react";

export const SearchBox = ({
  placeholder,
  setValue,
  value,
  list = [], // Default to an empty array if list is not provided
}: {
  placeholder: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  list?: string[]; // Optional list of items to match for autocomplete
}) => {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setValue(text);
    if (text && list.length > 0) {
      // Filter list only if it has items
      const matches = list.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredItems(matches);
    } else {
      setFilteredItems([]); // Clear suggestions if no input or list is empty
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBoxContainer}>
        <Icon name="search1" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          style={styles.placeholder}
          value={value}
          onChangeText={handleSearch}
        />
      </View>

      {/* Autocomplete dropdown (only shown if list is provided and filteredItems has matches) */}
      {list.length > 0 && filteredItems.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setValue(item);
                  setFilteredItems([]); // Hide suggestions after selection
                }}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
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
    outlineStyle: "none",
    flex: 1,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  suggestionItem: {
    padding: 10,
  },
  suggestionText: {
    color: "#1E293B",
  },
});
