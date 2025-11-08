import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors.js";

function SettingsPage({ navigation }) {
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg"); // "kg" or "lbs"

  useEffect(() => {
    loadSettings();
  }, []);

  // Load saved settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      const savedWeightUnit = await AsyncStorage.getItem("weightUnit");

      if (savedNotifications !== null) {
        setNotificationsEnabled(JSON.parse(savedNotifications));
      }
      if (savedWeightUnit !== null) {
        setWeightUnit(savedWeightUnit);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  // Toggle notifications
  const toggleNotifications = async (value) => {
    try {
      setNotificationsEnabled(value);
      await AsyncStorage.setItem("notificationsEnabled", JSON.stringify(value));

      if (value) {
        Alert.alert(
          "Notifications Enabled",
          "You'll receive workout reminders!"
        );
      }
    } catch (error) {
      console.error("Error saving notification setting:", error);
    }
  };

  // Toggle weight unit
  const toggleWeightUnit = async () => {
    try {
      const newUnit = weightUnit === "kg" ? "lbs" : "kg";
      setWeightUnit(newUnit);
      await AsyncStorage.setItem("weightUnit", newUnit);

      Alert.alert(
        "Weight Unit Changed",
        `Weight will now be displayed in ${newUnit.toUpperCase()}`
      );
    } catch (error) {
      console.error("Error saving weight unit:", error);
    }
  };

  // Navigate to Profile (Edit Account)
  const handleEditProfile = () => {
    Navigation.navigate("Profile");
  };

  // Clear all workout data
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your workouts, photos, and PRs. This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
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

  // Logout
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
            navigation.navigate("Login");
          } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
        {/* Account Section */}
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

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Notifications Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <MaterialIcons
                name={
                  notificationsEnabled
                    ? "notifications-active"
                    : "notifications-off"
                }
                size={24}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingSubtext}>Get workout reminders</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#333", true: Colors.primary + "80" }}
              thumbColor={notificationsEnabled ? Colors.primary : "#888"}
            />
          </View>

          {/* Weight Unit Toggle */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={toggleWeightUnit}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="fitness-center"
                size={24}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.settingLabel}>Weight Unit</Text>
                <Text style={styles.settingSubtext}>
                  Currently using {weightUnit.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.unitBadge}>
              <Text style={styles.unitBadgeText}>
                {weightUnit.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity style={styles.settingRow} onPress={handleClearData}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="delete-sweep" size={24} color="#ff4444" />
              <View>
                <Text style={[styles.settingLabel, { color: "#ff4444" }]}>
                  Clear All Data
                </Text>
                <Text style={styles.settingSubtext}>
                  Delete all workouts and photos
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
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
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
});

export default SettingsPage;
