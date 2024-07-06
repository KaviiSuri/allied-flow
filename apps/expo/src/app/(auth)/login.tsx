import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import type { IdTokenClaims } from "@logto/rn";
import { useLogto } from "@logto/rn";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Colors } from "../../constants/Color";
import { logtoService } from "~/config/logto";

export default function Home() {
  const { signIn, isAuthenticated, getIdTokenClaims } = useLogto();
  const [user, setUser] = useState<IdTokenClaims | null>(null);
  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims()
        .then((claims) => {
          setUser(claims);
        })
        .catch(console.error);
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const {
    data: serverUser,
    error,
    isLoading,
    refetch,
    isRefetching,
  } = api.auth.getSession.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (isAuthenticated) {
    return <Redirect href={"/dashboard"} />;
  }

  return (
    <SafeAreaView style={styles.pageBackground}>
      <Text style={styles.header}> Welcome to Allied Flow</Text>
      {/* Changes page title visible on the header */}
      <View style={styles.loginContainer}>
        <View style={styles.loginWindow}>

          <Text style={styles.textPrimary}>
            Log in to your account
            {/* {(isLoading || isRefetching) && ( */}
            {/*   <Text style={styles.textPrimary}>Loading...</Text> */}
            {/* )} */}
            {/* {error && <Text>Error: {error.message}</Text>} */}
            {/* {serverUser && <Text>{JSON.stringify(serverUser)}</Text>} */}
          </Text>

          <Pressable
            style={styles.loginButtons}
            onPress={() => signIn(logtoService.redirectUri)}
          >
            <Text style={styles.loginButtonText}>
              Sign In
            </Text>
          </Pressable>

          <Pressable
            style={styles.loginButtonsSecondary}
            onPress={() => refetch()}
          >
            <Text style={styles.loginButtonsTextSecondary}>Refetch</Text>
          </Pressable>
        </View>
        <Text style={styles.bottomText}>
          By Proceeding, you confirm that you have reviewed and agree to Spot
          Privacy Policy and Terms of Service
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: "#142454",
    fontFamily: "AvenirHeavy",
    fontSize: 24,
    lineHeight: 40,
    fontWeight: 800,
    marginBottom: 56,
  },
  pageBackground: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.loginScreenBg,
    width: "100%",
    flex: 1,
  },
  loginContainer: {
    maxWidth: "90%",
    width: 472,
    rowGap: 60,
    alignItems: "center",
    justifyContent: "space-between",
  },
  loginWindow: {
    alignItems: "center",
    justifyContent: "center",
    rowGap: 24,
    backgroundColor: Colors.background,
    width: "100%",
    borderRadius: 16,
    shadowColor: "#0E3EAE",
    padding: 56,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  bottomText: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    width: 360,
    color: Colors.tandcTextColor,
  },
  loginButtons: {
    backgroundColor: Colors.buttonPrimary,
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#0284c7",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonsSecondary: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#D0D5DD",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontFamily: "AvenirHeavy",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 800,
    color: "#fff",
  },
  loginButtonsTextSecondary: {
    fontFamily: "AvenirHeavy",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 800,
    color: "#344054",
  },
  textPrimary: {
    fontFamily: "AvenirHeavy",
    fontSize: 24,
    fontWeight: 800,
    color: Colors.text,
    lineHeight: 32,
    textAlign: "center",
  },
});
