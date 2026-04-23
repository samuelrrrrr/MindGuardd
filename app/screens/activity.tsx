import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../constants/Colors';
import { Card } from '../../components/UI';
import Icon from '../../components/Icon';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const phases = ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'];
  const [idx, setIdx] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % 4), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const isIn = phases[idx] === 'Breathe in...';
    const isOut = phases[idx] === 'Breathe out...';
    const toVal = isIn ? 1.15 : isOut ? 0.85 : 1;
    Animated.timing(scaleAnim, {
      toValue: toVal,
      duration: 3800,
      useNativeDriver: true,
    }).start();
  }, [idx]);

  const phase = phases[idx];

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
        <View style={{ paddingHorizontal: 22, alignItems: 'center' }}>
          <Text style={styles.heroTitle}>Paced Breathing</Text>
          <Text style={styles.heroSub}>Calm your nervous system in 2 minutes.</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Card>
          <View style={styles.breatheContainer}>
            <View style={styles.outerRing}>
              <Animated.View
                style={[styles.breathCircle, { transform: [{ scale: scaleAnim }] }]}
              >
                <LinearGradient
                  colors={[C.purple, C.navy]}
                  style={styles.breathInner}
                >
                  <Icon n="wind" s={42} c="#fff" />
                </LinearGradient>
              </Animated.View>
            </View>
            <Text style={styles.phaseText}>{phase}</Text>
            <Text style={styles.phaseSub}>Hold for 4 seconds</Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Immediate Relief</Text>

        {[
          {
            i: 'drop',
            c: '#3b82f6',
            bg: '#eff6ff',
            title: 'Cold Water',
            desc: 'Splash your face with cold water to trigger the mammalian dive reflex.',
          },
          {
            i: 'sparkle',
            c: C.purple,
            bg: C.purplePale,
            title: '5-4-3-2-1 Rule',
            desc: 'Acknowledge 5 things you see, 4 you can touch, 3 you hear...',
          },
        ].map((item) => (
          <Card key={item.title}>
            <View style={styles.reliefRow}>
              <View style={[styles.reliefIcon, { backgroundColor: item.bg }]}>
                <Icon n={item.i} s={20} c={item.c} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reliefTitle}>{item.title}</Text>
                <Text style={styles.reliefDesc}>{item.desc}</Text>
              </View>
            </View>
          </Card>
        ))}

        <LinearGradient
          colors={['#1a3a4e', C.navyDeep]}
          style={styles.nextExercise}
        >
          <View>
            <Text style={styles.nextLabel}>NEXT EXERCISE</Text>
            <Text style={styles.nextTitle}>Guided Muscle Relaxation</Text>
          </View>
          <TouchableOpacity style={styles.startBtn} activeOpacity={0.75}>
            <Text style={styles.startBtnText}>Start</Text>
            <Icon n="play" s={12} c="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  hero: { paddingBottom: 32 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', textAlign: 'center' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 7, textAlign: 'center' },
  content: { padding: 16, gap: 12, marginTop: -22 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: C.sub, textTransform: 'uppercase', letterSpacing: 0.8 },

  breatheContainer: { alignItems: 'center', paddingVertical: 20 },
  outerRing: { width: 200, height: 200, borderRadius: 100, borderWidth: 2, borderColor: `${C.purpleMid}60`, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  breathCircle: { width: 160, height: 160, borderRadius: 80, overflow: 'hidden' },
  breathInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  phaseText: { fontSize: 18, fontWeight: '800', color: C.purple, marginBottom: 4 },
  phaseSub: { fontSize: 12, color: C.sub, fontStyle: 'italic' },

  reliefRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  reliefIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reliefTitle: { fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 4 },
  reliefDesc: { fontSize: 12, color: C.sub, lineHeight: 20 },

  nextExercise: { borderRadius: 22, padding: 20, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  nextLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, fontWeight: '700' },
  nextTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginTop: 3 },
  startBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 5 },
  startBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
