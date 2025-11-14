import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors.js";

export const styles = StyleSheet.create({
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
