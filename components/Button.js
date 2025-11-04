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

  const buttonStyle = {
    backgroundColor: isPrimary ? Colors.primary : "transparent",
    borderColor: Colors.primary,
    ...style,
  };

  const finalTextStyle = {
    color: isPrimary ? "white" : Colors.primary,
    fontSize: 16,
    ...(textStyle?.fontFamily ? {} : { fontWeight: "600" }), // Only add fontWeight if no custom font
    ...textStyle,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={buttonStyle}
      activeOpacity={0.7}
    >
      <Text style={finalTextStyle}>{label}</Text>
    </TouchableOpacity>
  );
}
export default Button;
