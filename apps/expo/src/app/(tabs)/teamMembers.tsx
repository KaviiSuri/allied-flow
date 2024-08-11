import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Animated,
  Dimensions,
  Pressable,
  Image,
  Modal,
  Alert,
  PanResponder,
} from "react-native";
import {
  Table,
  TableHeading,
  TableRow,
  TableData,
} from "~/components/shared/table";
import { useEffect, useRef, useState } from "react";
import DocumentPicker from 'react-native-document-picker';
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { FormTextInput } from "~/components/shared/form/";
import { FormDropDown } from "~/components/shared/form/formDropDown";
import { Can, useAbility } from "~/providers/auth";
import type { Role } from "@repo/permissions";
import CloseIcon from "~/app/assets/images/close-icon.png";
import DownArrowIcon from "~/app/assets/images/down-arrow-icon.png";
import EditIcon from "~/app/assets/images/edit-icon.svg";
import TrashIcon from "~/app/assets/images/trash-icon.svg";
import UploadIcon from "~/app/assets/images/upload-icon.png";
import ExcelIcon from "~/app/assets/images/excel-icon.png";
import DownloadIcon from "~/app/assets/images/download-icon.png";
const windowHeight = Dimensions.get("window").height - 64;

type User = RouterOutputs["users"]["readUsers"][0];
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
  user: User;
  handleSave: (_user: UpdateUser) => Promise<void>;
  open: boolean;
  toggleOpen: () => void;
} {
  return "user" in props;
}

function MemberForm(
  props: {
    open: boolean;
    toggleOpen: () => void;
    isLoading?: boolean;
  } & (
    | {
        handleSave: (_user: CreateUser) => Promise<void>;
      }
    | {
        user: User;
        handleSave: (_user: UpdateUser) => Promise<void>;
      }
  ),
) {
  const [email, setEmail] = useState<string>(
    isUpdateUserProps(props) ? props.user.email : "",
  );
  const [name, setName] = useState<string>(
    isUpdateUserProps(props) ? props.user.name : "",
  );
  const [phone, setPhone] = useState<string>(
    isUpdateUserProps(props) ? props.user.phone : "",
  );
  const [role, setRole] = useState<Role>(
    isUpdateUserProps(props) ? props.user.role : "MANAGEMENT",
  );

  const RoleOptions = [
    {
      label: "Admin",
      value: "ADMIN",
    },
    {
      label: "Management",
      value: "MANAGEMENT",
    },
    {
      label: "Logistics",
      value: "LOGISTICS",
    },
    {
      label: "Sales",
      value: "SALES",
    },
  ];

  async function handleSave() {
    if (isUpdateUserProps(props)) {
      await props.handleSave({ id: props.user.id, email, name, phone, role });
    } else {
      await props.handleSave({ email, name, phone, role });
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
          <Text style={{ fontSize: 18, fontWeight: 800, fontFamily: "Avenir" }}>
            Add member
          </Text>
          <Pressable onPress={props.toggleOpen}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={CloseIcon}
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
            <FormTextInput
              label="Name"
              placeholder="Type member name"
              value={name}
              onChangeText={(t) => setName(t)}
            />
            <FormTextInput
              label="Email"
              placeholder="Type email address"
              value={email}
              onChangeText={(t) => setEmail(t)}
            />
            <FormTextInput
              label="Phone Number"
              placeholder="Type phone number"
              value={phone}
              onChangeText={(t) => setPhone(t)}
            />
            <FormDropDown
              label="Role"
              options={RoleOptions}
              value={role}
              onValueChange={(e) => setRole(e)}
              rightIcon={
                <Image
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  source={DownArrowIcon}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                  resizeMode={"contain"}
                  tintColor={"black"}
                />
              }
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
          <PrimaryButton
            text="Save"
            onPress={handleSave}
            isLoading={props.isLoading}
          />
        </View>
      </View>
    </Animated.View>
  );
}

function UpdateMemberForm(props: {
  open: boolean;
  user: User;
  toggleOpen: () => void;
}) {
  const utils = api.useUtils();
  const { mutateAsync: updateUser, isPending } =
    api.users.updateUser.useMutation({
      onSuccess: () => {
        utils.users.readUsers.refetch().catch(console.error);
      },
    });

  async function handleSave(user: RouterInputs["users"]["updateUser"]) {
    await updateUser(user);
    props.toggleOpen();
  }

  return (
    <MemberForm
      open={props.open}
      user={props.user}
      toggleOpen={props.toggleOpen}
      handleSave={handleSave}
      isLoading={isPending}
    />
  );
}

const handleFileDrop = () => {
  console.log('Upload');
}

// const handleFileDrop = async () => {
//   try {
//     // Pick the file(s) using the document picker
//     const result = await DocumentPicker.pick({
//       type: [DocumentPicker.types.allFiles],
//     });

//     // Process the selected files
//     result.forEach(file => {
//       console.log('Selected File:', file);
//       // You can handle the file upload logic here
//       // For example, upload the file to your server
//     });
//   } catch (err) {
//     if (DocumentPicker.isCancel(err)) {
//       // User canceled the picker
//       Alert.alert('Upload canceled');
//     } else {
//       // Handle other errors
//       Alert.alert('Unknown error:', err.message);
//     }
//   }
// };

const DragAndDrop = ({ onDrop, children }) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: () => {
        // Check if the drop location is valid and trigger the onDrop event
        onDrop();
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {children}
    </View>
  );
};

