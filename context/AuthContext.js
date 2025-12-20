import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import { setLogoutCallback } from "../utils/api";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingFlag, setOnboardingFlag] = useState(0);

  useEffect(() => {
    checkAuthStatus();

    setLogoutCallback(async () => {
      await signOut();
    });
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const email = await SecureStore.getItemAsync("userEmail");

      if (token && email) {
        setUser({ email });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (hasCompletedOnboarding) => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      setUser({ email });
      setIsAuthenticated(true);
      if (hasCompletedOnboarding) {
        setOnboardingFlag((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userEmail");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    onboardingFlag,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
