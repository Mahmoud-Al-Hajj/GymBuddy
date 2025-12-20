import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AuthProvider from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";
import LandingPage from "./auth/landingPage";
import Login from "./auth/login";
import Register from "./auth/register";
import HomePage from "./HomePage";
import Onboarding from "./Onboarding";
import Profile from "./ProfileScreen";
import SettingsPage from "./SettingsPage";

const Stack = createStackNavigator();

function Navigation() {
  const { isAuthenticated, isLoading, onboardingFlag } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isAuthenticated) {
        const completed = await SecureStore.getItemAsync("onboardingCompleted");
        setOnboardingCompleted(completed === "true");
      } else {
        setOnboardingCompleted(null);
      }
    };

    checkOnboarding();
  }, [isAuthenticated, onboardingFlag]);

  if (isLoading || (isAuthenticated && onboardingCompleted === null)) {
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
          {!onboardingCompleted && (
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

export default function Index() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
