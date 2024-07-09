import { Image, StyleSheet, Text, View } from "react-native"
import { SingleSelectDropdown } from "./shared/dropdown"
import { SingleSelect } from "./shared/dropdown/singleSelect"
import { useState } from "react"
import { useLogto } from "@logto/rn"
import { logtoService } from "~/config/logto"
import { Colors } from "~/constants/Color"
import OrgIcon from "~/app/assets/images/org-icon.png"
import DownArrowIcon from "~/app/assets/images/down-arrow-icon.png"
import ShareIcon from "~/app/assets/images/share-icon.png"
import LogoutIcon from "~/app/assets/images/logout-icon.png"
import NotebookIcon from "~/app/assets/images/notebook-icon.png"
import { MenuItem } from "./shared/dropdown/multiSelect"


export const Logout: React.FC = () => {
  const [logout, _setLogout] = useState("")
  const { signOut } = useLogto()

  const handleClick = () => {
    /* empty */
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
            source={OrgIcon}
            style={{ ...styles.icon, marginRight: 10 }}
            tintColor={Colors.text}
            resizeMode="contain"
          />}
          rightIcon={<Image
            source={DownArrowIcon}
            style={styles.icon}
            resizeMode="contain"
            tintColor={Colors.text}
          />}
        >
          <MenuItem
            value="invite"
            style={styles.item}
            onPress={() => console.log("Invite")}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={ShareIcon}
                style={{ ...styles.itemIcon }}
                tintColor={Colors.text}
                resizeMode="contain"
              />
              <Text style={{ ...styles.itemText, color: Colors.text }}>Invite members</Text>
            </View>
          </MenuItem>
          <MenuItem
            value="logout"
            style={styles.item}
            onPress={() => {
              signOut(logtoService.redirectUri).catch(console.error);
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={LogoutIcon}
                style={{ ...styles.itemIcon }}
                tintColor={Colors.error}
                resizeMode="contain"
              />
              <Text style={{ ...styles.itemText, color: Colors.error }}>Logout</Text>
            </View>
          </MenuItem>
        </SingleSelect>
      </SingleSelectDropdown>
      <Image
        source={NotebookIcon}
        style={styles.trailingIcon}
        resizeMode="contain"
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
    width: 16,
    height: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  itemText: {
    fontFamily: 'Avenir',
    fontSize: 14,
  },
  trailingIcon: {
    width: 20,
    height: 20,
    marginRight: 40,
  }
});
