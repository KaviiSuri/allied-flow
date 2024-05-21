"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import type { ReactNode } from "react";

import type { Session, User } from "@supabase/supabase-js";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "~/supabase/client";

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}>({
  user: null,
  session: null,
  isLoading: false,
});

export const AuthProvider = ({
  user: initialUser,
  session: initialSession,
  children,
}: {
  user: User | null;
  session: Session | null;
  children: ReactNode;
}) => {
  const [userSession, setUserSession] = useState<Session | null>(
    initialSession,
  );
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    void supabase()
      .auth.getSession()
      .then(({ data: { session } }) => {
        setUserSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      });

    const { data: authListener } = supabase().auth.onAuthStateChange(
      (event, session) => {
        setUserSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session: userSession,
    user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <ReactQueryDevtools />
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined) {
    throw new Error("useUser must be used within a AuthContextProvider.");
  }

  return context;
};