function UploadMemberPopup(props: { open: boolean; toggleOpen: () => void }) {

  const openFilePicker = () => {
    console.log("open");
  }

  // const openFilePicker = async () => {
  //   try {
  //     // Open the document picker to select a file
  //     const result = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //     });

  //     // Handle the selected file
  //     console.log('Selected File:', result);
  //     if (Array.isArray(result) && result.length > 0 && result[0]) {
  //       const selectedFile = result[0];
  //       console.log('Selected File:', selectedFile);
  //       Alert.alert('File Selected', `You selected: ${selectedFile.name}`);
  //     } else {
  //       Alert.alert('No file selected');
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User canceled the picker
  //       Alert.alert('Upload canceled');
  //     } else {
  //       // Handle other errors
  //       Alert.alert('Unknown error:', err.message);
  //     }
  //   }
  // };

  //return a centered modal which looks like a card and opens based on the value of open which takes value from uploadPopupVisible
  return (
    <Modal visible={props.open}>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 480,
            height: 582,
            backgroundColor: "white",
            borderRadius: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingVertical: 20,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#E2E8F0",
              backgroundColor: "#FFF",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 800,
                fontFamily: "Avenir",
              }}
            >
              Upload Members
            </Text>
            <Pressable onPress={props.toggleOpen}>
              <Image
                style={{
                  tintColor: "#64748B",
                }}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={CloseIcon}
              />
            </Pressable>
          </View>
          <DragAndDrop onDrop={handleFileDrop}>
          <View
            style={{
              margin: 16,
              height: 300,
              width: 448,
              backgroundColor: " #F8FAFC",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#E2E8F0",
              borderWidth: 1,
              borderRadius: 8,
              borderStyle: "dashed",
            }}
          >
            <Pressable
              style={{
                height: 40,
                width: 40,
                backgroundColor: "#FFFFFF",
                borderColor: "#E2E8F0",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                margin: 12,
                shadowColor: "#101828",
                shadowRadius: 5,
                shadowOpacity: 0.2,
              }}
              onPress={openFilePicker}
            >
              <Image
                style={{
                  tintColor: "#64748B",
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                }}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={UploadIcon}
              ></Image>
            </Pressable>
            <Text>Click to upload or drag and drop</Text>
          </View>
          </DragAndDrop>
          

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Avenir",
              marginBottom: 16,
              fontWeight: 500,
              color: "#64748B",
              textAlign: "center",
            }}
          >
            Upload a CSV file to add multiple members at once
          </Text>
          <Pressable onPress={props.toggleOpen}>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: "#E2E8F0",
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
            >
              <Image
                style={{
                  tintColor: "#007442",
                  height: 20,
                  width: 20,
                  resizeMode: "contain",
                }}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={ExcelIcon}
              ></Image>
              <Text
                style={{
                  fontWeight: 500,
                  marginHorizontal: 8,
                  fontSize: 12,
                  color: "#1E293B",
                }}
              >
                Download template
              </Text>
              <Image
                style={{
                  tintColor: "#64748B",
                  height: 14,
                  width: 14,
                  resizeMode: "contain",
                }}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={DownloadIcon}
              ></Image>
            </View>
            <View style={{
              borderTopWidth: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: 16,
              borderColor: "#E2E8F0"
            }}>
              <Pressable onPress={props.toggleOpen} 
                style={{
                  backgroundColor: "#FFF",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: 16,
                  borderRadius: 8,
                  borderColor: "#D0D5DD"
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Avenir",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
               
                
              </Pressable>
              <Pressable onPress={props.toggleOpen} style={{
                  backgroundColor: "#2F80F5",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 16,
                  marginRight:16,
                  borderRadius: 8,
                  borderColor: "#2F80F5",
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Avenir",
                    color: "#FFF",
                    textAlign: "center",
                  }}
                >
                  Upload
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function CreateMemberForm(props: { open: boolean; toggleOpen: () => void }) {
  const utils = api.useUtils();
  const { mutateAsync: createUser, isPending } =
    api.users.createUser.useMutation({
      onSuccess: () => {
        utils.users.readUsers.refetch().catch(console.error);
      },
    });

  async function handleSave(user: CreateUser) {
    await createUser(user);
    props.toggleOpen();
  }

  return (
    <MemberForm
      open={props.open}
      toggleOpen={props.toggleOpen}
      handleSave={handleSave}
      isLoading={isPending}
    />
  );
}

export default function TeamMembers() {
  const ability = useAbility();
  const { data } = api.users.readUsers.useQuery({
    scope: "TEAM",
  });
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
  const [uploadPopupVisible, setUploadPopupVisible] = useState(false);
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };
  useEffect(() => {
    console.log("===", ability.can("read", "User"));
  }, [ability]);

  const toggleUploadPopup = () => {
    setUploadPopupVisible(!uploadPopupVisible);
  };
  useEffect(() => {
    console.log("===", ability.can("read", "User"));
  }, [ability]);

  return (
    <Can I="read" a="User">
      <SafeAreaView
        style={{
          backgroundColor: "#F9F9F9",
          position: "relative",
        }}
      >
        {!userToUpdate && (
          <CreateMemberForm open={drawerVisible} toggleOpen={toggleDrawer} />
        )}
        {!userToUpdate && (
          <UploadMemberPopup
            open={uploadPopupVisible}
            toggleOpen={toggleUploadPopup}
          />
        )}
        {userToUpdate && (
          <UpdateMemberForm
            open={!!userToUpdate}
            user={userToUpdate}
            toggleOpen={() => setUserToUpdate(null)}
          />
        )}

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
          <Can I="create" a="User">
            <View
              style={{ flexDirection: "row", gap: 16, backgroundColor: "#FFF" }}
            >
              <SecondaryButton
                text="Upload members"
                onPress={toggleUploadPopup}
              />
              <PrimaryButton text="Add members" onPress={toggleDrawer} />
            </View>
          </Can>
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
                  <Can I="update" a="Team">
                    <Pressable
                      style={{
                        borderColor: "#E2E8F0",
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 8,
                        shadowOffset: { height: 1, width: 0 },
                        shadowOpacity: 0.05,
                        shadowColor: "#101828",
                        maxHeight: 35,
                      }}
                      onPress={() => setUserToUpdate(user)}
                    >
                      <EditIcon />
                    </Pressable>
                  </Can>
                  {ability.can("delete", "User") && (
                    <Pressable
                      style={{
                        borderColor: "#E2E8F0",
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 8,
                        shadowOffset: { height: 1, width: 0 },
                        shadowOpacity: 0.05,
                        shadowColor: "#101828",
                        maxHeight: 35,
                      }}
                    >
                      <TrashIcon />
                    </Pressable>
                  )}
                </View>
              </TableRow>
            ))}
          </Table>
        </View>
      </SafeAreaView>
    </Can>
  );
}
