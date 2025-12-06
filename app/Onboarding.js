import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "../styles/Onboarding.styles.js";
import { profileAPI } from "../utils/api.js";

function Onboarding({ navigation }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(35);
  const [weight, setWeight] = useState(54);

  const handleNext = async () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        console.log("📤 Updating user profile with:", {
          gender,
          age,
          weight,
        });

        // Call API to update user profile
        const response = await profileAPI.updateProfile({
          gender,
          age: parseInt(age),
          weight: parseInt(weight) || 54,
        });

        console.log("✅ Profile update response:", response);

        if (response.ok) {
          console.log("🎉 Profile updated successfully!");

          // Save to SecureStore as well for offline access
          await SecureStore.setItemAsync("userGender", gender);
          await SecureStore.setItemAsync("userAge", age.toString());
          await SecureStore.setItemAsync(
            "userWeight",
            (parseInt(weight) || 54).toString()
          );
          await SecureStore.setItemAsync("onboardingCompleted", "true");

          console.log("💾 Saved to SecureStore");

          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          const errorMessage =
            response.data?.error ||
            response.data?.message ||
            "Failed to update profile";
          console.log("❌ Profile update failed:", errorMessage);
          Alert.alert("Error", errorMessage);
        }
      } catch (error) {
        console.error("💥 Error saving profile:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderGenderScreen = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>Tell us about yourself!</Text>
      <Text style={styles.subtitle}>
        To give you a better experience we need{"\n"}to know your gender
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "male" && styles.genderButtonActive,
          ]}
          onPress={() => setGender("male")}
        >
          <MaterialCommunityIcons
            name="gender-male"
            size={48}
            color={gender === "male" ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.genderText,
              gender === "male" && styles.genderTextActive,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            gender === "female" && styles.genderButtonActive,
          ]}
          onPress={() => setGender("female")}
        >
          <MaterialCommunityIcons
            name="gender-female"
            size={48}
            color={gender === "female" ? "#fff" : "#666"}
          />
          <Text
            style={[
              styles.genderText,
              gender === "female" && styles.genderTextActive,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAgeScreen = () => {
    const ages = [];
    for (let i = 18; i <= 70; i++) {
      ages.push(i);
    }
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.title}>How old are you ?</Text>
        <Text style={styles.subtitle}>
          This helps us create your personalized plan
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {ages.map((ageOption) => (
            <TouchableOpacity key={ageOption} onPress={() => setAge(ageOption)}>
              <Text
                style={[
                  styles.ageText,
                  age === ageOption && styles.ageTextActive,
                ]}
              >
                {ageOption}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderWeightScreen = () => {
    return (
      <View style={styles.screenContainer}>
        <Text style={styles.title}>What's your weight?</Text>
        <Text style={styles.subtitle}>You can always change this later</Text>

        <View style={styles.weightInputContainer}>
          <TouchableOpacity
            style={styles.weightButton}
            onPress={() => setWeight(Math.max(1, (parseInt(weight) || 54) - 1))}
          >
            <Text style={styles.weightButtonText}>-</Text>
          </TouchableOpacity>

          <View style={styles.weightDisplay}>
            <TextInput
              style={styles.weightInput}
              value={weight.toString()}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) && num >= 1 && num <= 300) {
                  setWeight(num);
                }
              }}
              keyboardType="numeric"
              maxLength={3}
              selectTextOnFocus
              placeholder="54"
              placeholderTextColor="#666"
            />
            <Text style={styles.weightUnit}>kg</Text>
          </View>

          <TouchableOpacity
            style={styles.weightButton}
            onPress={() =>
              setWeight(Math.min(300, (parseInt(weight) || 54) + 1))
            }
          >
            <Text style={styles.weightButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.progressBar} pointerEvents="box-none">
          {[0, 1, 2].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                step <= currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.content} pointerEvents="box-none">
          {currentStep === 0 && renderGenderScreen()}
          {currentStep === 1 && renderAgeScreen()}
          {currentStep === 2 && renderWeightScreen()}
        </View>

        <View style={styles.navigationContainer} pointerEvents="box-none">
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              currentStep === 0 && !gender && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={currentStep === 0 && !gender}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 2 ? "Finish" : "Next"}
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Onboarding;
