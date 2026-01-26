import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function WeeklyChart() {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={StyleSheet.flatten([styles.container, { backgroundColor: isDark ? '#161616' : '#F8F8F8', borderColor: isDark ? '#27272a' : '#f3f4f6' }])}>
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="subtitle">Semana</ThemedText>
          <View style={styles.legend}>
             <View style={styles.legendItem}>
               <View style={StyleSheet.flatten([styles.dot, { backgroundColor: colors.calories }])} />
               <ThemedText style={{ fontSize: 10, color: colors.mutedForeground }}>Dia: 3.102 kcal</ThemedText>
             </View>
             <View style={styles.legendItem}>
               <View style={StyleSheet.flatten([styles.dot, { backgroundColor: colors.calories }])} />
               <ThemedText style={{ fontSize: 10, color: colors.mutedForeground }}>Semana: 21.714 kcal</ThemedText>
             </View>
          </View>
        </View>

        {/* Chart Area */}
        <View style={styles.chartArea}>
           {/* Dashed Target Line */}
           <View style={styles.targetLineContainer}>
             <ThemedText style={StyleSheet.flatten([styles.targetLabel, { color: colors.calories }])}>3.200</ThemedText>
             <View style={StyleSheet.flatten([styles.dashedLine, { borderColor: colors.calories }])} />
           </View>

           {/* Middle Label */}
           <View style={styles.midLabelContainer}>
              <ThemedText style={styles.targetLabel}>1.500</ThemedText>
              <View style={StyleSheet.flatten([styles.gridLine, { backgroundColor: colors.border }])} />
           </View>
           
           {/* Bottom Label */}
           <View style={styles.bottomLabelContainer}>
              <ThemedText style={styles.targetLabel}>0</ThemedText>
              <View style={StyleSheet.flatten([styles.gridLine, { backgroundColor: colors.border }])} />
           </View>

           {/* X Axis Labels */}
           <View style={styles.xAxis}>
             {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
               <ThemedText key={day} style={{ fontSize: 10, color: colors.mutedForeground }}>{day}</ThemedText>
             ))}
           </View>
        </View>

        {/* Summary Stats */}
        <View style={StyleSheet.flatten([styles.summary, { borderTopColor: colors.border }])}>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold">0</ThemedText>
            <ThemedText style={styles.statLabel}>Dias ativos</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold">0</ThemedText>
            <ThemedText style={styles.statLabel}>Calorias totais</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold">0g</ThemedText>
            <ThemedText style={styles.statLabel}>Proteína total</ThemedText>
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
  legend: {
    alignItems: 'flex-end',
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chartArea: {
    height: 200,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  targetLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetLabel: {
    fontSize: 10,
    width: 30,
    textAlign: 'right',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  gridLine: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
  midLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 38, // Match label width + gap
    paddingTop: 8,
  },
  summary: {
    borderTopWidth: 1,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
