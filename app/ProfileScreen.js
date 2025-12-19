import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BMICard from "../components/BMICard.js";
import InfoRow from "../components/InfoRow.js";
import ProfileCard from "../components/ProfileCard.js";
import StatsGrid from "../components/StatsGrid.js";
import { Colors } from "../constants/colors.js";
import { usePersonalBests } from "../hooks/usePersonalBests";
import { useProgressPhotos } from "../hooks/useProgressPhotos";
import { useWorkouts } from "../hooks/useWorkouts";
import { styles } from "../styles/ProfileScreen.styles.js";
import { profileAPI } from "../utils/api.js";

function ProfilePage({ navigation }) {
  // Use hooks for live data
  const { workouts, loadWorkouts } = useWorkouts();
  const { personalBests, loadPersonalBests } = usePersonalBests();
  const { progressPhotos, loadProgressPhotos } = useProgressPhotos();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [profilePhotoUri, setProfilePhotoUri] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    requestPermission();
    loadUserData();
    // Load stats from hooks instead
    loadWorkouts();
    loadPersonalBests();
    loadProgressPhotos();
    loadWeightUnit();
  }, []);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission Required",
        "You need to enable camera permission to set a profile photo"
      );
    }
  };

  const selectProfileImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setProfilePhotoUri(uri);
      await SecureStore.setItemAsync("profilePhotoUri", uri);

      // Optionally save to backend
      await syncProfileToBackend();
    }
  };

  const removeProfileImage = async () => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setProfilePhotoUri("");
            await SecureStore.deleteItemAsync("profilePhotoUri");
            await syncProfileToBackend();
          },
        },
      ]
    );
  };

  const loadWeightUnit = async () => {
    try {
      const savedUnit = await AsyncStorage.getItem("weightUnit");
      if (savedUnit) setWeightUnit(savedUnit);
    } catch (error) {
      console.error("Error loading weight unit:", error);
    }
  };

  const convertWeight = (weightInKg) => {
    if (!weightInKg) return "Not set";
    if (weightUnit === "lbs") {
      return `${(parseFloat(weightInKg) * 2.20462).toFixed(1)} lbs`;
    }
    return `${weightInKg} kg`;
  };

  // ============ NEW: Load user data from backend ============
  const loadUserData = async () => {
    setRefreshing(true);
    try {
      // Try to load from backend first
      const response = await profileAPI.getProfile();
      console.log("getProfile response:", response);

      if (response.ok && response.data) {
        const userData = response.data;

        // Update state with backend data
        if (userData.email) {
          setEmail(userData.email);
          setUsername(userData.username || userData.email.split("@")[0]);
        }
        if (userData.gender) setGender(userData.gender);
        if (userData.age) setAge(userData.age.toString());
        if (userData.weight) setWeight(userData.weight.toString());
        if (userData.height) setHeight(userData.height.toString());

        // Save to SecureStore for offline access
        if (userData.email)
          await SecureStore.setItemAsync("userEmail", userData.email);
        if (userData.gender)
          await SecureStore.setItemAsync("userGender", userData.gender);
        if (userData.age)
          await SecureStore.setItemAsync("userAge", userData.age.toString());
        if (userData.weight)
          await SecureStore.setItemAsync(
            "userWeight",
            userData.weight.toString()
          );
        if (userData.height)
          await SecureStore.setItemAsync(
            "userHeight",
            userData.height.toString()
          );

        // Format member since date
        if (userData.created_at) {
          const memberSince = formatMemberSince(userData.created_at);
          setStats((prev) => ({ ...prev, memberSince }));
        }
      } else {
        // If backend fails, load from SecureStore (offline mode)
        await loadUserDataFromLocal();
      }

      // Load profile photo from local storage
      const photoUri = await SecureStore.getItemAsync("profilePhotoUri");
      if (photoUri) setProfilePhotoUri(photoUri);
    } catch (error) {
      console.error("Error loading user data from backend:", error);
      // Fallback to local storage
      await loadUserDataFromLocal();
    } finally {
      setRefreshing(false);
    }
  };

  // Fallback: Load from local SecureStore
  const loadUserDataFromLocal = async () => {
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
      console.error("Error loading local data:", error);
    }
  };

  const loadWorkoutStats = useEffect(() => {
    // Update stats from hook data
    setStats((currentStats) => ({
      ...currentStats,
      totalWorkouts: workouts.length,
      totalPRs: personalBests.length,
      totalPhotos: progressPhotos.length,
    }));
  }, [workouts, personalBests, progressPhotos]);

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

  //Save edit with backend sync
  const syncProfileToBackend = async () => {
    try {
      const profileData = {
        gender: gender,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
      };

      const response = await profileAPI.updateProfile(profileData);
      console.log("updateProfile response:", response);

      if (!response.ok) {
        console.error("Failed to sync profile to backend");
      }
    } catch (error) {
      console.error("Error syncing profile:", error);
    }
  };

  //Save edit with backend sync
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

    setLoading(true);

    try {
      // Update local state and SecureStore
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

      // Sync to backend
      const updateData = {
        [editField]: editField === "gender" ? editValue : parseFloat(editValue),
      };

      const response = await profileAPI.updateProfile(updateData);

      if (response.ok && response.data) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Warning", "Saved locally but failed to sync with server");
      }

      setShowEditModal(false);
    } catch (error) {
      Alert.alert("Warning", "Saved locally but failed to sync with server");
      setShowEditModal(false);
    } finally {
      setLoading(false);
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

            navigation.reset({
              index: 0,
              routes: [{ name: "Landing" }],
            });
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
      "This will delete all your workouts, photos, and PRs from both your device and our servers. This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // Delete profile from backend
              const response = await profileAPI.deleteProfile();

              if (response.ok) {
                // Clear local data
                await AsyncStorage.removeItem("workouts");
                await SecureStore.deleteItemAsync("userGender");
                await SecureStore.deleteItemAsync("userAge");
                await SecureStore.deleteItemAsync("userWeight");
                await SecureStore.deleteItemAsync("userHeight");
                await SecureStore.deleteItemAsync("onboardingCompleted");
                await SecureStore.deleteItemAsync("profilePhotoUri");

                // Reset state
                setProfilePhotoUri("");
                setGender("male");
                setAge("");
                setWeight("");
                setHeight("");
                setStats({
                  totalWorkouts: 0,
                  totalPRs: 0,
                  totalPhotos: 0,
                  memberSince: stats.memberSince,
                });

                Alert.alert(
                  "Success",
                  "All data has been deleted from your device and our servers.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "Landing" }],
                        });
                      },
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to delete data from server. Please try again."
                );
              }
            } catch (error) {
              console.error("Error clearing data:", error);
              Alert.alert("Error", "Failed to clear data. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getAchievements = () => {
    const workoutCount = stats.totalWorkouts;
    const prCount = stats.totalPRs;

    return [
      {
        id: 1,
        name: "First Step",
        icon: "directions-walk",
        unlocked: workoutCount >= 1,
      },
      {
        id: 2,
        name: "Getting Started",
        icon: "fitness-center",
        unlocked: workoutCount >= 3,
      },
      {
        id: 3,
        name: "Committed",
        icon: "local-fire-department",
        unlocked: workoutCount >= 5,
      },
      {
        id: 4,
        name: "Gym Rat",
        icon: "pets",
        unlocked: workoutCount >= 7,
      },
      {
        id: 5,
        name: "L Ossa Kella",
        icon: "emoji-events",
        unlocked: workoutCount >= 10,
      },
      {
        id: 6,
        name: "PR King",
        icon: "military-tech",
        unlocked: prCount >= 10,
      },
      {
        id: 7,
        name: "Photographer",
        icon: "photo-camera",
        unlocked: stats.totalPhotos >= 5,
      },
      {
        id: 8,
        name: "Legend",
        icon: "star",
        unlocked: workoutCount >= 15,
      },
    ];
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <View style={styles.container}>
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Updating...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
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
          profilePhotoUri={profilePhotoUri}
          onSelectImage={selectProfileImage}
          onRemoveImage={removeProfileImage}
        />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.achievementTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsRow}>
              {getAchievements().map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementBadge,
                    !achievement.unlocked && styles.achievementLocked,
                  ]}
                >
                  <MaterialIcons
                    name={achievement.icon}
                    size={32}
                    color={achievement.unlocked ? "#FFD700" : "#888"}
                  />
                  <Text
                    style={[
                      styles.achievementName,
                      !achievement.unlocked && styles.achievementNameLocked,
                    ]}
                  >
                    {achievement.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

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
            value={weight ? convertWeight(weight) : "Not set"}
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
            disabled={loading}
          >
            <MaterialIcons name="delete-sweep" size={24} color="#ff4444" />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loading}
          >
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity> */}
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
                  editable={!loading}
                />
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  loading && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveEdit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ProfilePage;
