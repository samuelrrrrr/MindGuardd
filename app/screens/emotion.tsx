import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../constants/Colors';
import { Card } from '../../components/UI';
import Icon from '../../components/Icon';

export default function EmotionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sel, setSel] = useState<string | null>(null);
  const [txt, setTxt] = useState('');

  const emos = [
    { l: 'Anxious', i: 'bolt', c: C.amber, bg: C.amberLight },
    { l: 'Calm', i: 'leaf', c: C.mint, bg: C.mintLight },
    { l: 'Happy', i: 'heart', c: C.purple, bg: C.purplePale },
    { l: 'Tired', i: 'moon', c: C.navy, bg: '#e8eaf6' },
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
          <Text style={styles.heroTitle}>Log Emotion</Text>
        </View>
        <View style={{ paddingHorizontal: 22, paddingTop: 12, alignItems: 'center' }}>
          <Text style={styles.heroSubTitle}>How are you feeling{'\n'}right now?</Text>
          <Text style={styles.heroSub}>Your digital sanctuary is listening.</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.emoGrid}>
          {emos.map((e) => (
            <TouchableOpacity
              key={e.l}
              style={[
                styles.emoBtn,
                sel === e.l && {
                  backgroundColor: e.bg,
                  borderColor: e.c,
                },
              ]}
              onPress={() => setSel(e.l)}
              activeOpacity={0.75}
            >
              <View style={[styles.emoIcon, { backgroundColor: e.bg }]}>
                <Icon n={e.i} s={26} c={e.c} />
              </View>
              <Text style={[styles.emoLabel, { color: sel === e.l ? e.c : C.text }]}>
                {e.l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.overwhelmedBtn,
            sel === 'Overwhelmed' && {
              backgroundColor: C.coralLight,
              borderColor: C.coral,
            },
          ]}
          onPress={() => setSel('Overwhelmed')}
          activeOpacity={0.75}
        >
          <Icon n="wave" s={28} c={sel === 'Overwhelmed' ? C.coral : C.muted} />
          <Text style={[styles.overwhelmedLabel, { color: sel === 'Overwhelmed' ? C.coral : C.text }]}>
            Overwhelmed
          </Text>
        </TouchableOpacity>

        <Card>
          <TextInput
            value={txt}
            onChangeText={setTxt}
            placeholder="Write a few words about what's on your mind..."
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={3}
            style={styles.textarea}
          />
          <Text style={styles.charCount}>Optional · {txt.length} chars</Text>
        </Card>

        <LinearGradient
          colors={['#1a4e5e', C.navyDeep]}
          style={styles.sanctuaryCard}
        >
          <Text style={styles.safeWordLabel}>Safe word</Text>
          <Text style={styles.safeWord}>SANCTUARY</Text>
          <View style={styles.safeBadge}>
            <Text style={styles.safeBadgeText}>Your mental space, protected.</Text>
          </View>
        </LinearGradient>

        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={[C.navy, C.purple]}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>Save Emotion</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  heroSubTitle: { fontSize: 23, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 30 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 7, textAlign: 'center' },
  content: { padding: 16, gap: 12, marginTop: -22 },

  emoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emoBtn: { width: '47%', borderRadius: 20, padding: 20, alignItems: 'center', gap: 10, borderWidth: 2, borderColor: 'transparent', backgroundColor: C.card, shadowColor: '#12175e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  emoIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  emoLabel: { fontSize: 13, fontWeight: '700' },

  overwhelmedBtn: { borderRadius: 20, padding: 18, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent', backgroundColor: C.card, shadowColor: '#12175e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  overwhelmedLabel: { fontSize: 14, fontWeight: '700' },

  textarea: { fontSize: 14, color: C.text, lineHeight: 24, minHeight: 80 },
  charCount: { textAlign: 'right', fontSize: 10, color: C.muted, marginTop: 6 },

  sanctuaryCard: { borderRadius: 22, padding: 18, alignItems: 'center' },
  safeWordLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  safeWord: { fontSize: 22, fontWeight: '900', color: 'rgba(255,255,255,0.1)', letterSpacing: 8 },
  safeBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 99, paddingHorizontal: 18, paddingVertical: 6, marginTop: 6 },
  safeBadgeText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },

  saveBtn: { borderRadius: 99, paddingVertical: 17, alignItems: 'center', shadowColor: C.purple, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  saveBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
