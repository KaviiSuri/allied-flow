import { Dimensions, Text, TouchableOpacity, View} from "react-native";
import SkeletonLoader from "../skelton";
import { router } from "expo-router";

const height = Dimensions.get("window").height;
export const ErrorState = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <View
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 100,
        width: "100%",
        height: height,
      }}
    >
      <SkeletonLoader rows={1} columns={1} itemHeight={36} itemWidth={300} />
      <SkeletonLoader rows={1} columns={1} itemHeight={36} itemWidth={300} />
      <SkeletonLoader rows={1} columns={1} itemHeight={36} itemWidth={300} />
      <Text
        style={{
          marginTop: 20,
          fontSize: 18,
          color: "#667085",
          fontFamily: "AvenirHeavy",
          fontWeight: 800,
          maxWidth: 300,
          textAlign: "center",
        }}
      >
        {errorMessage}
      </Text>

      <TouchableOpacity
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf1f2",
          marginTop: 20,
        }}
        onPress={() => router.navigate("/")}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#b91c1c",
            fontFamily: "Avenir",
          }}
        >
          Navigate Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};
