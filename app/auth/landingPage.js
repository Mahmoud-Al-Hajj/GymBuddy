import { ImageBackground, Text, View } from "react-native";
import Button from "../../components/Button.js";
import { Ultimate, useGymBold } from "../../constants/fonts.js";
import { styles } from "../../styles/landingPage.styles.js";

function LandingPage({ navigation }) {
  const GymBold = useGymBold();
  const UltimateLoaded = Ultimate();

  if (!GymBold || !UltimateLoaded) {
    return null;
  }

  const NavigateToLogin = () => {
    navigation.navigate("Login");
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
        </View>
      </View>
    </ImageBackground>
  );
}

export default LandingPage;
