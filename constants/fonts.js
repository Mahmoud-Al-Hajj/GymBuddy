import { useFonts } from "expo-font";

export const fonts = {
  primary: "Montserrat_700Bold", // Strong, modern headline font
  secondary: "Inter_400Regular", // Clean, readable body text
  accent: "BebasNeue_400Regular", // Sporty / logo-style font
  tertiary: "Anton_400Regular",
  hoop: "GymBold",
};

export const useGymBold = () => {
  const [fontsLoaded, fontError] = useFonts({
    GymBold: require("../assets/fonts/RetroSportDemo-Regular.otf"),
  });

  if (fontError) {
    console.error("Error loading GymBold font:", fontError);
  }

  return fontsLoaded;
};

export const Ultimate = () => {
  const [fontsLoaded, fontError] = useFonts({
    Ultimate: require("../assets/fonts/Ultimate.ttf"),
  });

  if (fontError) {
    console.error("Error loading Ultimate font:", fontError);
  }

  return fontsLoaded;
};

export const RetroSportDemo = () => {
  const [fontsLoaded, fontError] = useFonts({
    RetroSportDemo: require("../assets/fonts/RetroSportDemo-Regular.otf"),
  });

  if (fontError) {
    console.error("Error loading RetroSportDemo font:", fontError);
  }

  return fontsLoaded;
};
