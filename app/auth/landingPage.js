import { Colors } from "@/constants/colors.js";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button.js";
import { Ultimate, useGymBold } from "../../constants/fonts.js";

function LandingPage({ navigation }) {
  const GymBold = useGymBold();
  const UltimateLoaded = Ultimate();

  if (!GymBold || !UltimateLoaded) {
    return null;
  }

  const NavigateToLogin = () => {
    navigation.navigate("Login");
  };
  //remove later
  const NavigateToHome = () => {
    navigation.navigate("Home2");
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
            style={{ width: 200, height: 200, position: "absolute", top: 275 }}
          />
          <Text style={styles.BelowText}>GymBuddy</Text>
          <Button
            label="Get Started"
            onPress={NavigateToLogin}
            style={styles.buttonStyle}
            textStyle={styles.textStyle}
          />
          <Button
            label="Test"
            onPress={NavigateToHome}
            style={{
              width: 200,
              height: 50,
              backgroundColor: Colors.secondary,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 50,
            }}
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
    //make it wider
    color: "white",
    fontSize: 53,
    position: "absolute",
    bottom: 395,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "GymBold",
  },
  buttonStyle: {
    position: "absolute",
    bottom: 115,
    left: 40,
    right: 40,
    alignSelf: "center",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 18,
    textAlign: "center",
    color: "black",
    fontFamily: "RetroSportDemo",
  },
});

export default LandingPage;
