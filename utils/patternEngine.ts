import {
  CheckInEntry,
  EmotionalLog,
  PatternData,
  Trend,
  PredictionResult,
  WhatIfScenario,
  RiskScore,
  RiskIndication,
  Intervention,
  InterventionType,
} from '../types/types';
import { generateId } from './storage';
import { computeRiskScore } from './riskEngine';

// ============================================
// Pattern Detector
// ============================================

export function detectPatterns(
  checkIns: CheckInEntry[],
  emotionalLogs: EmotionalLog[] = []
): PatternData[] {
  const patterns: PatternData[] = [];

  if (checkIns.length < 3) return patterns;

  const sorted = [...checkIns].sort((a, b) => a.timestamp - b.timestamp);

  const moodPattern = detectMoodTrend(sorted);
  if (moodPattern) patterns.push(moodPattern);

  const sleepPattern = detectSleepPattern(sorted);
  if (sleepPattern) patterns.push(sleepPattern);

  const stressPattern = detectStressPattern(sorted);
  if (stressPattern) patterns.push(stressPattern);

  const activityPattern = detectActivityMoodCorrelation(sorted);
  if (activityPattern) patterns.push(activityPattern);

  const weeklyPattern = detectWeeklyRhythm(sorted);
  if (weeklyPattern) patterns.push(weeklyPattern);

  const sleepMoodPattern = detectSleepMoodCorrelation(sorted);
  if (sleepMoodPattern) patterns.push(sleepMoodPattern);

  return patterns;
}

function detectMoodTrend(entries: CheckInEntry[]): PatternData | null {
  if (entries.length < 3) return null;
  const recent = entries.slice(-7);
  const trend = computeTrend(recent.map((e) => e.mood));
  const avgMood = average(recent.map((e) => e.mood));

  let description: string;
  if (trend === 'improving') {
    description = `Your mood has been improving over the last ${recent.length} days. Average mood: ${avgMood.toFixed(1)}/5. Keep it up!`;
  } else if (trend === 'declining') {
    description = `Your mood has been declining over the last ${recent.length} days. Average mood: ${avgMood.toFixed(1)}/5. Consider what might be causing this.`;
  } else {
    description = `Your mood has been stable over the last ${recent.length} days. Average mood: ${avgMood.toFixed(1)}/5.`;
  }

  return {
    id: generateId(),
    type: 'mood_trend',
    title: 'Mood Trend',
    description,
    trend,
    dataPoints: recent.length,
    detectedAt: Date.now(),
  };
}

function detectSleepPattern(entries: CheckInEntry[]): PatternData | null {
  if (entries.length < 3) return null;
  const recent = entries.slice(-7);
  const sleepHours = recent.map((e) => e.sleepHours);
  const avgSleep = average(sleepHours);
  const variance = computeVariance(sleepHours);
  const trend = computeTrend(sleepHours);

  let title: string;
  let description: string;

  if (variance > 4) {
    title = 'Irregular Sleep Pattern';
    description = `Your sleep schedule is highly variable (${Math.min(...sleepHours).toFixed(0)}-${Math.max(...sleepHours).toFixed(0)} hours). Irregular sleep can affect mental health.`;
  } else if (avgSleep < 6) {
    title = 'Insufficient Sleep';
    description = `Average sleep of ${avgSleep.toFixed(1)} hours over ${recent.length} days is below the recommended 7-9 hours.`;
  } else if (avgSleep >= 7 && avgSleep <= 9 && variance < 2) {
    title = 'Healthy Sleep Pattern';
    description = `Great sleep habits! Average of ${avgSleep.toFixed(1)} hours with consistent schedule.`;
  } else {
    title = 'Sleep Pattern';
    description = `Average sleep: ${avgSleep.toFixed(1)} hours over ${recent.length} days.`;
  }

  return {
    id: generateId(),
    type: 'sleep_pattern',
    title,
    description,
    trend,
    dataPoints: recent.length,
    detectedAt: Date.now(),
  };
}

