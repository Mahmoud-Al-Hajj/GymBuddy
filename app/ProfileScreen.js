import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../components/Button.js";
import TextInput from "../components/TextInput.js";
import { Colors } from "../constants/colors.js";

function ProfilePage() {
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await SecureStore.getItemAsync("userEmail");
      const userGender = await SecureStore.getItemAsync("userGender");
      const userAge = await SecureStore.getItemAsync("userAge");
      const userWeight = await SecureStore.getItemAsync("userWeight");

      if (email) setUsername(email.split("@")[0]);
      if (userGender) setGender(userGender);
      if (userAge) setAge(userAge);
      if (userWeight) setWeight(userWeight);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleEditProfile = async () => {
    try {
      await SecureStore.setItemAsync("userEmail", `${username}@example.com`);
      await SecureStore.setItemAsync("userGender", gender);
      await SecureStore.setItemAsync("userAge", age.toString());
      await SecureStore.setItemAsync("userWeight", weight.toString());

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text style={styles.subtitle}>
        View and edit your personal information
      </Text>

      <TextInput
        label="Username"
        placeholder="Enter your username"
        placeholderTextColor="#fff"
        value={username}
        onChangeText={setUsername}
        keyboardType="default"
        color={Colors.primary}
      />
      <TextInput
        label="Gender"
        placeholder="Enter your gender"
        placeholderTextColor="#fff"
        value={gender}
        onChangeText={setGender}
        keyboardType="default"
        color={Colors.primary}
      />
      <TextInput
        label="Age"
        placeholder="Enter your age"
        placeholderTextColor="#fff"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        color={Colors.primary}
      />
      <TextInput
        label="Weight"
        placeholder="Enter your weight"
        placeholderTextColor="#fff"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        color={Colors.primary}
      />
      <Button
        label="Save Changes"
        onPress={handleEditProfile}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfilePage;
