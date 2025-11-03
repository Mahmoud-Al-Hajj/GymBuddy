import { View } from "react-native";

export function Card({ children, onPress, style }) {
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    ...style,
  };

  return (
    <View style={cardStyle} onPress={onPress}>
      {children}
    </View>
  );
}
