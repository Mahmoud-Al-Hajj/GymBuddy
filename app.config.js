import dotenv from "dotenv";

dotenv.config();

export default {
  expo: {
    name: "GymBuddy",
    slug: "GymBuddy",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "gymbuddy",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.mahjooj.gymbuddy",
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.mahjooj.gymbuddy",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "f955b933-c29a-4419-8267-45d96c93ee05",
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      apiUrl: "https://gymbuddy-74oz.onrender.com/api",
    },
  },
};
