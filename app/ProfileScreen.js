import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BMICard from "../components/BMICard.js";
import InfoRow from "../components/InfoRow.js";
import ProfileCard from "../components/ProfileCard.js";
import StatsGrid from "../components/StatsGrid.js";
import { Colors } from "../constants/colors.js";

function ProfilePage({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [editValue, setEditValue] = useState("");

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalPRs: 0,
    totalPhotos: 0,
    memberSince: "",
  });

  useEffect(() => {
    loadUserData();
    loadWorkoutStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userEmail = await SecureStore.getItemAsync("userEmail");
      const userGender = await SecureStore.getItemAsync("userGender");
      const userAge = await SecureStore.getItemAsync("userAge");
      const userWeight = await SecureStore.getItemAsync("userWeight");
      const userHeight = await SecureStore.getItemAsync("userHeight");
      const memberSince = await SecureStore.getItemAsync("memberSince");

      if (userEmail) {
        setEmail(userEmail);
        setUsername(userEmail.split("@")[0]);
      }
      if (userGender) setGender(userGender);
      if (userAge) setAge(userAge);
      if (userWeight) setWeight(userWeight);
      if (userHeight) setHeight(userHeight);

      if (!memberSince) {
        const joinDate = new Date().toISOString();
        await SecureStore.setItemAsync("memberSince", joinDate);
        setStats((prev) => ({
          ...prev,
          memberSince: formatMemberSince(joinDate),
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          memberSince: formatMemberSince(memberSince),
        }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadWorkoutStats = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem("workouts");

      if (storedWorkouts) {
        const workouts = JSON.parse(storedWorkouts);

        const totalWorkouts = workouts.length;
        let totalPRs = 0;
        for (let workout of workouts) {
          if (workout.personalBests) {
            totalPRs += workout.personalBests.length;
          }
        }

        let totalPhotos = 0;
        for (let workout of workouts) {
          if (workout.photos) {
            totalPhotos += workout.photos.length;
          }
        }

        setStats((currentStats) => ({
          ...currentStats,
          totalWorkouts: totalWorkouts,
          totalPRs: totalPRs,
          totalPhotos: totalPhotos,
        }));
      }
    } catch (error) {
      console.error("Error loading workout stats:", error);
    }
  };

  const formatMemberSince = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const calculateBMI = () => {
    if (!weight || !height) return null;
    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { text: "N/A", color: "#888" };
    if (bmi < 18.5) return { text: "Underweight", color: "#FFA726" };
    if (bmi < 25) return { text: "Normal", color: "#4CAF50" };
    if (bmi < 30) return { text: "Overweight", color: "#FF9800" };
    return { text: "Obese", color: "#F44336" };
  };

  const openEditModal = (field, currentValue, label) => {
    setEditField(field);
    setEditValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      Alert.alert("Error", "Please enter a value");
      return;
    }

    if (
      editField === "age" ||
      editField === "weight" ||
      editField === "height"
    ) {
      const numValue = parseFloat(editValue);

      if (isNaN(numValue)) {
        Alert.alert("Error", "Please enter a valid number");
        return;
      }

      if (editField === "age") {
        if (numValue < 13 || numValue > 100) {
          Alert.alert("Error", "Age must be between 13 and 100 years");
          return;
        }
      }

      if (editField === "weight") {
        if (numValue < 20 || numValue > 400) {
          Alert.alert("Error", "Weight must be between 20 and 400 kg");
          return;
        }
      }

      if (editField === "height") {
        if (numValue < 100 || numValue > 250) {
          Alert.alert("Error", "Height must be between 100 and 250 cm");
          return;
        }
      }
    }

    try {
      switch (editField) {
        case "gender":
          await SecureStore.setItemAsync("userGender", editValue);
          setGender(editValue);
          break;
        case "age":
          await SecureStore.setItemAsync("userAge", editValue);
          setAge(editValue);
          break;
        case "weight":
          await SecureStore.setItemAsync("userWeight", editValue);
          setWeight(editValue);
          break;
        case "height":
          await SecureStore.setItemAsync("userHeight", editValue);
          setHeight(editValue);
          break;
      }

      setShowEditModal(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await SecureStore.deleteItemAsync("userToken");
            await SecureStore.deleteItemAsync("userEmail");
            await SecureStore.deleteItemAsync("userGender");
            await SecureStore.deleteItemAsync("userAge");
            await SecureStore.deleteItemAsync("userWeight");

            navigation.navigate("Login");
          } catch (error) {
            console.error("Error logging out:", error);
          }
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all your workouts, photos, and PRs. This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("workouts");
              setStats({
                ...stats,
                totalWorkouts: 0,
                totalPRs: 0,
                totalPhotos: 0,
              });
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

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

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
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.settingsButton}
        >
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <ProfileCard
          username={username}
          email={email}
          gender={gender}
          memberSince={stats.memberSince}
        />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />
        {stats.totalPRs < 1 && (
          <View style={styles.achievementContainer}>
            <LottieView
              source={require("../assets/animations/Trophy.json")}
              autoPlay
              loop
              style={styles.trophyAnimation}
            />
            <Text style={styles.achievementText}>
              {stats.totalPRs} Personal Records!
            </Text>
          </View>
        )}
        {/* Body Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Metrics</Text>

          <InfoRow
            icon={gender === "male" ? "gender-male" : "gender-female"}
            label="Gender"
            value={
              gender
                ? gender.charAt(0).toUpperCase() + gender.slice(1)
                : "Not set"
            }
            onPress={() => openEditModal("gender", gender, "Gender")}
          />

          <InfoRow
            icon="calendar"
            label="Age"
            value={age ? `${age} years` : "Not set"}
            onPress={() => openEditModal("age", age, "Age")}
          />

          <InfoRow
            icon="weight"
            label="Weight"
            value={weight ? `${weight} kg` : "Not set"}
            onPress={() => openEditModal("weight", weight, "Weight")}
          />

          <InfoRow
            icon="human-male-height"
            label="Height"
            value={height ? `${height} cm` : "Not set"}
            onPress={() => openEditModal("height", height, "Height")}
          />
        </View>

        {/* BMI Card */}
        <BMICard bmi={bmi} bmiCategory={bmiCategory} />

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <MaterialIcons name="delete-sweep" size={24} color="#ff4444" />
            <Text style={styles.dangerButtonText}>Clear All Workout Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {editField}</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {editField === "gender" ? (
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editValue === "male" && styles.genderOptionActive,
                    ]}
                    onPress={() => setEditValue("male")}
                  >
                    <MaterialCommunityIcons
                      name="gender-male"
                      size={24}
                      color={editValue === "male" ? Colors.primary : "#666"}
                    />
                    <Text
                      style={[
                        styles.genderOptionText,
                        editValue === "male" && styles.genderOptionTextActive,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      editValue === "female" && styles.genderOptionActive,
                    ]}
                    onPress={() => setEditValue("female")}
                  >
                    <MaterialCommunityIcons
                      name="gender-female"
                      size={24}
                      color={editValue === "female" ? Colors.primary : "#666"}
                    />
                    <Text
                      style={[
                        styles.genderOptionText,
                        editValue === "female" && styles.genderOptionTextActive,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <RNTextInput
                  style={styles.modalInput}
                  value={editValue}
                  onChangeText={setEditValue}
                  placeholder={`Enter ${editField}`}
                  placeholderTextColor="#666"
                  keyboardType={
                    editField === "age" ||
                    editField === "weight" ||
                    editField === "height"
                      ? "numeric"
                      : "default"
                  }
                  autoFocus
                />
              )}

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },

  dangerSection: {
    marginTop: 8,
    gap: 12,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ff444420",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4444",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    padding: 16,
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
    maxHeight: "60%",
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
    textTransform: "capitalize",
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
  genderOptions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  genderOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "20",
  },
  genderOptionText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  genderOptionTextActive: {
    color: Colors.primary,
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
  achievementContainer: {
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  trophyAnimation: {
    width: 140,
    height: 140,
  },
  achievementText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginTop: 12,
  },
});

export default ProfilePage;
