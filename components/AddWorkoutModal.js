import { MaterialIcons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/HomePage.styles";

export const AddWorkoutModal = ({
  visible,
  onClose,
  onSubmit,
  workoutName,
  setWorkoutName,
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
            <Text style={styles.modalTitle}>New Workout</Text>
            <TouchableOpacity onPress={onClose}>
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

            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>Create Workout</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
