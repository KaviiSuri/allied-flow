import { Text, View } from "react-native";
import { graphStyles } from "./css";
import { ChartComponent } from "./chart";

export const GraphComponent = () => {
  return (
    <View style={graphStyles.container}>
      <View>
        <Text>Sales Revenue</Text>
      </View>
      <View>
        <ChartComponent />
      </View>
    </View>
  );
};
