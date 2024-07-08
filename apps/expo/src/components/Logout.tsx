import { Image, Pressable, Text, View } from "react-native"
import { SingleSelectDropdown } from "./shared/dropdown"
import { DropDownLabel, MenuItem, SingleSelect } from "./shared/dropdown/singleSelect"
import { useState } from "react"
import { useLogto } from "@logto/rn"
import { logtoService } from "~/config/logto"
import { Colors } from "~/constants/Color"


export const Logout: React.FC = () => {
  const [logout, setLogout] = useState("")

  const handleClick = () => {

  }

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <SingleSelectDropdown style={{
        marginVertical: 20,
        marginLeft:20,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 10,
      }} >
        <SingleSelect
          style={{ width: 200, flexDirection: 'row', alignItems: 'center' }}
          value={logout}
          defaultValue="ABC Chemicals"
          onChange={handleClick}
          changeLabel={false}
          leftIcon={<Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require('../app/assets/images/org-icon.png')}
            style={{
              resizeMode: "contain",
              width: 16,
              tintColor: Colors.text,
              height: 16,
              marginRight: 10,
            }}
          />}
          rightIcon={<Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require('../app/assets/images/down-arrow-icon.png')}
            style={{
              resizeMode: "contain",
              width: 16,
              tintColor: Colors.text,
              height: 16,
            }}
          />}
        >
          <Pressable
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: Colors.border,
            }}
            onPress={() => console.log("Invite")}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={require('../app/assets/images/share-icon.png')}
                style={{
                  resizeMode: "contain",
                  width: 16,
                  tintColor: Colors.text,
                  height: 16,
                  marginRight: 10,
                }}
              />
              <Text style={{
                fontFamily: 'Avenir',
                fontSize: 14,
                color: Colors.text,
              }}>Invite members</Text>
            </View>
          </Pressable>
          <Pressable
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: Colors.border,
            }}
            onPress={() => console.log("Logout")}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={require('../app/assets/images/logout-icon.png')}
                style={{
                  resizeMode: "contain",
                  width: 16,
                  tintColor: Colors.error,
                  height: 16,
                  marginRight: 10,

                }}
              />
              <Text style={{
                fontFamily: 'Avenir',
                fontSize: 14,
                color: Colors.error,
              }}>Logout</Text>
            </View>
          </Pressable>
        </SingleSelect>
      </SingleSelectDropdown>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        source={require('../app/assets/images/notebook-icon.png')}
        style={{
          resizeMode: "contain",
          width: 20,
          height: 20,
          marginRight: 40,
        }}
      />
    </View>
  )
}
