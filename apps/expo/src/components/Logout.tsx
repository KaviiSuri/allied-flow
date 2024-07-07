import { Text, View } from "react-native"
import { SingleSelectDropdown } from "./shared/dropdown"
import { DropDownLabel, MenuItem, SingleSelect } from "./shared/dropdown/singleSelect"
import { useState } from "react"


export const Logout: React.FC = () => {
  const [logout, setLogout] = useState("")

  const handleClick = () => {

  }
  return (
    <View >
      <SingleSelectDropdown >
        <SingleSelect
          value={logout}
          defaultValue="ABC Chemicals"
          onChange={handleClick}
          changeLabel={false}
        >
          <MenuItem key={"invite"} value={"invite"}>
            Invite Members
          </MenuItem>
          <MenuItem key={"logout"} value={"Logout"}>
            Logout
          </MenuItem>
        </SingleSelect>
      </SingleSelectDropdown>
    </View>
  )
}
