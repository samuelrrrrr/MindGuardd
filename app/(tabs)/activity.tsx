import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { Card } from "../../components/UI";
import { C } from "../../constants/Colors";

const METHODS = [
  {
    id: "box",
    name: "Box Breathing",
    desc: "Find focus and center (4-4-4-4)",
    phases: ["Breathe in...", "Hold...", "Breathe out...", "Hold..."],
    durations: [4000, 4000, 4000, 4000],
  },
  {
    id: "478",
    name: "4-7-8 Relax",
    desc: "Fall asleep faster (4-7-8)",
    phases: ["Breathe in...", "Hold...", "Exhale loudly..."],
    durations: [4000, 7000, 8000],
  },
  {
    id: "paced",
    name: "Paced Breathing",
    desc: "Calm your nervous system (4-4)",
    phases: ["Breathe in...", "Breathe out..."],
    durations: [4000, 4000],
  },
];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [activeMethod, setActiveMethod] = useState(METHODS[0]);
  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeout: any;
    let interval: any;
    let isMounted = true;

    if (!isPlaying) {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIdx(0);
      setTimeLeft(0);
      return;
    }

    const runPhase = (currentIdx: number) => {
      if (!isMounted) return;
      setIdx(currentIdx);

      const phaseStr = activeMethod.phases[currentIdx];
      const duration = activeMethod.durations[currentIdx];
      const durationSecs = duration / 1000;

      setTimeLeft(durationSecs);

      clearInterval(interval);
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const isIn =
        phaseStr.includes("Breathe in") || phaseStr.includes("Inhale");
      const isOut =
        phaseStr.includes("Breathe out") || phaseStr.includes("Exhale");

      if (isIn) {
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: duration - 200,
          useNativeDriver: true,
        }).start();
      } else if (isOut) {
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: duration - 200,
          useNativeDriver: true,
        }).start();
      }

      timeout = setTimeout(() => {
        runPhase((currentIdx + 1) % activeMethod.phases.length);
      }, duration);
    };

    runPhase(0);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [activeMethod, isPlaying]);

  const phase = isPlaying ? activeMethod.phases[idx] || "" : "Tap to start";
  const durationSec = isPlaying
    ? (activeMethod.durations[idx] || 4000) / 1000
    : 0;

  return (
    <LinearGradient
      colors={["#12175e", "#2d2b8e"]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Image
        source={require("../../assets/images/onboardbreathe-01.png")}
        style={styles.bgImage}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 22,
            alignItems: "center",
            paddingTop: 20,
          }}
        >
          <Text style={styles.heroTitle}>Breathe</Text>
          <Text style={styles.heroSub}>Choose a method to calm your mind.</Text>
        </View>

        <View style={styles.centerArea}>
          <TouchableOpacity
            style={styles.circleContainer}
            activeOpacity={0.9}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            <Animated.View
              style={[
                styles.ringOuter,
                {
                  transform: [
                    {
                      scale: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.8],
                      }),
                    },
                  ],
                  opacity: scaleAnim.interpolate({
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
                      scale: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.4],
                      }),
                    },
                  ],
                  opacity: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 0.2],
                  }),
                },
              ]}
            />
            <View style={styles.circleInner}>
              <Text style={styles.circleText}>
                {isPlaying ? timeLeft : "Tap here"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.phaseText}>{phase}</Text>
          <Text style={styles.phaseSub}>
            {isPlaying ? `For ${durationSec} seconds` : activeMethod.name}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Breathing Methods</Text>

          {METHODS.map((item) => {
            const isActive = activeMethod.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => {
                  setIsPlaying(false);
                  setActiveMethod(item);
                }}
              >
                <Card style={isActive ? styles.activeCard : undefined}>
                  <View style={styles.reliefRow}>
                    <View
                      style={[
                        styles.reliefIcon,
                        {
                          backgroundColor: isActive ? C.purplePale : "#eff6ff",
                        },
                      ]}
                    >
                      <Icon
                        n="wind"
                        s={20}
                        c={isActive ? C.purple : "#3b82f6"}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reliefTitle}>{item.name}</Text>
                      <Text style={styles.reliefDesc}>{item.desc}</Text>
                    </View>
                    {isActive && <Icon n="check" s={18} c={C.purple} />}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgImage: {
    position: "absolute",
    width: "200%",
    height: "200%",
    resizeMode: "contain",
    right: -350,
    bottom: -450,
    opacity: 0.9,
    transform: [{ rotate: "-45deg" }], // Tambahkan baris ini
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 7,
    textAlign: "center",
  },
  content: { padding: 16, gap: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  centerArea: {
    height: 280,
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
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: "#f6f8fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 20,
    fontWeight: "700",
    color: C.navy,
    textAlign: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  phaseText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  phaseSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },

  reliefRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  reliefIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  reliefTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
  },
  reliefDesc: { fontSize: 12, color: C.sub, lineHeight: 20 },

  activeCard: {
    borderColor: C.purple,
    borderWidth: 1,
    backgroundColor: "#F7F6FF",
  },
});
