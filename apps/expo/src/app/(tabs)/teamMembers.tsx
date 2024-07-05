import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Animated,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import {
  Table,
  TableHeading,
  TableRow,
  TableData,
} from "~/components/shared/table";
import { useState } from "react";
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { FormTextInput } from "~/components/shared/form/";
const windowHeight = Dimensions.get("window").height - 64;

type User = RouterOutputs["users"]['readUsers'][0];
type CreateUser = RouterInputs["users"]["createUser"];
type UpdateUser = RouterInputs["users"]["updateUser"];

type MemberProps = {
  open: boolean;
  toggleOpen: () => void;
} & (
    | { handleSave: (_user: CreateUser) => Promise<void> }
    | { user: User; handleSave: (_user: UpdateUser) => Promise<void> }
  );

function isUpdateUserProps(props: MemberProps): props is {
  user: User; handleSave: (_user: UpdateUser) => Promise<void>, open: boolean;
  toggleOpen: () => void;
} {
  return 'user' in props;
}

function MemberForm(props: {
  open: boolean,
  toggleOpen: () => void
} & ({
  handleSave: (_user: CreateUser) => Promise<void>
} | {
  user: User,
  handleSave: (_user: UpdateUser) => Promise<void>
})) {
  const [email, setEmail] = useState<string>(isUpdateUserProps(props) ? props.user.email : '');
  const [name, setName] = useState<string>(isUpdateUserProps(props) ? props.user.name : '');
  const [phone, setPhone] = useState<string>(isUpdateUserProps(props) ? props.user.phone : '');

  async function handleSave() {
    if (isUpdateUserProps(props)) {
      await props.handleSave({ id: props.user.id, email, name, phone, role: "ADMIN", teamId: "ADMIN" });
    } else {
      await props.handleSave({ email, name, phone, role: "ADMIN", teamId: "ADMIN" });
    }
    props.toggleOpen();
  }

  return (
    <Animated.View
      style={{
        zIndex: 1,
        position: "absolute",
        right: props.open ? 0 : "-100%",
        width: "100%",
        height: windowHeight,
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            opacity: 0.1,
          }}
          onPress={props.toggleOpen}
        ></Pressable>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          flexDirection: "column",
          backgroundColor: "#F9F9F9",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
            backgroundColor: "#FFF",
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: 800, fontFamily: "Avenir" }}
          >
            Add member
          </Text>
          <Pressable onPress={props.toggleOpen}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={require("../../app/assets/images/close-icon.png")}
            />
          </Pressable>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <View
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              borderColor: "#E2E8F0",
              borderWidth: 1,
              flexDirection: "column",
              gap: 16,
              backgroundColor: "#FFF",
            }}
          >
            <FormTextInput label="Name" placeholder="Type member name" value={name}
              onChangeText={(t) => setName(t)}
            />
            <FormTextInput label="Email" placeholder="Type email address" value={email}
              onChangeText={(t) => setEmail(t)}
            />
            <FormTextInput
              label="Phone Number"
              placeholder="Type phone number"
              value={phone}
              onChangeText={(t) => setPhone(t)}
            />
          </View>
        </View>
        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#E2E8F0",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 16,
          }}
        >
          <SecondaryButton text="Cancel" onPress={props.toggleOpen} />
          <PrimaryButton text="Save" onPress={handleSave} />
        </View>
      </View>
    </Animated.View>
  )
}

function UpdateMemberForm(props: {
  open: boolean,
  user: User,
  toggleOpen: () => void
}) {
  const utils = api.useUtils();
  const { mutateAsync: updateUser } = api.users.updateUser.useMutation({
    onSuccess: () => {
      utils.users.readUsers.refetch().catch(console.error);
    },
  });

  async function handleSave(user: RouterInputs["users"]["updateUser"]) {
    await updateUser(user);
    props.toggleOpen();
  }

  return (
    <MemberForm open={props.open} user={props.user} toggleOpen={props.toggleOpen} handleSave={handleSave} />
  )
}

function CreateMemberForm(props: {
  open: boolean,
  toggleOpen: () => void
}) {
  const utils = api.useUtils();
  const { mutateAsync: createUser } = api.users.createUser.useMutation({
    onSuccess: () => {
      utils.users.readUsers.refetch().catch(console.error);
    },
  });

  async function handleSave(user: CreateUser) {
    await createUser(user);
    props.toggleOpen();
  }

  return (
    <MemberForm open={props.open} toggleOpen={props.toggleOpen} handleSave={handleSave} />
  )
}

export default function TeamMembers() {
  const { data } = api.users.readUsers.useQuery();
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  // const slideAnim = useRef(new Animated.Value(-100)).current;
  // useEffect(() => {
  //   Animated.timing(slideAnim, {
  //     toValue: 0,
  //     duration: 10000,
  //     useNativeDriver: true,
  //   }).start();
  // }, [slideAnim]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#F9F9F9",
        position: "relative",
      }}
    >

      <CreateMemberForm open={drawerVisible} toggleOpen={toggleDrawer} />
      {userToUpdate && <UpdateMemberForm open={!!userToUpdate} user={userToUpdate} toggleOpen={() => setUserToUpdate(null)} />}

      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#FFF",
        }}
      >
        <View>
          <TextInput
            placeholder="Search by member name"
            style={{
              width: 320,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#E2E8F0",
              fontFamily: "Avenir",
              fontWeight: 400,
              fontSize: 16,
              shadowOffset: { height: 1, width: 0 },
              shadowOpacity: 0.05,
              shadowColor: "#101828",
            }}
            placeholderTextColor="#94A3B8"
          // You can adjust the number of lines
          // onChangeText={(text) => setText(text)}
          // value={text}
          />
        </View>
        <View
          style={{ flexDirection: "row", gap: 16, backgroundColor: "#FFF" }}
        >
          <SecondaryButton text="Upload members" />
          <PrimaryButton text="Add members" onPress={toggleDrawer} />
        </View>
      </View>

      <View style={{ padding: 16, height: windowHeight }}>
        <Table style={{ backgroundColor: "#fff" }}>
          <TableHeading>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Name
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Email
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Phone Number
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Role
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Clients
            </TableData>
            <TableData style={{ fontSize: 12, color: "#475467" }}>
              Actions
            </TableData>
          </TableHeading>
          {data?.map((user) => (
            <TableRow id={user.id} key={user.id}>
              <TableData>{user.name}</TableData>
              <TableData>{user.email}</TableData>
              <TableData>{user.phone}</TableData>
              <TableData>{user.role}</TableData>
              <TableData>John Doe</TableData>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  flexDirection: "row",
                  gap: 16,
                  flex: 1,
                }}
              >
                <Pressable
                  style={{
                    borderColor: "#E2E8F0",
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    shadowOffset: { height: 1, width: 0 },
                    shadowOpacity: 0.05,
                    shadowColor: "#101828",
                  }}
                  onPress={() => setUserToUpdate(user)}
                >
                  <Image
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    source={require("../../app/assets/images/edit-icon.svg")}
                  />
                </Pressable>
                <Pressable
                  style={{
                    borderColor: "#E2E8F0",
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 8,
                    shadowOffset: { height: 1, width: 0 },
                    shadowOpacity: 0.05,
                    shadowColor: "#101828",
                  }}
                >
                  <Image
                    source={
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      require("../../app/assets/images/trash-icon.svg")
                    }
                  />
                </Pressable>
              </View>
            </TableRow>
          ))}
        </Table>
      </View>
    </SafeAreaView>
  );
}
