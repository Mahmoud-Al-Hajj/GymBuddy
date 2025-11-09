import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/colors.js";

function BMICard({ bmi, bmiCategory }) {
  if (!bmi) return null;

  return (
    <View style={styles.bmiCard}>
      <View style={styles.bmiHeader}>
        <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
        <View
          style={[
            styles.bmiCategoryBadge,
            { backgroundColor: bmiCategory.color + "20" },
          ]}
        >
          <Text style={[styles.bmiCategoryText, { color: bmiCategory.color }]}>
            {bmiCategory.text}
          </Text>
        </View>
      </View>
      <Text style={styles.bmiValue}>{bmi}</Text>
      <Text style={styles.bmiSubtext}>Based on your height and weight</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bmiCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  bmiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bmiCategoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  bmiSubtext: {
    fontSize: 13,
    color: "#888",
  },
});

export default BMICard;
