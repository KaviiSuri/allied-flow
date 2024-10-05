import { Dimensions, View, Text } from "react-native";
import SkeletonLoader from "../skelton";

const height = Dimensions.get("window").height;

export const LoadingState = ({ stateContent }: { stateContent: string }) => {
  return (
    <View
      style={{
        display: "flex",
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
          fontSize: 18,
          color: "#667085",
          fontFamily: "AvenirHeavy",
          fontWeight: 800,
          maxWidth: 300,
          marginTop: 20,
        }}
      >
        {stateContent}
      </Text>
    </View>
  );
};