import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';

import WelcomeScreen from './src/screens/WelcomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuizGenderScreen from './src/screens/QuizGenderScreen';
import QuizAgeScreen from './src/screens/QuizAgeScreen';
import QuizActivityScreen from './src/screens/QuizActivityScreen';
import QuizSocialProofScreen from './src/screens/QuizSocialProofScreen';
import QuizGoalScreen from './src/screens/QuizGoalScreen';
import QuizGoalWeightScreen from './src/screens/QuizGoalWeightScreen';
import QuizExerciseRoutineScreen from './src/screens/QuizExerciseRoutineScreen';
import QuizAnalysisScreen from './src/screens/QuizAnalysisScreen';
import QuizMeasurementsScreen from './src/screens/QuizMeasurementsScreen';
import QuizCameraScreen from './src/screens/QuizCameraScreen';

export type RootStackParamList = {
  WelcomeScreen: undefined;
  DashboardScreen: undefined;
  QuizGenderScreen: undefined;
  QuizAgeScreen: undefined;
  QuizGoalScreen: undefined;
  QuizActivityScreen: undefined;
  QuizSocialProofScreen: undefined;
  QuizGoalWeightScreen: undefined;
  QuizExerciseRoutineScreen: undefined;
  QuizAnalysisScreen: undefined;
  QuizMeasurementsScreen: undefined;
  QuizCameraScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

import { QuizProvider } from './src/context/QuizContext';

const App = () => {
  return (
    <QuizProvider>
      <SafeAreaProvider>
        <NavigationContainer>
        <Stack.Navigator
          initialRouteName="WelcomeScreen"
          screenListeners={{
            state: () => {
              setTimeout(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }, 250);
            },
          }}
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="QuizGenderScreen" component={QuizGenderScreen} />
          <Stack.Screen name="QuizAgeScreen" component={QuizAgeScreen} />
          <Stack.Screen name="QuizGoalScreen" component={QuizGoalScreen} />
          <Stack.Screen name="QuizActivityScreen" component={QuizActivityScreen} />
        <Stack.Screen name="QuizSocialProofScreen" component={QuizSocialProofScreen} />
        <Stack.Screen name="QuizGoalWeightScreen" component={QuizGoalWeightScreen} />
        <Stack.Screen name="QuizExerciseRoutineScreen" component={QuizExerciseRoutineScreen} />
        <Stack.Screen name="QuizAnalysisScreen" component={QuizAnalysisScreen} />
        <Stack.Screen name="QuizMeasurementsScreen" component={QuizMeasurementsScreen} />
        <Stack.Screen name="QuizCameraScreen" component={QuizCameraScreen} />
          <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </QuizProvider>
  );
};

export default App;
