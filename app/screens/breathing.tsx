import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";

const { width, height } = Dimensions.get("window");

export default function BreathingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"Breath In" | "Breath Out">("Breath In");
  const [timeLeft, setTimeLeft] = useState(30);

  const animValue = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    );
    animRef.current.start();
  };

  const stopAnimation = () => {
    if (animRef.current) {
      animRef.current.stop();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            stopAnimation();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopAnimation();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopAnimation();
    };
  }, [isPlaying]);

  // Sync phase with animation value approximately
  useEffect(() => {
    const listener = animValue.addListener(({ value }) => {
      // 0 to 1 is Breath In, 1 to 0 is Breath Out
      // But since it's hard to catch the direction with just value,
      // we can use a small hack or simply toggle phase based on value bounds
    });
    return () => animValue.removeListener(listener);
  }, [animValue]);

  // To perfectly sync phase, let's use setInterval or simply toggle it every 4s
  useEffect(() => {
    let phaseInterval: NodeJS.Timeout;
    if (isPlaying) {
      setPhase("Breath In");
      let isBreathIn = true;
      phaseInterval = setInterval(() => {
        isBreathIn = !isBreathIn;
        setPhase(isBreathIn ? "Breath In" : "Breath Out");
      }, 4000);
    }
    return () => {
      if (phaseInterval) clearInterval(phaseInterval);
    };
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <LinearGradient
      colors={["#12175e", "#2d2b8e"]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon n="back" s={24} c="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enjoy 5 deep breaths</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* CIRCLES */}
      <View style={styles.centerArea}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsPlaying(!isPlaying)}
          style={styles.circleContainer}
        >
          <Animated.View
            style={[
              styles.ringOuter,
              {
                transform: [
                  {
                    scale: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.8],
                    }),
                  },
                ],
                opacity: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.ringMiddle,
              {
                transform: [
                  {
                    scale: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.4],
                    }),
                  },
                ],
                opacity: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 0.2],
                }),
              },
            ]}
          />
          <View style={styles.circleInner} />
        </TouchableOpacity>
      </View>

      {/* TEXT & TIMER */}
      <View style={styles.textContainer}>
        <Text style={styles.phaseText}>{phase}</Text>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* BUTTON */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Icon n={isPlaying ? "pause" : "play"} s={16} c="#2d2b8e" />
          <Text style={styles.actionBtnText}>
            {isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
  },
  ringMiddle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
  },
  circleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f6f8fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  phaseText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
  },
  bottomArea: {
    paddingHorizontal: 24,
  },
  actionBtn: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d2b8e",
  },
});
