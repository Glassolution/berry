import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Insight } from '@/src/context/InsightsContext';

// Colors (matching index.tsx)
const COLORS = {
  berryRed: "#ee2b5b",
  berryOrange: "#FF8C42",
  gray700: "#374151",
  white: "#FFFFFF",
  success: "#22C55E",
  info: "#3B82F6",
  warning: "#F59E0B",
};

export const InsightCard = ({ insight, onDismiss }: { insight: Insight; onDismiss?: () => void }) => {
  if (!insight) return null;

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'RECOVERY': return { icon: 'fitness-center', color: COLORS.berryRed };
      case 'AGUA': return { icon: 'local-drink', color: COLORS.info };
      case 'CALORIAS': return { icon: 'local-fire-department', color: COLORS.berryOrange };
      case 'MACROS': return { icon: 'pie-chart', color: COLORS.success };
      case 'CONSISTENCIA': return { icon: 'trending-up', color: COLORS.success };
      default: return { icon: 'auto-awesome', color: COLORS.berryRed };
    }
  };

  const { icon, color } = getIconAndColor(insight.type);

  return (
    <View style={[styles.card, { borderColor: `${color}30`, backgroundColor: `${color}08` }]}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <MaterialIcons name={icon as any} size={24} color="white" />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
            <Text style={[styles.title, { color }]}>{insight.title}</Text>
            {onDismiss && (
                <Pressable onPress={onDismiss} hitSlop={10}>
                    <MaterialIcons name="close" size={16} color={COLORS.gray700} style={{ opacity: 0.5 }} />
                </Pressable>
            )}
        </View>
        <Text style={styles.message}>{insight.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 24,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Manrope_800ExtraBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Manrope_500Medium',
    color: COLORS.gray700,
    lineHeight: 20,
  },
});
