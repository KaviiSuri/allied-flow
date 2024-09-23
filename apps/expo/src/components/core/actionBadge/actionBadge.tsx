import { TouchableOpacity,Text } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export const ActionBadgeMobile = ({actionText, iconName, handleAction}:{actionText: string, iconName: string, handleAction: () => void}) => {
    return (
<TouchableOpacity
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 4,
                }}
                onPress={() => {handleAction()}}
              >
                <Text
                  style={{
                    color: "#2F80F5",
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "Avenir",
                  }}
                >
                {actionText}
                </Text>
                <Icon style={{paddingTop: 4, color: "#2f80f5"}} name={iconName} />
              </TouchableOpacity>
    )}