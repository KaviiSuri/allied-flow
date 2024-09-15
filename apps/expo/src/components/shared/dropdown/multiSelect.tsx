import type { ReactNode } from "react";
import React, { useState, useRef, useEffect, useContext } from "react";
import type { ViewStyle, TextStyle } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";

interface DropDownLabelProps {
  children: ReactNode;
  style?: TextStyle;
}

interface MultiSelectProps {
  value: (string | number)[];
  label: string;
  onChange: (value: (string | number)[]) => void;
  children: ReactNode;
  style?: ViewStyle;
}

interface MenuItemProps {
  value: string | number;
  children: ReactNode;
  style?: TextStyle;
  selected?: boolean;
}

interface MultiSelectDropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  dropdownPosition: { top: number; left: number; width: number };
  setDropdownPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number; width: number }>
  >;
}

const MultiSelectDropdownContext =
  React.createContext<MultiSelectDropdownContextType>({
    open: false,
    setOpen: () => {
      /* do nothing */
    },
    dropdownPosition: { top: 0, left: 0, width: 0 },
    setDropdownPosition: () => {
      /* do nothing */
    },
  });

interface MultiSelectDropdownProps {
  fullWidth?: boolean;
  style?: ViewStyle;
  children: ReactNode;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  children,
  fullWidth,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  return (
    <MultiSelectDropdownContext.Provider
      value={{ open, setOpen, dropdownPosition, setDropdownPosition }}
    >
      <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
        {children}
      </View>
    </MultiSelectDropdownContext.Provider>
  );
};

export const DropDownLabel: React.FC<DropDownLabelProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  label,
  onChange,
  children,
  style,
}) => {
  const { open, setOpen, setDropdownPosition, dropdownPosition } = useContext(
    MultiSelectDropdownContext,
  );
  const selectRef = useRef<View>(null);
  const [internalValue, setInternalValue] =
    useState<(string | number)[]>(value);

  useEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(internalValue)) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  const handleChange = (newValue: string | number) => {
    const updatedValue = internalValue.includes(newValue)
      ? internalValue.filter((v) => v !== newValue)
      : [...internalValue, newValue];
    setInternalValue(updatedValue);
    onChange(updatedValue);
  };

  const handleDone = () => {
    setOpen(false);
  };

  const handleLayout = () => {
    if (selectRef.current) {
      selectRef.current.measure((_, __, width, height, pageX, pageY) => {
        setDropdownPosition({ top: pageY + height, left: pageX, width });
      });
    }
  };

  const selectedLabels = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<MenuItemProps> =>
        React.isValidElement(child) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        internalValue.includes(child.props.value),
    )
    .map((child) => child.props.children)
    .join(", ");

  return (
    <>
      <TouchableOpacity
        ref={selectRef as React.RefObject<TouchableOpacity>}
        style={[styles.select, style]}
        onPress={() => setOpen(true)}
        onLayout={handleLayout}
      >
        <Text>{selectedLabels || label}</Text>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={handleDone}>
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
            <ScrollView>
              {React.Children.map(children, (child) =>
                React.isValidElement(child)
                  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    React.cloneElement(child, {
                      ...child.props,
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                      selected: internalValue.includes(child.props.value),
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                      onPress: () => handleChange(child.props.value),
                    })
                  : child,
              )}
            </ScrollView>
            <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export const MenuItem: React.FC<MenuItemProps & { onPress?: () => void }> = ({
  children,
  style,
  selected,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.menuItem, selected && styles.selectedMenuItem, style]}
      onPress={handlePress}
    >
      <Text style={selected ? styles.selectedMenuItemText : undefined}>
        {children}
      </Text>
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
    // Add your label styles
  },
  select: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
    maxHeight: 300,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedMenuItem: {
    backgroundColor: "#e6e6e6",
  },
  selectedMenuItemText: {
    fontWeight: "bold",
  },
  doneButton: {
    padding: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
