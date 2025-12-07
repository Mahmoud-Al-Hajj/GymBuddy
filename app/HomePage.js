import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Hooks
import { useExercises } from "../hooks/useExercises";
import { usePersonalBests } from "../hooks/usePersonalBests";
import { useProgressPhotos } from "../hooks/useProgressPhotos";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useWorkouts } from "../hooks/useWorkouts";

// Components
import { AddWorkoutModal } from "../components/AddWorkoutModal";
import RestTimer from "../components/RestTimer";
import SearchBar from "../components/SearchBar";
import StatCard from "../components/StatCard";
import WorkoutCard from "../components/WorkoutCard";
import { WorkoutDetailModal } from "../components/WorkoutDetailModal";

// Utils
import { Colors } from "../constants/colors";
import { styles } from "../styles/HomePage.styles";
import {
  filterWorkouts,
  formatDate,
  getDailyQuote,
} from "../utils/workoutHelpers";

function HomePage({ navigation }) {
  // Data hooks
  const {
    workouts,
    loadWorkouts,
    createWorkout,
    deleteWorkout,
    getWorkoutById,
  } = useWorkouts();
  const { addExercise, updateExercise, deleteExercise, toggleComplete } =
    useExercises();
  const { personalBests, loadPersonalBests, addPersonalBest } =
    usePersonalBests();
  const { progressPhotos, loadProgressPhotos, addProgressPhoto } =
    useProgressPhotos();
  const {
    userName,
    weightUnit,
    defaultSets,
    defaultReps,
    loadUserData,
    loadDefaults,
  } = useUserPreferences();

  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [showEditExercise, setShowEditExercise] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [restTimer, setRestTimer] = useState(90);

  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  // Initial load
  useEffect(() => {
    checkOnboardingStatus();
    loadUserData();
    loadWorkouts();
    loadPersonalBests();
    loadProgressPhotos();
    loadDefaults();
    loadRestTimerSetting();
  }, []);

  // Reload on focus
  useFocusEffect(
    React.useCallback(() => {
      loadWorkouts();
      loadPersonalBests();
      loadProgressPhotos();
      loadDefaults();
    }, [])
  );

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

  const loadRestTimerSetting = async () => {
    try {
      const savedRestTimer = await AsyncStorage.getItem("restTimer");
      if (savedRestTimer) {
        setRestTimer(parseInt(savedRestTimer));
      }
    } catch (error) {
      console.error("Error loading rest timer:", error);
    }
  };

  const handleAddWorkout = async () => {
    if (!workoutName.trim() || !exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

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

    const result = await createWorkout(newWorkout);
    if (result.success) {
      resetForm();
      setShowAddWorkout(false);
    } else {
      Alert.alert("Error", result.error);
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

    const result = await addExercise(workoutId, newExercise);
    if (result.success) {
      await refreshWorkoutDetail(workoutId);
      resetExerciseForm();
    } else {
      Alert.alert("Error", "Failed to add exercise");
    }
  };

  const handleSaveEditExercise = async () => {
    if (!exerciseName.trim() || !sets || !reps) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await updateExercise(selectedExercise.id, {
        name: exerciseName,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : 0,
      });

      await refreshWorkoutDetail(selectedWorkout.id);
      setShowEditExercise(false);
      resetExerciseForm();
      Alert.alert("Success", "Exercise updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update exercise");
    }
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
          onPress: async () => {
            await deleteExercise(exerciseId);
            await refreshWorkoutDetail(workoutId);
            Alert.alert("Success", "Exercise deleted");
          },
        },
      ]
    );
  };

  const handleDeleteWorkout = (workoutId) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteWorkout(workoutId);
            setShowWorkoutDetail(false);
          },
        },
      ]
    );
  };

  const handleToggleComplete = async (workoutId, exerciseId) => {
    const workout = workouts.find((w) => w.id === workoutId);
    const exercise = workout.exercises.find((ex) => ex.id === exerciseId);
    await toggleComplete(exerciseId, !exercise.completed);
    await refreshWorkoutDetail(workoutId);
  };

  const handleMarkPersonalBest = async (workoutId, exerciseId) => {
    const workout = workouts.find((w) => w.id === workoutId);
    const exercise = workout.exercises.find((ex) => ex.id === exerciseId);

    await addPersonalBest({
      exerciseName: exercise.name,
      weight: exercise.weight,
      reps: exercise.reps,
      workoutId,
    });

    await refreshWorkoutDetail(workoutId);
    Alert.alert("Personal Best!", "New PR logged successfully!");
  };

  const refreshWorkoutDetail = async (workoutId) => {
    await loadWorkouts();
    await loadPersonalBests();
    await loadProgressPhotos();

    const updatedWorkout = await getWorkoutById(workoutId);
    if (updatedWorkout) {
      setSelectedWorkout({
        ...updatedWorkout,
        personal_bests: personalBests.filter(
          (pb) => pb.workout_id === workoutId
        ),
        progress_photos: progressPhotos.filter(
          (photo) => photo.workout_id === workoutId
        ),
      });
    }
  };

  const handleAddPhoto = async (workoutId) => {
    try {
      await addProgressPhoto(workoutId);
      await refreshWorkoutDetail(workoutId);
      Alert.alert("Success", "Photo added successfully!");
    } catch (error) {
      console.error("Error adding photo:", error);
      Alert.alert("Error", "Failed to add photo");
    }
  };

  const resetForm = () => {
    setWorkoutName("");
    resetExerciseForm();
  };

  const resetExerciseForm = () => {
    setExerciseName("");
    setSets(defaultSets);
    setReps(defaultReps);
    setWeight("");
  };

  const filteredWorkouts = filterWorkouts(workouts, searchQuery);

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
            loadDefaults();
            resetForm();
            setShowAddWorkout(true);
          }}
        >
          <MaterialIcons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <ScrollView
        style={styles.workoutsList}
        showsVerticalScrollIndicator={false}
      >
        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {searchQuery ? "No workouts found" : "Someone's been lazy...."}
            </Text>
          </View>
        ) : (
          filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              formatDate={formatDate}
              onPress={async () => {
                loadDefaults();
                const fullWorkout = await getWorkoutById(workout.id);
                if (fullWorkout) {
                  setSelectedWorkout({
                    ...fullWorkout,
                    personal_bests: personalBests.filter(
                      (pb) => pb.workout_id === workout.id
                    ),
                    progress_photos: progressPhotos.filter(
                      (photo) => photo.workout_id === workout.id
                    ),
                  });
                  setShowWorkoutDetail(true);
                }
              }}
            />
          ))
        )}
      </ScrollView>

      {/* Modals */}
      <AddWorkoutModal
        visible={showAddWorkout}
        onClose={() => setShowAddWorkout(false)}
        onSubmit={handleAddWorkout}
        workoutName={workoutName}
        setWorkoutName={setWorkoutName}
        exerciseName={exerciseName}
        setExerciseName={setExerciseName}
        sets={sets}
        setSets={setSets}
        reps={reps}
        setReps={setReps}
        weight={weight}
        setWeight={setWeight}
        weightUnit={weightUnit}
      />

      <WorkoutDetailModal
        visible={showWorkoutDetail}
        onClose={() => setShowWorkoutDetail(false)}
        workout={selectedWorkout}
        onDeleteWorkout={handleDeleteWorkout}
        onToggleExerciseComplete={handleToggleComplete}
        onEditExercise={(workout, exercise) => {
          setSelectedExercise(exercise);
          setExerciseName(exercise.name);
          setSets(exercise.sets.toString());
          setReps(exercise.reps.toString());
          setWeight(exercise.weight.toString());
          setShowEditExercise(true);
        }}
        onMarkPersonalBest={handleMarkPersonalBest}
        onMarkPR={handleMarkPersonalBest}
        onDeleteExercise={handleDeleteExercise}
        onAddExercise={handleAddExercise}
        onAddPhoto={handleAddPhoto}
        exerciseName={exerciseName}
        setExerciseName={setExerciseName}
        sets={sets}
        setSets={setSets}
        reps={reps}
        setReps={setReps}
        weight={weight}
        setWeight={setWeight}
        weightUnit={weightUnit}
      />

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 100,
          right: 20,
          backgroundColor: Colors.primary,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 8,
        }}
        onPress={() => setShowRestTimer(true)}
      >
        <MaterialCommunityIcons name="timer" size={24} color="#fff" />
      </TouchableOpacity>

      <RestTimer
        visible={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        defaultDuration={restTimer}
        onComplete={() => setShowRestTimer(false)}
      />
    </View>
  );
}

export default HomePage;
