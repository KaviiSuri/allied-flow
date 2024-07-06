import React, { useState, ReactNode, useRef, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ViewStyle, TextStyle, LayoutChangeEvent } from 'react-native';

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
  label: string;
  onChange: (value: string | number) => void;
  children: ReactNode;
  style?: ViewStyle;
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
  setDropdownPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number; width: number }>>;
}

const SingleSelectDropdownContext = React.createContext<SingleSelectDropdownContextType>({
  open: false,
  setOpen: () => { },
  value: null,
  onChange: () => { },
  dropdownPosition: { top: 0, left: 0, width: 0 },
  setDropdownPosition: () => { },
});

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({ children, fullWidth, style }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const handleChange = (newValue: string | number) => {
    setValue(newValue);
    setOpen(false);
  };

  return (
    <SingleSelectDropdownContext.Provider value={{ open, setOpen, value, onChange: handleChange, dropdownPosition, setDropdownPosition }}>
      <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
        {children}
      </View>
    </SingleSelectDropdownContext.Provider>
  );
};

export const DropDownLabel: React.FC<DropDownLabelProps> = ({ children, style }) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

export const SingleSelect: React.FC<SingleSelectProps> = ({ value, label, onChange, children, style }) => {
  const { open, setOpen, setDropdownPosition, dropdownPosition } = useContext(SingleSelectDropdownContext);
  const selectRef = useRef<View>(null);
  const [internalValue, setInternalValue] = useState<string | number | null>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string | number) => {
    setInternalValue(newValue);
    onChange(newValue);
    setOpen(false);
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
      React.isValidElement(child) && child.props.value === internalValue
  );

  return (
    <>
      <TouchableOpacity
        ref={selectRef as React.RefObject<TouchableOpacity>}
        style={[styles.select, style]}
        onPress={() => setOpen(true)}
        onLayout={handleLayout}
      >
        <Text>{selectedChild ? selectedChild.props.children : label}</Text>
      </TouchableOpacity>
      <Modal
        animationType="none"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={[styles.modalContent, { position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width }]}>
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                  ...child.props,
                  onPress: () => handleChange(child.props.value)
                })
                : child
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export const MenuItem: React.FC<MenuItemProps & { onPress?: () => void }> = ({ value, children, style, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={[styles.menuItem, style]} onPress={handlePress}>
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add your container styles
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    // Add your label styles
  },
  select: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
