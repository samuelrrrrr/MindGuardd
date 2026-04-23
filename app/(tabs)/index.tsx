import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { Card, Ring } from "../../components/UI";
import { C } from "../../constants/Colors";
import {
  calcRiskScore,
  MOOD_SCORE,
  TODAY_CHECKIN,
} from "../../constants/mockData";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // ── Derived values from today's check-in ───────────────────
  const moodScore = Math.round((MOOD_SCORE[TODAY_CHECKIN.mood] / 10) * 100);
  const riskScore = calcRiskScore(TODAY_CHECKIN);
  const sleepScore = Math.round((TODAY_CHECKIN.sleep / 10) * 100);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <LinearGradient
          colors={[C.navyDeep, C.navy, "#2d3182"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 8 }]}
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.avatarRow}
              onPress={() => setShowSidebar(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[C.purpleLight, C.purple]}
                style={styles.avatar}
              >
                <Image
                  source={require("../../assets/images/asistant.png")}
                  style={styles.avatarInner}
                />
              </LinearGradient>
              <View>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.nameText}>Talita</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setShowNotifications(true)}
            >
              <Icon n="bell" s={20} c="rgba(255,255,255,0.9)" />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View style={styles.greetingBox}>
            <Image
              source={require("../../assets/images/onboard-01.png")}
              style={{
                position: "absolute",
                right: -155,
                bottom: -160,
                width: 350,
                height: 350,
                opacity: 1,
              }}
              resizeMode="contain"
              pointerEvents="none"
            />
            <View style={{ zIndex: 1, elevation: 1, position: "relative" }}>
              <Text style={styles.greeting}>
                Good Morning,{"\n"}how are you today?
              </Text>
              <Text style={styles.greetingSub}>
                Your mental sanctuary {"\n"} is ready for the day.
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/*DAILY PROGRESS*/}
        <View style={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.sectionLabel}>Daily Progress</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                paddingVertical: 10,
                paddingTop: 24,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Ring value={moodScore} color={C.mint} sub="MOOD" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Ring value={riskScore} color={C.red} sub="RISK" />
              </View>
              <View style={{ alignItems: "center" }}>
                <Ring value={sleepScore} color={C.purpleLight} sub="SLEEP" />
              </View>
            </View>
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={() => router.push("/(tabs)/trends")}
            >
              <Text style={[styles.aiBtnText, { color: C.purpleLight }]}>
                View Your Journey
              </Text>
              <Icon n="arrow" s={15} c={C.purpleLight} />
            </TouchableOpacity>
          </Card>

          {/* AI INSIGHT */}
          <LinearGradient
            colors={[C.navyDeep, "#2d2b8e"]}
            style={[styles.card, { borderRadius: 22, padding: 24 }]}
          >
            <View style={styles.aiHeader}>
              <View style={styles.aiIcon}>
                <Icon n="sparkle" s={13} c={C.purpleLight} />
              </View>
              <Text style={styles.aiLabel}>AI Insight</Text>
            </View>
            <Text style={styles.aiTitle}>
              Focus on your breathing for just 3 minutes to lower cortisol.
            </Text>
            <Text style={styles.aiQuote}>
              "Calm is a superpower that starts within."
            </Text>
          </LinearGradient>

          {/* QUICK ACTIONS */}
          <View>
            {/* Daily Check-in Card */}
            <TouchableOpacity
              style={styles.dailyCheckinCard}
              onPress={() => router.push("/(tabs)/checkin")}
              activeOpacity={0.85}
            >
              <Image
                source={require("../../assets/images/onboard-04.png")}
                style={styles.dailyCheckinBg}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.dailyCheckinOverlay}
              />
              <View style={styles.dailyCheckinContent}>
                <Text style={styles.dailyCheckinTitle}>Daily Check-in</Text>
                <Text style={styles.dailyCheckinSub}>
                  How are you feeling right now?
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* NOTIFICATION MODAL */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNotifications(false)}
        >
          <Pressable
            style={[styles.notificationBubble, { top: insets.top + 60 }]}
          >
            <Text style={styles.notifHeader}>Notifications</Text>
            <View style={styles.notifItem}>
              <View
                style={[styles.notifIcon, { backgroundColor: C.mintLight }]}
              >
                <Icon n="check" s={14} c={C.mint} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>Daily Check-in Complete</Text>
                <Text style={styles.notifTime}>Just now</Text>
              </View>
            </View>
            <View style={[styles.notifItem, { marginBottom: 0 }]}>
              <View
                style={[styles.notifIcon, { backgroundColor: C.purplePale }]}
              >
                <Icon n="sparkle" s={14} c={C.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>New AI Insight Available</Text>
                <Text style={styles.notifTime}>2 hours ago</Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* SIDEBAR MODAL */}
      <Modal
        visible={showSidebar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSidebar(false)}
      >
        <View style={styles.sidebarOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowSidebar(false)}
          />
          <View style={styles.sidebarContainer}>
            <View style={styles.sidebarHeader}>
              <TouchableOpacity onPress={() => setShowSidebar(false)}>
                <Icon n="x" s={24} c={C.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarProfile}>
              <LinearGradient
                colors={[C.purpleLight, C.purple]}
                style={styles.sidebarAvatar}
              >
                <Image
                  source={require("../../assets/images/asistant.png")}
                  style={styles.sidebarAvatarInner}
                />
              </LinearGradient>
              <Text style={styles.sidebarUsername}>Talita</Text>
            </View>

            <TouchableOpacity style={styles.sidebarItem}>
              <Icon n="download" s={20} c={C.text} />
              <Text style={styles.sidebarItemText}>Export to Excel</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={[
                styles.sidebarItem,
                { borderBottomWidth: 0, marginBottom: 20 },
              ]}
            >
              <Icon n="log-out" s={20} c={C.coral} />
              <Text style={[styles.sidebarItemText, { color: C.coral }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sidebarOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
  },
  sidebarContainer: {
    width: width * 0.75,
    backgroundColor: C.bg,
    height: "100%",
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  sidebarHeader: {
    marginBottom: 20,
    alignItems: "flex-end",
  },
  sidebarProfile: {
    alignItems: "center",
    marginBottom: 40,
  },
  sidebarAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  sidebarAvatarInner: {
    width: 80,
    height: 80,
  },
  sidebarUsername: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    gap: 14,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  scroll: { flex: 1, backgroundColor: C.bg },
  hero: { paddingHorizontal: 22, paddingBottom: 40 },
  content: { padding: 16, gap: 12 },
  card: { marginBottom: 0 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: { width: 42, height: 42 },
  welcomeText: {
    bottom: 3,
    fontSize: 12,
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "500",
  },
  nameText: { fontSize: 17, fontWeight: "800", color: "#fff" },
  bellBtn: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.coral,
  },

  greetingBox: { paddingTop: 16 },
  greeting: { fontSize: 23, fontWeight: "800", color: "#fff", lineHeight: 30 },
  greetingSub: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 1)",
    marginTop: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  moodRow: { flexDirection: "row", justifyContent: "space-between" },
  moodItem: { alignItems: "center", gap: 5 },
  moodEmoji: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodLabel: { fontSize: 9 },

  riskRow: { flexDirection: "row", alignItems: "center" },
  riskScore: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
    marginBottom: 6,
    marginTop: 4,
  },
  riskDesc: { fontSize: 12, color: C.sub, lineHeight: 19 },

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
    marginBottom: 10,
  },
  aiQuote: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 1)",
    fontStyle: "italic",
    marginBottom: 14,
  },
  aiBtn: {
    backgroundColor: "rgba(162,155,254,0.18)",
    borderWidth: 1,
    borderColor: "rgba(162,155,254,0.35)",
    borderRadius: 99,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    top: 5,
  },
  aiBtnText: { fontSize: 12, fontWeight: "700" },

  stabilityText: { fontSize: 16, fontWeight: "900", color: C.text },
  barRow: { flexDirection: "row", alignItems: "flex-end", height: 44, gap: 4 },
  barItem: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  barFill: {
    width: "100%",
    borderRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dayLabel: { fontSize: 9, color: C.muted, fontWeight: "600", marginTop: 3 },

  quickActions: { flexDirection: "row", gap: 10 },
  quickBtn: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 8,
    shadowColor: "#12175e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
  },
  quickSub: { fontSize: 10, color: C.muted, marginTop: -4 },

  shortcutGrid: { flexDirection: "row", gap: 10 },
  shortcutBtn: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#12175e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutLabel: { fontSize: 13, fontWeight: "800", color: C.text, flex: 1 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  notificationBubble: {
    position: "absolute",
    right: 20,
    width: 250,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#12175e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  notifHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: C.text,
    marginBottom: 14,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notifTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.text,
  },
  notifTime: {
    fontSize: 10,
    color: C.sub,
    marginTop: 2,
  },

  dailyCheckinCard: {
    height: 140,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: C.navy, // fallback color
  },
  dailyCheckinBg: {
    position: "absolute",
    width: "130%",
    height: "130%",
    resizeMode: "cover",
    opacity: 100,
    right: -140,
    bottom: -30,
  },
  dailyCheckinOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  dailyCheckinContent: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  dailyCheckinTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  dailyCheckinSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
});
