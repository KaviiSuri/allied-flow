import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";

export const CenterModalComponent = ({
  visible,
  setVisible,
  children,
  onUpdateRequest,
  onAcceptRequest,
  onRejectRequest,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  onUpdateRequest: () => void;
  onAcceptRequest: () => void;
  onRejectRequest: () => void;
}) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
      style={styles.modal}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* header */}
              <View style={{ flexDirection: "row", gap: 16 }}>
                <Icon name="arrow-switch" size={24} color="black" />
                <View>
                  <Text
                    style={{
                      fontFamily: "AvenirHeavy",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    Requested a price update
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Avenir",
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#64748B",
                    }}
                  >
                    2023-06-14 12:00 PM
                  </Text>
                </View>
              </View>
              {/* content */}
              <View>{children}</View>
              {/* footer */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <SecondaryButton
                  text="Reject Request"
                  onPress={onRejectRequest}
                />
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <SecondaryButton
                    text="Update Request"
                    onPress={onUpdateRequest}
                  />
                  <PrimaryButton
                    text="Accept Request"
                    onPress={onAcceptRequest}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    backgroundColor: "white",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.5,
    padding: 20,
    gap: 16,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
});
