import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/HomePage.styles";
import { formatDate } from "../../utils/workoutHelpers";
import { AddExerciseForm } from "../AddExerciseForm";
import { ExerciseList } from "../ExerciseList";
import { PersonalBestsList } from "../PersonalBestsList";
import { ProgressPhotosList } from "../ProgressPhotosList";

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
            <ExerciseList
              exercises={workout.exercises}
              onToggleComplete={(exerciseId) =>
                onToggleExerciseComplete(workout.id, exerciseId)
              }
              onEdit={(exercise) => onEditExercise(workout, exercise)}
              onMarkPR={(exerciseId) =>
                onMarkPersonalBest(workout.id, exerciseId)
              }
              weightUnit={weightUnit}
            />

            <AddExerciseForm
              exerciseName={exerciseName}
              setExerciseName={setExerciseName}
              sets={sets}
              setSets={setSets}
              reps={reps}
              setReps={setReps}
              weight={weight}
              setWeight={setWeight}
              onSubmit={() => onAddExercise(workout.id)}
            />

            {workout.personal_bests && workout.personal_bests.length > 0 && (
              <PersonalBestsList
                personalBests={workout.personal_bests}
                weightUnit={weightUnit}
              />
            )}

            {workout.progress_photos && workout.progress_photos.length > 0 && (
              <ProgressPhotosList photos={workout.progress_photos} />
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
