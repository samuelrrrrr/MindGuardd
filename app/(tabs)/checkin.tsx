import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
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
import { saveCheckIn, getCheckIns } from "../../utils/storage";
import { AIInsight } from "../../types/types";
import { generateOpenAIInsight } from "../../utils/aiEngine";
import { computeRiskScore } from "../../utils/riskEngine";
import { detectPatterns } from "../../utils/patternEngine";

export default function CheckInScreen() {
  const insets = useSafeAreaInsets();
  const [mood, setMood] = useState("Good");
  const [sleep, setSleep] = useState(8);
  const [stress, setStress] = useState(3);
  const [activityText, setActivityText] = useState("");
  const [done, setDone] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);

  const moods = [
    { l: "Sad", e: "😔" },
    { l: "Neutral", e: "😐" },
    { l: "Good", e: "😊" },
    { l: "Great", e: "🤩" },
    { l: "Calm", e: "🧘" },
  ];
  const acts = [
    { l: "Work", i: "insights" },
    { l: "Study", i: "brain" },
    { l: "Rest", i: "leaf" },
    { l: "Exercise", i: "run" },
  ];

  const handleSave = async () => {
    const newCheckIn = await saveCheckIn({ mood, sleep, stress, act: activityText || "None" });
    if (newCheckIn) {
      const history = await getCheckIns();
      const risk = computeRiskScore(newCheckIn);
      const patterns = detectPatterns(history, []);
      // Ganti dengan API key OpenAI kamu di file .env menggunakan nama variabel EXPO_PUBLIC_OPENAI_API_KEY
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";
      const insight = await generateOpenAIInsight(apiKey, history, risk, patterns);
      setAiInsight(insight);
    }
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
        <View style={{ paddingHorizontal: 22, paddingBottom: 0 }}>
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
          <Text style={styles.sectionLabel}>Mood</Text>
          <View style={styles.moodRow}>
            {moods.map((m) => (
              <TouchableOpacity
                key={m.l}
                style={[
                  styles.moodBtn,
                  mood === m.l && {
                    backgroundColor: C.purplePale,
                    borderColor: C.purple,
                  },
                ]}
                onPress={() => setMood(m.l)}
                activeOpacity={0.75}
              >
                <Text style={{ fontSize: 22 }}>{m.e}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    { color: mood === m.l ? C.purple : C.muted },
                  ]}
                >
                  {m.l}
                </Text>
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
            <Text style={[styles.sliderValue, { color: C.purple }]}>
              {sleep}/10
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={sleep}
            onValueChange={setSleep}
            minimumTrackTintColor={C.purple}
            maximumTrackTintColor={C.purplePale}
            thumbTintColor={C.purple}
          />
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Poor</Text>
            <Text style={styles.muted}>Excellent</Text>
          </View>
        </Card>

        {/* STRESS */}
        <Card>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Icon n="bolt" s={17} c={C.amber} />
              <Text style={styles.inputLabel}>Stress Level</Text>
            </View>
            <Text style={[styles.sliderValue, { color: C.amber }]}>
              {stress}/10
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={stress}
            onValueChange={setStress}
            minimumTrackTintColor={C.amber}
            maximumTrackTintColor={C.amberLight}
            thumbTintColor={C.amber}
          />
          <View style={styles.rowBetween}>
            <Text style={styles.muted}>Relaxed</Text>
            <Text style={styles.muted}>High Stress</Text>
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
                {aiInsight ? `${aiInsight.condition}\n\n${aiInsight.analysis}` : 'Memproses AI Insight...'}
              </Text>
              {aiInsight && aiInsight.recommendations.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  {aiInsight.recommendations.map((rec, i) => (
                    <Text key={i} style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 4 }}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </LinearGradient>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.8} onPress={handleSave}>
            <LinearGradient colors={[C.navy, C.purple]} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save Check-In</Text>
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
  heroTitle: { fontSize: 24, fontWeight: "900", color: "#fff", lineHeight: 32 },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 7 },
  content: { padding: 16, gap: 12, marginTop: -22 },

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
