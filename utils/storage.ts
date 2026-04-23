import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckInEntry } from '../types/types';

const CHECKIN_STORAGE_KEY = '@mindguard_checkins_v2';

export const generateId = () => Math.random().toString(36).substring(2, 15);

export const getTodayDate = () => {
  return new Date().toLocaleString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric', 
    hour: 'numeric', minute: '2-digit' 
  });
};

export const getMoodScale = (mood: string): number => {
  switch (mood) {
    case 'Sad': return 1;
    case 'Neutral': return 2;
    case 'Calm': return 3;
    case 'Good': return 4;
    case 'Great': return 5;
    default: return 3;
  }
};

export const getStressScale = (stress: number): number => {
  // Map stress from 0-10 to 1-5
  if (stress === 0) return 1;
  return Math.max(1, Math.min(5, Math.ceil(stress / 2)));
};

export const saveCheckIn = async (data: { mood: string, sleep: number, stress: number, act: string }) => {
  try {
    const existing = await getCheckIns();
    
    const newCheckIn: CheckInEntry = {
      id: generateId(),
      timestamp: Date.now(),
      date: getTodayDate(),
      mood: getMoodScale(data.mood),
      sleepHours: data.sleep,
      stress: getStressScale(data.stress),
      activity: data.act,
      notes: `Felt ${data.mood.toLowerCase()}, focusing on ${data.act.toLowerCase()}.`,
    };

    const updatedCheckIns = [newCheckIn, ...existing];
    await AsyncStorage.setItem(CHECKIN_STORAGE_KEY, JSON.stringify(updatedCheckIns));
    return newCheckIn;
  } catch (e) {
    console.error('Failed to save check-in', e);
    return null;
  }
};

export const getCheckIns = async (): Promise<CheckInEntry[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CHECKIN_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch check-ins', e);
    return [];
  }
};

export const clearCheckIns = async () => {
  await AsyncStorage.removeItem(CHECKIN_STORAGE_KEY);
};
