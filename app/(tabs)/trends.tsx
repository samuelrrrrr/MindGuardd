import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { Card, MultiLineChart } from "../../components/UI";
import { C } from "../../constants/Colors";
import {
  calcRiskScore,
  LAST_14_DAYS,
  LAST_7_DAYS,
  MOOD_SCORE,
} from "../../constants/mockData";
import { CheckInEntry } from "../../types/types";
import { computeRiskScore } from "../../utils/riskEngine";
import { getCheckIns } from "../../utils/storage";

type TimeRange = "weekly" | "monthly";
type Metric = "mood" | "risk" | "sleep";

// ── Chart data derived from real mock check-ins ──────────────────────────────
const DAYS_7 = [...LAST_7_DAYS].reverse(); // oldest → newest for chart
const DAYS_14 = [...LAST_14_DAYS].reverse();

const CHART_DATA = {
  weekly: {
    mood: DAYS_7.map((d) => Math.round((MOOD_SCORE[d.mood] / 10) * 100)),
    risk: DAYS_7.map(calcRiskScore),
    sleep: DAYS_7.map((d) => d.sleep * 10), // normalise to 0-100 scale
    labels: DAYS_7.map((d) => {
      const day = new Date(d.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      return day.slice(0, 2);
    }),
  },
  monthly: {
    mood: DAYS_14.map((d) => Math.round((MOOD_SCORE[d.mood] / 10) * 100)),
    risk: DAYS_14.map(calcRiskScore),
    sleep: DAYS_14.map((d) => d.sleep * 10),
    labels: DAYS_14.filter((_, i) => i % 3 === 0).map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    ),
  },
};

const NUM_TO_MOOD: Record<number, string> = {
  1: "Sad",
  2: "Neutral",
  3: "Calm",
  4: "Good",
  5: "Great",
};

const CHECKIN_HISTORY = LAST_14_DAYS.map((entry, i) => {
  const risk = calcRiskScore(entry);
  const riskLabel = risk < 35 ? "Low" : risk < 60 ? "Medium" : "High";

  // Format to "Thu, Apr 23, 12:53 PM"
  const formattedDate = new Date(entry.date).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    id: String(i + 1),
    date: formattedDate,
    mood: Math.round((MOOD_SCORE[entry.mood] / 10) * 100),
    sleep: entry.sleep,
    risk: riskLabel,
    note: entry.note ?? "",
    tags: [entry.act],
  };
});

