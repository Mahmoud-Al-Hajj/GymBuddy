import { Formik } from "formik";
import { useState } from "react";
import { Alert, ImageBackground, StyleSheet, Text, View } from "react-native";
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

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (values) => {
    if (
      values.email === "test@gmail.com" &&
      values.password === "password123"
    ) {
      Alert.alert("Success", "Login successful!");
      // Later: router.push('/home')
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
        <View style={styles.TextContainer}>
          <Text style={styles.title}>
            Welcome to <Text style={{ color: Colors.primary }}>GymBuddy</Text>
          </Text>
          <Text style={styles.subtitle}>
            Hello there, please Login to continue
          </Text>
        </View>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
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
    marginBottom: 80,
  },
  textStyle: {
    fontSize: 17,
    textAlign: "center",
    color: "black",
  },
});

export default Login;
