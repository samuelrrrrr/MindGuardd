export interface CheckInEntry {
  id: string;
  timestamp: number;
  date: string;
  mood: number; // 1-5 scale
  sleepHours: number;
  stress: number; // 1-5 scale
  activity: string;
  notes?: string;
}

export type RiskCategory = 'Low' | 'Medium' | 'High';

export interface RiskFactor {
  name: string;
  contribution: number;
  description: string;
}

export interface RiskScore {
  score: number; // 0-100
  category: RiskCategory;
  factors: RiskFactor[];
  timestamp: number;
  date: string;
}

export interface AIInsight {
  id: string;
  timestamp: number;
  condition: string;
  riskLevel: string;
  analysis: string;
  recommendations: string[];
  confidence: number;
  source: 'openai' | 'rule_based';
}

export type Trend = 'improving' | 'declining' | 'stable';

export interface PatternData {
  id: string;
  type: string;
  title: string;
  description: string;
  trend: Trend;
  dataPoints: number;
  detectedAt: number;
}

export interface EmotionalLog {
  id: string;
  timestamp: number;
  emotion: string;
  intensity: number;
  context?: string;
}

export interface RiskIndication {
  type: 'burnout' | 'anxiety' | 'stress_overload' | string;
  severity: 'low' | 'moderate' | 'high';
  confidence: number;
  description: string;
  detectedAt: number;
}

export type InterventionType = 'breathing' | 'movement' | 'sleep_hygiene' | 'grounding' | 'journaling' | 'social_connection' | 'rest';

export interface Intervention {
  id: string;
  type: InterventionType;
  title: string;
  description: string;
  duration: string;
  steps: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface PredictionResult {
  predictedScores: { date: string; score: number }[];
  outlook: 'positive' | 'neutral' | 'negative';
  confidence: number;
  description: string;
}

export interface WhatIfScenario {
  scenario: string;
  currentScore: number;
  predictedScore: number;
  improvement: number;
  description: string;
}
