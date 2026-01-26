import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ywfmsuzmujnttaahzopo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Zm1zdXptdWpudHRhYWh6b3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyOTcyNDAsImV4cCI6MjA4NDg3MzI0MH0.OXCFJcVi-e9DyBz3C_Km6EQCTdo_j_lkXKtCZqRqEP0';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Using fallback Supabase credentials. Ensure .env is loaded for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
