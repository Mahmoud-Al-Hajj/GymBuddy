import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors.js";

function ProfileCard({
  username,
  email,
  gender,
  memberSince,
  profilePhotoUri,
  onSelectImage,
  onRemoveImage,
}) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity style={styles.avatar} onPress={onSelectImage}>
          {profilePhotoUri ? (
            <Image
              source={{ uri: profilePhotoUri }}
              style={styles.profileImage}
            />
          ) : (
            <MaterialCommunityIcons
              name={
                gender === "male" ? "face-man-profile" : "face-woman-profile"
              }
              size={48}
              color={Colors.primary}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editIconContainer}
          onPress={onSelectImage}
        >
          <MaterialCommunityIcons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileName}>{username}</Text>
      <Text style={styles.profileEmail}>{email}</Text>
      <Text style={styles.memberSince}>Member since {memberSince}</Text>
      {profilePhotoUri && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemoveImage}>
          <MaterialCommunityIcons name="delete" size={18} color="#ff4444" />
          <Text style={styles.removeButtonText}>Remove Photo</Text>
        </TouchableOpacity>
      )}
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
    position: "relative",
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
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#1a1a1a",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  removeButtonText: {
    color: "#ff4444",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
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
