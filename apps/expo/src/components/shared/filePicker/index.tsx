import React from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/Feather";

const FilePickerExample = () => {
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // You can specify file types here, e.g., 'image/*', 'application/pdf'
        copyToCacheDirectory: true,
      });
      console.log(result);
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#CBD5E1",
        borderRadius: 8,
      }}
    >
      <TouchableOpacity onPress={pickDocument} style={{
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
        gap : 8
      }}>
        <Icon size={24} name="upload" color={"black"} />
        <Text style={{color: "#696969"}}>Upload technical documents here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilePickerExample;
