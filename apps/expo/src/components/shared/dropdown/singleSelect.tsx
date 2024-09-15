import type { ReactNode } from "react";
import React, { useState, useRef, useEffect, useContext } from "react";
import type { ViewStyle, TextStyle } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  LayoutChangeEvent,
  Image,
} from "react-native";
import { Colors } from "~/constants/Color";
import FilledRadioIcon from "~/app/assets/images/filled-radio.png";
import UnfilledRadioIcon from "~/app/assets/images/unfilled-radio.png";

interface Option {
  label: string;
  value: string | number;
}

interface SingleSelectDropdownProps {
  children: ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

interface DropDownLabelProps {
  id?: string;
  children: ReactNode;
  style?: TextStyle;
}

interface SingleSelectProps {
  value: string | number;
  defaultValue: string;
  onChange: (value: string | number) => void;
  children: ReactNode;
  style?: ViewStyle;
  changeLabel?: boolean;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
}

interface MenuItemProps {
  value: string | number;
  children: ReactNode;
  style?: TextStyle;
}

interface SingleSelectDropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | number | null;
  onChange: (value: string | number) => void;
  dropdownPosition: { top: number; left: number; width: number };
  setDropdownPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number; width: number }>
  >;
}

const SingleSelectDropdownContext =
  React.createContext<SingleSelectDropdownContextType>({
    open: false,
    setOpen: () => { },
    value: null,
    onChange: () => { },
    dropdownPosition: { top: 0, left: 0, width: 0 },
    setDropdownPosition: () => { },
  });

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  children,
  fullWidth,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const handleChange = (newValue: string | number) => {
    setValue(newValue);
    setOpen(false);
  };

  return (
    <SingleSelectDropdownContext.Provider
      value={{
        open,
        setOpen,
        value,
        onChange: handleChange,
        dropdownPosition,
        setDropdownPosition,
      }}
    >
      <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
        {children}
      </View>
    </SingleSelectDropdownContext.Provider>
  );
};

export const DropDownLabel: React.FC<DropDownLabelProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

export const SingleSelect: React.FC<SingleSelectProps> = ({
  value,
  defaultValue,
  onChange,
  children,
  style,
  changeLabel,
  rightIcon,
  leftIcon,
}) => {
  const { open, setOpen, setDropdownPosition, dropdownPosition } = useContext(
    SingleSelectDropdownContext,
  );
  const selectRef = useRef<View>(null);
  const [internalValue, setInternalValue] = useState<string | number | null>(
    value,
  );

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (
    newValue: string | number,
    customOnPress?: () => void,
  ) => {
    if (newValue) {
      setInternalValue(newValue);
      onChange(newValue);
      setOpen(false);
      if (customOnPress) {
        customOnPress();
      }
    }
  };

  const handleLayout = () => {
    if (selectRef.current) {
      selectRef.current.measure((_, __, width, height, pageX, pageY) => {
        setDropdownPosition({ top: pageY + height, left: pageX, width });
      });
    }
  };

  const selectedChild = React.Children.toArray(children).find(
    (child): child is React.ReactElement<MenuItemProps> =>
      React.isValidElement(child) && child.props.value === internalValue,
  );

  return (
    <>
      <TouchableOpacity
        ref={selectRef as React.RefObject<TouchableOpacity>}
        style={[styles.select, style]}
        onPress={() => {
          setOpen(true);
          handleLayout();
        }}
        onLayout={handleLayout}
      >
        {leftIcon && <View>{leftIcon}</View>}
        <Text style={styles.label}>
          {selectedChild && changeLabel
            ? selectedChild.props.children
            : defaultValue}
        </Text>
        {rightIcon && <View>{rightIcon}</View>}
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => {
            setOpen(false);
          }}
        >
          <View
            style={[
              styles.modalContent,
              {
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              },
            ]}
          >
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                  ...child.props,
                  onPress: () => {
                    handleChange(child.props.value, child.props.onPress);
                  },
                })
                : child,
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export const MenuItem: React.FC<MenuItemProps & { onPress?: () => void }> = ({
  value,
  children,
  style,
  onPress,
}) => {
  const { value: selectedValue, onChange } = useContext(
    SingleSelectDropdownContext,
  );
  const handlePress = () => {
    if (onPress) {
      onPress();
      onChange(value);
    }
  };

  return (
    <TouchableOpacity style={[styles.menuItem, style]} onPress={handlePress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={selectedValue === value ? FilledRadioIcon : UnfilledRadioIcon}
          style={styles.radioIcon}
          resizeMode={"contain"}
        />
        <Text style={styles.menuItemText}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add your container styles
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontFamily: "Avenir",
    flex: 1,
    textAlign: "left",
  },
  select: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  menuItemText: {
    fontFamily: "Avenir",
    flex: 1,
    fontWeight: "500",
    color: Colors.text,
  },
  radioIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
});
