import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome5";

export const BottomDrawer = ({
  children,
  openCreateForm,
  setOpenCreateForm,
  primaryButtonText,
  secondaryButtonText,
  header,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
}: {
  children: JSX.Element[] | JSX.Element;
  openCreateForm: boolean;
  setOpenCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  header: string;
  onPrimaryButtonPress?: () => void;
  onSecondaryButtonPress?: () => void;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openCreateForm}
      onRequestClose={() => setOpenCreateForm(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOpenCreateForm(false)}>
        <View style={createStyles.modalBackground}></View>
      </TouchableWithoutFeedback>

      {/* Modal content: white section */}
      <View style={createStyles.modalContainer}>
        {/* Your modal content goes here */}
        <View style={createStyles.formHeader}>
          <Text style={createStyles.formHeaderText}>{header}</Text>
          <TouchableOpacity
            onPress={() => setOpenCreateForm(false)}
            style={createStyles.closeButtonContainer}
          >
            <Icon style={createStyles.closeButtonIcon} name="times" />
          </TouchableOpacity>
        </View>
        <ScrollView style={createStyles.formBody}>
          <View>{children}</View>
        </ScrollView>

        <GestureHandlerRootView style={createStyles.formSubmitContainer}>
          {secondaryButtonText && (
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                borderColor: "#D0D5DD",
                borderWidth: 1,
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowColor: "#101828",
                flex: 1,
              }}
              onPress={onSecondaryButtonPress}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  fontFamily: "Avenir",
                  color: "#344054",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
          {primaryButtonText && (
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: "#2F80F5",
                borderRadius: 8,
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.05,
                shadowColor: "#101828",
                flex: 1,
              }}
              onPress={onPrimaryButtonPress}
            >
              <Text
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "white",
                  fontFamily: "Avenir",
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {primaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
};

export const createStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: "red",
  },
  createButtonContainer: {
    height: 46,
    width: 46,
    borderRadius: 24,
    position: "absolute",
    right: 16,
    bottom: 50,
  },
  createButton: {
    height: "100%",
    borderRadius: 24,
    width: "100%",
    backgroundColor: "#2f80f5",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
  },
  modalContainer: {
    height: 669,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // translucent background
    justifyContent: "flex-end", // content sticks to the bottom
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#E2E8F0",
    padding: 16,
    borderBottomWidth: 1,
  },
  formHeaderText: {
    fontWeight: 800,
    fontFamily: "AvenirHeavy",
    fontSize: 14,
  },
  closeButtonContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonIcon: {
    fontSize: 14,
  },
  formBody: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  formSubmitContainer: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    paddingBottom: 46,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderColor: "#E2E8F0",
    borderTopWidth: 1,
    gap: 16,
  },
});
