import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button.js";
import SearchBar from "../components/SearchBar.js";
import StatCard from "../components/StatCard.js";
import WorkoutCard from "../components/WorkoutCard.js";
import { Colors } from "../constants/colors.js";
import { styles } from "../styles/HomePage.styles.js";

function HomePage({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [userName, setUserName] = useState("");
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [showEditExercise, setShowEditExercise] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");

  useEffect(() => {
    checkOnboardingStatus();
    loadUserData();
    loadWorkouts();
    loadDefaultValues();
  }, []);

  // Reload workouts when screen comes into focus (e.g., after clearing data in Profile)
  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const loadDefaultValues = async () => {
    try {
      const defaultSets = await AsyncStorage.getItem("defaultSets");
      const defaultReps = await AsyncStorage.getItem("defaultReps");
      const savedWeightUnit = await AsyncStorage.getItem("weightUnit");

      if (defaultSets) setSets(defaultSets);
      if (defaultReps) setReps(defaultReps);
      if (savedWeightUnit) setWeightUnit(savedWeightUnit);
    } catch (error) {
      console.error("Error loading default values:", error);
    }
  };

  const getFilteredWorkouts = () => {
    if (!searchQuery.trim()) {
      return workouts;
    }

    const query = searchQuery.toLowerCase();

    return workouts.filter((workout) => {
      return workout.name.toLowerCase().includes(query);
    });
  };

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

    setWorkoutName("");
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setShowAddWorkout(false);
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

    const updated = updatedWorkouts.find((w) => w.id === workoutId);
    setSelectedWorkout(updated);
  };

  const handleOpenEditExercise = (workout, exercise) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.name);
    setSets(exercise.sets.toString());
    setReps(exercise.reps.toString());
    setWeight(exercise.weight.toString());
    setShowEditExercise(true);
  };

  const handleSaveEditExercise = () => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const updatedWorkouts = workouts.map((workout) => {
      if (workout.id === selectedWorkout.id) {
        return {
          ...workout,
          exercises: workout.exercises.map((ex) =>
            ex.id === selectedExercise.id
              ? {
                  ...ex,
                  name: exerciseName,
                  sets: parseInt(sets),
                  reps: parseInt(reps),
                  weight: weight ? parseFloat(weight) : 0,
                }
              : ex
          ),
        };
      }
      return workout;
    });

    saveWorkouts(updatedWorkouts);

    const updated = updatedWorkouts.find((w) => w.id === selectedWorkout.id);
    setSelectedWorkout(updated);

    setShowEditExercise(false);
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");

    Alert.alert("Success", "Exercise updated successfully!");
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedWorkouts = workouts.map((workout) => {
              if (workout.id === workoutId) {
                return {
                  ...workout,
                  exercises: workout.exercises.filter(
                    (ex) => ex.id !== exerciseId
                  ),
                };
              }
              return workout;
            });

            saveWorkouts(updatedWorkouts);

            const updated = updatedWorkouts.find((w) => w.id === workoutId);
            setSelectedWorkout(updated);

            Alert.alert("Success", "Exercise deleted");
          },
        },
      ]
    );
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

    const updated = updatedWorkouts.find((w) => w.id === workoutId);
    setSelectedWorkout(updated);
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

    const updated = updatedWorkouts.find((w) => w.id === workoutId);
    setSelectedWorkout(updated);

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
        const updatedSelectedWorkout = updatedWorkouts.find(
          (w) => w.id === workoutId
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
        <StatCard
          icon="dumbbell"
          number={workouts.length}
          label="Workouts"
          color={Colors.primary}
        />
        <StatCard
          icon="trophy"
          number={workouts.reduce(
            (sum, w) => sum + (w.personalBests?.length || 0),
            0
          )}
          label="PRs"
          color="#FFD700"
        />
        <StatCard
          icon="camera"
          number={workouts.reduce((sum, w) => sum + (w.photos?.length || 0), 0)}
          label="Photos"
          color="#4CAF50"
        />
      </View>

      <View style={styles.workoutsHeader}>
        <Text style={styles.sectionTitle}>My Workouts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            loadDefaultValues();
            setShowAddWorkout(true);
          }}
        >
          <MaterialIcons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <ScrollView
        style={styles.workoutsList}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredWorkouts().length === 0 ? (
          <View style={styles.emptyState}>
            {!searchQuery ? (
              <>
                <LottieView
                  source={require("../assets/animations/Sloth sleeping.json")}
                  autoPlay
                  loop
                  style={styles.lazyAnimation}
                />
                <Text style={styles.emptyText}>Someone's been lazy....</Text>
                <Text style={styles.emptySubText}>
                  Even this sloth works out more than you!
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={64}
                  color="#333"
                />
                <Text style={styles.emptyText}>No workouts found</Text>
                <Text style={styles.emptySubText}>
                  Try a different search term
                </Text>
              </>
            )}
          </View>
        ) : (
          getFilteredWorkouts().map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              formatDate={formatDate}
              onPress={() => {
                loadDefaultValues();
                setSelectedWorkout(workout);
                setShowWorkoutDetail(true);
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Add Workout Modal */}
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

              <Text style={styles.inputLabel}>Weight ({weightUnit})</Text>
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

      {/* Workout Detail Modal */}
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
                      {exercise.weight > 0 &&
                        ` • ${exercise.weight} ${weightUnit}`}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.prButton}
                    onPress={() =>
                      handleOpenEditExercise(selectedWorkout, exercise)
                    }
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>

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
                        {pb.weight} {weightUnit} × {pb.reps} reps
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

      {/* Edit Exercise Modal */}
      <Modal
        visible={showEditExercise}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditExercise(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Exercise</Text>
              <TouchableOpacity onPress={() => setShowEditExercise(false)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Exercise Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Bench Press"
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

              <Text style={styles.inputLabel}>Weight ({weightUnit})</Text>
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
                onPress={handleSaveEditExercise}
              >
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <Button
                label="Delete Exercise"
                onPress={() => {
                  setShowEditExercise(false);
                  handleDeleteExercise(
                    selectedWorkout?.id,
                    selectedExercise?.id
                  );
                }}
                style={styles.deleteButton}
                textStyle={styles.deleteButtonText}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default HomePage;
