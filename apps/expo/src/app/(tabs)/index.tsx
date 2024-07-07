import { SafeAreaView, Text } from "react-native";
import { SingleSelectDropdown } from "~/components/shared/dropdown";

export default function Dashboard() {

  interface Option {
    label: string;
    value: string | number;
  }
  const options: Option[] = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];
  return (
    <SafeAreaView
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Text>Dashboard</Text>

      <SingleSelectDropdown
        options={options}
        onSelect={(item) => console.log('Selected:', item)}
      />
    </SafeAreaView>
  );
}
