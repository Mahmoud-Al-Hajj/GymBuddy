import { Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

function Button({
  label,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = "primary",
}) {
  const isPrimary = variant === "primary";

  const baseStyle = {
    backgroundColor: isPrimary ? Colors.primary : "transparent",
    borderColor: Colors.primary,
    borderWidth: isPrimary ? 0 : 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  };

  const finalTextStyle = {
    color: isPrimary ? "white" : Colors.primary,
    fontSize: 16,
    ...(textStyle?.fontFamily ? {} : { fontWeight: "600" }),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        baseStyle, // default button styling
        style, // custom styles you pass in
        disabled && { opacity: 0.6 }, // disabled styling
      ]}
    >
      <Text style={finalTextStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

export default Button;
