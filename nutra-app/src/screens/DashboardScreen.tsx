import React from 'react';
import { StyleSheet, Pressable, View, TextInput, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import FloatingNav from '@/components/floating-nav';

const colors = {
  muted: '#f3f4f6',
  primary: '#22C55E',
  calories: '#16A34A',
};

export default function DashboardScreen() {
  return (
    <>
    <ParallaxScrollView
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
            <ThemedText style={styles.userName}>Cas, Bem-vindo!</ThemedText>
          </View>
        </View>
        <Link href="/modal" asChild>
          <Pressable style={styles.iconButton}>
            <IconSymbol name="bell.fill" size={22} color="#111827" />
          </Pressable>
        </Link>
      </ThemedView>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <IconSymbol name="magnifyingglass" size={18} color="#6b7280" />
          <TextInput
            placeholder="Describe Your Food"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.proBanner}>
        <View style={styles.proText}>
          <ThemedText style={styles.proTitle}>Get Pro Access</ThemedText>
          <ThemedText style={styles.proSubtitle}>Get 1 month free and unlock all pro features</ThemedText>
          <Pressable style={styles.upgradeButton}>
            <ThemedText style={styles.upgradeText}>Upgrade Now</ThemedText>
          </Pressable>
        </View>
        <View style={styles.ratingBadge}>
          <ThemedText style={styles.ratingText}>4.9 out of 5</ThemedText>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?q=80&w=600&fit=crop' }}
          style={styles.proImage}
        />
      </View>

      <View style={styles.categoriesHeader}>
        <ThemedText style={styles.catTitle}>Categories</ThemedText>
        <Pressable>
          <ThemedText style={styles.seeAll}>See all</ThemedText>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catStrip}>
        {[
          { key: 'leaf', label: 'Vegan', color: colors.calories },
          { key: 'bowl', label: 'Carb', color: '#f59e0b' },
          { key: 'dumbbell', label: 'Protein', color: '#3b82f6' },
          { key: 'snack', label: 'Snacks', color: '#ef4444' },
          { key: 'drink', label: 'Drink', color: '#14b8a6' },
        ].map((c) => (
          <View key={c.key} style={styles.catItem}>
            <View style={StyleSheet.flatten([styles.catIcon, { backgroundColor: `${c.color}20` }])}>
              <IconSymbol name={c.key as any} size={22} color={c.color} />
            </View>
            <ThemedText style={styles.catLabel}>{c.label}</ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.cardsGrid}>
        <View style={styles.recipeCard}>
          <View style={styles.recipeText}>
            <ThemedText style={styles.recipeTitle}>Chicken Salad</ThemedText>
            <ThemedText style={styles.recipeCal}>480 kcal</ThemedText>
            <Link href="/recipes" asChild>
              <Pressable style={styles.recipeButton}>
                <ThemedText style={styles.recipeButtonText}>Tell me Recipe</ThemedText>
              </Pressable>
            </Link>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&fit=crop' }}
            style={styles.recipeImage}
          />
        </View>
        <View style={styles.recipeCard}>
          <View style={styles.recipeText}>
            <ThemedText style={styles.recipeTitle}>Herb Omelette</ThemedText>
            <ThemedText style={styles.recipeCal}>300 kcal</ThemedText>
            <Link href="/recipes" asChild>
              <Pressable style={styles.recipeButton}>
                <ThemedText style={styles.recipeButtonText}>Tell me Recipe</ThemedText>
              </Pressable>
            </Link>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600&fit=crop' }}
            style={styles.recipeImage}
          />
        </View>
      </View>
    </ParallaxScrollView>
    <FloatingNav active="index" />
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    backgroundColor: '#0F291E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: '600',
  },
  hello: {
    fontSize: 14,
    color: '#6b7280',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  proBanner: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 28,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  proText: {
    maxWidth: '65%',
    gap: 6,
  },
  proTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  proSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
  },
  upgradeButton: {
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeText: {
    color: '#111827',
    fontWeight: '600',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: '#EDFE37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
  },
  proImage: {
    width: 110,
    height: 110,
    position: 'absolute',
    right: -8,
    top: 18,
    transform: [{ rotate: '12deg' }],
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 12,
    color: '#6b7280',
  },
  catStrip: {
    marginBottom: 16,
  },
  catItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  catIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catLabel: {
    fontSize: 12,
    color: '#111827',
  },
  cardsGrid: {
    gap: 12,
  },
  recipeCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  recipeText: {
    gap: 6,
    maxWidth: '60%',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  recipeCal: {
    fontSize: 12,
    color: '#6b7280',
  },
  recipeButton: {
    marginTop: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  recipeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  recipeImage: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
});

 
