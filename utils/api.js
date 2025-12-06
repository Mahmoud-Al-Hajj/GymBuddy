import { create } from "apisauce";
import * as SecureStore from "expo-secure-store";

const api = create({
  baseURL: "http://192.168.18.79:3000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.addAsyncRequestTransform(async (request) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (email, password, username) =>
    api.post("/auth/register", { username, email, password }),
};

// ============ USER/PROFILE APIs ============
export const profileAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData) => api.post("/users/profile", userData),
  deleteProfile: () => api.delete("/users/profile"),
};

// ============ WORKOUT APIs ============
export const workoutAPI = {
  createWorkout: (workoutData) => api.post("/workouts", workoutData),
  getAllWorkouts: () => api.get("/workouts"),
  getWorkoutById: (workoutId) => api.get(`/workouts/${workoutId}`),
  updateWorkout: (workoutId, workoutData) =>
    api.put(`/workouts/${workoutId}`, workoutData),
  deleteWorkout: (workoutId) => api.delete(`/workouts/${workoutId}`),
};

// ============ EXERCISE APIs ============
export const exerciseAPI = {
  addExercise: (workoutId, exerciseData) =>
    api.post(`/workouts/${workoutId}/exercises`, exerciseData),
  updateExercise: (exerciseId, exerciseData) =>
    api.put(`/workouts/exercises/${exerciseId}`, exerciseData),
  deleteExercise: (exerciseId) =>
    api.delete(`/workouts/exercises/${exerciseId}`),
  completeExercise: (exerciseId, completed) =>
    api.post(`/workouts/exercises/${exerciseId}/complete`, { completed }),
};

// ============ PERSONAL BEST APIs ============
export const personalBestAPI = {
  addPersonalBest: (personalBestData) =>
    api.post("/personal-bests", personalBestData),
  getAllPersonalBests: () => api.get("/personal-bests"),
  getPersonalBestByExercise: (exerciseName) =>
    api.get(`/personal-bests/exercise/${exerciseName}`),
  deletePersonalBest: (personalBestId) =>
    api.delete(`/personal-bests/${personalBestId}`),
};

// ============ PROGRESS PHOTO APIs ============
export const progressPhotoAPI = {
  addProgressPhoto: (photoData) => api.post("/progress-photos", photoData),
  getAllProgressPhotos: () => api.get("/progress-photos"),
  deleteProgressPhoto: (photoId) => api.delete(`/progress-photos/${photoId}`),
};

export default api;
