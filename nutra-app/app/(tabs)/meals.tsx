import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput, Image, ImageStyle, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(isDark);
  const [selectedFruit, setSelectedFruit] = useState('strawberry');

  const colors = {
    background: isDark ? '#0A0A0A' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    textSecondary: isDark ? '#A1A1AA' : '#9CA3AF', // gray-400
    card: isDark ? '#161616' : '#F8F8F8',
    border: isDark ? '#27272a' : '#f3f4f6', // gray-100/zinc-800
    primary: isDark ? '#FFFFFF' : '#000000',
    primaryForeground: isDark ? '#000000' : '#FFFFFF',
    accent: '#FF4D8D',
  };

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <View style={StyleSheet.flatten([styles.avatarContainer, { borderColor: isDark ? '#27272a' : '#f3f4f6' }])}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFkXKqekglN6NYXK7weGZ0etF87-SjSQLWaf5_jRQpWlv9TBz6GMUohAUVXuGkO7IY7QmAoaQxY5Qg7xOoayL9PVJgQvWQF98JzLLdFubwnAc0EE8edyknq3-NDObQlQYQmzNRJNDIL5NuKFzTLhFbhnl1TeaZkpNi0eOVzqzwKIfp6dC11jZ6DzRtG3JQFJKmRm-ue38YKq23LWMQcz5iu9-AyiphEhjTuZxnTiQzV0YX5BeirddvRwicmSV4KKtbWYpAnuP9k3R7' }}
                style={styles.avatarImage as ImageStyle}
              />
            </View>
            <View>
              <ThemedText style={StyleSheet.flatten([styles.hello, { color: colors.textSecondary }])}>BEM-VINDO</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.userName, { color: colors.text }])}>Floyd Miles</ThemedText>
            </View>
          </View>
          <Pressable style={StyleSheet.flatten([styles.iconButton, { 
            borderColor: colors.border
          }])}>
            <MaterialIcons name="notifications-none" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Search & Assistant */}
        <View style={styles.searchRow}>
          <View style={StyleSheet.flatten([styles.searchBox, { 
            backgroundColor: isDark ? '#18181b' : '#ffffff', // Not strictly following HTML bg-gray-50 but matching dark mode logic
            borderColor: colors.border
          }])}>
            <MaterialIcons name="search" size={24} color="#9ca3af" style={{ marginLeft: 16 }} />
            <TextInput
              placeholder="O que você comeu?"
              placeholderTextColor="#9ca3af"
              style={StyleSheet.flatten([styles.searchInput, { color: colors.text }])}
            />
          </View>
          <Pressable style={StyleSheet.flatten([styles.assistantButton, { backgroundColor: colors.primary }])}>
            <MaterialIcons name="auto-awesome" size={24} color={colors.primaryForeground} />
          </Pressable>
        </View>

        {/* Calories Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsInfo}>
            <View style={styles.statsValueRow}>
              <ThemedText style={StyleSheet.flatten([styles.statsValue, { color: colors.text }])}>1250</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.statsTarget, { color: colors.textSecondary }])}>/ 2500</ThemedText>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.statsLabel, { color: colors.textSecondary }])}>KCAL RESTANTES HOJE</ThemedText>
          </View>
          
          <View style={styles.chartContainer}>
            <Svg width={96} height={96} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx="50"
                cy="50"
                r="44"
                stroke={isDark ? '#27272a' : '#f3f4f6'}
                strokeWidth="5"
                fill="transparent"
              />
              <Circle
                cx="50"
                cy="50"
                r="44"
                stroke={colors.primary}
                strokeWidth="7"
                strokeDasharray={251.2}
                strokeDashoffset={100}
                strokeLinecap="round"
                fill="transparent"
              />
            </Svg>
            <View style={styles.chartIconContainer}>
              <MaterialIcons name="local-fire-department" size={24} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* Macro Cards Grid */}
        <View style={styles.macroGrid}>
          {/* Protein */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={48} height={48} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                <Circle cx="50" cy="50" r="42" stroke={colors.primary} strokeWidth="6" strokeDasharray={125.6} strokeDashoffset={40} strokeLinecap="round" fill="transparent" />
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="restaurant-menu" size={18} color={colors.text} />
              </View>
            </View>
            <View style={styles.macroTextCenter}>
              <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>PROTEÍNA</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>75g</ThemedText>
            </View>
          </View>

          {/* Carbs */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={48} height={48} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                <Circle cx="50" cy="50" r="42" stroke={colors.primary} strokeWidth="6" strokeDasharray={125.6} strokeDashoffset={60} strokeLinecap="round" fill="transparent" />
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="grass" size={18} color={colors.text} />
              </View>
            </View>
            <View style={styles.macroTextCenter}>
              <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>CARBOS</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>138g</ThemedText>
            </View>
          </View>

          {/* Fat */}
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={48} height={48} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={isDark ? '#27272a' : '#f3f4f6'} strokeWidth="4" fill="transparent" />
                <Circle cx="50" cy="50" r="42" stroke={colors.primary} strokeWidth="6" strokeDasharray={125.6} strokeDashoffset={80} strokeLinecap="round" fill="transparent" />
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="opacity" size={18} color={colors.text} />
              </View>
            </View>
            <View style={styles.macroTextCenter}>
              <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.textSecondary }])}>GORDURA</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>35g</ThemedText>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
           <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Configurações de Perfil</ThemedText>
           
           <View style={StyleSheet.flatten([styles.settingsCard, { backgroundColor: colors.card }])}>
             
             {/* Account */}
             <Pressable style={styles.settingItem}>
               <View style={styles.settingLeft}>
                 <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: isDark ? '#27272a' : '#f9fafb' }])}>
                   <MaterialIcons name="person" size={20} color={colors.text} />
                 </View>
                 <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Conta</ThemedText>
               </View>
               <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
             </Pressable>

             {/* Goals */}
             <Pressable style={styles.settingItem}>
               <View style={styles.settingLeft}>
                 <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: isDark ? '#27272a' : '#f9fafb' }])}>
                   <MaterialIcons name="track-changes" size={20} color={colors.text} />
                 </View>
                 <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Metas</ThemedText>
               </View>
               <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
             </Pressable>

             {/* Dark Mode */}
             <View style={styles.settingItem}>
               <View style={styles.settingLeft}>
                 <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: isDark ? '#27272a' : '#f9fafb' }])}>
                   <MaterialIcons name="dark-mode" size={20} color={colors.text} />
                 </View>
                 <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Modo Escuro</ThemedText>
               </View>
               <Switch 
                 value={isDarkMode} 
                 onValueChange={setIsDarkMode}
                 trackColor={{ false: '#e4e4e7', true: '#000000' }}
                 thumbColor={'#ffffff'}
                 ios_backgroundColor="#e4e4e7"
               />
             </View>

             {/* Fruit Theme */}
             <View style={StyleSheet.flatten([styles.settingItem, { flexDirection: 'column', alignItems: 'flex-start', gap: 12 }])}>
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                 <View style={styles.settingLeft}>
                   <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: isDark ? '#27272a' : '#f9fafb' }])}>
                     <MaterialIcons name="shopping-basket" size={20} color={colors.text} />
                   </View>
                   <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Tema da Fruta</ThemedText>
                 </View>
                 <MaterialIcons name="expand-more" size={24} color={colors.textSecondary} />
               </View>
               
               <View style={styles.themeSelector}>
                          {/* Strawberry */}
                          <Pressable 
                            onPress={() => setSelectedFruit('strawberry')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'strawberry' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'strawberry' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'strawberry' ? colors.primary : colors.textSecondary }])}>MORANGO</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#FF4D8D' }])} />
                          </Pressable>

                          {/* Blueberry */}
                          <Pressable 
                            onPress={() => setSelectedFruit('blueberry')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'blueberry' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'blueberry' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'blueberry' ? colors.primary : colors.textSecondary }])}>MIRTILO</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#3B82F6' }])} />
                          </Pressable>

                           {/* Grape */}
                          <Pressable 
                            onPress={() => setSelectedFruit('grape')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'grape' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'grape' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'grape' ? colors.primary : colors.textSecondary }])}>UVA</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#8B5CF6' }])} />
                          </Pressable>
                       </View>
             </View>

             {/* Devices */}
             <Pressable style={styles.settingItem}>
               <View style={styles.settingLeft}>
                 <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: isDark ? '#27272a' : '#f9fafb' }])}>
                   <MaterialIcons name="watch" size={20} color={colors.text} />
                 </View>
                 <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Dispositivos</ThemedText>
               </View>
               <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
             </Pressable>

           </View>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={() => router.replace('/welcome')}>
          <MaterialIcons name="logout" size={20} color={colors.textSecondary} />
          <ThemedText style={StyleSheet.flatten([styles.logoutText, { color: colors.textSecondary }])}>Sair da conta</ThemedText>
        </Pressable>

        <View style={{ height: 85 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hello: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent', // Default
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  assistantButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsInfo: {
    flex: 1,
  },
  statsValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statsValue: {
    fontSize: 48,
    fontWeight: '800', // Black/Bold
    letterSpacing: -1,
  },
  statsTarget: {
    fontSize: 20,
    fontWeight: '500',
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
  },
  chartContainer: {
    width: 96,
    height: 96,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIconContainer: {
    position: 'absolute',
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  macroCard: {
    flex: 1,
    padding: 16,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  macroChartContainer: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroIconOverlay: {
    position: 'absolute',
  },
  macroTextCenter: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    paddingLeft: 4,
  },
  settingsCard: {
    borderRadius: 40,
    padding: 12,
    gap: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    // Shadow for light mode, implicit
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    paddingLeft: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeName: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  themeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
  }
});
