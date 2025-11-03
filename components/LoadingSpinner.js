import { ActivityIndicator, Modal, Text, View } from "react-native";
import { Colors } from "../constants/colors";

export function LoadingSpinner({ visible, message = "Loading..." }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 24,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 16, fontSize: 16, color: Colors.text }}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
