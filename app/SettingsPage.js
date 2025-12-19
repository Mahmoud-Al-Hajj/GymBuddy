import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors.js";
import { useAuth } from "../hooks/useAuth";
import { styles } from "../styles/SettingsPage.styles.js";
import { settingsAPI } from "../utils/api.js";

function SettingsPage({ navigation }) {
  const { signOut } = useAuth();
  const [weightUnit, setWeightUnit] = useState("kg");
  const [defaultSets, setDefaultSets] = useState(3);
  const [defaultReps, setDefaultReps] = useState(10);
  const [restTimer, setRestTimer] = useState(90);
  const [tempValue, setTempValue] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      console.log("getSettings response:", response);

      if (response.ok && response.data) {
        const settings = response.data;
        setWeightUnit(settings.weightUnit || "kg");
        setDefaultSets(settings.defaultSets || 3);
        setDefaultReps(settings.defaultReps || 12);
        setRestTimer(settings.restTimer || 90);

        setOriginalSettings({
          weightUnit: settings.weightUnit || "kg",
          defaultSets: settings.defaultSets || 3,
          defaultReps: settings.defaultReps || 12,
          restTimer: settings.restTimer || 90,
        });

        // Also save to AsyncStorage for offline access
        await AsyncStorage.setItem("weightUnit", settings.weightUnit || "kg");
        await AsyncStorage.setItem(
          "defaultSets",
          (settings.defaultSets || 3).toString()
        );
        await AsyncStorage.setItem(
          "defaultReps",
          (settings.defaultReps || 12).toString()
        );
        await AsyncStorage.setItem(
          "restTimer",
          (settings.restTimer || 90).toString()
        );
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Fall back to AsyncStorage if API fails
      const localSettings = {
        weightUnit: await AsyncStorage.getItem("weightUnit"),
        defaultSets: await AsyncStorage.getItem("defaultSets"),
        defaultReps: await AsyncStorage.getItem("defaultReps"),
        restTimer: await AsyncStorage.getItem("restTimer"),
      };

      if (localSettings.weightUnit) setWeightUnit(localSettings.weightUnit);
      if (localSettings.defaultSets)
        setDefaultSets(parseInt(localSettings.defaultSets));
      if (localSettings.defaultReps)
        setDefaultReps(parseInt(localSettings.defaultReps));
      if (localSettings.restTimer)
        setRestTimer(parseInt(localSettings.restTimer));
    }
  };

  const saveSetting = async (key, value) => {
    try {
      // Save to AsyncStorage first
      let valueToStore = value.toString();
      if (typeof value === "boolean") {
        valueToStore = JSON.stringify(value);
      }
      await AsyncStorage.setItem(key, valueToStore);

      const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      const settingData = {};
      settingData[snakeCaseKey] = value;

      const updateResponse = await settingsAPI.updateSettings(settingData);
      console.log("updateSettings response:", updateResponse);
    } catch (error) {
      console.error("Error saving " + key + ":", error);
      Alert.alert("Error", "Failed to save setting");
    }
  };

  const toggleWeightUnit = async () => {
    const newUnit = weightUnit === "kg" ? "lbs" : "kg";
    setWeightUnit(newUnit);
    setHasUnsavedChanges(true);

    Alert.alert(
      "Weight Unit Changed",
      `All weights will be displayed in ${newUnit}`
    );
  };

  const incrementSets = async () => {
    if (defaultSets < 20) {
      const newValue = defaultSets + 1;
      setDefaultSets(newValue);
      setHasUnsavedChanges(true);
    }
  };

  const decrementSets = async () => {
    if (defaultSets > 1) {
      const newValue = defaultSets - 1;
      setDefaultSets(newValue);
      setHasUnsavedChanges(true);
    }
  };

  const incrementReps = async () => {
    if (defaultReps < 100) {
      const newValue = defaultReps + 1;
      setDefaultReps(newValue);
      setHasUnsavedChanges(true);
    }
  };

  const decrementReps = async () => {
    if (defaultReps > 1) {
      const newValue = defaultReps - 1;
      setDefaultReps(newValue);
      setHasUnsavedChanges(true);
    }
  };

  const incrementRestTimer = async () => {
    if (restTimer < 600) {
      const newValue = restTimer + 15;
      setRestTimer(newValue);
      setHasUnsavedChanges(true);
    }
  };

  const decrementRestTimer = async () => {
    if (restTimer > 15) {
      const newValue = restTimer - 15;
      setRestTimer(newValue);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveSettings = async () => {
    const settingsData = {
      weight_unit: weightUnit,
      default_sets: defaultSets,
      default_reps: defaultReps,
      rest_timer: parseInt(restTimer),
    };
    try {
      const response = await settingsAPI.updateSettings(settingsData);
      console.log("handleSaveSettings response:", response);

      if (response.ok) {
        await AsyncStorage.setItem("weightUnit", weightUnit);
        await AsyncStorage.setItem("defaultSets", defaultSets.toString());
        await AsyncStorage.setItem("defaultReps", defaultReps.toString());
        await AsyncStorage.setItem("restTimer", restTimer.toString());

        const newOriginalSettings = {
          weightUnit,
          defaultSets,
          defaultReps,
          restTimer,
        };
        setOriginalSettings(newOriginalSettings);

        setHasUnsavedChanges(false);
        Alert.alert("Success", "Settings saved successfully!");
      } else {
        Alert.alert("Error", "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings");
    }
  };

  const handleDiscardChanges = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setWeightUnit(originalSettings.weightUnit || "kg");
            setDefaultSets(originalSettings.defaultSets || 3);
            setDefaultReps(originalSettings.defaultReps || 12);
            setRestTimer(originalSettings.restTimer || 90);
            setHasUnsavedChanges(false);
          },
        },
      ]
    );
  };
  const handleEditProfile = () => {
    navigation.navigate("Profile");
  };

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "Reset all settings to default values?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          try {
            const response = await settingsAPI.resetSettings();
            console.log("resetSettings response:", response);

            if (response.ok) {
              await AsyncStorage.multiRemove([
                "weightUnit",
                "defaultSets",
                "defaultReps",
                "restTimer",
              ]);

              setWeightUnit("kg");
              setDefaultSets(3);
              setDefaultReps(12);
              setRestTimer(90);

              Alert.alert("Success", "Settings reset to defaults");
            }
          } catch (error) {
            console.error("Error resetting settings:", error);
            Alert.alert("Error", "Failed to reset settings");
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (hasUnsavedChanges) {
              Alert.alert(
                "Unsaved Changes",
                "You have unsaved changes. Do you want to discard them?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Discard",
                    style: "destructive",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* All your existing sections stay the same */}
        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleEditProfile}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="person" size={24} color={Colors.primary} />
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Workout Preferences section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Preferences</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={toggleWeightUnit}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={24}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.settingLabel}>Weight Unit</Text>
                <Text style={styles.settingSubtext}>Tap to switch units</Text>
              </View>
            </View>
            <View style={styles.unitBadge}>
              <Text style={styles.unitBadgeText}>{weightUnit}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="counter"
                size={24}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.settingLabel}>Default Sets</Text>
                <Text style={styles.settingSubtext}>For new exercises</Text>
              </View>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={decrementSets}
              >
                <MaterialIcons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{defaultSets}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={incrementSets}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="repeat"
                size={24}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.settingLabel}>Default Reps</Text>
                <Text style={styles.settingSubtext}>For new exercises</Text>
              </View>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={decrementReps}
              >
                <MaterialIcons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{defaultReps}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={incrementReps}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={24}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.settingLabel}>Rest Timer</Text>
                <Text style={styles.settingSubtext}>
                  Default rest between sets
                </Text>
              </View>
            </View>
            <View style={styles.timerContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={decrementRestTimer}
              >
                <MaterialIcons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <View style={styles.timerValueContainer}>
                <Text style={styles.timerValue}>{restTimer}</Text>
              </View>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={incrementRestTimer}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="info" size={24} color="#888" />
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={styles.versionText}>GymBuddy 1.0.0</Text>
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={24} color="#888" />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={24} color="#888" />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleResetSettings}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="restore" size={24} color="#FFA726" />
              <View>
                <Text style={[styles.settingLabel, { color: "#FFA726" }]}>
                  Reset Settings
                </Text>
                <Text style={styles.settingSubtext}>
                  Restore default settings
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="logout" size={24} color="#EF5350" />
              <Text style={[styles.settingLabel, { color: "#EF5350" }]}>
                Logout
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {hasUnsavedChanges && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscardChanges}
          >
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveSettingsButton}
            onPress={handleSaveSettings}
          >
            <Text style={styles.saveSettingsButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default SettingsPage;
