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

const METHODS = [
  {
    id: "box",
    name: "Box Breathing",
    desc: "Find focus and center (4-4-4-4)",
    phases: ['Breathe in...', 'Hold...', 'Breathe out...', 'Hold...'],
    durations: [4000, 4000, 4000, 4000]
  },
  {
    id: "478",
    name: "4-7-8 Relax",
    desc: "Fall asleep faster (4-7-8)",
    phases: ['Breathe in...', 'Hold...', 'Exhale loudly...'],
    durations: [4000, 7000, 8000]
  },
  {
    id: "paced",
    name: "Paced Breathing",
    desc: "Calm your nervous system (4-4)",
    phases: ['Breathe in...', 'Breathe out...'],
    durations: [4000, 4000]
  }
];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const [activeMethod, setActiveMethod] = useState(METHODS[0]);
  const [idx, setIdx] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeout: any;
    let isMounted = true;
    
    const runPhase = (currentIdx: number) => {
      if (!isMounted) return;
      setIdx(currentIdx);
      
      const phaseStr = activeMethod.phases[currentIdx];
      const duration = activeMethod.durations[currentIdx];
      
      const isIn = phaseStr.includes('Breathe in') || phaseStr.includes('Inhale');
      const isOut = phaseStr.includes('Breathe out') || phaseStr.includes('Exhale');
      
      const toVal = isIn ? 1.15 : isOut ? 0.85 : 1; 
      
      if (isIn || isOut) {
        Animated.timing(scaleAnim, {
          toValue: toVal,
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
    };
  }, [activeMethod]);

  const phase = activeMethod.phases[idx] || '';
  const durationSec = (activeMethod.durations[idx] || 4000) / 1000;

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
          <Text style={styles.heroTitle}>Breathe</Text>
          <Text style={styles.heroSub}>Choose a method to calm your mind.</Text>
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
            <Text style={styles.phaseSub}>For {durationSec} seconds</Text>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Breathing Methods</Text>

        {METHODS.map((item) => {
          const isActive = activeMethod.id === item.id;
          return (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.8}
              onPress={() => {
                clearTimeout(); // Let the effect handle cleanup
                setIdx(0);
                scaleAnim.setValue(1);
                setActiveMethod(item);
              }}
            >
              <Card style={isActive ? styles.activeCard : undefined}>
                <View style={styles.reliefRow}>
                  <View style={[styles.reliefIcon, { backgroundColor: isActive ? C.purplePale : '#eff6ff' }]}>
                    <Icon n="wind" s={20} c={isActive ? C.purple : '#3b82f6'} />
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

  reliefRow: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  reliefIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reliefTitle: { fontSize: 14, fontWeight: '800', color: C.text, marginBottom: 4 },
  reliefDesc: { fontSize: 12, color: C.sub, lineHeight: 20 },

  activeCard: {
    borderColor: C.purple,
    borderWidth: 1,
    backgroundColor: 'rgba(162,155,254,0.05)',
  }
});
