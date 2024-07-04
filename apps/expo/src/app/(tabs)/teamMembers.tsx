import { SafeAreaView, Text, View, TextInput, Animated, Dimensions, Pressable, Image } from "react-native";
import { Table, TableHeading, TableRow, TableData } from "~/components/shared/table";
import { useState } from "react";
import { api } from "~/utils/api";
import {PrimaryButton, SecondaryButton} from "~/components/core/button";
import {FormTextInput} from "~/components/shared/form/";
const windowHeight = Dimensions.get('window').height - 64;

export default function TeamMembers() {

  const { data, isLoading, isError } = api.users.readUsers.useQuery();
  console.log(data)
  // const slideAnim = useRef(new Animated.Value(-100)).current;
  // useEffect(() => {
  //   Animated.timing(slideAnim, {
  //     toValue: 0,
  //     duration: 10000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [slideAnim]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const handleClick = () => {
    setDrawerVisible(!drawerVisible);
  }

  return (
    <SafeAreaView style={{
      backgroundColor: '#F9F9F9',
      position: 'relative'
    }}>
      <Animated.View style={{ zIndex: 1, position: "absolute", right: drawerVisible ? 0 : '-100%', width: '100%', height: windowHeight, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Pressable style={{ width: '100%', height: '100%', backgroundColor: '#000', opacity: 0.1 }} onPress={handleClick}>
          </Pressable>
        </View>
        <View style={{ flex: 1, height: '100%', flexDirection: 'column', backgroundColor: '#F9F9F9' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#FFF' }}>
            <Text style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Avenir'}}>Add member</Text>
            <Pressable onPress={handleClick}><Image source={require('../../app/assets/images/close-icon.png')}/></Pressable>
          </View>
          <View style={{ flex: 1, padding: 20 }}>
            <View style={{ width: '100%', padding: 16, borderRadius: 12, borderColor: '#E2E8F0', borderWidth: 1, flexDirection: "column", gap: 16, backgroundColor: '#FFF' }}>
                <FormTextInput label="Name" placeholder="Type member name" />
                <FormTextInput label="Email" placeholder="Type email address" />
                <FormTextInput label="Phone Number" placeholder="Type phone number" />
            </View>
          </View>
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
            <SecondaryButton text="Cancel" />
            <PrimaryButton text="Save"/>
          </View>
        </View>
      </Animated.View>

        <View style={{paddingHorizontal: 24, paddingVertical: 8, flexDirection: 'row', justifyContent: "space-between", backgroundColor: '#FFF'}}>
        <View>
        <TextInput
          placeholder="Search by member name"
          style={{
            width: 320,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#E2E8F0',
            fontFamily: 'Avenir',
            fontWeight: 400,
            fontSize: 16,
            shadowOffset : { height: 1, width: 0}, shadowOpacity: 0.05, shadowColor: '#101828'
          }}
          placeholderTextColor='#94A3B8'
        // You can adjust the number of lines
        // onChangeText={(text) => setText(text)}
        // value={text}
        />
        </View>
        <View style={{flexDirection: "row", gap: 16, backgroundColor: '#FFF'}}>
            <SecondaryButton text="Upload members" />
            <PrimaryButton text="Add members" onPress={handleClick}/>
        </View>
        </View>

      <View style={{ padding: 16, height: windowHeight }}>
        <Table style={{backgroundColor: '#fff'}}>
          <TableHeading>
          <TableData style={{fontSize: 12, color: '#475467'}}>Name</TableData>
            <TableData style={{fontSize: 12, color: '#475467'}}>Email</TableData>
            <TableData style={{fontSize: 12, color: '#475467'}}>Phone Number</TableData>
            <TableData style={{fontSize: 12, color: '#475467'}}>Role</TableData>
            <TableData style={{fontSize: 12, color: '#475467'}}>Clients</TableData>
            <TableData style={{fontSize: 12, color: '#475467'}}>Actions</TableData>
          </TableHeading>
          {data?.map(user => (
            <TableRow id={user.id}>
              <TableData>{user.id}</TableData>
              <TableData>{user.email}</TableData>
              <TableData>{user.phone}</TableData>
              <TableData>{user.role}</TableData>
              <TableData>John Doe</TableData>
              <View style={{ paddingHorizontal: 16, paddingVertical: 7, flexDirection: "row", gap: 16, flex: 1 }}>
                <Pressable style={{ borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, padding: 8, shadowOffset : { height: 1, width: 0}, shadowOpacity: 0.05, shadowColor: '#101828' }}>
                  <Image source={require("../../app/assets/images/edit-icon.svg")} />
                </Pressable>
                <Pressable style={{ borderColor: '#E2E8F0', borderWidth: 1, borderRadius: 8, padding: 8, shadowOffset : { height: 1, width: 0}, shadowOpacity: 0.05, shadowColor: '#101828' }}>
                  <Image source={require("../../app/assets/images/trash-icon.svg")} />
                </Pressable>
              </View>
            </TableRow>
          ))}
        </Table>
      </View>
    </SafeAreaView>
  );
}
