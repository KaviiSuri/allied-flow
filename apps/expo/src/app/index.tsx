import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";


export default function Index() {
  return (
    <SafeAreaView className=" bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <Pressable
          className="flex items-center rounded-lg bg-primary p-2"
        >
          <Text className="text-foreground"> Refresh posts</Text>
        </Pressable>

        <View className="py-2">
          <Text className="font-semibold italic text-primary">
            Press on a post
          </Text>
        </View>

        <View className="flex flex-col space-y-2">
          <Text className="text-foreground font-bold">
            Supbase URL: {process.env.EXPO_PUBLIC_SUPABASE_URL}
          </Text>
        </View>

        <View className="flex flex-col space-y-2">
          <Text className="text-foreground font-bold">
            Supbase Key: {process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
