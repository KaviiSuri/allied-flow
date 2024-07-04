import { useLogto } from "@logto/rn";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import type { DrawerNavigationHelpers, DrawerDescriptorMap } from "@react-navigation/drawer/lib/typescript/src/types";
import type { DrawerNavigationState, ParamListBase } from "@react-navigation/routers";
import { useState  } from "react";
import type {JSX} from "react";
import { Image, View } from "react-native";
import Dropdown from "./Dropdown";



export default function CustomDrawerContent (props: JSX.IntrinsicAttributes & { state: DrawerNavigationState<ParamListBase>; navigation: DrawerNavigationHelpers; descriptors: DrawerDescriptorMap; }) {
  const { signOut } = useLogto()

  const [selected, setSelected] = useState(undefined);
  const data = [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { label: 'Invite', icon: require('../assets/images/share-icon.png') },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { label: 'Logout', icon: require('../assets/images/logout-icon.png') },
  ];

  return (
    <View style={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>

        <View style ={{
            flexDirection: 'row',
            alignItems: 'center',
        }}>

        <Dropdown label="ABC Chemicals" data={data} onSelect={setSelected} />
            <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={require('../assets/images/notebook-icon.png')}
                style={{
                    resizeMode: "contain",
                    width: 20,
                    height: 20,
                    marginRight: 20,
                }}
            />

        </View>
        
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem label="Logout" onPress={() => signOut()}
        icon={({ focused }) => (
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require('../assets/images/logout-icon.png')}
            style={{
              resizeMode: "contain",
              width: 20,
              height: 20,
              tintColor: focused ? "#2F80F5" : "#475569",
            }}
          />
        )}
      />
    </View>
  );
};