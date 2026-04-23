import { Tabs } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import { C } from "../../constants/Colors";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { id: "index", icon: "home", label: "Home" },
    { id: "journal", icon: "insights", label: "Journal" },
    { id: "checkin", icon: "plus", label: "" },
    { id: "insights", icon: "activity", label: "Activity" },
    { id: "trends", icon: "trends", label: "Journey" },
  ];

  return (
    <View
      style={[
        styles.navBar,
        { paddingBottom: insets.bottom ? insets.bottom - 20 : 12 },
      ]}
    >
      {tabs.map((tab) => {
        const route = state.routes.find(
          (r: any) => r.name === tab.id || r.name === `(tabs)/${tab.id}`,
        );
        const index = route ? state.routes.indexOf(route) : -1;
        const isActive = state.index === index;
        const isCenter = tab.id === "checkin";

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabBtn}
            activeOpacity={0.7}
            onPress={() => {
              if (index !== -1) {
                navigation.navigate(tab.id);
              }
            }}
          >
            {isCenter ? (
              <View style={styles.fabBtn}>
                <Icon n="plus" s={24} c="#fff" />
              </View>
            ) : (
              <>
                <Icon n={tab.icon} s={22} c={isActive ? C.purple : C.muted} />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? C.purple : C.muted },
                  ]}
                >
                  {tab.label}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="insights" />
      <Tabs.Screen name="checkin" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="trends" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: C.card,
    borderTopWidth: 4,
    paddingTop: 12,
    borderTopColor: C.purplePale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#12175e",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
  },
  fabBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -22,
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    // gradient workaround: use navy + purple mix as bg
    // If you want gradient, wrap with LinearGradient
  },
});
