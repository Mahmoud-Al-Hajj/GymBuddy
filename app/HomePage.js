import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
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
import {
  exerciseAPI,
  personalBestAPI,
  progressPhotoAPI,
  workoutAPI,
} from "../utils/api.js";

function HomePage({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [personalBests, setPersonalBests] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([]);
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
    loadPersonalBests();
    loadProgressPhotos();
    loadDefaultValues();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
      loadPersonalBests();
      loadProgressPhotos();
      loadDefaultValues();
    }, [])
  );

  const getDailyQuote = () => {
    const quotes = [
      "The only bad workout is the one you didn't do",
      "Stronger than yesterday",
      "Your body can stand almost anything. It's your mind you have to convince",
      "Progress, not perfection hbb",
      "Sore today, strong tomorrow",
      "Make yourself proud",
      "The pain you feel today will be the strength you feel tomorrow",
      "Push yourself because no one else is going to do it for you",
      "Who will keep your family safe if you don't?",
      "Don't limit your challenges. Challenge your limits.",
    ];
    const day = new Date().getDate();
    return quotes[day % quotes.length];
  };

  const convertWeight = (weightInKg) => {
    const weight = parseFloat(weightInKg);
    if (!weight || weight === 0) return 0;
    if (weightUnit === "lbs") {
      return (weight * 2.20462).toFixed(1);
    }
    return weight;
  };

  const displayWeight = (weightInKg) => {
    const converted = convertWeight(weightInKg);
    return converted > 0 ? `${converted} ${weightUnit}` : "";
  };

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
      const onboardingCompleted = await SecureStore.getItemAsync(
        "onboardingCompleted"
      );

      if (onboardingCompleted !== "true") {
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
      const res = await workoutAPI.getWorkouts();
      console.log("getWorkouts response:", JSON.stringify(res.data, null, 2));
      if (res.ok) {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        console.log("Processed workouts:", data);
        setWorkouts(data);
      } else {
        console.error("getWorkouts failed:", res.problem);
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
      setWorkouts([]);
    }
  };

  const loadPersonalBests = async () => {
    try {
      const res = await personalBestAPI.getPersonalBests();
      console.log("Personal bests loaded:", res.data);
      if (res.ok) {
        setPersonalBests(Array.isArray(res.data) ? res.data : []);
      } else {
        setPersonalBests([]);
      }
    } catch (error) {
      console.error("Error loading personal bests:", error);
      setPersonalBests([]);
    }
  };

  const loadProgressPhotos = async () => {
    try {
      const res = await progressPhotoAPI.getProgressPhotos();
      console.log("Progress photos loaded:", res.data);
      if (res.ok) {
        setProgressPhotos(Array.isArray(res.data) ? res.data : []);
      } else {
        setProgressPhotos([]);
      }
    } catch (error) {
      console.error("Error loading progress photos:", error);
      setProgressPhotos([]);
    }
  };

  const saveWorkouts = async () => {
    await loadWorkouts();
  };

  const loadWorkoutDetails = async (workoutId) => {
    try {
      const res = await workoutAPI.getWorkoutById(workoutId);
      if (res.ok) {
        console.log(
          "Workout details loaded:",
          JSON.stringify(res.data, null, 2)
        );

        const pbRes = await personalBestAPI.getPersonalBests();
        console.log("Personal bests loaded:", pbRes.data);

        const photoRes = await progressPhotoAPI.getProgressPhotos();
        console.log("Progress photos loaded:", photoRes.data);

        const workoutWithExtras = {
          ...res.data,
          personal_bests: pbRes.ok
            ? pbRes.data.filter((pb) => pb.workout_id === workoutId)
            : [],
          progress_photos: photoRes.ok
            ? photoRes.data.filter((photo) => photo.workout_id === workoutId)
            : [],
        };

        console.log("Combined workout data:", workoutWithExtras);
        return workoutWithExtras;
      }
    } catch (error) {
      console.error("Error loading workout details:", error);
    }
    return null;
  };

  const handleAddWorkout = async () => {
    if (!workoutName.trim() || !exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    console.log("Adding workout:", {
      workoutName,
      exerciseName,
      sets,
      reps,
      weight,
    });
    const newWorkout = {
      name: workoutName,
      date: new Date().toISOString(),
      exercises: [
        {
          name: exerciseName,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: weight ? parseFloat(weight) : 0,
        },
      ],
    };

    try {
      const res = await workoutAPI.createWorkout(newWorkout);
      if (res.ok) {
        await loadWorkouts();
        setWorkoutName("");
        setExerciseName("");
        setSets("");
        setReps("");
        setWeight("");
        setShowAddWorkout(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create workout");
    }
  };

  const handleAddExercise = async (workoutId) => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newExercise = {
      name: exerciseName,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : 0,
    };

    try {
      const res = await exerciseAPI.addExercise(workoutId, newExercise);
      if (res.ok) {
        // Reload full workout details
        const updatedWorkout = await loadWorkoutDetails(workoutId);
        if (updatedWorkout) {
          setSelectedWorkout(updatedWorkout);
        }
        setExerciseName("");
        setSets("");
        setReps("");
        setWeight("");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add exercise");
    }
  };

  const handleOpenEditExercise = (workout, exercise) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.name);
    setSets(exercise.sets.toString());
    setReps(exercise.reps.toString());
    setWeight(exercise.weight.toString());
    setShowEditExercise(true);
  };

  const handleSaveEditExercise = async () => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await exerciseAPI.updateExercise(selectedExercise.id, {
        name: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : 0,
      });

      await loadWorkouts();
      const updated = workouts.find((w) => w.id === selectedWorkout.id);
      setSelectedWorkout(updated);

      setShowEditExercise(false);
      setExerciseName("");
      setSets("");
      setReps("");
      setWeight("");

      Alert.alert("Success", "Exercise updated successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update exercise");
    }
  };

  const handleDeleteExercise = async (workoutId, exerciseId) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await exerciseAPI.deleteExercise(exerciseId);
              await loadWorkouts();
              const updated = workouts.find((w) => w.id === workoutId);
              setSelectedWorkout(updated);
              Alert.alert("Success", "Exercise deleted");
            } catch (error) {
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const toggleExerciseComplete = async (workoutId, exerciseId) => {
    const workout = workouts.find((w) => w.id === workoutId);
    const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
    try {
      await exerciseAPI.completeExercise(exerciseId, !exercise.completed);
      await loadWorkouts();
      const updated = workouts.find((w) => w.id === workoutId);
      setSelectedWorkout(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const markPersonalBest = async (workoutId, exerciseId) => {
    try {
      const workout = workouts.find((w) => w.id === workoutId);
      const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
      const pb = {
        exerciseName: exercise.name,
        weight: exercise.weight,
        reps: exercise.reps,
        workoutId,
      };
      await personalBestAPI.addPersonalBest(pb);

      // Reload full workout details to show new personal best
      const updatedWorkout = await loadWorkoutDetails(workoutId);
      if (updatedWorkout) {
        setSelectedWorkout(updatedWorkout);
      }

      Alert.alert("Personal Best!", "New PR logged successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to log personal best");
    }
  };
  // const handleAddPhoto = async (workoutId) => {
  //   try {
  //     const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (!granted) {
  //       Alert.alert("Error", "Media library permission denied");
  //       return;
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled) {
  //       const photoData = { workoutId, uri: result.assets[0].uri };
  //       await progressPhotoAPI.addProgressPhoto(photoData);

  //       await loadWorkouts();
  //       const updated = workouts.find((w) => w.id === workoutId);
  //       setSelectedWorkout(updated);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Error", "Failed to add photo");
  //   }
  // };

  const deleteWorkout = (workoutId) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await workoutAPI.deleteWorkout(workoutId);
              await loadWorkouts();
              setShowWorkoutDetail(false);
            } catch (error) {
              console.error(error);
            }
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
          number={personalBests.length}
          label="PRs"
          color="#FFD700"
        />
        <StatCard
          icon="camera"
          number={progressPhotos.length}
          label="Photos"
          color="#4CAF50"
        />
      </View>

      <View style={styles.quoteCard}>
        <MaterialIcons name="format-quote" size={20} color={Colors.primary} />
        <Text style={styles.quoteText}>{getDailyQuote()}</Text>
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
                <Text style={styles.emptyText}>Someone's been lazy....</Text>

                <Text style={styles.motivationalQuote}>
                  "He who is scared of climbing mountains lives among hills
                  forever."
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
              onPress={async () => {
                loadDefaultValues();
                const fullWorkout = await loadWorkoutDetails(workout.id);
                if (fullWorkout) {
                  setSelectedWorkout(fullWorkout);
                  setShowWorkoutDetail(true);
                }
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
              {selectedWorkout?.exercises &&
              selectedWorkout.exercises.length > 0 ? (
                selectedWorkout.exercises.map((exercise) => (
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
                          ` • ${displayWeight(exercise.weight)}`}
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
                ))
              ) : (
                <Text style={styles.emptyText}>No exercises yet</Text>
              )}

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

              {selectedWorkout?.personal_bests &&
              selectedWorkout.personal_bests.length > 0 ? (
                <>
                  <Text style={styles.sectionHeader}>Personal Bests 🏆</Text>
                  {selectedWorkout.personal_bests.map((pb) => (
                    <View key={pb.id} style={styles.pbCard}>
                      <Text style={styles.pbExercise}>{pb.exercise_name}</Text>
                      <Text style={styles.pbDetails}>
                        {displayWeight(pb.weight)} × {pb.reps} reps
                      </Text>
                      <Text style={styles.pbDate}>{formatDate(pb.date)}</Text>
                    </View>
                  ))}
                </>
              ) : null}

              {selectedWorkout?.progress_photos &&
                selectedWorkout.progress_photos.length > 0 && (
                  <>
                    <Text style={styles.sectionHeader}>Progress Photos</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View style={styles.photosContainer}>
                        {selectedWorkout.progress_photos.map((photo) => (
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
