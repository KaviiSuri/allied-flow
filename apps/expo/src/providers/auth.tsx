import { createContext, useContext, useEffect, useState } from "react";
import { defaultAbility, defineAbilityFor } from "@repo/permissions";
import { useLogto } from "@logto/rn";
import { Redirect } from "expo-router";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { createContextualCan } from "@casl/react";

interface AuthContext {
  isLoading: boolean;
  isError: boolean;
  user: RouterOutputs["auth"]["getSession"] | null;
}

const authContext = createContext<AuthContext>({
  isLoading: false,
  isError: false,
  user: null,
});

export type Abilities = ReturnType<typeof defineAbilityFor>;
const abilityContext = createContext<Abilities>(defaultAbility);

export const Can = createContextualCan<Abilities>(abilityContext.Consumer);

export const useUser = () => useContext(authContext);
export const useAbility = () => useContext(abilityContext);

export default function AuthProvider(props: { children: React.ReactNode }) {
  const { isAuthenticated } = useLogto();
  const {
    data: backendUser,
    isLoading,
    isPending,
    isError,
    error,
  } = api.auth.getSession.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  console.log("error", error);

  const [ability, setAbility] = useState<Abilities | null>(null);

  useEffect(() => {
    if (!backendUser) {
      setAbility(null);
      return;
    }
    const ability = defineAbilityFor(backendUser);
    setAbility(ability);
  }, [backendUser]);

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />;
  }

  return (
    <authContext.Provider
      value={{
        isLoading: isLoading || isPending,
        user: backendUser ?? null,
        isError,
      }}
    >
      <abilityContext.Provider value={ability ?? defaultAbility}>
        {props.children}
      </abilityContext.Provider>
    </authContext.Provider>
  );
}

export function AuthConsumer(props: {
  children: (value: AuthContext, ability: Abilities) => React.ReactNode;
}) {
  return (
    <authContext.Consumer>
      {(value) => {
        return (
          <abilityContext.Consumer>
            {(ability) => {
              if (!value.user) {
                return null;
              }
              return props.children(value, ability);
            }}
          </abilityContext.Consumer>
        );
      }}
    </authContext.Consumer>
  );
}
