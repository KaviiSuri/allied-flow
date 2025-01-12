import React from "react";
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createStyles } from "../BottomDrawerLayout";

interface BottomDrawerModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const windowHeight = Dimensions.get("window").height;

export const MobileDrawerModal: React.FC<BottomDrawerModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={createStyles.modalBackground}></View>
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={createStyles.modalContainer}
      >
        <View style={createStyles.formHeader}>
          <Text style={createStyles.formHeaderText}>{title}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={createStyles.closeButtonContainer}
          >
            <Icon style={createStyles.closeButtonIcon} name="times" />
          </TouchableOpacity>
        </View>
        <ScrollView style={createStyles.formBody}>
          <View>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
