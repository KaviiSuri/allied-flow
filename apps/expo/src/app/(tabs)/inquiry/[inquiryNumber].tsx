import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-svg";
import Toast from "react-native-toast-message";

export default function InquiryDetails() {
  useEffect(() => {
    Toast.show({
      type: "success",
      text1: "Inquiry Details",
      text2: "This is the inquiry details screen",
    });
  }, []);
  return (
    <View>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
      <Text>Inquiry Details</Text>
    </View>
  );
}
