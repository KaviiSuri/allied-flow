import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/Feather";
import { api, RouterInputs } from "../../../utils/api";

type StorageFolderName = RouterInputs["files"]["getUploadUrls"]["folderName"];

interface FilePickerProps {
  onUploadComplete: (result: {
    downloadUrl: string;
    storagePath: string;
    name: string;
  }) => void;
  onUploadError: (error: Error) => void;
  onRemoveFile?: () => void;
  folderName: StorageFolderName;
  allowedTypes?: string[];
  label?: string;
  currentFile?: {
    name?: string;
    url: string;
  };
}

const FilePicker: React.FC<FilePickerProps> = ({
  onUploadComplete,
  onUploadError,
  folderName,
  currentFile,
  onRemoveFile,
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  label = "Upload document here",
}) => {
  const { mutateAsync } = api.files.getUploadUrls.useMutation();
  const [isUploading, setIsUploading] = useState(false);

  const pickAndUploadDocument = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        setIsUploading(false);
        return;
      }

      const { uri, name } = result.assets[0];

      // Get pre-signed URLs from the API
      const { uploadUrl, downloadUrl, storagePath } = await mutateAsync({
        fileName: name,
        folderName: folderName as StorageFolderName,
      });

      // Upload the file using the pre-signed URL
      const response = await fetch(uri);
      const blob = await response.blob();

      await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      console.log("File uploaded successfully:", {
        downloadUrl,
        storagePath,
        name,
      });

      onUploadComplete({ downloadUrl, storagePath, name });
    } catch (error) {
      console.error("Error uploading file:", error);
      onUploadError(
        error instanceof Error ? error : new Error("Unknown error occurred"),
      );
    } finally {
      setIsUploading(false);
    }
  };
  console.log('quoteItem currentFile', currentFile)

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
        opacity: isUploading ? 0.7 : 1,
      }}
    >
      {!currentFile && (
        <TouchableOpacity
          onPress={pickAndUploadDocument}
          disabled={isUploading}
          style={{
            flexDirection: "row",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Icon size={24} name="upload" color={"black"} />
          )}
          <Text>{isUploading ? "Uploading..." : label}</Text>
        </TouchableOpacity>
      )}

      {currentFile && (
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 12,
            paddingHorizontal: 16,
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon size={24} name="file" color={"black"} />
          <Text>{currentFile.name}</Text>
          <TouchableOpacity onPress={onRemoveFile}>
            <Icon size={32} name="x" color={"red"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default FilePicker;
