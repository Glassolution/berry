import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/lib/supabase';

export default function AuthCallback() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    if (user) {
      router.replace('/WelcomeMemberScreen');
      return;
    }

    const handleAuth = async () => {
      try {
        console.log('callback params:', params);
        const { code, error, error_description } = params;

        if (error) {
          console.error('Auth error:', error_description || error);
          router.replace('/QuizSaveProgressScreen'); // Voltar em caso de erro
          return;
        }

        if (code) {
          const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code as string);
          if (sessionError) {
             console.log(sessionError);
             throw sessionError;
          }
          router.replace('/WelcomeMemberScreen');
        } else {
          router.replace('/QuizSaveProgressScreen');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.replace('/QuizSaveProgressScreen');
      }
    };

    handleAuth();
  }, [user, params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
      <Text style={styles.text}>Autenticando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontFamily: 'PlusJakartaSans-Regular', // Assuming font exists, or system font
  },
});
