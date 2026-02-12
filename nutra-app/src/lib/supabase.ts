import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://shfhvlogmkfnqxcuumfl.supabase.co';
const fallbackSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmh2bG9nbWtmbnF4Y3V1bWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjM4NDksImV4cCI6MjA4MDk5OTg0OX0.ialrVY_ntBQ6vKkB5RxyyKXbAQSRMTM3fCKS2MYgM5o';

const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseUrl = envUrl === fallbackSupabaseUrl ? envUrl : fallbackSupabaseUrl;
export const supabaseAnonKey = envKey === fallbackSupabaseAnonKey ? envKey : fallbackSupabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
