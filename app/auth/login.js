import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Formik } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Yup from "yup";
import Button from "../../components/Button.js";
import TextInput from "../../components/TextInput.js";
import { Colors } from "../../constants/colors.js";
import { styles } from "../../styles/login.styles.js";
import { authAPI } from "../../utils/api.js";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await authAPI.login(values.email, values.password);
      console.log("Login response:", response.data);

      if (response.ok && response.data?.token) {
        const { token, user } = response.data;

        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userEmail", user.email);

        const onboardingCompleted = await SecureStore.getItemAsync(
          "onboardingCompleted"
        );

        if (onboardingCompleted === "true") {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Onboarding" }],
          });
        }
      } else {
        const errorMessage =
          response.data?.message || "Invalid email or password";
        Alert.alert("Login Failed", errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/download (15).jpeg")}
      style={styles.backgroundImage}
      blurRadius={4}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.TextContainer}>
            <Text style={styles.title}>
              Welcome to <Text style={{ color: Colors.primary }}>GymBuddy</Text>
            </Text>
            <Text style={styles.tagline}>Your Personal Fitness Companion</Text>
            <Text style={styles.subtitle}>
              Track workouts • Build habits • Achieve goals
            </Text>
          </View>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.formContainer}>
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  placeholderTextColor="#fff"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={errors.email}
                  keyboardType="email-address"
                  color={Colors.primary}
                  editable={!loading}
                />

                <TextInput
                  label="Password"
                  placeholder="Enter your password"
                  placeholderTextColor="#fff"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={errors.password}
                  secureTextEntry
                  color={Colors.primary}
                  editable={!loading}
                />

                <Button
                  label={loading ? "Logging in..." : "Login"}
                  onPress={handleSubmit}
                  style={(styles.button, loading && styles.disabled)}
                  textStyle={styles.textStyle}
                  disabled={loading}
                />
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary}
                    style={styles.loader}
                  />
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                  style={styles.linkContainer}
                  disabled={loading}
                >
                  <Text style={styles.linkText}>
                    Don't have an account?{" "}
                    <Text style={styles.linkBold}>Register</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
      <View />
    </ImageBackground>
  );
}

export default Login;
