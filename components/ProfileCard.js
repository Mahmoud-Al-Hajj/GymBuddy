import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../constants/colors.js";

function ProfileCard({ username, email, gender, memberSince }) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name={gender === "male" ? "face-man-profile" : "face-woman-profile"}
            size={48}
            color={Colors.primary}
          />
        </View>
      </View>
      <Text style={styles.profileName}>{username}</Text>
      <Text style={styles.profileEmail}>{email}</Text>
      <Text style={styles.memberSince}>Member since {memberSince}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.primary,
  },
});

export default ProfileCard;