function detectStressPattern(entries: CheckInEntry[]): PatternData | null {
  if (entries.length < 3) return null;
  const recent = entries.slice(-7);
  const stressLevels = recent.map((e) => e.stress);
  const avgStress = average(stressLevels);
  const trend = computeTrend(stressLevels);

  let description: string;
  if (avgStress >= 4) {
    description = `Average stress level of ${avgStress.toFixed(1)}/5 is high. Consider stress management techniques.`;
  } else if (avgStress >= 3) {
    description = `Moderate average stress of ${avgStress.toFixed(1)}/5. Monitor for increases.`;
  } else {
    description = `Low average stress of ${avgStress.toFixed(1)}/5. Good stress management!`;
  }

  return {
    id: generateId(),
    type: 'stress_trend',
    title: 'Stress Trend',
    description,
    trend,
    dataPoints: recent.length,
    detectedAt: Date.now(),
  };
}

function detectActivityMoodCorrelation(entries: CheckInEntry[]): PatternData | null {
  if (entries.length < 5) return null;
  const activityMood: Record<string, number[]> = {};
  for (const e of entries) {
    if (!activityMood[e.activity]) activityMood[e.activity] = [];
    activityMood[e.activity].push(e.mood);
  }

  let bestActivity = '';
  let bestMood = 0;
  let worstActivity = '';
  let worstMood = 5;

  for (const [activity, moods] of Object.entries(activityMood)) {
    if (moods.length < 2) continue;
    const avg = average(moods);
    if (avg > bestMood) {
      bestMood = avg;
      bestActivity = activity;
    }
    if (avg < worstMood) {
      worstMood = avg;
      worstActivity = activity;
    }
  }

  if (!bestActivity) return null;

  const description =
    bestActivity === worstActivity
      ? `Your mood is generally ${bestMood.toFixed(1)}/5 during ${bestActivity} activities.`
      : `Your mood is highest during ${bestActivity} (avg ${bestMood.toFixed(1)}/5) and lowest during ${worstActivity} (avg ${worstMood.toFixed(1)}/5).`;

  return {
    id: generateId(),
    type: 'activity_mood_correlation',
    title: 'Activity-Mood Connection',
    description,
    trend: 'stable',
    dataPoints: entries.length,
    detectedAt: Date.now(),
  };
}

