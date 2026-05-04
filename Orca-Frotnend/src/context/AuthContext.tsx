import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client/react";
import { getStoredToken, setStoredToken } from "../graphql/client";
import { LOGIN_MUTATION, ME_QUERY } from "../graphql/operations";
import type {
  AuthUser,
  LoginMutation,
  LoginVars,
  MeQuery,
} from "../graphql/types";

export type { AuthUser };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  meLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readInitialToken(): string | null {
  return getStoredToken();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [sessionToken, setSessionToken] = useState<string | null>(() =>
    readInitialToken(),
  );

  const hasToken = Boolean(sessionToken);

  const { data, loading: meLoading } = useQuery<MeQuery>(ME_QUERY, {
    skip: !hasToken,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const [loginMutation] = useMutation<LoginMutation, LoginVars>(
    LOGIN_MUTATION,
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginMutation({ variables: { email, password } });
      const token = res.data?.login?.token;
      if (!token) throw new Error("Login failed");
      setStoredToken(token);
      setSessionToken(token);
      await client.resetStore();
    },
    [loginMutation, client],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setSessionToken(null);
    void client.clearStore();
  }, [client]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: sessionToken,
      user: (data?.me as AuthUser | undefined) ?? null,
      meLoading: hasToken && meLoading,
      login,
      logout,
    }),
    [sessionToken, data?.me, meLoading, hasToken, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
