import { useCallback, useState } from "react";
import { workoutAPI } from "../utils/api.js";

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workoutAPI.getWorkouts();
      if (res.ok) {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setWorkouts(data);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error("Error loading workouts:", error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkout = async (workoutData) => {
    const res = await workoutAPI.createWorkout(workoutData);
    if (res.ok) {
      await loadWorkouts();
      return { success: true };
    }
    return { success: false, error: "Failed to create workout" };
  };

  const deleteWorkout = async (workoutId) => {
    await workoutAPI.deleteWorkout(workoutId);
    await loadWorkouts();
  };

  const getWorkoutById = async (workoutId) => {
    const res = await workoutAPI.getWorkoutById(workoutId);
    return res.ok ? res.data : null;
  };

  return {
    workouts,
    loading,
    loadWorkouts,
    createWorkout,
    deleteWorkout,
    getWorkoutById,
  };
};
