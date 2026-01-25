import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

import { AppThemeProvider, useTheme } from '@/context/ThemeContext';
import { QuizProvider } from '@/src/context/QuizContext';
import { AuthProvider } from '@/src/context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme } = useTheme();

  return (
    <QuizProvider>
      <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="settings" options={{ title: 'Configurações', headerShown: true }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
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
          <Stack.Screen name="QuizSaveProgressScreen" />
          <Stack.Screen name="login" options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} />
          <Stack.Screen name="WelcomeMemberScreen" options={{ animation: 'fade' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </QuizProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </AppThemeProvider>
  );
}
