import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import type { IdTokenClaims } from "@logto/rn";
import { useLogto } from "@logto/rn";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { logtoService } from "~/config/logto";


export default function Home() {
  const { signIn, signOut, isAuthenticated, getIdTokenClaims } = useLogto();
  const [user, setUser] = useState<IdTokenClaims | null>(null);
  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then((claims) => {
        setUser(claims);
      }).catch(console.error);
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const { data: serverUser, error, isLoading, refetch, isRefetching } = api.auth.getSession.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <View className="h-full w-full bg-background p-4">
        <Text className="text-2xl font-bold text-center text-white">Welcome to Allied Flow</Text>

        <Text className="text-center text-white mt-4">
          {isAuthenticated ? `Hello ${user?.email}` : "Please sign in to continue"}
        </Text>

        {isAuthenticated && (
          <Text className="text-center text-white mt-4">
            <Text className="font-bold">Server User:</Text>
            {(isLoading || isRefetching) && <Text>Loading...</Text>}
            {error && <Text>Error: {error.message}</Text>}
            {serverUser && <Text>{JSON.stringify(serverUser)}</Text>}
          </Text>
        )}

        <Pressable
          className="bg-primary text-white p-2 rounded-md mt-4"
          onPress={() => (isAuthenticated ? signOut() : signIn(logtoService.redirectUri))}
        >
          <Text className="text-white text-center">
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Text>
        </Pressable>

        <Pressable
          className="bg-primary text-white p-2 rounded-md mt-4"
          onPress={() => refetch()}
        >
          <Text className="text-white text-center">
            Refetch
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
