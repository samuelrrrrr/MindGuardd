import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../constants/Colors';
import { Card, Pill, Bar } from '../../components/UI';
import Icon from '../../components/Icon';

export default function RiskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const factors = [
    { l: 'Sleep Quality', sub: 'Moderate Impact', c: C.purple, v: 55, i: 'moon', desc: 'Average 6.5h this week. Consistent sleep may lower risk.' },
    { l: 'Workload', sub: 'High Intensity', c: C.coral, v: 85, i: 'bolt', desc: 'Elevated screen time detected during late hours.' },
    { l: 'Social Contact', sub: 'Positive Factor', c: C.mint, v: 70, i: 'users', desc: 'Meaningful interactions yesterday helped stabilize mood.' },
    { l: 'Movement', sub: 'Highly Stable', c: C.navy, v: 82, i: 'run', desc: 'Your daily walks are a core pillar of stability.' },
  ];

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
        <View style={styles.backRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Icon n="back" s={18} c="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
          <Text style={styles.heroTitle}>Risk Analysis</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statusBanner}>
          <Pill label="CURRENT STATUS" color={C.mint} bg={C.mintLight} />
          <Text style={styles.statusScore}>Low Risk</Text>
          <Text style={styles.statusDesc}>Mental well-being indicators are currently stable.</Text>
          <View style={styles.miniBarRow}>
            {[35, 42, 38, 45, 40, 36, 30].map((v, i) => (
              <View key={i} style={styles.miniBarItem}>
                <View
                  style={[
                    styles.miniBar,
                    {
                      height: (v / 50) * 34 + 4,
                      backgroundColor: i === 6 ? `${C.mint}cc` : `${C.mint}44`,
                    },
                  ]}
                />
                <Text style={styles.dayLabel}>{'MTWTFSS'[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Contributing Factors</Text>

        {factors.map((f) => (
          <Card key={f.l}>
            <View style={styles.factorHeader}>
              <View style={[styles.factorIcon, { backgroundColor: `${f.c}18` }]}>
                <Icon n={f.i} s={18} c={f.c} />
              </View>
              <View>
                <Text style={styles.factorTitle}>{f.l}</Text>
                <Text style={[styles.factorSub, { color: f.c }]}>{f.sub}</Text>
              </View>
            </View>
            <Bar value={f.v} color={f.c} bg={`${f.c}18`} h={5} style={{ marginBottom: 8 }} />
            <Text style={styles.factorDesc}>{f.desc}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  hero: { paddingBottom: 32 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 22, paddingVertical: 4 },
  backBtn: { width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  content: { padding: 16, gap: 12, marginTop: -22 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.sub, textTransform: 'uppercase', letterSpacing: 0.8 },

  statusBanner: { borderWidth: 1.5, borderColor: `${C.mint}40`, borderRadius: 24, padding: 20, backgroundColor: `${C.mint}08` },
  statusScore: { fontSize: 30, fontWeight: '900', color: C.mint, marginVertical: 8 },
  statusDesc: { fontSize: 13, color: C.sub, marginBottom: 16 },
  miniBarRow: { flexDirection: 'row', gap: 4, alignItems: 'flex-end', height: 40 },
  miniBarItem: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  miniBar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  dayLabel: { fontSize: 9, color: C.muted, marginTop: 3 },

  factorHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  factorIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  factorTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  factorSub: { fontSize: 12, fontWeight: '600' },
  factorDesc: { fontSize: 12, color: C.sub, lineHeight: 22 },
});
