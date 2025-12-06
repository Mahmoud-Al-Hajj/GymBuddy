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
import { styles } from "../../styles/register.styles.js";
import { authAPI } from "../../utils/api.js";

const registerValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Register({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values) => {
    setLoading(true);

    try {
      console.log("Register values:", values);
      const trimmedEmail = values.email.trim();
      const trimmedPassword = values.password.trim();
      const trimmedUsername = values.username.trim();

      console.log("📤 Sending to API:", {
        email: trimmedEmail,
        password: trimmedPassword,
        username: trimmedUsername,
      });

      const response = await authAPI.register(
        trimmedEmail,
        trimmedPassword,
        trimmedUsername
      );
      if (response.ok && response.data?.token && response.data?.user) {
        const { token, user } = response.data;

        // Save token and email
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userEmail", user.email);

        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Onboarding" }],
              });
            },
          },
        ]);
      } else {
        const errorMessage =
          response.data?.error ||
          response.data?.message ||
          "Registration failed";
        Alert.alert("Registration Failed", errorMessage);
      }
    } catch (error) {
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
              Join <Text style={{ color: Colors.primary }}>GymBuddy</Text>
            </Text>
            <Text style={styles.subtitle}>
              Create your account and start your fitness journey
            </Text>
          </View>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.formContainer}>
                <TextInput
                  label="Username"
                  placeholder="Choose a username"
                  placeholderTextColor="#fff"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  error={errors.username}
                  color={Colors.primary}
                  editable={!loading}
                />

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
                  placeholder="Create a password"
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
                  label={loading ? "Creating Account..." : "Sign Up"}
                  onPress={handleSubmit}
                  style={[styles.button, loading && styles.buttonDisabled]}
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
                  onPress={() => navigation.navigate("Login")}
                  style={styles.linkContainer}
                  disabled={loading}
                >
                  <Text style={styles.linkText}>
                    Already have an account?{" "}
                    <Text style={styles.linkBold}>Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

export default Register;
