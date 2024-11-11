import { Text, View } from "react-native";
import { dashboardWebStyles } from "./css";
import {
  SingleSelect,
  SingleSelectDropdown,
} from "../shared/dropdown/singleSelect";
import { MenuItem } from "../shared/dropdown/multiSelect";
import Icon from "react-native-vector-icons/Feather";
import { useState } from "react";

export const BoardSection = ({ title }: { title: string }) => {
  const [selected, setSelected] = useState<string | number>("All");
  return (
    <View style={dashboardWebStyles.boardSection}>
      <View style={dashboardWebStyles.boardTopBarContainer}>
        <Text style={dashboardWebStyles.titleText}>{title}</Text>
        <SingleSelectDropdown
          style={{
            flexDirection: "row",
            width: 120,
          }}
        >
          <SingleSelect
            value={selected}
            defaultValue="All"
            onChange={(e) => setSelected(e)}
            leftIcon={<Icon name="calendar" />}
            rightIcon={<Icon name="chevron-down" />}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
            changeLabel={true}
          >
            <MenuItem value={"All"}>All time</MenuItem>
            <MenuItem value={"Last_week"}>Last week</MenuItem>
            <MenuItem value={"Last_month"}>Last month</MenuItem>
          </SingleSelect>
        </SingleSelectDropdown>
      </View>
      <Text style={dashboardWebStyles.indicator}>1275</Text>
    </View>
  );
};
