import { View, Text } from "react-native";
import { SingleSelectDropdown } from "../dropdown";
import { MenuItem, SingleSelect } from "../dropdown/singleSelect";

interface FormDropDownProps {
  label?: string;
  options: {
    label: string;
    value: string;
  }[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  paddingBottom?: boolean,
}

export const FormDropDown: React.FC<FormDropDownProps> = ({
  label,
  options,
  rightIcon,
  onValueChange,
  value: _defaultValue,
  paddingBottom
}) => {
  return (
    <View>
      <SingleSelectDropdown style={{ justifyContent: "space-between" }}>
        {label &&
          <Text
            style={[
              {
                fontSize: 14,
                fontWeight: 400,
                fontFamily: "Avenir",
                color: "#475467",
              },
              paddingBottom && {
                paddingBottom: 8
              }
            ]}
          >
            {label}
          </Text>
        }
        <SingleSelect
          style={{ flexDirection: "row", alignItems: "center" }}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value={_defaultValue}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          defaultValue={_defaultValue}
          onChange={(e) => onValueChange(e)}
          changeLabel={true}
          rightIcon={rightIcon}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </SingleSelect>
      </SingleSelectDropdown>
    </View>
  );
};
