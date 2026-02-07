import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// FORCE OVERRIDE to ensure correct credentials are used
const supabaseUrl = 'https://shfhvlogmkfnqxcuumfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmh2bG9nbWtmbnF4Y3V1bWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjM4NDksImV4cCI6MjA4MDk5OTg0OX0.ialrVY_ntBQ6vKkB5RxyyKXbAQSRMTM3fCKS2MYgM5o';

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://shfhvlogmkfnqxcuumfl.supabase.co';
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmh2bG9nbWtmbnF4Y3V1bWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjM4NDksImV4cCI6MjA4MDk5OTg0OX0.ialrVY_ntBQ6vKkB5RxyyKXbAQSRMTM3fCKS2MYgM5o';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Using fallback Supabase credentials. Ensure .env is loaded for production.');
}

console.log('Supabase Config:', { supabaseUrl }); // Debug log to confirm update

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
