import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import Button from "../../components/Button.js";
import TextInput from "../../components/TextInput.js";
import { Colors } from "../../constants/colors.js";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (values) => {
    if (
      values.email === "test@gmail.com" &&
      values.password === "password123"
    ) {
      const mockToken = "1234567890abcdef";
      await SecureStore.setItemAsync("userToken", mockToken);
      await SecureStore.setItemAsync("userEmail", values.email);

      const userGender = await SecureStore.getItemAsync("userGender");
      const userAge = await SecureStore.getItemAsync("userAge");
      const userWeight = await SecureStore.getItemAsync("userWeight");

      if (userGender && userAge && userWeight) {
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

      Alert.alert("Success", "Login successful!");
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/images/download (15).jpeg")}
      style={styles.backgroundImage}
      blurRadius={4}
    >
      <View style={styles.overlay} />
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
              />

              <Button
                label="Login"
                onPress={handleSubmit}
                style={styles.button}
                textStyle={styles.textStyle}
              />
            </View>
          )}
        </Formik>
      </View>
      <View />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    filter: "brightness(90%)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 12,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 162,
    borderRadius: 10,
  },
  TextContainer: {
    marginBottom: 55,
  },
  textStyle: {
    fontSize: 17,
    textAlign: "center",
    color: "black",
  },
});

export default Login;
