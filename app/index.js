import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import LandingPage from "./auth/landingPage";
import Login from "./auth/login";
import Register from "./auth/register";
import HomePage from "./HomePage";
import Onboarding from "./Onboarding";
import Profile from "./ProfileScreen";
import SettingsPage from "./SettingsPage";

const Stack = createStackNavigator();

export default function Index() {
  const { isAuthenticated, isLoading, onboardingFlag, authError } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  const [onboardingError, setOnboardingError] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      setIsCheckingOnboarding(true);
      setOnboardingError(null);
      try {
        if (isAuthenticated) {
          const completed = await SecureStore.getItemAsync(
            "onboardingCompleted"
          );
          setOnboardingCompleted(completed === "true");
        } else {
          setOnboardingCompleted(null);
        }
      } catch (error) {
        console.error("Onboarding check failed:", error);
        setOnboardingError("Failed to load onboarding status");
        // Default to showing onboarding if we can't check
        setOnboardingCompleted(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, onboardingFlag]);

  // Show error state if auth failed critically
  if (authError && !isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          padding: 20,
        }}
      >
        <Text
          style={{
            color: "#ff6b6b",
            fontSize: 18,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {authError}
        </Text>
        <TouchableOpacity
          onPress={() => {
            // Force re-render by updating the key of the AuthProvider
            window.location.reload?.() || console.log("Please restart the app");
          }}
          style={{
            backgroundColor: "#4ecdc4",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#000", fontWeight: "bold" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading || isCheckingOnboarding) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: "#666", marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      {isAuthenticated ? (
        <>
          {onboardingCompleted === false && (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Settings" component={SettingsPage} />
        </>
      ) : (
        <>
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}
