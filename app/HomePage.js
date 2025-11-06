import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors.js";

function HomePage({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [userName, setUserName] = useState("");
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    checkOnboardingStatus();
    loadUserData();
    loadWorkouts();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const userGender = await SecureStore.getItemAsync("userGender");
      const userAge = await SecureStore.getItemAsync("userAge");
      const userWeight = await SecureStore.getItemAsync("userWeight");

      if (!userGender || !userAge || !userWeight) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        });
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      if (email) {
        setUserName(email.split("@")[0]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadWorkouts = async () => {
    try {
      const storedWorkouts = await AsyncStorage.getItem("workouts");
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
    }
  };

  const saveWorkouts = async (updatedWorkouts) => {
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error("Error saving workouts:", error);
    }
  };

  const handleAddWorkout = () => {
    if (!workoutName.trim() || !exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newWorkout = {
      id: Date.now().toString(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: [
        {
          id: Date.now().toString(),
          name: exerciseName,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: weight ? parseFloat(weight) : 0,
          completed: false,
        },
      ],
      photos: [],
      personalBests: [],
    };

    const updatedWorkouts = [newWorkout, ...workouts];
    saveWorkouts(updatedWorkouts);

    // Reset form
    setWorkoutName("");
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setShowAddWorkout(false);

    Alert.alert("Success", "Workout added successfully!");
  };

  const handleAddExercise = (workoutId) => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newExercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : 0,
      completed: false,
    };

    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: [...workout.exercises, newExercise],
        };
      }
      return workout;
    });

    saveWorkouts(updatedWorkouts);
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
  };

  const toggleExerciseComplete = (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          exercises: workout.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
          ),
        };
      }
      return workout;
    });
    saveWorkouts(updatedWorkouts);
  };

  const markPersonalBest = (workoutId, exerciseId) => {
    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === workoutId) {
        const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
        const pb = {
          id: Date.now().toString(),
          exerciseName: exercise.name,
          weight: exercise.weight,
          reps: exercise.reps,
          date: new Date().toISOString(),
        };
        return {
          ...workout,
          personalBests: [...(workout.personalBests || []), pb],
        };
      }
      return workout;
    });
    saveWorkouts(updatedWorkouts);
    Alert.alert("Personal Best!", "New PR logged successfully!");
  };

  const handleAddPhoto = async (workoutId) => {
    try {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert("Error", "Media library permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const updatedWorkouts = workouts.map((workout) => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              photos: [
                ...(workout.photos || []),
                {
                  id: Date.now().toString(),
                  uri: result.assets[0].uri,
                  date: new Date().toISOString(),
                },
              ],
            };
          }
          return workout;
        });

        await saveWorkouts(updatedWorkouts);

        // Find the workout we just updated and show it in the modal
        const updatedSelectedWorkout = updatedWorkouts.find(
          (workout) => workout.id === workoutId
        );

        setSelectedWorkout(updatedSelectedWorkout);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add photo");
    }
  };

  const deleteWorkout = (workoutId) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedWorkouts = workouts.filter((w) => w.id !== workoutId);
            saveWorkouts(updatedWorkouts);
            setShowWorkoutDetail(false);
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.subGreeting}>Ready to crush your workout?</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.profileButton}
        >
          <MaterialIcons name="person" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={24}
            color={Colors.primary}
          />
          <Text style={styles.statNumber}>{workouts.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.statNumber}>
            {workouts.reduce(
              (sum, w) => sum + (w.personalBests?.length || 0),
              0
            )}
          </Text>
          <Text style={styles.statLabel}>PRs</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="camera" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>
            {workouts.reduce((sum, w) => sum + (w.photos?.length || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Photos</Text>
        </View>
      </View>

      <View style={styles.workoutsHeader}>
        <Text style={styles.sectionTitle}>My Workouts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddWorkout(true)}
        >
          <MaterialIcons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.workoutsList}
        showsVerticalScrollIndicator={false}
      >
        {workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="dumbbell" size={64} color="#333" />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubText}>
              Tap + to add your first workout
            </Text>
          </View>
        ) : (
          workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.workoutCard}
              onPress={() => {
                setSelectedWorkout(workout);
                setShowWorkoutDetail(true);
              }}
            >
              <View style={styles.workoutCardHeader}>
                <View>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDate}>
                    {formatDate(workout.date)}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#666"
                />
              </View>

              <View style={styles.workoutStats}>
                <View style={styles.workoutStatItem}>
                  <MaterialCommunityIcons
                    name="weight-lifter"
                    size={18}
                    color={Colors.primary}
                  />
                  <Text style={styles.workoutStatText}>
                    {workout.exercises.length} exercises
                  </Text>
                </View>
                {workout.personalBests?.length > 0 && (
                  <View style={styles.workoutStatItem}>
                    <MaterialCommunityIcons
                      name="trophy"
                      size={18}
                      color="#FFD700"
                    />
                    <Text style={styles.workoutStatText}>
                      {workout.personalBests.length} PRs
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showAddWorkout}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddWorkout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Workout</Text>
              <TouchableOpacity onPress={() => setShowAddWorkout(false)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Workout Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Leg Day"
                placeholderTextColor="#666"
                value={workoutName}
                onChangeText={setWorkoutName}
              />

              <Text style={styles.inputLabel}>Exercise Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Squat"
                placeholderTextColor="#666"
                value={exerciseName}
                onChangeText={setExerciseName}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Sets *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={sets}
                    onChangeText={setSets}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Reps *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="12"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="60"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddWorkout}
              >
                <Text style={styles.submitButtonText}>Create Workout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWorkoutDetail}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWorkoutDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
                <Text style={styles.modalSubtitle}>
                  {formatDate(selectedWorkout?.date || "")}
                </Text>
              </View>
              <View style={styles.modalHeaderButtons}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleAddPhoto(selectedWorkout?.id)}
                >
                  <MaterialCommunityIcons
                    name="camera-plus"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => deleteWorkout(selectedWorkout?.id)}
                >
                  <MaterialIcons name="delete" size={24} color="#ff4444" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowWorkoutDetail(false)}>
                  <MaterialIcons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.sectionHeader}>Exercises</Text>
              {selectedWorkout?.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <TouchableOpacity
                    style={styles.exerciseCheckbox}
                    onPress={() =>
                      toggleExerciseComplete(selectedWorkout.id, exercise.id)
                    }
                  >
                    <MaterialCommunityIcons
                      name={
                        exercise.completed
                          ? "checkbox-marked"
                          : "checkbox-blank-outline"
                      }
                      size={24}
                      color={exercise.completed ? Colors.primary : "#666"}
                    />
                  </TouchableOpacity>
                  <View style={styles.exerciseInfo}>
                    <Text
                      style={[
                        styles.exerciseName,
                        exercise.completed && styles.exerciseCompleted,
                      ]}
                    >
                      {exercise.name}
                    </Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} sets × {exercise.reps} reps
                      {exercise.weight > 0 && ` • ${exercise.weight} kg`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.prButton}
                    onPress={() =>
                      markPersonalBest(selectedWorkout.id, exercise.id)
                    }
                  >
                    <MaterialCommunityIcons
                      name="trophy"
                      size={20}
                      color="#FFD700"
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.addExerciseForm}>
                <Text style={styles.addExerciseTitle}>Add Exercise</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Exercise name"
                  placeholderTextColor="#666"
                  value={exerciseName}
                  onChangeText={setExerciseName}
                />
                <View style={[styles.row, { marginTop: 12 }]}>
                  <TextInput
                    style={[styles.input, styles.smallInput]}
                    placeholder="Sets"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={sets}
                    onChangeText={setSets}
                  />
                  <TextInput
                    style={[styles.input, styles.smallInput]}
                    placeholder="Reps"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                  />
                  <TextInput
                    style={[styles.input, styles.smallInput]}
                    placeholder="Weight"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>
                <TouchableOpacity
                  style={styles.addExerciseButton}
                  onPress={() => handleAddExercise(selectedWorkout?.id)}
                >
                  <MaterialIcons name="add" size={20} color="#fff" />
                  <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
                </TouchableOpacity>
              </View>

              {selectedWorkout?.personalBests?.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>Personal Bests 🏆</Text>
                  {selectedWorkout.personalBests.map((pb) => (
                    <View key={pb.id} style={styles.pbCard}>
                      <Text style={styles.pbExercise}>{pb.exerciseName}</Text>
                      <Text style={styles.pbDetails}>
                        {pb.weight} kg × {pb.reps} reps
                      </Text>
                      <Text style={styles.pbDate}>{formatDate(pb.date)}</Text>
                    </View>
                  ))}
                </>
              )}

              {selectedWorkout?.photos?.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>Progress Photos</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.photosContainer}>
                      {selectedWorkout.photos.map((photo) => (
                        <Image
                          key={photo.id}
                          source={{ uri: photo.uri }}
                          style={styles.progressPhoto}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </>
              )}
            </ScrollView>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subGreeting: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  profileButton: {
    padding: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
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
  workoutsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  workoutsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#444",
    marginTop: 8,
  },
  workoutCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  workoutCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  workoutDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  workoutStats: {
    flexDirection: "row",
    gap: 16,
  },
  workoutStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  workoutStatText: {
    fontSize: 13,
    color: "#aaa",
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
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalHeaderButtons: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  smallInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  exerciseCheckbox: {
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  exerciseCompleted: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  exerciseDetails: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  prButton: {
    padding: 8,
  },
  addExerciseForm: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  addExerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    gap: 8,
  },
  addExerciseButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  pbCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FFD700",
  },
  pbExercise: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  pbDetails: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  pbDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  photosContainer: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 20,
  },
  progressPhoto: {
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: "#2a2a2a",
  },
});

export default HomePage;
