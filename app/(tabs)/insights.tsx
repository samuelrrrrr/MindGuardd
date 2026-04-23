import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bar, Card, LineChart, Pill } from "../../components/UI";
import { C } from "../../constants/Colors";

export default function InsightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chartData = [45, 52, 48, 70, 65, 72, 68];

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
        <View style={{ paddingHorizontal: 22 }}>
          <Pill
            label="Weekly Analysis"
            color={C.purpleLight}
            bg="rgba(162,155,254,0.2)"
          />
          <Text style={styles.heroTitle}>Your Weekly{"\n"}Insight</Text>
          <Text style={styles.heroSub}>Personalized feedback · June 12–19</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <LinearGradient
          colors={[`${C.navyDeep}f5`, "#2d2b8e"]}
          style={{ borderRadius: 22, padding: 18, marginBottom: 0 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=5" }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 12,
              }}
            />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>
              MindGuard AI
            </Text>
          </View>
          <Text style={styles.aiQuote}>
            "I noticed you've been feeling a bit stressed lately, particularly
            during your evening reflections."
          </Text>
          <Text style={styles.aiDesc}>
            Your resilience levels have stayed consistent, but I see a dip in
            focus during mid-week. This seems to correlate with shorter sleep
            cycles. A 5-minute breathing break at 3 PM could help!
          </Text>
        </LinearGradient>

        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Resilience</Text>
            <Pill label="+12%" color={C.mint} bg={C.mintLight} />
          </View>
          <View style={styles.miniBarRow}>
            {[40, 55, 48, 62, 80, 58, 65].map((v, i) => (
              <View
                key={i}
                style={[
                  styles.miniBar,
                  {
                    height: (v / 100) * 44 + 4,
                    backgroundColor: i === 4 ? C.navy : C.purplePale,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.muted}>Stable growth over 7 days</Text>
        </Card>

        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Daily Focus</Text>
            <Text style={[styles.bigNum, { color: C.purple }]}>74%</Text>
          </View>
          <Bar value={74} color={C.purple} />
          <View style={[styles.rowBetween, { marginTop: 6, marginBottom: 12 }]}>
            <Text style={styles.muted}>Restless</Text>
            <Text style={styles.muted}>Centered</Text>
          </View>
          <TouchableOpacity
            style={styles.focusBtn}
            onPress={() => router.push("/screens/activity")}
            activeOpacity={0.75}
          >
            <Text style={[styles.focusBtnText, { color: C.purple }]}>
              Boost focus now
            </Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { marginBottom: 10 }]}>
            Mood Trajectory
          </Text>
          <LineChart data={chartData} color={C.purple} h={68} />
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <Text key={d} style={styles.muted}>
                {d}
              </Text>
            ))}
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  hero: { paddingBottom: 32 },
  heroTitle: { fontSize: 26, fontWeight: "900", color: "#fff", marginTop: 10 },
  heroSub: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 6 },
  content: { padding: 16, gap: 12, marginTop: 3 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: "800", color: C.text },
  bigNum: { fontSize: 15, fontWeight: "900" },
  muted: { fontSize: 10, color: C.muted },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  aiQuote: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: "italic",
  },
  aiDesc: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 22 },

  miniBarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 48,
    gap: 4,
    marginBottom: 6,
  },
  miniBar: { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  focusBtn: {
    backgroundColor: C.purplePale,
    borderRadius: 99,
    paddingVertical: 10,
    alignItems: "center",
  },
  focusBtnText: { fontSize: 13, fontWeight: "700" },
});
