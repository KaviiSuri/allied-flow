import {
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useState, useRef } from "react";

export const SearchClientBox = ({
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
  const blurTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleSearch = (text: string) => {
    setValue(text);
    if (text && list.length > 0) {
      const matches = list.filter((item) =>
        item.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredItems(matches);
    } else {
      setFilteredItems([]);
    }
  };

  const handleSuggestionPress = (item: string) => {
    console.log("LOGS: PRESS:", item);
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
    }
    setValue(item);
    setFilteredItems([]);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setFilteredItems([]);
    }, 100);
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchBoxContainer}>
        <Icon name="search1" size={20} color="#94a3b8" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          style={styles.placeholder}
          value={value}
          onChangeText={handleSearch}
          onBlur={() => {
            handleBlur();
          }}
          onFocus={() => {
            handleSearch(value);
          }}
        />
      </View>

      {list.length > 0 && filteredItems.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestionItem}
                onPressIn={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </Pressable>
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
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
  },
  placeholder: {
    color: "#1E293B",
    flex: 1,
    outlineWidth: 0, // Remove default outline on focus
    fontSize: 16,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 5, // for Android
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    backgroundColor: "#ffffff", // Background color for suggestions
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  suggestionText: {
    color: "#1E293B",
    fontSize: 16,
  },
});