function detectWeeklyRhythm(entries: CheckInEntry[]): PatternData | null {
  if (entries.length < 7) return null;
  const dayMoods: Record<number, number[]> = {};
  for (const e of entries) {
    const day = new Date(e.timestamp).getDay();
    if (!dayMoods[day]) dayMoods[day] = [];
    dayMoods[day].push(e.mood);
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDay = 0;
  let bestMood = 0;
  let worstDay = 0;
  let worstMood = 5;

  for (const [dayStr, moods] of Object.entries(dayMoods)) {
    const day = Number(dayStr);
    const avg = average(moods);
    if (avg > bestMood) { bestMood = avg; bestDay = day; }
    if (avg < worstMood) { worstMood = avg; worstDay = day; }
  }

  return {
    id: generateId(),
    type: 'weekly_rhythm',
    title: 'Weekly Rhythm',
    description: `You tend to feel best on ${dayNames[bestDay]}s (avg mood ${bestMood.toFixed(1)}/5) and lowest on ${dayNames[worstDay]}s (avg mood ${worstMood.toFixed(1)}/5).`,
    trend: 'stable',
    dataPoints: entries.length,
    detectedAt: Date.now(),
  };
}

function detectSleepMoodCorrelation(entries: CheckInEntry[]): PatternData | null {
  if (entries.length < 5) return null;
  const goodSleep = entries.filter((e) => e.sleepHours >= 7 && e.sleepHours <= 9);
  const badSleep = entries.filter((e) => e.sleepHours < 6);

  if (goodSleep.length < 2 || badSleep.length < 2) return null;

  const goodMood = average(goodSleep.map((e) => e.mood));
  const badMood = average(badSleep.map((e) => e.mood));
  const diff = goodMood - badMood;

  if (Math.abs(diff) < 0.3) return null;

  return {
    id: generateId(),
    type: 'sleep_mood_correlation',
    title: 'Sleep-Mood Connection',
    description: `On days with 7-9h sleep, your mood averages ${goodMood.toFixed(1)}/5 vs ${badMood.toFixed(1)}/5 on days with less than 6h. Sleep quality directly affects your mood.`,
    trend: diff > 0 ? 'stable' : 'declining',
    dataPoints: entries.length,
    detectedAt: Date.now(),
  };
}

// ============================================
// Predictive Engine
// ============================================

export function predictFuture(
  entries: CheckInEntry[],
  daysAhead: number = 7
): PredictionResult {
  if (entries.length < 3) {
    return {
      predictedScores: [],
      outlook: 'neutral',
      confidence: 0,
      description: 'Not enough data for prediction. Log at least 3 days.',
    };
  }

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const scores = sorted.map((e) => computeRiskScore(e).score);

  const { slope, intercept } = linearRegression(scores);
  const windowSize = Math.min(3, scores.length);
  const lastAvg = average(scores.slice(-windowSize));

  const predictedScores: { date: string; score: number }[] = [];
  const today = new Date();

  for (let i = 1; i <= daysAhead; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    const dateStr = futureDate.toISOString().split('T')[0];

    const trendValue = intercept + slope * (scores.length + i - 1);
    const blended = lastAvg * 0.6 + trendValue * 0.4;
    const clamped = Math.round(Math.max(0, Math.min(100, blended)));

    predictedScores.push({ date: dateStr, score: clamped });
  }

  const avgPredicted = average(predictedScores.map((p) => p.score));
  const lastActualScore = scores[scores.length - 1];

  let outlook: 'positive' | 'neutral' | 'negative';
  if (avgPredicted < lastActualScore - 5) {
    outlook = 'positive';
  } else if (avgPredicted > lastActualScore + 5) {
    outlook = 'negative';
  } else {
    outlook = 'neutral';
  }

  const confidence = Math.min(0.9, 0.3 + entries.length * 0.05);

  let description: string;
  if (outlook === 'positive') {
    description = `Based on your recent trends, your mental health risk is predicted to decrease. Keep up your positive habits!`;
  } else if (outlook === 'negative') {
    description = `Your risk score may increase in the coming days. Consider proactive self-care and stress management.`;
  } else {
    description = `Your mental health indicators are expected to remain stable. Continue monitoring and maintaining your routines.`;
  }

  return {
    predictedScores,
    outlook,
    confidence,
    description,
  };
}

export function generateWhatIfScenarios(
  entries: CheckInEntry[]
): WhatIfScenario[] {
  if (entries.length < 3) return [];

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const latestEntry = sorted[sorted.length - 1];
  const currentScore = computeRiskScore(latestEntry).score;
  const scenarios: WhatIfScenario[] = [];

  if (latestEntry.sleepHours < 7) {
    const improved = { ...latestEntry, sleepHours: 8 };
    const newScore = computeRiskScore(improved).score;
    scenarios.push({
      scenario: 'If you sleep 8 hours tonight',
      currentScore,
      predictedScore: newScore,
      improvement: currentScore - newScore,
      description: `Improving your sleep to 8 hours could reduce your risk score by ${currentScore - newScore} points.`,
    });
  }

  if (latestEntry.activity !== 'exercise') {
    const improved = { ...latestEntry, activity: 'exercise' as const };
    const newScore = computeRiskScore(improved).score;
    scenarios.push({
      scenario: 'If you exercise today',
      currentScore,
      predictedScore: newScore,
      improvement: currentScore - newScore,
      description: `Adding exercise could reduce your risk score by ${currentScore - newScore} points.`,
    });
  }

  if (latestEntry.stress >= 4) {
    const improved = { ...latestEntry, stress: 2 as const };
    const newScore = computeRiskScore(improved).score;
    scenarios.push({
      scenario: 'If stress reduces to manageable levels',
      currentScore,
      predictedScore: newScore,
      improvement: currentScore - newScore,
      description: `Reducing stress through relaxation techniques could lower your risk by ${currentScore - newScore} points.`,
    });
  }

  if (latestEntry.mood <= 3) {
    const improved = { ...latestEntry, mood: 4 as const };
    const newScore = computeRiskScore(improved).score;
    scenarios.push({
      scenario: 'If mood improves through positive activities',
      currentScore,
      predictedScore: newScore,
      improvement: currentScore - newScore,
      description: `Engaging in mood-boosting activities could lower risk by ${currentScore - newScore} points.`,
    });
  }

  return scenarios;
}

// ============================================
// Micro-Intervention System
// ============================================

const INTERVENTIONS: Omit<Intervention, 'id' | 'priority'>[] = [
  {
    type: 'breathing',
    title: 'Box Breathing',
    description: 'Inhale 4 sec → Hold 4 sec → Exhale 4 sec → Hold 4 sec. Repeat 4 times.',
    duration: '2 min',
    steps: [
      'Find a comfortable position',
      'Breathe in slowly for 4 seconds',
      'Hold your breath for 4 seconds',
      'Exhale slowly for 4 seconds',
      'Hold for 4 seconds',
      'Repeat 4 times',
    ],
  },
  {
    type: 'breathing',
    title: '4-7-8 Breathing',
    description: 'Inhale 4 sec → Hold 7 sec → Exhale 8 sec. Calms the nervous system.',
    duration: '3 min',
    steps: [
      'Sit or lie down comfortably',
      'Breathe in through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale through your mouth for 8 seconds',
      'Repeat 3-4 times',
    ],
  },
  {
    type: 'movement',
    title: 'Quick Stretch Break',
    description: 'Simple stretches to release physical tension and boost energy.',
    duration: '3 min',
    steps: [
      'Stand up and reach your arms overhead',
      'Roll your shoulders forward and backward 5 times',
      'Gently tilt your head side to side',
      'Touch your toes (or reach as far as comfortable)',
      'Do 5 gentle squats',
      'Shake out your hands and feet',
    ],
  },
  {
    type: 'movement',
    title: 'Mindful Walk',
    description: 'Take a short walk, focusing on each step and your surroundings.',
    duration: '5 min',
    steps: [
      'Step outside or walk around your space',
      'Walk slowly and deliberately',
      'Notice 5 things you can see',
      'Notice 3 things you can hear',
      'Feel the ground beneath your feet',
      'Return feeling refreshed',
    ],
  },
  {
    type: 'sleep_hygiene',
    title: 'Sleep Preparation Ritual',
    description: 'Wind down routine to improve sleep quality.',
    duration: '10 min',
    steps: [
      'Put away screens 30 min before bed',
      'Dim the lights in your room',
      'Do 5 minutes of gentle stretching',
      'Write down 3 things from today you\'re grateful for',
      'Practice 4-7-8 breathing in bed',
    ],
  },
  {
    type: 'sleep_hygiene',
    title: 'Power Nap Guide',
    description: 'A quick 15-20 minute nap to restore energy.',
    duration: '20 min',
    steps: [
      'Find a quiet, comfortable spot',
      'Set a timer for 15-20 minutes',
      'Close your eyes and relax your body',
      'Don\'t worry about falling asleep — just rest',
      'Get up when the timer goes off',
    ],
  },
  {
    type: 'grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Use your senses to ground yourself in the present moment.',
    duration: '3 min',
    steps: [
      'Notice 5 things you can SEE',
      'Touch 4 things you can FEEL',
      'Listen for 3 things you can HEAR',
      'Identify 2 things you can SMELL',
      'Notice 1 thing you can TASTE',
    ],
  },
  {
    type: 'grounding',
    title: 'Body Scan',
    description: 'Mentally scan your body to release tension.',
    duration: '5 min',
    steps: [
      'Close your eyes and take 3 deep breaths',
      'Focus attention on the top of your head',
      'Slowly move attention down: forehead, jaw, neck',
      'Continue: shoulders, arms, hands',
      'Then: chest, stomach, hips',
      'Finally: legs, feet, toes',
      'Release any tension you notice',
    ],
  },
  {
    type: 'journaling',
    title: 'Emotional Check-In Journal',
    description: 'Write about your current emotions to process them.',
    duration: '5 min',
    steps: [
      'Write: "Right now, I feel..."',
      'Describe what triggered this feeling',
      'Write: "What I need right now is..."',
      'Write one thing you can do about it',
    ],
  },
  {
    type: 'journaling',
    title: 'Gratitude List',
    description: 'Write 3 things you\'re grateful for today.',
    duration: '3 min',
    steps: [
      'Think about your day so far',
      'Write 3 specific things you\'re grateful for',
      'For each, write WHY you\'re grateful',
      'Read them back to yourself',
    ],
  },
  {
    type: 'social_connection',
    title: 'Reach Out',
    description: 'Send a message to someone you care about.',
    duration: '2 min',
    steps: [
      'Think of a friend or family member',
      'Send them a simple message',
      'Ask how they\'re doing',
      'Connection reduces isolation',
    ],
  },
  {
    type: 'rest',
    title: 'Digital Detox Break',
    description: 'Step away from all screens for a few minutes.',
    duration: '5 min',
    steps: [
      'Put your phone face down',
      'Close your laptop',
      'Look out a window or at nature',
      'Let your mind wander freely',
      'Return to your device when ready',
    ],
  },
];

export function getRecommendedInterventions(
  latestCheckIn: CheckInEntry | null,
  riskScore: RiskScore | null,
  riskIndications: RiskIndication[]
): Intervention[] {
  const recommended: Intervention[] = [];
  const usedTypes = new Set<InterventionType>();

  if (!latestCheckIn) {
    return getInterventionsByType('breathing', 'medium', 1)
      .concat(getInterventionsByType('grounding', 'low', 1));
  }

  if (latestCheckIn.stress >= 4) {
    recommended.push(...getInterventionsByType('breathing', 'high', 1));
    usedTypes.add('breathing');
  }

  if (latestCheckIn.sleepHours < 6) {
    recommended.push(...getInterventionsByType('sleep_hygiene', 'high', 1));
    usedTypes.add('sleep_hygiene');
  }

  if (latestCheckIn.mood <= 2) {
    recommended.push(...getInterventionsByType('journaling', 'high', 1));
    recommended.push(...getInterventionsByType('social_connection', 'medium', 1));
    usedTypes.add('journaling');
    usedTypes.add('social_connection');
  }

  if (['work', 'study', 'rest'].includes(latestCheckIn.activity.toLowerCase())) {
    recommended.push(...getInterventionsByType('movement', 'medium', 1));
    usedTypes.add('movement');
  }

  for (const indication of riskIndications) {
    if (indication.type === 'anxiety' && !usedTypes.has('grounding')) {
      recommended.push(...getInterventionsByType('grounding', 'high', 1));
      usedTypes.add('grounding');
    }
    if (indication.type === 'burnout' && !usedTypes.has('rest')) {
      recommended.push(...getInterventionsByType('rest', 'high', 1));
      usedTypes.add('rest');
    }
    if (indication.type === 'stress_overload' && !usedTypes.has('breathing')) {
      recommended.push(...getInterventionsByType('breathing', 'high', 1));
      usedTypes.add('breathing');
    }
  }

  if (recommended.length === 0) {
    recommended.push(...getInterventionsByType('breathing', 'low', 1));
    recommended.push(...getInterventionsByType('movement', 'low', 1));
  }

  return recommended.slice(0, 4);
}

function getInterventionsByType(
  type: InterventionType,
  priority: 'low' | 'medium' | 'high',
  count: number
): Intervention[] {
  const matching = INTERVENTIONS.filter((i) => i.type === type);
  const shuffled = [...matching].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((i) => ({
    ...i,
    id: generateId(),
    priority,
  }));
}

export function getAllInterventions(): Intervention[] {
  return INTERVENTIONS.map((i) => ({
    ...i,
    id: generateId(),
    priority: 'low' as const,
  }));
}

// ============================================
// Internal Utilities
// ============================================

function computeTrend(values: number[]): Trend {
  if (values.length < 3) return 'stable';
  const { slope } = linearRegression(values);
  if (slope > 0.15) return 'improving';
  if (slope < -0.15) return 'declining';
  return 'stable';
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function computeVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = average(values);
  return values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
}

function linearRegression(values: number[]): { slope: number; intercept: number } {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0 };
  const xMean = (n - 1) / 2;
  const yMean = average(values);
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += (i - xMean) ** 2;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
}
