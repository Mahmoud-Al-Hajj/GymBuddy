import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./auth/landingPage";
import Login from "./auth/login";
import Register from "./auth/register";
import HomePage from "./HomePage";
import Onboarding from "./Onboarding";
import Profile from "./ProfileScreen";
import SettingsPage from "./SettingsPage";
const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={SettingsPage} />
    </Stack.Navigator>
  );
}
