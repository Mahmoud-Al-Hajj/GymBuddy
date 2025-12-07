import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { Colors } from "../constants/colors";

/**
 * RestTimer Component
 * A professional rest timer that tracks rest periods between sets
 *
 * Features:
 * - Automatic countdown with visual progress
 * - Sound and vibration alerts when timer completes
 * - Pause/Resume functionality
 * - Quick adjust buttons (+15s, -15s)
 * - Skip timer option
 * - Persists across app states
 */
export default function RestTimer({
  visible,
  onClose,
  onComplete,
  defaultDuration = 90, // Default 90 seconds
}) {
  const [timeRemaining, setTimeRemaining] = useState(defaultDuration);
  const [totalDuration, setTotalDuration] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(true);
  const [sound, setSound] = useState(null);

  // Animation for progress circle
  const progressAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Load user's preferred rest timer duration
  useEffect(() => {
    loadRestTimerSetting();
    return () => {
      // Cleanup
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Start/Stop timer based on visibility and running state
  useEffect(() => {
    if (visible && isRunning) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [visible, isRunning]);

  // Update progress animation when time changes
  useEffect(() => {
    const progress = timeRemaining / totalDuration;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [timeRemaining, totalDuration]);

  const loadRestTimerSetting = async () => {
    try {
      const savedDuration = await AsyncStorage.getItem("restTimer");
      if (savedDuration) {
        const duration = parseInt(savedDuration);
        setTimeRemaining(duration);
        setTotalDuration(duration);
      }
    } catch (error) {
      console.error("Error loading rest timer setting:", error);
    }
  };

  const startTimer = () => {
    stopTimer(); // Clear any existing timer

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimerComplete = async () => {
    stopTimer();

    // Vibrate phone
    Vibration.vibrate([0, 500, 200, 500]);

    // Play sound
    try {
      const { sound: timerSound } = await Audio.Sound.createAsync(
        require("../assets/sounds/timer-complete.mp3"), // You'll need to add this
        { shouldPlay: true }
      );
      setSound(timerSound);
    } catch (error) {
      console.log("Could not play sound:", error);
    }

    // Call completion callback
    if (onComplete) {
      onComplete();
    }
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  const addTime = (seconds) => {
    setTimeRemaining((prev) => Math.min(prev + seconds, 600)); // Max 10 minutes
  };

  const skipTimer = () => {
    stopTimer();
    onClose();
  };

  const resetTimer = () => {
    setTimeRemaining(totalDuration);
    setIsRunning(true);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = Math.round((timeRemaining / totalDuration) * 100);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Rest Timer</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Timer Circle */}
          <View style={styles.timerCircleContainer}>
            <View style={styles.timerCircle}>
              {/* Progress indicator could be added here with SVG */}
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.percentageText}>{progressPercentage}%</Text>
            </View>
          </View>

          {/* Status Text */}
          <Text style={styles.statusText}>
            {timeRemaining === 0
              ? "Time's up! Ready for next set"
              : isRunning
              ? "Resting..."
              : "Paused"}
          </Text>

          {/* Control Buttons */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => addTime(-15)}
              disabled={timeRemaining <= 15}
            >
              <Text style={styles.adjustButtonText}>-15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.playPauseButton,
                !isRunning && styles.playPauseButtonPaused,
              ]}
              onPress={togglePause}
            >
              <MaterialIcons
                name={isRunning ? "pause" : "play-arrow"}
                size={40}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => addTime(15)}
            >
              <Text style={styles.adjustButtonText}>+15s</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
              <MaterialIcons name="refresh" size={20} color="#fff" />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={skipTimer}>
              <MaterialIcons name="skip-next" size={20} color="#fff" />
              <Text style={styles.skipButtonText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#1a1a1a",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  timerCircleContainer: {
    marginVertical: 32,
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#2a2a2a",
    borderWidth: 8,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 56,
    fontWeight: "700",
    color: "#fff",
    fontVariant: ["tabular-nums"],
  },
  percentageText: {
    fontSize: 18,
    color: "#999",
    marginTop: 8,
  },
  statusText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 32,
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 24,
  },
  adjustButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  adjustButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  playPauseButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  playPauseButtonPaused: {
    backgroundColor: "#FFA726",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  skipButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
};
