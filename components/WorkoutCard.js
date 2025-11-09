import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors.js";

function WorkoutCard({ workout, onPress, formatDate }) {
  return (
    <TouchableOpacity style={styles.workoutCard} onPress={onPress}>
      <View style={styles.workoutCardHeader}>
        <View>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.workoutStatItem}>
          <MaterialCommunityIcons
            name="weight-lifter"
            size={18}
            color={Colors.primary}
          />
          <Text style={styles.workoutStatText}>
            {workout.exercises.length} exercises
          </Text>
        </View>
        {workout.personalBests?.length > 0 && (
          <View style={styles.workoutStatItem}>
            <MaterialCommunityIcons name="trophy" size={18} color="#FFD700" />
            <Text style={styles.workoutStatText}>
              {workout.personalBests.length} PRs
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  workoutCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  workoutDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  workoutStats: {
    flexDirection: "row",
    gap: 16,
  },
  workoutStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  workoutStatText: {
    fontSize: 13,
    color: "#aaa",
  },
});

export default WorkoutCard;