export default function TrendsScreen() {
  const insets = useSafeAreaInsets();
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [history, setHistory] = useState<CheckInEntry[]>([]);
  const [page, setPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchCheckIns = async () => {
        const data = await getCheckIns();
        if (isActive) {
          setHistory(
            data.length > 0
              ? data
              : (CHECKIN_HISTORY as unknown as CheckInEntry[]),
          );
        }
      };
      fetchCheckIns();
      return () => {
        isActive = false;
      };
    }, []),
  );
  // No longer tracking a single metric, we show all three
  // const [metric, setMetric] = useState<Metric>('mood');

  const seriesData = [
    { data: CHART_DATA[timeRange].mood, color: C.mint, label: "Mood" },
    { data: CHART_DATA[timeRange].risk, color: C.coral, label: "Risk" },
    { data: CHART_DATA[timeRange].sleep, color: C.purpleLight, label: "Sleep" },
  ];
  const currentLabels = CHART_DATA[timeRange].labels;

  const metricConfig = {
    mood: { label: "Mood Score", color: C.mint },
    risk: { label: "Risk Level", color: C.coral },
    sleep: { label: "Hours of Sleep", color: C.purpleLight },
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
          source={require("../../assets/images/onboardjourney-01.png")}
          style={styles.bgImage}
        />
        <View
          style={{
            paddingHorizontal: 22,
            zIndex: 1,
            elevation: 1,
            position: "relative",
          }}
        >
          <Text style={styles.heroTitle}>Your Journey</Text>
          <Text style={styles.heroSub}>
            Track your mental well-being over time
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* FILTER BAR */}
        <View style={styles.filterRow}>
          <View style={styles.timeRangeToggle}>
            {(["weekly", "monthly"] as TimeRange[]).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.toggleBtn,
                  timeRange === t && styles.toggleBtnActive,
                ]}
                onPress={() => setTimeRange(t)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    timeRange === t && styles.toggleTextActive,
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CHART CARD */}
        <Card style={{ marginBottom: 16, marginTop: 16 }}>
          <View style={{ marginBottom: 20, marginTop: 4 }}>
            <Text style={styles.chartTitle}>Overall Well-being</Text>
            <Text style={styles.chartSub}>
              Mood, Risk, and Sleep correlation this{" "}
              {timeRange === "weekly" ? "week" : "month"}
            </Text>

            {/* Legend */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              {seriesData.map((s) => (
                <View
                  key={s.label}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: s.color,
                    }}
                  />
                  <Text
                    style={{ fontSize: 11, color: C.sub, fontWeight: "600" }}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <MultiLineChart series={seriesData} h={140} />

          <View style={[styles.rowBetween, { marginTop: 16 }]}>
            {currentLabels.map((l, i) => (
              <Text key={i} style={styles.chartLabel}>
                {l}
              </Text>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Daily Check-in History</Text>

        {/* HISTORY LIST */}
        {history.slice((page - 1) * 5, page * 5).map((item) => {
          const isReal = item.stress !== undefined;
          const riskCat = isReal
            ? computeRiskScore(item).category
            : (item as any).risk;
          const displayMood = isReal
            ? `${item.mood}/5`
            : `${(item as any).mood}%`;
          return (
            <Card key={item.id} style={{ marginBottom: 12, padding: 16 }}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <View style={styles.historyMetrics}>
                  <View style={styles.smallMetric}>
                    <Icon n="sparkle" s={12} c={C.mint} />
                    <Text style={[styles.smallMetricText, { color: C.mint }]}>
                      {displayMood}
                    </Text>
                  </View>
                  <View style={styles.smallMetric}>
                    <Icon n="moon" s={12} c={C.purple} />
                    <Text style={[styles.smallMetricText, { color: C.purple }]}>
                      {item.sleepHours || (item as any).sleep}h
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.historyNote}>
                {item.notes || (item as any).note}
              </Text>

              <View style={styles.tagsRow}>
                {item.activity && item.activity.length <= 25 ? (
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{item.activity}</Text>
                  </View>
                ) : !item.activity && (item as any).tags ? (
                  (item as any).tags?.map((t: string) =>
                    t.length <= 25 ? (
                      <View key={t} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                    ) : null,
                  )
                ) : null}
                <View
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor:
                        riskCat === "Low"
                          ? C.mintLight
                          : riskCat === "Medium"
                            ? C.amberLight
                            : C.coralLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      {
                        color:
                          riskCat === "Low"
                            ? C.mint
                            : riskCat === "Medium"
                              ? C.amber
                              : C.coral,
                      },
                    ]}
                  >
                    Risk: {riskCat}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}

        {history.length > 5 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 8,
              marginBottom: 24,
            }}
          >
            <TouchableOpacity
              disabled={page === 1}
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              style={{ padding: 12, opacity: page === 1 ? 0.5 : 1 }}
            >
              <Text style={{ color: C.text, fontWeight: "bold" }}>
                Previous
              </Text>
            </TouchableOpacity>
            <Text style={{ color: C.sub, fontWeight: "600" }}>
              Page {page} of {Math.ceil(history.length / 5)}
            </Text>
            <TouchableOpacity
              disabled={page === Math.ceil(history.length / 5)}
              onPress={() =>
                setPage((p) => Math.min(Math.ceil(history.length / 5), p + 1))
              }
              style={{
                padding: 12,
                opacity: page === Math.ceil(history.length / 5) ? 0.5 : 1,
              }}
            >
              <Text style={{ color: C.text, fontWeight: "bold" }}>Next</Text>
            </TouchableOpacity>
          </View>
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
    width: 220,
    height: 220,
    right: -60,
    top: -10,
    opacity: 0.9,
    resizeMode: "contain",
  },
  heroTitle: { fontSize: 28, fontWeight: "900", color: "#fff" },
  heroSub: { fontSize: 14, color: "rgba(255, 255, 255, 1)", marginTop: 6 },
  content: { padding: 16, gap: 4, marginTop: 2 },

  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 2,
  },
  timeRangeToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 25,
    padding: 4,
  },
  toggleBtn: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 16 },
  toggleBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: { fontSize: 13, fontWeight: "600", color: C.sub },
  toggleTextActive: { color: C.navy, fontWeight: "800" },

  metricTabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.purplePale,
    marginBottom: 10,
  },
  metricTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  metricTabText: { fontSize: 13, fontWeight: "600", color: C.sub },

  chartTitle: { fontSize: 18, fontWeight: "800", color: C.text },
  chartSub: { fontSize: 12, color: C.sub, marginTop: 2 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartLabel: { fontSize: 10, color: C.muted, fontWeight: "600" },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: C.text,
    marginVertical: 12,
    marginLeft: 4,
  },

  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  historyDate: { fontSize: 12, fontWeight: "700", color: C.navy },
  historyMetrics: { flexDirection: "row", gap: 8 },
  smallMetric: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f5ffff",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  smallMetricText: { fontSize: 11, fontWeight: "800" },

  historyNote: { fontSize: 13, color: C.sub, lineHeight: 20, marginBottom: 12 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagBadge: {
    backgroundColor: C.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { fontSize: 10, fontWeight: "700", color: C.sub },
});
