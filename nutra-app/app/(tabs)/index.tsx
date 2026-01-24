import { StyleSheet, Pressable, View, TextInput, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { EmptyMealsPlaceholder } from '@/components/dashboard/EmptyMealsPlaceholder';

export default function HomeScreen() {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.primary, dark: colors.primary }}
      >
      <ThemedView style={styles.headerRow}>
        <View style={styles.userRow}>
          <Link href="/settings" asChild>
            <Pressable style={StyleSheet.flatten([styles.avatarFallback, { backgroundColor: colors.muted }])}>
              <ThemedText style={StyleSheet.flatten([styles.avatarText, { color: colors.primary }])}>CA</ThemedText>
            </Pressable>
          </Link>
          <View>
            <ThemedText style={styles.hello}>Olá,</ThemedText>
            <ThemedText style={StyleSheet.flatten([styles.userName, { color: colors.foreground }])}>Cas, Bem-vindo!</ThemedText>
          </View>
        </View>
        <Link href="/modal" asChild>
          <Pressable style={StyleSheet.flatten([styles.iconButton, { backgroundColor: colors.secondary, borderColor: colors.border }])}>
            <IconSymbol name="bell.fill" size={22} color={colors.foreground} />
          </Pressable>
        </Link>
      </ThemedView>

      <View style={styles.searchRow}>
        <View style={StyleSheet.flatten([styles.searchBox, { backgroundColor: colors.input, borderColor: colors.border }])}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.mutedForeground} />
          <TextInput
            placeholder="Descreva sua comida"
            placeholderTextColor={colors.mutedForeground}
            style={StyleSheet.flatten([styles.searchInput, { color: colors.foreground }])}
          />
        </View>
      </View>

      <View style={styles.proBanner}>
        <LinearGradient
          colors={['#1f2937', '#111827']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.proText}>
          <ThemedText style={styles.proTitle}>Seja Premium</ThemedText>
          <ThemedText style={styles.proSubtitle}>1 mês grátis e desbloqueie tudo</ThemedText>
          <Pressable style={styles.upgradeButton}>
            <ThemedText style={styles.upgradeText}>Assinar Agora</ThemedText>
          </Pressable>
        </View>
        <View style={styles.ratingBadge}>
          <ThemedText style={styles.ratingText}>4.9 de 5</ThemedText>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=600&fit=crop' }}
          style={styles.proImage}
        />
      </View>

      {/* Dashboard Components */}
      <DailyProgress />
      <WeeklyChart />
      <EmptyMealsPlaceholder />
      
      {/* Bottom spacing for TabBar */}
      <View style={{ height: 100 }} />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hello: {
    fontSize: 14,
    color: '#888',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchRow: {
    marginBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  proBanner: {
    height: 160,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    padding: 20,
    justifyContent: 'center',
  },
  proText: {
    width: '60%',
    zIndex: 2,
  },
  proTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  proSubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  upgradeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ratingBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  proImage: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 140,
    height: 140,
    transform: [{ rotate: '-15deg' }],
    zIndex: 1,
  },
});
