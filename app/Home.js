import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [username, setUsername] = useState("");

  const [workoutName, setWorkoutName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    loadUserData();
    loadWorkouts();
  }, []);

  const loadUserData = async () => {
    try {
      const weight = await SecureStore.setItemAsync(
        "userWeight",
        weight.toString()
      );
      const email = await SecureStore.getItemAsync("userEmail");
      if (email) {
        setUsername(email.split("@")[0]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }

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
  };

  const saveWorkouts = async (updatedWorkouts) => {
    try {
      await AsyncStorage.setItem("workouts", JSON.stringify(updatedWorkouts));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error("Error saving workouts:", error);
    }
  };

  const handleAddWorkout = async (
    workoutName,
    exerciseName,
    sets,
    reps,
    weight
  ) => {
    const newWorkout = {
      id: 1 + workouts.length,
      name: workoutName,
      date: new Date().toISOString(),
      exercises: [
        {
          id: 1 + exercises.length,
          name: exerciseName,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: weight,
        },
      ],
    };
    saveWorkouts(updatedWorkouts);
    setWorkoutName("");
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
  };

  return (
    <View>
      <View>
        <View>
          <Text>Hello, {userName}!</Text>
          <Text>Ready to crush your workout?</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default Home;
