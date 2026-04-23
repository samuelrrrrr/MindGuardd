/**
 * Mock daily check-in data for the past 14 days.
 * Sesuai schema dari checkin.tsx:
 *   mood   : 'Sad' | 'Neutral' | 'Good' | 'Great' | 'Calm'
 *   sleep  : 0-10  (sleep quality)
 *   stress : 0-10  (stress level)
 *   act    : 'Work' | 'Study' | 'Rest' | 'Exercise'
 *
 * Today = 2026-04-23 (Rabu)
 */

export type Mood = 'Sad' | 'Neutral' | 'Good' | 'Great' | 'Calm';
export type Activity = 'Work' | 'Study' | 'Rest' | 'Exercise';

export interface DailyCheckIn {
  date: string;      // ISO date string, e.g. "2026-04-23"
  mood: Mood;
  sleep: number;     // 0-10
  stress: number;    // 0-10
  act: Activity;
  note?: string;     // optional free-text note
}

/** Mood → numeric score (untuk grafik / risk calculation) */
export const MOOD_SCORE: Record<Mood, number> = {
  Sad: 1,
  Neutral: 3,
  Good: 6,
  Calm: 7,
  Great: 10,
};

/** 14 hari terakhir, index 0 = hari ini, index 13 = 2 minggu lalu */
export const MOCK_CHECKINS: DailyCheckIn[] = [
  // ── Minggu ini ──────────────────────────────────────────────
  {
    date: '2026-04-23', // Rabu (hari ini)
    mood: 'Good',
    sleep: 7,
    stress: 4,
    act: 'Work',
    note: 'Productive morning, light afternoon.',
  },
  {
    date: '2026-04-22', // Selasa
    mood: 'Great',
    sleep: 9,
    stress: 2,
    act: 'Exercise',
    note: 'Morning run felt amazing.',
  },
  {
    date: '2026-04-21', // Senin
    mood: 'Neutral',
    sleep: 6,
    stress: 6,
    act: 'Work',
    note: 'Deadline pressure, manageable.',
  },
  {
    date: '2026-04-20', // Minggu
    mood: 'Calm',
    sleep: 8,
    stress: 2,
    act: 'Rest',
    note: 'Lazy Sunday, feel recharged.',
  },
  {
    date: '2026-04-19', // Sabtu
    mood: 'Good',
    sleep: 8,
    stress: 3,
    act: 'Exercise',
    note: 'Weekend workout + family time.',
  },
  {
    date: '2026-04-18', // Jumat
    mood: 'Great',
    sleep: 8,
    stress: 3,
    act: 'Work',
    note: 'End-of-week energy boost.',
  },
  {
    date: '2026-04-17', // Kamis
    mood: 'Neutral',
    sleep: 5,
    stress: 7,
    act: 'Study',
    note: 'Heavy study session, a bit drained.',
  },

  // ── Minggu lalu ──────────────────────────────────────────────
  {
    date: '2026-04-16', // Rabu
    mood: 'Sad',
    sleep: 4,
    stress: 9,
    act: 'Work',
    note: 'Tough meeting, overthinking at night.',
  },
  {
    date: '2026-04-15', // Selasa
    mood: 'Neutral',
    sleep: 6,
    stress: 5,
    act: 'Study',
    note: 'Caught up on notes, feeling okay.',
  },
  {
    date: '2026-04-14', // Senin
    mood: 'Good',
    sleep: 7,
    stress: 4,
    act: 'Work',
  },
  {
    date: '2026-04-13', // Minggu
    mood: 'Calm',
    sleep: 9,
    stress: 1,
    act: 'Rest',
    note: 'Deep sleep, meditation in the morning.',
  },
  {
    date: '2026-04-12', // Sabtu
    mood: 'Great',
    sleep: 8,
    stress: 2,
    act: 'Exercise',
    note: 'Hiking trip with friends.',
  },
  {
    date: '2026-04-11', // Jumat
    mood: 'Neutral',
    sleep: 6,
    stress: 6,
    act: 'Work',
    note: 'Long day, okay energy.',
  },
  {
    date: '2026-04-10', // Kamis
    mood: 'Sad',
    sleep: 4,
    stress: 8,
    act: 'Work',
    note: 'Anxious about project review.',
  },
];

// ─── Derived helpers ────────────────────────────────────────────────────────

/** Hitung rata-rata sleep, stress, dan mood score dari array check-in */
export function calcAverages(data: DailyCheckIn[]) {
  if (!data.length) return { avgSleep: 0, avgStress: 0, avgMood: 0 };
  const len = data.length;
  const avgSleep = data.reduce((s, d) => s + d.sleep, 0) / len;
  const avgStress = data.reduce((s, d) => s + d.stress, 0) / len;
  const avgMood = data.reduce((s, d) => s + MOOD_SCORE[d.mood], 0) / len;
  return { avgSleep, avgStress, avgMood };
}

/**
 * Hitung Risk Score (0-100) berdasarkan:
 *   - Stress tinggi → risk naik
 *   - Mood rendah   → risk naik
 *   - Sleep rendah  → risk naik
 */
export function calcRiskScore(entry: DailyCheckIn): number {
  const stressRisk = (entry.stress / 10) * 40;                    // max 40
  const moodRisk = ((10 - MOOD_SCORE[entry.mood]) / 9) * 40;      // max 40
  const sleepRisk = ((10 - entry.sleep) / 10) * 20;               // max 20
  return Math.round(stressRisk + moodRisk + sleepRisk);
}

/** Data 7 hari terakhir */
export const LAST_7_DAYS = MOCK_CHECKINS.slice(0, 7);

/** Data 14 hari terakhir (semua) */
export const LAST_14_DAYS = MOCK_CHECKINS;

/** Hari ini */
export const TODAY_CHECKIN = MOCK_CHECKINS[0];
