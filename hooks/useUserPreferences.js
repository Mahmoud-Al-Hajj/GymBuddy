import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";

export const useUserPreferences = () => {
  const [userName, setUserName] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [defaultSets, setDefaultSets] = useState("");
  const [defaultReps, setDefaultReps] = useState("");

  const loadUserData = useCallback(async () => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      if (email) {
        setUserName(email.split("@")[0]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const loadDefaults = useCallback(async () => {
    try {
      const sets = await AsyncStorage.getItem("defaultSets");
      const reps = await AsyncStorage.getItem("defaultReps");
      const unit = await AsyncStorage.getItem("weightUnit");

      if (sets) setDefaultSets(sets);
      if (reps) setDefaultReps(reps);
      if (unit) setWeightUnit(unit);
    } catch (error) {
      console.error("Error loading defaults:", error);
    }
  }, []);

  return {
    userName,
    weightUnit,
    defaultSets,
    defaultReps,
    loadUserData,
    loadDefaults,
  };
};
