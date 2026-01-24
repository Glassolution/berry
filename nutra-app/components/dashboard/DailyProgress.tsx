import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 to 1
  color: string;
  trackColor?: string;
  children?: React.ReactNode;
}

function CircularProgress({ size, strokeWidth, progress, color, trackColor, children }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor || 'rgba(255,255,255,0.1)'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      {children}
    </View>
  );
}

export function DailyProgress() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  // Mock data - replace with store data later
  const calories = { current: 0, target: 3102 };
  const protein = { current: 0, target: 150 };
  const carbs = { current: 0, target: 200 };
  const fat = { current: 0, target: 70 };

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="subtitle">Hoje</ThemedText>
            <ThemedText style={{ color: colors.mutedForeground }}>
              {calories.target - calories.current} kcal restantes
            </ThemedText>
          </View>
          <View style={[styles.flameBadge, { backgroundColor: colors.calories.replace('hsl', 'hsla').replace(')', ', 0.2)') }]}>
             <IconSymbol name="flame" size={16} color={colors.calories} />
             <ThemedText style={{ color: colors.calories, fontWeight: 'bold' }}>0</ThemedText>
          </View>
        </View>

        {/* Charts Row */}
        <View style={styles.chartsRow}>
          {/* Main Calorie Chart */}
          <View style={styles.mainChart}>
            <CircularProgress 
              size={120} 
              strokeWidth={12} 
              progress={calories.current / calories.target} 
              color={colors.calories}
              trackColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            >
              <View style={{ alignItems: 'center' }}>
                <ThemedText type="title" style={{ fontSize: 24, lineHeight: 28 }}>{calories.current}</ThemedText>
                <ThemedText style={{ fontSize: 10, color: colors.mutedForeground }}>/ {calories.target}</ThemedText>
              </View>
            </CircularProgress>
            <ThemedText style={{ marginTop: 8, color: colors.calories, fontWeight: '600' }}>Calorias</ThemedText>
          </View>

          {/* Small Macro Charts */}
          <View style={styles.smallCharts}>
            <View style={styles.smallChartItem}>
              <CircularProgress 
                size={50} 
                strokeWidth={4} 
                progress={protein.current / protein.target} 
                color={colors.protein}
              >
                <ThemedText style={{ fontSize: 12, fontWeight: 'bold' }}>{protein.current}</ThemedText>
              </CircularProgress>
              <ThemedText style={{ fontSize: 10, color: colors.protein, marginTop: 4 }}>Proteína</ThemedText>
            </View>
            <View style={styles.smallChartItem}>
              <CircularProgress 
                size={50} 
                strokeWidth={4} 
                progress={carbs.current / carbs.target} 
                color={colors.carbs}
              >
                <ThemedText style={{ fontSize: 12, fontWeight: 'bold' }}>{carbs.current}</ThemedText>
              </CircularProgress>
              <ThemedText style={{ fontSize: 10, color: colors.carbs, marginTop: 4 }}>Carbos</ThemedText>
            </View>
            <View style={styles.smallChartItem}>
              <CircularProgress 
                size={50} 
                strokeWidth={4} 
                progress={fat.current / fat.target} 
                color={colors.fat}
              >
                <ThemedText style={{ fontSize: 12, fontWeight: 'bold' }}>{fat.current}</ThemedText>
              </CircularProgress>
              <ThemedText style={{ fontSize: 10, color: colors.fat, marginTop: 4 }}>Gordura</ThemedText>
            </View>
          </View>
        </View>

        {/* Footer Stats */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.footerRow}>
            <ThemedText style={{ fontWeight: '600' }}>Proteína</ThemedText>
            <ThemedText style={{ color: colors.protein }}>{protein.current}g</ThemedText>
          </View>
          <View style={styles.footerRow}>
            <ThemedText style={{ fontWeight: '600' }}>Carboidratos</ThemedText>
            <ThemedText style={{ color: colors.carbs }}>{carbs.current}g</ThemedText>
          </View>
          <View style={styles.footerRow}>
            <ThemedText style={{ fontWeight: '600' }}>Gorduras</ThemedText>
            <ThemedText style={{ color: colors.fat }}>{fat.current}g</ThemedText>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  flameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  mainChart: {
    alignItems: 'center',
    flex: 1,
  },
  smallCharts: {
    gap: 16,
  },
  smallChartItem: {
    alignItems: 'center',
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
