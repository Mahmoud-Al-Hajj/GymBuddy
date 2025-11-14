import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
