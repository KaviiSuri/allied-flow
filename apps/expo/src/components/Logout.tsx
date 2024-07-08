import { Image, Pressable, StyleSheet, Text, View } from "react-native"
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
    <View style={styles.header}>
      <SingleSelectDropdown style={styles.dropdown} >
        <SingleSelect
          style={styles.dropdownItem}
          value={logout}
          defaultValue="ABC Chemicals"
          onChange={handleClick}
          changeLabel={false}
          leftIcon={<Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require('../app/assets/images/org-icon.png')}
            style={{ ...styles.icon, marginRight: 10 }}
          />}
          rightIcon={<Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require('../app/assets/images/down-arrow-icon.png')}
            style={styles.icon}
          />}
        >
          <Pressable
            style={styles.item}
            onPress={() => console.log("Invite")}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={require('../app/assets/images/share-icon.png')}
                style={{ ...styles.itemIcon, tintColor: Colors.text }}
              />
              <Text style={{ ...styles.itemText, color: Colors.text }}>Invite members</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.item}
            onPress={() => console.log("Logout")}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={require('../app/assets/images/logout-icon.png')}
                style={{ ...styles.itemIcon, tintColor: Colors.error }}
              />
              <Text style={{ ...styles.itemText, color: Colors.error }}>Logout</Text>
            </View>
          </Pressable>
        </SingleSelect>
      </SingleSelectDropdown>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        source={require('../app/assets/images/notebook-icon.png')}
        style={styles.trailingIcon}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    marginVertical: 20,
    marginLeft: 20,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  dropdownItem: { width: 200, flexDirection: 'row', alignItems: 'center', },
  icon: {
    resizeMode: "contain",
    width: 16,
    tintColor: Colors.text,
    height: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemIcon: {
    resizeMode: "contain",
    width: 16,
    height: 16,
    marginRight: 10,
  },
  itemText: {
    fontFamily: 'Avenir',
    fontSize: 14,
  },
  trailingIcon: {
    resizeMode: "contain",
    width: 20,
    height: 20,
    marginRight: 40,
  }
});