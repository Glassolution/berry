import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';
import Svg, { Line, Circle, Text as SvgText, G } from 'react-native-svg';

function calculateBMR(weight: number, height: number, age: number, male: boolean) {
  return male
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
}

function calculateTDEE(bmr: number, activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive') {
  const factors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return Math.round(bmr * factors[activity]);
}

export default function ProgressScreen() {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  const [goalCalories, setGoalCalories] = useState('3102');
  const [age, setAge] = useState('17');
  const [weight, setWeight] = useState('70');
  const [goalWeight, setGoalWeight] = useState('70');
  const [height, setHeight] = useState('190');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'>('moderate');

  // Weight Progress State
  const [currentDate, setCurrentDate] = useState('22/01');
  const [currentWeightInput, setCurrentWeightInput] = useState('70');

  // Derived calculations
  const numericWeight = parseFloat(weight) || 0;
  const numericHeight = parseFloat(height) || 0;
  const numericAge = parseFloat(age) || 0;

  const bmr = useMemo(() => calculateBMR(numericWeight, numericHeight, numericAge, sex === 'male'), [numericWeight, numericHeight, numericAge, sex]);
  const tdee = useMemo(() => calculateTDEE(bmr, activity), [bmr, activity]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.background, dark: colors.background }}
      headerImage={
        <IconSymbol
          size={280}
          color={colors.primary}
          name="chart.bar.fill"
          style={StyleSheet.flatten([styles.headerImage, { opacity: 0.1 }])}
        />
      }>
      
      {/* Header Title Area */}
      <View style={styles.headerRow}>
        <ThemedText type="title" style={{ fontSize: 32 }}>Progresso</ThemedText>
        <View style={StyleSheet.flatten([
          styles.goalBadge, 
          { 
            backgroundColor: colors.primary.replace('hsl', 'hsla').replace(')', ', 0.1)'), 
          }
        ])}>
          <IconSymbol name="flame" size={16} color={colors.primary} />
          <ThemedText style={StyleSheet.flatten([styles.goalBadgeText, { color: colors.primary }])}>{goalCalories} kcal meta</ThemedText>
        </View>
      </View>

      {/* Metas Nutricionais Card */}
      <View style={StyleSheet.flatten([styles.card, { borderColor: colors.border, backgroundColor: colors.card }])}>
        <View style={styles.cardContent}>
          <ThemedText style={styles.cardTitle}>Metas Nutricionais</ThemedText>
          
          <View style={styles.field}>
            <ThemedText style={styles.label}>Meta diária de calorias (kcal)</ThemedText>
            <TextInput
              style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
              keyboardType="number-pad"
              value={goalCalories}
              onChangeText={setGoalCalories}
              placeholderTextColor={colors.icon}
            />
          </View>
          
          <ThemedText style={styles.helperText}>
            Ajuste educativo da meta diária. Valores são estimativos.
          </ThemedText>
        </View>
      </View>

      {/* Calculadora de Metas Card */}
      <View style={StyleSheet.flatten([styles.card, { borderColor: colors.border, backgroundColor: colors.card }])}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleRow}>
              <ThemedText style={styles.cardTitle}>Calculadora de Metas</ThemedText>
            </View>
            <ThemedText style={styles.metaWeightText}>Meta: {goalWeight} kg</ThemedText>
          </View>

          <View style={styles.grid}>
            {/* Row 1 */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText style={styles.label}>Idade</ThemedText>
                <TextInput
                  style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={setAge}
                  placeholderTextColor={colors.icon}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText style={styles.label}>Peso (kg)</ThemedText>
                <TextInput
                  style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                  placeholderTextColor={colors.icon}
                />
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText style={styles.label}>Meta de peso (kg)</ThemedText>
                <TextInput
                  style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
                  keyboardType="decimal-pad"
                  value={goalWeight}
                  onChangeText={setGoalWeight}
                  placeholderTextColor={colors.icon}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <ThemedText style={styles.label}>Altura (cm)</ThemedText>
                <TextInput
                  style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
                  keyboardType="number-pad"
                  value={height}
                  onChangeText={setHeight}
                  placeholderTextColor={colors.icon}
                />
              </View>
            </View>

            {/* Sex Select */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Sexo</ThemedText>
              <Pressable 
                style={StyleSheet.flatten([styles.selectInput, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', borderColor: colors.border }])}
                onPress={() => setSex(prev => prev === 'male' ? 'female' : 'male')}
              >
                <ThemedText style={{ color: colors.text }}>{sex === 'male' ? 'Masculino' : 'Feminino'}</ThemedText>
                <IconSymbol name="chevron.down" size={20} color={colors.text} />
              </Pressable>
            </View>

            {/* Activity Select */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Nível de atividade</ThemedText>
              <Pressable 
                style={StyleSheet.flatten([styles.selectInput, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', borderColor: colors.border }])}
                onPress={() => {
                   const levels = ['sedentary', 'light', 'moderate', 'active', 'veryActive'] as const;
                   const currentIndex = levels.indexOf(activity);
                   const nextIndex = (currentIndex + 1) % levels.length;
                   setActivity(levels[nextIndex]);
                }}
              >
                <ThemedText style={{ color: colors.text }}>
                  {activity === 'sedentary' ? 'Sedentário (Pouco exercício)' : 
                   activity === 'light' ? 'Levemente ativo (1-3 dias/sem)' : 
                   activity === 'moderate' ? 'Moderadamente ativo (3-4 dias/sem)' : 
                   activity === 'active' ? 'Muito ativo (6-7 dias/sem)' : 'Extremamente ativo'}
                </ThemedText>
                <IconSymbol name="chevron.down" size={20} color={colors.text} />
              </Pressable>
              <ThemedText style={styles.activityNote}>Dias/semana: 3-4 dias/semana</ThemedText>
            </View>

            {/* Goal Estimates Cards - Vertical Stack */}
            <View style={styles.goalsContainer}>
              <View style={{ flexDirection: 'column', gap: 12 }}>
                {[
                  { title: 'Emagrecimento', cal: '2.302', p: 201, c: 201, g: 77 },
                  { title: 'Manutenção', cal: '2.802', p: 210, c: 281, g: 93 },
                  { title: 'Hipertrofia', cal: '3.102', p: 233, c: 349, g: 86 },
                ].map((item) => (
                  <View key={item.title} style={StyleSheet.flatten([styles.goalCard, { width: '100%', borderColor: colors.border, backgroundColor: isDark ? '#111827' : '#f9fafb' }])}>
                    <View style={styles.goalHeader}>
                      <View>
                        <ThemedText style={styles.goalTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.goalSubtitle}>Estimativa educativa</ThemedText>
                      </View>
                      <View style={StyleSheet.flatten([
                        styles.miniGoalBadge, 
                        { 
                          backgroundColor: colors.primary.replace('hsl', 'hsla').replace(')', ', 0.1)'), 
                        }
                      ])}>
                         <IconSymbol name="flame" size={14} color={colors.primary} />
                         <ThemedText style={StyleSheet.flatten([styles.miniGoalBadgeText, { color: colors.primary }])}>{item.cal} kcal</ThemedText>
                      </View>
                    </View>
                    <View style={styles.macrosRow}>
                      <ThemedText style={StyleSheet.flatten([styles.macroText, { color: colors.protein }])}>P: {item.p}g</ThemedText>
                      <ThemedText style={StyleSheet.flatten([styles.macroText, { color: colors.carbs }])}>C: {item.c}g</ThemedText>
                      <ThemedText style={StyleSheet.flatten([styles.macroText, { color: colors.fat }])}>G: {item.g}g</ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            
            <ThemedText style={styles.footerNote}>
              Os valores são educativos e estimativos; ajuste conforme sua preferência.
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Progresso de Peso Card */}
      <View style={StyleSheet.flatten([styles.card, { borderColor: colors.border, backgroundColor: colors.card }])}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleRow}>
              {/* <IconSymbol name="chart.bar.fill" size={20} color={colors.icon} style={{ marginRight: 8 }} /> */}
              <ThemedText style={styles.cardTitle}>Progresso de Peso</ThemedText>
            </View>
          </View>

          {/* Big Date and Weight Display */}
          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <ThemedText style={{ fontSize: 16, opacity: 0.6, marginBottom: 4 }}>{currentDate}</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
               <ThemedText style={{ fontSize: 64, fontWeight: 'bold', lineHeight: 74 }}>{currentWeightInput}</ThemedText>
               <ThemedText style={{ fontSize: 24, fontWeight: '600', marginLeft: 4, opacity: 0.8 }}>kg</ThemedText>
            </View>
          </View>

          {/* Chart Area - Below Weight */}
          <View style={{ height: 220, marginVertical: 16 }}>
             <Svg height="100%" width="100%">
                {/* Grid Lines */}
                <Line x1="10%" y1="20%" x2="100%" y2="20%" stroke={colors.border} strokeWidth="1" strokeDasharray="4, 4" />
                <Line x1="10%" y1="50%" x2="100%" y2="50%" stroke={colors.border} strokeWidth="1" strokeDasharray="4, 4" />
                <Line x1="10%" y1="80%" x2="100%" y2="80%" stroke={colors.border} strokeWidth="1" strokeDasharray="4, 4" />
                
                {/* Y Axis Labels */}
                <SvgText x="0" y="20%" fill={colors.text} fontSize="12" dy="4">72</SvgText>
                <SvgText x="0" y="50%" fill={colors.text} fontSize="12" dy="4">70</SvgText>
                <SvgText x="0" y="80%" fill={colors.text} fontSize="12" dy="4">68</SvgText>

                {/* X Axis Label */}
                <SvgText x="50%" y="95%" fill={colors.text} fontSize="12" textAnchor="middle">{currentDate}</SvgText>

                {/* Data Point */}
                <Circle cx="50%" cy="50%" r="4" fill={colors.primary} stroke={colors.card} strokeWidth="2" />
             </Svg>
          </View>

          {/* Input Fields (Secondary) */}
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <ThemedText style={styles.label}>Data</ThemedText>
              <TextInput
                style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
                value={currentDate}
                onChangeText={setCurrentDate}
                placeholderTextColor={colors.icon}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <ThemedText style={styles.label}>Peso (kg)</ThemedText>
              <TextInput
                style={StyleSheet.flatten([styles.input, { backgroundColor: isDark ? '#1f2937' : '#f3f4f6', color: colors.text, borderColor: colors.border }])}
                keyboardType="decimal-pad"
                value={currentWeightInput}
                onChangeText={setCurrentWeightInput}
                placeholderTextColor={colors.icon}
              />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>70 kg</ThemedText>
              <ThemedText style={styles.statLabel}>Inicial</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>70 kg</ThemedText>
              <ThemedText style={styles.statLabel}>Atual</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>0</ThemedText>
              <ThemedText style={styles.statLabel}>Variação (kg)</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.helperText}>
            Registro educativo e estimativo.
          </ThemedText>
        </View>
      </View>

      {/* Info Box */}
      <View style={StyleSheet.flatten([styles.infoBox, { backgroundColor: isDark ? '#111827' : '#e5e7eb', borderColor: colors.border }])}>
        <ThemedText style={{ textAlign: 'center', opacity: 0.8 }}>
          A análise é educativa. Use como referência para ajustar sua rotina.
        </ThemedText>
      </View>

      {/* Save Button */}
      <Pressable style={({ pressed }) => StyleSheet.flatten([styles.saveButton, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }])}>
        <ThemedText style={{ color: colors.primaryForeground, fontSize: 16, fontWeight: '600' }}>Salvar</ThemedText>
      </Pressable>
      
      {/* Footer spacing */}
      <View style={{ height: 100 }} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -80,
    right: -30,
    position: 'absolute',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  goalBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    gap: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  metaWeightText: {
    fontSize: 14,
    opacity: 0.7,
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  helperText: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: -4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  infoBox: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityNote: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  goalsContainer: {
    marginTop: 8,
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  goalCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  miniGoalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniGoalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 16,
  },
  macroText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 8,
  },
});
