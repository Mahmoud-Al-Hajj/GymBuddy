import * as SecureStore from "expo-secure-store";
import { createContext, useEffect, useState } from "react";
import { profileAPI, setLogoutCallback } from "../utils/api";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingFlag, setOnboardingFlag] = useState(0);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAuthStatus();

    setLogoutCallback(async () => {
      await signOut();
    });
  }, []);

  const checkAuthStatus = async () => {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 500;

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const email = await SecureStore.getItemAsync("userEmail");

      if (token && email) {
        const response = await profileAPI.getProfile();

        if (response.ok && response.data) {
          setUser({ email, ...response.data });
          setIsAuthenticated(true);
          setAuthError(null);
        } else {
          console.warn("Token validation failed, clearing credentials");
          await clearAuthData();
        }
      } else {
        // No token
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Only set error if we had a token but validation failed
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        setAuthError("Unable to verify session. Please log in again.");
      }
      await clearAuthData();
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userEmail");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Failed to clear auth data:", error);
    }
  };

  const signIn = async (hasCompletedOnboarding) => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      const token = await SecureStore.getItemAsync("userToken");

      if (!token || !email) {
        throw new Error("Missing authentication credentials");
      }

      const response = await profileAPI.getProfile();

      if (response.ok && response.data) {
        setUser({ email, ...response.data });
        setIsAuthenticated(true);
        setAuthError(null);

        if (hasCompletedOnboarding) {
          setOnboardingFlag((prev) => prev + 1);
        }
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      setAuthError("Failed to sign in. Please try again.");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await clearAuthData();
      setAuthError(null);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    onboardingFlag,
    authError,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
