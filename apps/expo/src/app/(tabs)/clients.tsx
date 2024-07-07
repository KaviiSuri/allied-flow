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
import { RouterInputs, RouterOutputs, api } from "~/utils/api";
import { PrimaryButton, SecondaryButton } from "~/components/core/button";
import { FormTextInput } from "~/components/shared/form/";
import { Can } from "~/providers/auth";
const windowHeight = Dimensions.get("window").height - 64;

type Team = RouterOutputs["teams"]['readTeams'][0];
type CreateTeam = RouterInputs["teams"]["createTeam"];
type UpdateTeam = RouterInputs["teams"]["updateTeam"];

type TeamProps = {
  open: boolean;
  toggleOpen: () => void;
  isLoading?: boolean;
} & (
    | { handleSave: (_user: CreateTeam) => Promise<void> }
    | { team: Team; handleSave: (_user: UpdateTeam) => Promise<void> }
  );

function isUpdateTeamProps(props: TeamProps): props is {
  team: Team; handleSave: (_user: UpdateTeam) => Promise<void>, open: boolean;
  toggleOpen: () => void;
} {
  return 'team' in props;
}

function TeamForm(props: TeamProps) {
  const [name, setName] = useState(isUpdateTeamProps(props) ? props.team.name : '');
  const [address, setAddress] = useState(isUpdateTeamProps(props) ? props.team.address : '');
  const [gstNumber, setGstNumber] = useState(isUpdateTeamProps(props) ? props.team.gstNo : '');

  async function handleSave() {
    if (isUpdateTeamProps(props)) {
      await props.handleSave({ id: props.team.id, name, address, gstNo: gstNumber });
    } else {
      await props.handleSave({
        name,
        gstNo: gstNumber,
        address,
        type: 'CLIENT',
      });
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
          backgroundColor: "#FFF",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
          }}
        >
          <Text
            style={{ fontSize: 18, fontWeight: 800, fontFamily: "Avenir" }}
          >
            Add clients
          </Text>
          <Pressable onPress={props.toggleOpen}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={require("../../app/assets/images/close-icon.png")}
            />
          </Pressable>
        </View>
        <View
          style={{ flex: 1, padding: 20, flexDirection: "column", gap: 16 }}
        >
          <View
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 12,
              borderColor: "#E2E8F0",
              borderWidth: 1,
              flexDirection: "column",
              gap: 16,
            }}
          >
            <FormTextInput
              label="Company Name"
              placeholder="Type company name"
              onChangeText={setName}
            />
            <FormTextInput
              label="Company Address"
              placeholder="Type company address"
              onChangeText={setAddress}
            />
            <View style={{ flexDirection: "row", gap: 16 }}>
              <FormTextInput
                label="POC"
                placeholder="Type POC"
                style={{ flex: 1 }}
              />
              <FormTextInput
                label="GST Number"
                placeholder="Type GST Number"
                style={{ flex: 1 }}
                onChangeText={setGstNumber}
              />
            </View>
            <FormTextInput
              label="Phone Number"
              placeholder="Type phone number"
            />
            <FormTextInput label="Email" placeholder="Type email" />
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
          <SecondaryButton text="Cancel" />
          <PrimaryButton text="Save" onPress={handleSave} isLoading={props.isLoading} />
        </View>
      </View>
    </Animated.View>
  )
}

function UpdateTeamForm(props: {
  open: boolean,
  team: Team,
  toggleOpen: () => void
}) {
  const utils = api.useUtils();
  const { mutateAsync: updateTeam, isPending } = api.teams.updateTeam.useMutation({
    onSuccess: () => {
      utils.teams.readTeams.refetch().catch(console.error);
    },
  });

  async function handleSave(team: RouterInputs["teams"]["updateTeam"]) {
    await updateTeam(team);
    props.toggleOpen();
  }

  return (
    <TeamForm open={props.open} team={props.team} toggleOpen={props.toggleOpen} handleSave={handleSave} isLoading={isPending} />
  )
}

function CreateTeamForm(props: {
  open: boolean,
  toggleOpen: () => void
}) {
  const utils = api.useUtils();
  const { mutateAsync: createTeam, isPending } = api.teams.createTeam.useMutation({
    onSuccess: () => {
      utils.teams.readTeams.refetch().catch(console.error);
    },
  });

  async function handleSave(team: CreateTeam) {
    await createTeam(team);
    props.toggleOpen();
  }

  return (
    <TeamForm open={props.open} toggleOpen={props.toggleOpen} handleSave={handleSave} isLoading={isPending} />
  )
}

export default function Clients() {
  const { data } = api.teams.readTeams.useQuery({
    type: "CLIENT",
  });
  const [teamToUpdate, setTeamToUpdate] = useState<Team | null>(null);
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
      <Can I="read" a="Team">
        {!teamToUpdate && <CreateTeamForm open={drawerVisible} toggleOpen={toggleDrawer} />}
        {teamToUpdate && <UpdateTeamForm open={!!teamToUpdate} team={teamToUpdate} toggleOpen={() => setTeamToUpdate(null)} />}
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <TextInput
              placeholder="Search by client name"
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
          <View style={{ flexDirection: "row", gap: 16 }}>
            <SecondaryButton text="Upload clients" />
            <PrimaryButton text="Add clients" onPress={toggleDrawer} />
          </View>
        </View>

        <View style={{ padding: 16, height: windowHeight }}>
          <Table style={{ backgroundColor: "#fff" }}>
            <TableHeading>
              <TableData style={{ fontSize: 12, color: "#475467" }}>
                Company Name
              </TableData>
              <TableData style={{ fontSize: 12, color: "#475467" }}>
                POC Name
              </TableData>
              <TableData style={{ fontSize: 12, color: "#475467" }}>
                Phone Number
              </TableData>
              <TableData style={{ fontSize: 12, color: "#475467" }}>
                Email
              </TableData>
              <TableData style={{ fontSize: 12, color: "#475467" }}>
                Actions
              </TableData>
            </TableHeading>
            {data?.map((team) => (
              <TableRow key={team.id}>
                <TableData>{team.name}</TableData>
                <TableData>{team.name}</TableData>
                <TableData></TableData>
                <TableData></TableData>
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
                      }}
                      onPress={() => setTeamToUpdate(team)}
                    >
                      <Image
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        source={require("../../app/assets/images/edit-icon.svg")}
                      />
                    </Pressable>
                  </Can>
                  <Can I="delete" a="Team">
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
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        source={require("../../app/assets/images/trash-icon.svg")}
                      />
                    </Pressable>
                  </Can>
                </View>
              </TableRow>
            ))}
          </Table>
        </View>
      </Can>
    </SafeAreaView>

  );
}
