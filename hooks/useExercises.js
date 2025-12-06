import { exerciseAPI } from "../utils/api";

export const useExercises = () => {
  const addExercise = async (workoutId, exerciseData) => {
    const res = await exerciseAPI.addExercise(workoutId, exerciseData);
    return { success: res.ok };
  };

  const updateExercise = async (exerciseId, exerciseData) => {
    await exerciseAPI.updateExercise(exerciseId, exerciseData);
  };

  const deleteExercise = async (exerciseId) => {
    await exerciseAPI.deleteExercise(exerciseId);
  };

  const toggleComplete = async (exerciseId, completed) => {
    await exerciseAPI.completeExercise(exerciseId, completed);
  };

  return {
    addExercise,
    updateExercise,
    deleteExercise,
    toggleComplete,
  };
};
