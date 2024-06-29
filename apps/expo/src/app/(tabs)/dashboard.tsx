import { SafeAreaView, Text, View } from "react-native";


export default function Dashboard(){
    return (
          <SafeAreaView style={{
            backgroundColor: '#F9F9F9',
          }}>
            <View style={{
              padding: 20,
            }}>
                <Text style={{
                  fontFamily:'Avenir',
                  fontWeight: 800,
                  fontSize: 18,
                }}>
                  Dashboard
                </Text>
            </View>
          </SafeAreaView>
      );
}