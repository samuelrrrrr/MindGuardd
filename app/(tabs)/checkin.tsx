import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { Card } from "../../components/UI";
import { C } from "../../constants/Colors";
import { AIInsight } from "../../types/types";
import { generateOpenAIInsight } from "../../utils/aiEngine";
import { detectPatterns } from "../../utils/patternEngine";
import { computeRiskScore } from "../../utils/riskEngine";
import { getCheckIns, saveCheckIn } from "../../utils/storage";

export default function CheckInScreen() {
  const insets = useSafeAreaInsets();
  const [moodIndex, setMoodIndex] = useState(2);
  const [sleepIndex, setSleepIndex] = useState(2);
  const [stressIndex, setStressIndex] = useState(2);
  const [activityText, setActivityText] = useState("");
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);

  const emotes = ["face-1", "face-2", "face-3", "face-4", "face-5"];
  const moodLabels = ["Sad", "Neutral", "Good", "Great", "Excellent"];
  const sleepLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  const stressLabels = ["High", "Moderate", "Neutral", "Low", "Relaxed"];

  const currentMood = { l: moodLabels[moodIndex], e: emotes[moodIndex] };
  const mood = currentMood.l;
  const acts = [
    { l: "Work", i: "insights" },
    { l: "Study", i: "brain" },
    { l: "Rest", i: "leaf" },
    { l: "Exercise", i: "run" },
  ];

  const sleepHoursMapping = [4, 6, 7, 8, 9];
  const sleepHours = sleepHoursMapping[sleepIndex];

  const stressScoreMapping = [10, 7, 5, 3, 0];
  const stressScore = stressScoreMapping[stressIndex];

  const handleSave = async () => {
    setIsLoading(true);
    const newCheckIn = await saveCheckIn({
      mood,
      sleep: sleepHours,
      stress: stressScore,
      act: activityText || "None",
    });
    if (newCheckIn) {
      const history = await getCheckIns();
      const risk = computeRiskScore(newCheckIn);
      const patterns = detectPatterns(history, []);
      // Ganti dengan API key OpenAI kamu di file .env menggunakan nama variabel EXPO_PUBLIC_OPENAI_API_KEY
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";
      const insight = await generateOpenAIInsight(
        apiKey,
        history,
        risk,
        patterns,
      );
      setAiInsight(insight);
    }
    setIsLoading(false);
    setDone(true);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[C.navyDeep, C.navy]}
        style={[styles.hero, { paddingTop: insets.top + 8 }]}
      >
        <Image
          source={require("../../assets/images/onboard-04.png")}
          style={styles.bgImage}
        />
        <View
          style={{
            paddingHorizontal: 22,
            paddingBottom: 0,
            zIndex: 1,
            elevation: 1,
            position: "relative",
          }}
        >
          <Text style={styles.heroTitle}>
            How are you feeling,{"\n"}
            <Text style={{ color: C.purpleLight }}>Sarah?</Text>
          </Text>
          <Text style={styles.heroSub}>
            Take a moment to reflect on your day.
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* MOOD */}
        <Card>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Icon n="heart" s={17} c={C.coral} />
              <Text style={styles.inputLabel}>Mood</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "800", color: C.coral }}>
              {moodLabels[moodIndex]}
            </Text>
          </View>
          <View style={styles.moodRow}>
            {emotes.map((e, i) => (
              <TouchableOpacity
                key={`mood-${i}`}
                style={[
                  styles.moodBtn,
                  moodIndex === i && {
                    backgroundColor: "rgba(255, 127, 80, 0.15)",
                    borderColor: C.coral,
                  },
                ]}
                onPress={() => setMoodIndex(i)}
                activeOpacity={0.75}
              >
                <View style={{ paddingVertical: 4 }}>
                  <Icon n={e} s={24} c={moodIndex === i ? C.coral : C.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* SLEEP */}
        <Card>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Icon n="moon" s={17} c={C.purple} />
              <Text style={styles.inputLabel}>Sleep Quality</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "800", color: C.purple }}>
              {sleepLabels[sleepIndex]}
            </Text>
          </View>
          <View style={styles.moodRow}>
            {emotes.map((e, i) => (
              <TouchableOpacity
                key={`sleep-${i}`}
                style={[
                  styles.moodBtn,
                  sleepIndex === i && {
                    backgroundColor: C.purplePale,
                    borderColor: C.purple,
                  },
                ]}
                onPress={() => setSleepIndex(i)}
                activeOpacity={0.75}
              >
                <View style={{ paddingVertical: 4 }}>
                  <Icon
                    n={e}
                    s={24}
                    c={sleepIndex === i ? C.purple : C.muted}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* STRESS */}
        <Card>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Icon n="bolt" s={17} c={C.amber} />
              <Text style={styles.inputLabel}>Stress Level</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "800", color: C.amber }}>
              {stressLabels[stressIndex]}
            </Text>
          </View>
          <View style={styles.moodRow}>
            {emotes.map((e, i) => (
              <TouchableOpacity
                key={`stress-${i}`}
                style={[
                  styles.moodBtn,
                  stressIndex === i && {
                    backgroundColor: C.amberLight,
                    borderColor: C.amber,
                  },
                ]}
                onPress={() => setStressIndex(i)}
                activeOpacity={0.75}
              >
                <View style={{ paddingVertical: 4 }}>
                  <Icon
                    n={e}
                    s={24}
                    c={stressIndex === i ? C.amber : C.muted}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* ACTIVITIES */}
        <Card>
          <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>
            Activities
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="What did you do today?"
            placeholderTextColor={C.muted}
            value={activityText}
            onChangeText={setActivityText}
            multiline
            textAlignVertical="top"
          />
        </Card>

        {done ? (
          <View style={{ gap: 16 }}>
            <View style={styles.savedRow}>
              <Icon n="check" s={20} c={C.mint} />
              <Text style={styles.savedText}>Check-in saved!</Text>
            </View>
            <LinearGradient
              colors={[C.navyDeep, "#2d2b8e"]}
              style={{ borderRadius: 22, padding: 24, marginBottom: 16 }}
            >
              <View style={styles.aiHeader}>
                <View style={styles.aiIcon}>
                  <Icon n="sparkle" s={13} c={C.purpleLight} />
                </View>
                <Text style={styles.aiLabel}>AI Insight</Text>
              </View>
              <Text style={styles.aiTitle}>
                {aiInsight
                  ? `${aiInsight.condition}\n\n${aiInsight.analysis}`
                  : "Memproses AI Insight..."}
              </Text>
              {aiInsight && aiInsight.recommendations.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  {aiInsight.recommendations.map((rec, i) => (
                    <Text
                      key={i}
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 13,
                        marginBottom: 4,
                      }}
                    >
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </LinearGradient>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[C.navy, C.purple]}
              style={[styles.saveBtn, isLoading && { opacity: 0.8 }]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveBtnText}>Save Check-In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  hero: { paddingBottom: 32 },
  bgImage: {
    position: "absolute",
    width: 550,
    height: 300,
    right: -220,
    bottom: -100,
    opacity: 0.9,
    resizeMode: "contain",
  },
  heroTitle: { fontSize: 24, fontWeight: "900", color: "#fff", lineHeight: 32 },
  heroSub: { fontSize: 13, color: "rgba(255, 255, 255, 1)", marginTop: 7 },
  content: { padding: 16, gap: 12, marginTop: 2 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  muted: { fontSize: 10, color: C.muted },
  inputLabel: { fontSize: 14, fontWeight: "700", color: C.text },
  sliderValue: { fontSize: 17, fontWeight: "900" },

  moodRow: { flexDirection: "row", justifyContent: "space-between" },
  moodBtn: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  moodLabel: { fontSize: 9, fontWeight: "700" },

  actGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actBtn: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: C.bg,
  },
  actLabel: { fontSize: 14, fontWeight: "600" },

  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
  },
  savedText: { fontSize: 16, fontWeight: "800", color: C.mint },

  textInput: {
    minHeight: 100,
    backgroundColor: C.bg,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: C.text,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(162,155,254,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.purpleLight,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 24,
    marginBottom: 4,
  },

  saveBtn: {
    borderRadius: 99,
    paddingVertical: 17,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
