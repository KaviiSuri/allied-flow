import { Image, SafeAreaView, Text, View } from "react-native";
import { SingleSelectExample } from "~/components/layouts/singleSelectExample";

export default function Dashboard() {

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
      <View
      >
        <Image source={"../assets/images/down-arrow-icon.png"}
          style={{
            resizeMode: "contain",
            width: 20,
            height: 20,
            tintColor: "#475569",
          }}
        />

      </View>
    </SafeAreaView>
  );
}
