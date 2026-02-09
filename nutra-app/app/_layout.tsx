import 'react-native-url-polyfill/auto';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { useEffect, useRef, useState } from 'react';
import { Manrope_300Light, Manrope_400Regular, Manrope_500Medium, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

import { AppThemeProvider, useTheme } from '@/context/ThemeContext';
import { QuizProvider } from '@/src/context/QuizContext';
import { NutritionProvider } from '@/src/context/NutritionContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { useQuiz } from '@/src/context/QuizContext';
import { supabase } from '@/src/lib/supabase';
import { calculateDietPlan, DietPlan } from '@/src/utils/nutritionCalculations';

WebBrowser.maybeCompleteAuthSession();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme } = useTheme();
  const { session, loading, isSigningOut } = useAuth();
  const { updateQuizData } = useQuiz();
  const segments = useSegments();
  const router = useRouter();
  const [bootstrapping, setBootstrapping] = useState(false);
  const hasBootstrappedRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    const inTabsGroup = segments[0] === '(tabs)';
    const protectedScreens = ['settings', 'modal'];
    const inProtectedScreen = protectedScreens.includes(segments[0] as string);

    console.log('Layout Check:', { session: !!session, segment: segments[0], inTabsGroup, inProtectedScreen, isSigningOut });

    if (isSigningOut) {
      if (segments[0] !== 'login') {
        router.replace('/login');
      }
      return;
    }

    if (!session && (inTabsGroup || inProtectedScreen)) {
      console.log('Redirecting to /welcome (not logged in)');
      router.replace('/welcome');
    } else if (
      session &&
      (segments[0] === 'welcome' || segments[0] === 'login' || segments[0] === 'register') &&
      !hasBootstrappedRef.current
    ) {
      return;
    } else if (!bootstrapping && session && (segments[0] === 'welcome' || segments[0] === 'login' || segments[0] === 'register')) {
      console.log('Redirecting to /(tabs) (logged in)');
      router.replace('/(tabs)');
    }
  }, [session, loading, segments, isSigningOut, bootstrapping, router]);

  useEffect(() => {
    if (loading) return;
    if (!session?.user?.id) return;
    if (hasBootstrappedRef.current) return;

    let cancelled = false;
    setBootstrapping(true);

    const run = async () => {
      try {
        const userId = session.user.id;

        const { data, error } = await supabase
          .from('profiles')
          .select('quiz_data')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.warn('Erro ao carregar profile:', error);
          return;
        }

        const quizDataFromDb = (data?.quiz_data ?? {}) as any;
        updateQuizData(quizDataFromDb);

        const missingDietFields =
          !Array.isArray(quizDataFromDb?.restrictions) ||
          typeof quizDataFromDb?.dietPreference !== 'string' ||
          !Array.isArray(quizDataFromDb?.foodsLike) ||
          !Array.isArray(quizDataFromDb?.foodsDislike) ||
          ![3, 4, 5, 6].includes(Number(quizDataFromDb?.mealsPerDay));

        const activeDietPlan = quizDataFromDb?.activeDietPlan as DietPlan | undefined;
        const hasActivePlan = !!activeDietPlan?.calories && Array.isArray(activeDietPlan?.meals);

        const currentSegment = segments[0] as string | undefined;
        const inQuizFlow = typeof currentSegment === 'string' && currentSegment.startsWith('Quiz');

        if (!inQuizFlow && currentSegment !== 'diet-onboarding' && missingDietFields) {
          router.replace('/diet-onboarding');
          return;
        }

        if (!inQuizFlow && currentSegment !== 'diet-onboarding' && !missingDietFields && !hasActivePlan) {
          const plan = calculateDietPlan(
            quizDataFromDb.gender,
            quizDataFromDb.age,
            quizDataFromDb.height,
            quizDataFromDb.weight,
            quizDataFromDb.goalWeight,
            quizDataFromDb.activityLevel,
            {
              restrictions: quizDataFromDb.restrictions,
              restrictionOtherText: quizDataFromDb.restrictionOtherText,
              dietPreference: quizDataFromDb.dietPreference,
              foodsLike: quizDataFromDb.foodsLike,
              foodsDislike: quizDataFromDb.foodsDislike,
              mealsPerDay: quizDataFromDb.mealsPerDay,
              budget: quizDataFromDb.budget,
            }
          );

          const mergedQuizData = { ...quizDataFromDb, activeDietPlan: plan };

          const { error: saveError } = await supabase.from('profiles').upsert({
            id: userId,
            quiz_data: mergedQuizData,
            updated_at: new Date(),
          });

          if (saveError) {
            console.warn('Erro ao salvar plano no profile:', saveError);
          } else {
            updateQuizData({ activeDietPlan: plan } as any);
          }

          if (currentSegment !== 'diet') {
            router.replace('/diet');
          }
          return;
        }
      } finally {
        if (!cancelled) {
          hasBootstrappedRef.current = true;
          setBootstrapping(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [loading, session?.user?.id, segments, router, updateQuizData]);

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="settings" options={{ title: 'Configurações', headerShown: true }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
        <Stack.Screen name="diet" />
        <Stack.Screen name="diet-onboarding" />
        <Stack.Screen name="QuizGenderScreen" />
        <Stack.Screen name="QuizAgeScreen" />
        <Stack.Screen name="QuizGoalScreen" />
        <Stack.Screen name="QuizActivityScreen" />
        <Stack.Screen name="QuizSocialProofScreen" />
        <Stack.Screen name="QuizGoalWeightScreen" />
        <Stack.Screen name="QuizExerciseRoutineScreen" />
        <Stack.Screen name="QuizAnalysisScreen" />
        <Stack.Screen name="QuizMeasurementsScreen" />
        <Stack.Screen name="QuizCameraScreen" />
        <Stack.Screen name="QuizScanResultScreen" />
        <Stack.Screen name="QuizAddActivityScreen" />
        <Stack.Screen name="QuizPlanReadyScreen" />
        <Stack.Screen name="QuizDietPlanScreen" />
        <Stack.Screen name="QuizSaveProgressScreen" />
        <Stack.Screen name="login" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', headerShown: false }} />
        <Stack.Screen name="register" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom', headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <AuthProvider>
        <QuizProvider>
          <NutritionProvider>
            <RootLayoutNav />
          </NutritionProvider>
        </QuizProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}
