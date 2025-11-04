import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "./auth/landingPage";
import Login from "./auth/login";
import Home from "./Home";
import HomePage from "./HomePage";
import Onboarding from "./Onboarding";
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
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Home2" component={Home} />
    </Stack.Navigator>
  );
}
