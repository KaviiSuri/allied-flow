
import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  Image,
  SafeAreaView,
} from 'react-native';

import { Colors } from '~/constants/Color';

interface Props {
  label: string;
  data: { label: string; icon: any }[];
  onSelect: (item: { label: string }) => void;
}

const Dropdown: FC<Props> = ({ label, data, onSelect }) => {
  const DropdownButton = useRef();
  const [visible, setVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
      setDropdownTop(py + h);
    });
    setVisible(true);
  };

  const onItemPress = (item: any): void => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
    if(item.label==='Invite') {
        //Invite member
        setPopupVisible(true);
    };
  };

  const renderItem = ({ item }: any): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={item.icon}
            style={{
                resizeMode: "contain",
                width: 16,
                tintColor: item.label==='Logout'?Colors.error:Colors.text,
                height: 16,
                marginRight: 10,
            }}
        />
      <Text style={{
        fontFamily: 'Avenir',
        fontSize: 14,
        color: item.label==='Logout'?Colors.error:Colors.text,
      }}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderInvitePopup = (): ReactElement<any, any> => {
    return (
      <Modal visible={isPopupVisible} transparent animationType="none">
        <TouchableOpacity
          onPress={() => setPopupVisible(false)}
        ><View style={{
            height: '100%', width: '100%',
            flex: 1, justifyContent: 'center', alignItems: 'center'
        }}><View style={{
            justifyContent: 'center', alignItems: 'center',
            width:300,
            height:300,
            backgroundColor:Colors.error,
            }}>
            <Text>Hello</Text></View>
          
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={styles.button}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      {renderInvitePopup()}
      <View 
                    style={{flexDirection: 'row', alignItems: 'center',
                    }}
                    >
                    <Image
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        source={require('../assets/images/org-icon.png')}
                        style={{
                            resizeMode: "contain",
                            width: 16,
                            height: 16,
                        }}
                    />
                    <Text style={{
                        paddingLeft: 10,
                        fontSize: 14,
                        fontFamily: 'Avenir',
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        color: Colors.text,
                    }}>{label}</Text>
                    <Image
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        source={require('../assets/images/down-arrow-icon.png')}
                        style={{
                            resizeMode: "contain",
                            width: 10,
                            height: 10,
                            marginLeft: 'auto',
                        }}
                    />
                </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 20,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 160,
  },
  buttonText: {
    fontFamily: 'Avenir',
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: Colors.border,
    width: 160,
    marginHorizontal:20,
    marginVertical: 10,
    shadowRadius: 4,
    shadowOpacity: 1,
    borderRadius: 10,
  },
  overlay: {
    width: '100%',
    height: '100%',
  },
  item: {
    padding:10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
});

export default Dropdown;