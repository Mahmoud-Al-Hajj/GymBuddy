import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/colors.js";

const { height } = Dimensions.get("window");

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
      // Save user data and navigate to home
      try {
        await SecureStore.setItemAsync("userGender", gender);
        await SecureStore.setItemAsync("userAge", age.toString());
        await SecureStore.setItemAsync("userWeight", weight.toString());

        alert("Profile setup complete!");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Error saving profile:", error);
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
            onPress={() => setWeight(Math.max(40, weight - 1))}
          >
            <Text style={styles.weightButtonText}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.weightDisplay}>
            <TextInput
              style={styles.weightInput}
              value={weight.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                if (num >= 40 && num <= 200) {
                  setWeight(num);
                } else if (text === "") {
                  setWeight(40);
                }
              }}
              keyboardType="numeric"
              maxLength={3}
              selectTextOnFocus
            />
            <Text style={styles.weightUnit}>kg</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.weightButton}
            onPress={() => setWeight(Math.min(200, weight + 1))}
          >
            <Text style={styles.weightButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
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

      {currentStep === 0 && renderGenderScreen()}
      {currentStep === 1 && renderAgeScreen()}
      {currentStep === 2 && renderWeightScreen()}

      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: 60,
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
    width: "100%",
  },
  genderButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  genderButtonActive: {
    backgroundColor: Colors.primary,
  },
  genderText: {
    color: "#666",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "600",
  },
  genderTextActive: {
    color: "#fff",
  },

  scrollContent: {
    paddingVertical: 100,
    alignItems: "center",
  },
  ageText: {
    fontSize: 32,
    color: "#444",
    fontWeight: "600",
    paddingVertical: 8,
  },
  ageTextActive: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
  },

  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 120,
    gap: 30,
  },
  weightDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 140,
    justifyContent: "center",
  },
  weightInput: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    minWidth: 80,
  },
  weightUnit: {
    fontSize: 18,
    color: "#888",
    marginLeft: 6,
  },
  weightButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  weightButtonText: {
    fontSize: 28,
    color: "#000",
    fontWeight: "bold",
  },

  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: "#333",
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Onboarding;
