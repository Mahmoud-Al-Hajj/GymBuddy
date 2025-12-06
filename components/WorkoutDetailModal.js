import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors";
import { styles } from "../styles/HomePage.styles";

export const WorkoutDetailModal = ({
  visible,
  onClose,
  workout,
  onDeleteWorkout,
  onToggleExerciseComplete,
  onEditExercise,
  onMarkPersonalBest,
  onAddExercise,
  onAddPhoto,
  exerciseName,
  setExerciseName,
  sets,
  setSets,
  reps,
  setReps,
  weight,
  setWeight,
  weightUnit,
}) => {
  if (!workout) return null;

  const displayWeight = (weightInKg) => {
    const w = parseFloat(weightInKg);
    if (!w || w === 0) return "";
    if (weightUnit === "lbs") {
      return `${(w * 2.20462).toFixed(1)} ${weightUnit}`;
    }
    return `${w} ${weightUnit}`;
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>{workout.name}</Text>
              <Text style={styles.modalSubtitle}>
                {formatDate(workout.date)}
              </Text>
            </View>
            <View style={styles.modalHeaderButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onAddPhoto(workout.id)}
              >
                <MaterialCommunityIcons
                  name="camera-plus"
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onDeleteWorkout(workout.id)}
              >
                <MaterialIcons name="delete" size={24} color="#ff4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.sectionHeader}>Exercises</Text>
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <TouchableOpacity
                    style={styles.exerciseCheckbox}
                    onPress={() =>
                      onToggleExerciseComplete(workout.id, exercise.id)
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
                    onPress={() => onEditExercise(workout, exercise)}
                  >
                    <MaterialIcons
                      name="edit"
                      size={20}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.prButton}
                    onPress={() => onMarkPersonalBest(workout.id, exercise.id)}
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
                onPress={() => onAddExercise(workout.id)}
              >
                <MaterialIcons name="add" size={20} color="#fff" />
                <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>

            {workout.personal_bests && workout.personal_bests.length > 0 ? (
              <>
                <Text style={styles.sectionHeader}>Personal Bests 🏆</Text>
                {workout.personal_bests.map((pb) => (
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

            {workout.progress_photos && workout.progress_photos.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Progress Photos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.photosContainer}>
                    {workout.progress_photos.map((photo) => (
                      <Image
                        key={photo.id}
                        source={{ uri: photo.image_url }}
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
  );
};
