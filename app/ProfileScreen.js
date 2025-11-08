import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
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
import { Colors } from "../constants/colors.js";

function ProfilePage({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
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
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons
                name={
                  gender === "male" ? "face-man-profile" : "face-woman-profile"
                }
                size={48}
                color={Colors.primary}
              />
            </View>
          </View>
          <Text style={styles.profileName}>{username}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          <Text style={styles.memberSince}>
            Member since {stats.memberSince}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={28}
              color={Colors.primary}
            />
            <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="trophy" size={28} color="#FFD700" />
            <Text style={styles.statNumber}>{stats.totalPRs}</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="camera" size={28} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.totalPhotos}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>

        {/* Body Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Metrics</Text>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openEditModal("gender", gender, "Gender")}
          >
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name={gender === "male" ? "gender-male" : "gender-female"}
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.infoLabel}>Gender</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>
                {gender
                  ? gender.charAt(0).toUpperCase() + gender.slice(1)
                  : "Not set"}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openEditModal("age", age, "Age")}
          >
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.infoLabel}>Age</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>
                {age ? `${age} years` : "Not set"}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openEditModal("weight", weight, "Weight")}
          >
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name="weight"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.infoLabel}>Weight</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>
                {weight ? `${weight} kg` : "Not set"}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => openEditModal("height", height, "Height")}
          >
            <View style={styles.infoLeft}>
              <MaterialCommunityIcons
                name="human-male-height"
                size={24}
                color={Colors.primary}
              />
              <Text style={styles.infoLabel}>Height</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoValue}>
                {height ? `${height} cm` : "Not set"}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* BMI Card */}
        {bmi && (
          <View style={styles.bmiCard}>
            <View style={styles.bmiHeader}>
              <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
              <View
                style={[
                  styles.bmiCategoryBadge,
                  { backgroundColor: bmiCategory.color + "20" },
                ]}
              >
                <Text
                  style={[styles.bmiCategoryText, { color: bmiCategory.color }]}
                >
                  {bmiCategory.text}
                </Text>
              </View>
            </View>
            <Text style={styles.bmiValue}>{bmi}</Text>
            <Text style={styles.bmiSubtext}>
              Based on your height and weight
            </Text>
          </View>
        )}

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
  profileCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  infoRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoValue: {
    fontSize: 16,
    color: "#888",
  },
  bmiCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bmiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bmiCategoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  bmiSubtext: {
    fontSize: 13,
    color: "#888",
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
});

export default ProfilePage;
