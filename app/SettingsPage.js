import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors.js";

function SettingsPage({ navigation }) {
  const [weightUnit, setWeightUnit] = useState("kg");
  const [defaultSets, setDefaultSets] = useState("3");
  const [defaultReps, setDefaultReps] = useState("12");
  const [restTimer, setRestTimer] = useState("60");

  const [showSetsModal, setShowSetsModal] = useState(false);
  const [showRepsModal, setShowRepsModal] = useState(false);
  const [showRestTimerModal, setShowRestTimerModal] = useState(false);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = {
        weightUnit: await AsyncStorage.getItem("weightUnit"),
        defaultSets: await AsyncStorage.getItem("defaultSets"),
        defaultReps: await AsyncStorage.getItem("defaultReps"),
        restTimer: await AsyncStorage.getItem("restTimer"),
      };

      if (settings.weightUnit !== null) {
        setWeightUnit(settings.weightUnit);
      }
      if (settings.defaultSets !== null) {
        setDefaultSets(settings.defaultSets);
      }
      if (settings.defaultReps !== null) {
        setDefaultReps(settings.defaultReps);
      }
      if (settings.restTimer !== null) {
        setRestTimer(settings.restTimer);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        typeof value === "boolean" ? JSON.stringify(value) : value.toString()
      );
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      Alert.alert("Error", "Failed to save setting");
    }
  };

  const toggleWeightUnit = async () => {
    const newUnit = weightUnit === "kg" ? "lbs" : "kg";
    setWeightUnit(newUnit);
    await saveSetting("weightUnit", newUnit);

    Alert.alert(
      "Weight Unit Changed",
      `All weights will be displayed in ${newUnit.toUpperCase()}`
    );
  };

  const handleSaveSets = async () => {
    if (!tempValue || parseInt(tempValue) < 1 || parseInt(tempValue) > 20) {
      Alert.alert("Invalid Input", "Please enter a number between 1 and 20");
      return;
    }

    setDefaultSets(tempValue);
    await saveSetting("defaultSets", tempValue);
    setShowSetsModal(false);
    Alert.alert("Success", `Default sets set to ${tempValue}`);
  };

  const handleSaveReps = async () => {
    if (!tempValue || parseInt(tempValue) < 1 || parseInt(tempValue) > 100) {
      Alert.alert("Invalid Input", "Please enter a number between 1 and 100");
      return;
    }

    setDefaultReps(tempValue);
    await saveSetting("defaultReps", tempValue);
    setShowRepsModal(false);
    Alert.alert("Success", `Default reps set to ${tempValue}`);
  };

  const handleSaveRestTimer = async () => {
    if (!tempValue || parseInt(tempValue) < 10 || parseInt(tempValue) > 600) {
      Alert.alert("Invalid Input", "Please enter seconds between 10 and 600");
      return;
    }

    setRestTimer(tempValue);
    await saveSetting("restTimer", tempValue);
    setShowRestTimerModal(false);
    Alert.alert("Success", `Rest timer set to ${tempValue} seconds`);
  };

  const handleEditProfile = () => {
    navigation.navigate("Profile");
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your workouts, photos, and personal records. This cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("workouts");
              Alert.alert("Success", "All workout data has been cleared");
            } catch (error) {
              console.error("Error clearing data:", error);
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert("Reset Settings", "Reset all settings to default values?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              "weightUnit",
              "defaultSets",
              "defaultReps",
              "restTimer",
            ]);

            // Reset to defaults
            setWeightUnit("kg");
            setDefaultSets("3");
            setDefaultReps("12");
            setRestTimer("60");

            Alert.alert("Success", "Settings reset to defaults");
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
          try {
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("userEmail");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const SettingModal = ({
    visible,
    onClose,
    title,
    value,
    onSave,
    placeholder,
    keyboardType = "numeric",
  }) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <TextInput
              style={styles.modalInput}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={placeholder}
              placeholderTextColor="#666"
              keyboardType={keyboardType}
              autoFocus
            />

            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account */}
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

        {/* Workout Preferences */}
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
              <Text style={styles.unitBadgeText}>
                {weightUnit.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              setTempValue(defaultSets);
              setShowSetsModal(true);
            }}
          >
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
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{defaultSets}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              setTempValue(defaultReps);
              setShowRepsModal(true);
            }}
          >
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
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{defaultReps}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              setTempValue(restTimer);
              setShowRestTimerModal(true);
            }}
          >
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="timer"
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
            <View style={styles.valueContainer}>
              <Text style={styles.valueText}>{restTimer}s</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="delete-sweep" size={24} color="#ff4444" />
              <View>
                <Text style={[styles.settingLabel, { color: "#ff4444" }]}>
                  Clear All Data
                </Text>
                <Text style={styles.settingSubtext}>
                  Delete all workouts permanently
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="info" size={24} color="#888" />
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
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
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <SettingModal
        visible={showSetsModal}
        onClose={() => setShowSetsModal(false)}
        title="Default Sets"
        value={defaultSets}
        onSave={handleSaveSets}
        placeholder="Enter number of sets (1-20)"
      />

      <SettingModal
        visible={showRepsModal}
        onClose={() => setShowRepsModal(false)}
        title="Default Reps"
        value={defaultReps}
        onSave={handleSaveReps}
        placeholder="Enter number of reps (1-100)"
      />

      <SettingModal
        visible={showRestTimerModal}
        onClose={() => setShowRestTimerModal(false)}
        title="Rest Timer"
        value={restTimer}
        onSave={handleSaveRestTimer}
        placeholder="Enter seconds (10-600)"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  settingSubtext: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  unitBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unitBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  versionText: {
    fontSize: 14,
    color: "#888",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalBody: {
    padding: 20,
  },
  modalInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default SettingsPage;
