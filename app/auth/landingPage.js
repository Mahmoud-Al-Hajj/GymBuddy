import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button.js";

function LandingPage() {
  const router = useRouter();

  const NavigateToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/download.jpeg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ImageBackground
            source={require("../../assets/images/bg.png")}
            style={styles.downloadImage}
          />
          <ImageBackground
            source={require("../../assets/images/22801938895(1).png")}
            style={{ width: 200, height: 200, position: "absolute", top: 280 }}
          />
          <Text style={styles.BelowText}>GymBuddy</Text>
          <Button
            label="Get Started"
            onPress={NavigateToLogin}
            style={styles.buttonStyle}
            textStyle={styles.textStyle}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadImage: {
    width: "100%",
    height: "100%",
    filter: "brightness(152%)",
  },
  BelowText: {
    color: "white",
    fontSize: 53,
    fontWeight: "bold",
    position: "absolute",
    bottom: 380,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  buttonStyle: {
    position: "absolute",
    bottom: 115,
    left: 40,
    right: 40,
    alignSelf: "center",
    paddingVertical: 17,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
});

export default LandingPage;
