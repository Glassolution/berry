import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import StreakCelebration from '@/components/StreakCelebration';

type StreakData = {
  streakDays: number;
  lastStreakAt: string | null;
};

type RecordTodayResult =
  | { status: 'incremented'; streakDays: number }
  | { status: 'already_lit'; streakDays: number }
  | { status: 'failed'; streakDays: number };

type StreakContextType = {
  streakDays: number;
  lastStreakAt: string | null;
  isLitToday: boolean;
  color: string;
  recordToday: () => Promise<RecordTodayResult>;
  refresh: () => Promise<void>;
};

const StreakContext = createContext<StreakContextType | undefined>(undefined);

const pad2 = (value: number) => String(value).padStart(2, '0');

const toDateKey = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const parseDateKey = (key: string) => {
  const [y, m, d] = key.split('-').map((p) => Number(p));
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

const dayDiff = (fromKey: string, toKey: string) => {
  const from = parseDateKey(fromKey);
  const to = parseDateKey(toKey);
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / 86400000);
};

const isMissingTableError = (error: any) => {
  const msg = String(error?.message ?? '');
  return (
    msg.includes("Could not find the table 'public.streaks'") ||
    msg.includes("Could not find the table 'streaks'") ||
    msg.includes('schema cache') && msg.includes('streaks') ||
    msg.includes('relation "public.streaks" does not exist') ||
    msg.includes('relation "streaks" does not exist')
  );
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '').trim();
  const full = normalized.length === 3 ? normalized.split('').map((c) => c + c).join('') : normalized;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const to = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
};

const lerpHex = (from: string, to: string, t: number) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t));
};

const getStreakColor = (days: number) => {
  if (days <= 0) return '#CBD5E1';
  const stops = [
    { d: 1, c: '#FF8A3D' },
    { d: 30, c: '#FF6A00' },
    { d: 100, c: '#FFD166' },
    { d: 150, c: '#FF4D8D' },
    { d: 200, c: '#6D5BFF' },
  ];

  if (days >= 200) return stops[stops.length - 1].c;

  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (days >= a.d && days <= b.d) {
      const t = clamp01((days - a.d) / (b.d - a.d));
      return lerpHex(a.c, b.c, t);
    }
  }

  return stops[0].c;
};

const getStorageKey = (userId: string | null) => `berry_streak_v1:${userId ?? 'anon'}`;

const readLocal = async (key: string): Promise<StreakData | null> => {
  try {
    if (Platform.OS === 'web') {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (!raw) return null;
      return JSON.parse(raw) as StreakData;
    }
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as StreakData;
  } catch {
    return null;
  }
};

const writeLocal = async (key: string, value: StreakData) => {
  const raw = JSON.stringify(value);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, raw);
    return;
  }
  await AsyncStorage.setItem(key, raw);
};

export const StreakProvider = ({ userId, children }: { userId: string | null; children: React.ReactNode }) => {
  const [streakDays, setStreakDays] = useState(0);
  const [lastStreakAt, setLastStreakAt] = useState<string | null>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const loadingRef = useRef(false);

  const lastKey = useMemo(() => (lastStreakAt ? toDateKey(new Date(lastStreakAt)) : null), [lastStreakAt]);
  const isLitToday = lastKey != null && lastKey === toDateKey(new Date());
  const color = useMemo(() => getStreakColor(streakDays), [streakDays]);

  const persistSupabase = async (uid: string, payload: StreakData) => {
    const { error } = await supabase
      .from('streaks')
      .upsert({
        user_id: uid,
        streak_days: payload.streakDays,
        last_streak_at: payload.lastStreakAt,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
  };

  const loadSupabase = async (uid: string): Promise<StreakData | null> => {
    const { data, error } = await supabase
      .from('streaks')
      .select('streak_days,last_streak_at')
      .eq('user_id', uid)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { streakDays: 0, lastStreakAt: null };

    return {
      streakDays: Number(data.streak_days) || 0,
      lastStreakAt: typeof data.last_streak_at === 'string' ? data.last_streak_at : null,
    };
  };

  const applyResetIfNeeded = async (current: StreakData) => {
    if (!current.lastStreakAt || current.streakDays <= 0) return current;
    const now = new Date();
    const nowKey = toDateKey(now);
    const lk = toDateKey(new Date(current.lastStreakAt));
    const diff = dayDiff(lk, nowKey);
    if (diff >= 2) {
      return { streakDays: 0, lastStreakAt: null };
    }
    return current;
  };

  const refresh = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const storageKey = getStorageKey(userId);
      let loaded: StreakData | null = null;

      if (userId) {
        try {
          loaded = await loadSupabase(userId);
        } catch (e: any) {
          if (!isMissingTableError(e)) {
            loaded = null;
          }
        }
      }

      if (!loaded) {
        loaded = (await readLocal(storageKey)) ?? { streakDays: 0, lastStreakAt: null };
      }

      const normalized = await applyResetIfNeeded(loaded);
      setStreakDays(normalized.streakDays);
      setLastStreakAt(normalized.lastStreakAt);

      if (normalized.streakDays !== loaded.streakDays || normalized.lastStreakAt !== loaded.lastStreakAt) {
        await writeLocal(storageKey, normalized);
        if (userId) {
          try {
            await persistSupabase(userId, normalized);
          } catch {}
        }
      }
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  const recordToday = async (): Promise<RecordTodayResult> => {
    const now = new Date();
    const nowKey = toDateKey(now);
    const current: StreakData = { streakDays, lastStreakAt };

    if (current.lastStreakAt) {
      const lk = toDateKey(new Date(current.lastStreakAt));
      if (lk === nowKey) {
        return { status: 'already_lit', streakDays: current.streakDays };
      }
    }

    let baseDays = current.streakDays;
    if (current.lastStreakAt) {
      const lk = toDateKey(new Date(current.lastStreakAt));
      const diff = dayDiff(lk, nowKey);
      if (diff >= 2) baseDays = 0;
    }

    const next: StreakData = {
      streakDays: Math.max(0, baseDays) + 1,
      lastStreakAt: now.toISOString(),
    };

    const storageKey = getStorageKey(userId);

    try {
      setStreakDays(next.streakDays);
      setLastStreakAt(next.lastStreakAt);
      await writeLocal(storageKey, next);
      setCelebrationVisible(true);

      if (userId) {
        try {
          await persistSupabase(userId, next);
        } catch (e: any) {
          if (!isMissingTableError(e)) throw e;
        }
      }
      return { status: 'incremented', streakDays: next.streakDays };
    } catch {
      return { status: 'failed', streakDays: current.streakDays };
    }
  };

  const value = useMemo<StreakContextType>(
    () => ({
      streakDays,
      lastStreakAt,
      isLitToday,
      color,
      recordToday,
      refresh,
    }),
    [streakDays, lastStreakAt, isLitToday, color]
  );

  return (
    <StreakContext.Provider value={value}>
      {children}
      <StreakCelebration
        visible={celebrationVisible}
        streakDays={streakDays}
        color={color}
        onDone={() => setCelebrationVisible(false)}
      />
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within StreakProvider');
  return ctx;
};
