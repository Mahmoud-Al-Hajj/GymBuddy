import React from "react";
import { StyleSheet, View } from "react-native";
import StatCard from "./StatCard.js";
import { Colors } from "../constants/colors.js";

function StatsGrid({ stats }) {
  return (
    <View style={styles.statsGrid}>
      <StatCard
        icon="dumbbell"
        number={stats.totalWorkouts}
        label="Workouts"
        color={Colors.primary}
      />
      <StatCard
        icon="trophy"
        number={stats.totalPRs}
        label="PRs"
        color="#FFD700"
      />
      <StatCard
        icon="camera"
        number={stats.totalPhotos}
        label="Photos"
        color="#4CAF50"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
});

export default StatsGrid;