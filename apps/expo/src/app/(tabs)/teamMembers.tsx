import { Button, SafeAreaView, Text, View, TextInput, Animated, Dimensions, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import { api } from "~/utils/api";
const windowHeight = Dimensions.get('window').height;

export default function TeamMembers() {
  const { data, isLoading, isError } = api.users.readUsers.useQuery()
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
          <TouchableOpacity style={{ width: '100%', height: '100%', backgroundColor: '#000', opacity: 0.1 }} onPress={handleClick}>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, height: '100%', flexDirection: 'column', backgroundColor: '#FFF' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
            <Text style={{ fontSize: 18, fontWeight: 800 }}>Add Member</Text>
          </View>
          <View style={{ flex: 1, padding: 20, flexDirection: 'column', gap: 16 }}>
            <View style={{ width: '100%', padding: 16, borderRadius: 12, borderColor: '#E2E8F0', borderWidth: 1 }}>

              <View>
                <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8 }}>Name</Text>
                <TextInput style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 }} placeholder="Type member name" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8 }}>Email</Text>
                <TextInput style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 }} placeholder="Type email address" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8 }}>Phone Number</Text>
                <TextInput style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 }} placeholder="Type phone number" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8 }}>Assigned Clients</Text>
                <TextInput style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 }} placeholder="Select Clients" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: 400, paddingBottom: 8 }}>Role</Text>
                <TextInput style={{ borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12 }} placeholder="Select Role" />
              </View>
            </View>
          </View>
          <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'flex-end', gap: 16 }}>
            <Button title="Cancel" onPress={handleClick} />
            <Button title="Save" onPress={handleClick} />
          </View>
        </View>
      </Animated.View>
      <View style={{
        padding: 20,
      }}>
        <Text style={{
          fontFamily: 'Avenir',
          fontWeight: 800,
          fontSize: 18,
        }}>
          Team members
        </Text>
      </View>
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <TextInput
          placeholder="Search by member name"
          style={{
            width: 320,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#E2E8F0'
          }}
        // You can adjust the number of lines
        // onChangeText={(text) => setText(text)}
        // value={text}
        />
        <Button title="Add Member" onPress={handleClick} />
      </View>
      <View style={{ padding: 16 }}>
        <View style={{ borderColor: '#EAECF0', borderRadius: 12, borderWidth: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>Name</Text>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>Email</Text>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>Phone Number</Text>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>Role</Text>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>Clients</Text>
            <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>Actions</Text>
          </View>
          {data?.map(user => (
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#EAECF0' }}>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>{user.id}</Text>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>{user.email}</Text>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>{user.phone}</Text>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>{user.role}</Text>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>John Doe</Text>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 14, fontSize: 12, fontWeight: 500, flex: 1 }}>john@doe.com</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
