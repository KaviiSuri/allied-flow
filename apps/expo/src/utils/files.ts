import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export const downloadFile = async (url: string, filename: string) => {
  try {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      // Mobile: Use expo-file-system to download
      const fileUri = FileSystem.documentDirectory + filename;
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log("Sharing is not available");
      }
    } else {
      // Web: Use an <a> tag to trigger the download
      // @ts-ignore
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = filename;
      // @ts-ignore
      document.body.appendChild(link);
      link.click();
      // @ts-ignore
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

