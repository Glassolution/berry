import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput, Image, ImageStyle, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNutritionContext } from '@/context/NutritionContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, fruit, setFruit, colors, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const insets = useSafeAreaInsets();
  const { meals } = useNutritionContext();
  const [selectedFruit, setSelectedFruit] = useState(fruit);
  const [activeLocalSettings, setActiveLocalSettings] = useState<'none' | 'account' | 'goals'>('none');
  const [internalAccountTab, setInternalAccountTab] = useState<'profile' | 'security' | 'dados'>('profile');
  const [name, setName] = useState('Cas');
  const [email, setEmail] = useState('seu@email.com');
  const [phone, setPhone] = useState('+55');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Brasil');
  const [countryDropdownVisible, setCountryDropdownVisible] = useState(false);
  const [goalCalories, setGoalCalories] = useState('2500');
  const [goalWeight, setGoalWeight] = useState('70');
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [activity, setActivity] = useState('3');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'>('moderate');
  const [activityDropdownVisible, setActivityDropdownVisible] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleSelectFruit = (f: any) => {
    setSelectedFruit(f);
    setFruit(f);
  };

  useEffect(() => {
    (async () => {
      const savedName = await AsyncStorage.getItem('profile_name');
      const savedAvatar = await AsyncStorage.getItem('profile_avatar');
      if (savedName) setName(savedName);
      if (savedAvatar) setAvatarUri(savedAvatar);
      const savedGoal = await AsyncStorage.getItem('nutra:goal:calories');
      if (savedGoal) setGoalCalories(savedGoal);
    })();
  }, []);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.length) {
      const uri = res.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem('profile_avatar', uri);
    }
  };

  const parsedGoal = parseInt(String(goalCalories).replace(/\D/g, ''), 10);
  const target = !isNaN(parsedGoal) ? parsedGoal : 2500;
  const todayMealsValue = meals.filter(m => m.createdAt.toDateString() === new Date().toDateString());
  const consumedCalories = todayMealsValue.reduce((acc, m) => acc + (Number(m.calories) || 0), 0);
  const diff = target - consumedCalories;
  const isOver = diff < 0;
  const progress = Math.min(consumedCalories / target, 1);
  const dashArray = 251.2;
  const dashOffset = dashArray * (1 - progress);
  const progressColor = isOver ? '#ef4444' : progress >= 1 ? '#22c55e' : colors.primary;

  const consumedProtein = todayMealsValue.reduce((acc, m) => acc + (Number(m.protein) || 0), 0);
  const consumedCarbs = todayMealsValue.reduce((acc, m) => acc + (Number(m.carbs) || 0), 0);
  const consumedFat = todayMealsValue.reduce((acc, m) => acc + (Number(m.fat) || 0), 0);
  const targetProtein = Math.round((target * 0.3) / 4);
  const targetCarbs = Math.round((target * 0.4) / 4);
  const targetFat = Math.round((target * 0.3) / 9);
  const circleLen = 263.89;

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])} edges={['top','bottom']}>
      <ScrollView contentContainerStyle={StyleSheet.flatten([styles.scrollContent, { paddingBottom: insets.bottom + 96 }])} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <View style={StyleSheet.flatten([styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.secondary }])}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage as ImageStyle} onError={() => setAvatarUri(null)} />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.secondary }}>
                  <IconSymbol name="person" size={24} color={colors.secondaryForeground} />
                </View>
              )}
            </View>
            <View>
              <ThemedText style={StyleSheet.flatten([styles.hello, { color: colors.mutedForeground }])}>BEM-VINDO</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.userName, { color: colors.text }])}>{name}</ThemedText>
            </View>
          </View>
          <Pressable style={StyleSheet.flatten([styles.iconButton, { 
            borderColor: colors.border
          }])}>
            <MaterialIcons name="notifications-none" size={24} color={colors.mutedForeground} />
          </Pressable>
        </View>

        

        <View style={styles.statsSection}>
          <View style={styles.statsInfo}>
            <View style={styles.statsValueRow}>
              <ThemedText style={StyleSheet.flatten([styles.statsValue, { color: isOver ? '#ef4444' : colors.text }])}>{consumedCalories}</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.statsTarget, { color: colors.mutedForeground }])}>/ {target}</ThemedText>
            </View>
            <ThemedText style={StyleSheet.flatten([styles.statsLabel, { color: isOver ? '#ef4444' : colors.mutedForeground }])}>KCAL CONSUMIDAS HOJE</ThemedText>
          </View>
          
          <View style={styles.chartContainer}>
            <Svg width={96} height={96} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle
                cx="50"
                cy="50"
                r="44"
                stroke={colors.border}
                strokeWidth="5"
                fill="transparent"
              />
              {progress > 0 && (
                <Circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke={progressColor}
                  strokeWidth="7"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              )}
            </Svg>
            <View style={styles.chartIconContainer}>
              <MaterialIcons name="local-fire-department" size={24} color={progressColor} />
            </View>
          </View>
        </View>

        <View style={styles.macroGrid}>
          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={48} height={48} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={colors.border} strokeWidth="4" fill="transparent" />
                {consumedProtein > 0 && (
                  <Circle 
                    cx="50" cy="50" r="42" 
                    stroke={consumedProtein > targetProtein ? '#ef4444' : (consumedProtein >= targetProtein ? '#22c55e' : colors.primary)} 
                    strokeWidth="6" 
                    strokeDasharray={circleLen} 
                    strokeDashoffset={circleLen * (1 - Math.min(consumedProtein / targetProtein, 1))} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="restaurant-menu" size={18} color={colors.text} />
              </View>
            </View>
            <View style={styles.macroTextCenter}>
              <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.mutedForeground }])}>PROTEÍNA</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{consumedProtein}g <ThemedText style={{ fontSize: 10, color: colors.mutedForeground }}>/ {targetProtein}g</ThemedText></ThemedText>
            </View>
          </View>

          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={48} height={48} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={colors.border} strokeWidth="4" fill="transparent" />
                {consumedCarbs > 0 && (
                  <Circle 
                    cx="50" cy="50" r="42" 
                    stroke={consumedCarbs > targetCarbs ? '#ef4444' : (consumedCarbs >= targetCarbs ? '#22c55e' : colors.primary)} 
                    strokeWidth="6" 
                    strokeDasharray={circleLen} 
                    strokeDashoffset={circleLen * (1 - Math.min(consumedCarbs / targetCarbs, 1))} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="grass" size={18} color={colors.text} />
              </View>
            </View>
            <View style={styles.macroTextCenter}>
              <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.mutedForeground }])}>CARBOS</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{consumedCarbs}g <ThemedText style={{ fontSize: 10, color: colors.mutedForeground }}>/ {targetCarbs}g</ThemedText></ThemedText>
            </View>
          </View>

          <View style={StyleSheet.flatten([styles.macroCard, { backgroundColor: colors.card, borderColor: colors.border }])}>
            <View style={styles.macroChartContainer}>
               <Svg width={48} height={48} viewBox="0 0 100 100" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="50" cy="50" r="42" stroke={colors.border} strokeWidth="4" fill="transparent" />
                {consumedFat > 0 && (
                  <Circle 
                    cx="50" cy="50" r="42" 
                    stroke={consumedFat > targetFat ? '#ef4444' : (consumedFat >= targetFat ? '#22c55e' : colors.primary)} 
                    strokeWidth="6" 
                    strokeDasharray={circleLen} 
                    strokeDashoffset={circleLen * (1 - Math.min(consumedFat / targetFat, 1))} 
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
              </Svg>
              <View style={styles.macroIconOverlay}>
                <MaterialIcons name="opacity" size={18} color={colors.text} />
              </View>
            </View>
            <View style={styles.macroTextCenter}>
              <ThemedText style={StyleSheet.flatten([styles.macroLabel, { color: colors.mutedForeground }])}>GORDURA</ThemedText>
              <ThemedText style={StyleSheet.flatten([styles.macroValue, { color: colors.text }])}>{consumedFat}g <ThemedText style={{ fontSize: 10, color: colors.mutedForeground }}>/ {targetFat}g</ThemedText></ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
           <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Configurações de Perfil</ThemedText>
           
           <View style={StyleSheet.flatten([styles.settingsCard, { backgroundColor: colors.card }])}>
             
            <Pressable 
              style={StyleSheet.flatten([styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }])}
              onPress={() => {
                setInternalAccountTab('profile');
                setActiveLocalSettings(activeLocalSettings === 'account' ? 'none' : 'account');
              }}
            >
              <View style={styles.settingLeft}>
                 <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: colors.secondary }])}>
                   <MaterialIcons name="person" size={20} color={colors.text} />
                 </View>
                 <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Conta</ThemedText>
               </View>
             <MaterialIcons 
               name={activeLocalSettings === 'account' ? 'expand-less' : 'expand-more'} 
               size={24} 
               color={colors.mutedForeground} 
             />
            </Pressable>

            {activeLocalSettings === 'account' && (
              <View style={{ paddingTop: 12, paddingHorizontal: 4 }}>
                <View style={StyleSheet.flatten([styles.internalTabsContainer])}>
                  <Pressable
                    style={StyleSheet.flatten([
                      styles.internalTabButton,
                      internalAccountTab === 'profile'
                        ? { backgroundColor: colors.primary, borderColor: colors.primary }
                        : { borderColor: colors.border }
                    ])}
                    onPress={() => setInternalAccountTab('profile')}
                  >
                    <ThemedText
                      style={StyleSheet.flatten([
                        styles.internalTabText,
                        internalAccountTab === 'profile'
                          ? { color: colors.primaryForeground }
                          : { color: colors.text }
                      ])}
                    >
                      Conta
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={StyleSheet.flatten([
                      styles.internalTabButton,
                      internalAccountTab === 'security'
                        ? { backgroundColor: colors.primary, borderColor: colors.primary }
                        : { borderColor: colors.border }
                    ])}
                    onPress={() => setInternalAccountTab('security')}
                  >
                    <ThemedText
                      style={StyleSheet.flatten([
                        styles.internalTabText,
                        internalAccountTab === 'security'
                          ? { color: colors.primaryForeground }
                          : { color: colors.text }
                      ])}
                    >
                      Segurança
                    </ThemedText>
                  </Pressable>
                <Pressable
                  style={StyleSheet.flatten([
                    styles.internalTabButton,
                    internalAccountTab === 'dados'
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { borderColor: colors.border }
                  ])}
                  onPress={() => setInternalAccountTab('dados')}
                >
                  <ThemedText
                    style={StyleSheet.flatten([
                      styles.internalTabText,
                      internalAccountTab === 'dados'
                        ? { color: colors.primaryForeground }
                        : { color: colors.text }
                    ])}
                  >
                    Dados
                  </ThemedText>
                </Pressable>
                </View>

                {internalAccountTab === 'profile' && (
                  <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                    <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={styles.sectionContent}>
                      <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Foto de Perfil</ThemedText>
                      <View style={styles.profileRow}>
                    <View style={StyleSheet.flatten([styles.avatarLarge, { backgroundColor: colors.primary }])}>
                      {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatarImage as ImageStyle} onError={() => setAvatarUri(null)} />
                      ) : (
                        <IconSymbol name="person" size={40} color={colors.primaryForeground} />
                      )}
                    </View>
                        <View style={styles.uploadContainer}>
                      <Pressable style={StyleSheet.flatten([styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }])} onPress={pickAvatar}>
                            <IconSymbol name="camera" size={18} color={colors.text} />
                            <ThemedText style={StyleSheet.flatten([styles.uploadText, { color: colors.text }])}>Enviar foto</ThemedText>
                          </Pressable>
                          <ThemedText type="mini" style={{ opacity: 0.7 }}>Máximo 2MB (JPG, PNG)</ThemedText>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

                {internalAccountTab === 'profile' && (
                  <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                    <View style={styles.sectionContent}>
                      <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Informações Pessoais</ThemedText>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Nome</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          value={name}
                          onChangeText={async (v) => {
                            setName(v);
                            await AsyncStorage.setItem('profile_name', v);
                          }}
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Email</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Telefone</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>País</ThemedText>
                        <Pressable
                          style={StyleSheet.flatten([styles.selectInput, { borderColor: colors.border, backgroundColor: colors.card }])}
                          onPress={() => setCountryDropdownVisible(true)}
                        >
                          <ThemedText style={StyleSheet.flatten([styles.selectValue, { color: colors.text }])}>{country}</ThemedText>
                          <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.text} />
                        </Pressable>
                      </View>
                      <Modal
                        visible={countryDropdownVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setCountryDropdownVisible(false)}
                      >
                        <View style={StyleSheet.flatten([styles.modalOverlay])}>
                          <View style={StyleSheet.flatten([styles.dropdownMenu, { backgroundColor: colors.card, borderColor: colors.border }])}>
                            <ScrollView showsVerticalScrollIndicator>
                              {[
                                { name: 'Brasil', code: '55' },
                                { name: 'Estados Unidos', code: '1' },
                                { name: 'Portugal', code: '351' },
                                { name: 'Espanha', code: '34' },
                                { name: 'França', code: '33' },
                                { name: 'México', code: '52' },
                                { name: 'Argentina', code: '54' },
                                { name: 'Reino Unido', code: '44' },
                                { name: 'Alemanha', code: '49' },
                                { name: 'Itália', code: '39' },
                              ].map((opt) => (
                                <Pressable
                                  key={opt.code}
                                  style={StyleSheet.flatten([styles.dropdownItem, { borderColor: colors.border }])}
                                  onPress={() => {
                                    setCountry(opt.name);
                                    setCountryDropdownVisible(false);
                                  }}
                                >
                                  <ThemedText style={StyleSheet.flatten([styles.dropdownItemText, { color: colors.text }])}>{opt.name}</ThemedText>
                                  {country === opt.name && <MaterialIcons name="check" size={18} color={colors.primary} />}
                                </Pressable>
                              ))}
                            </ScrollView>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                )}

                {internalAccountTab === 'security' && (
                  <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                    <View style={styles.sectionContent}>
                      <View style={styles.sectionHeaderRow}>
                        <IconSymbol name="shield" size={20} color={colors.primary} />
                        <ThemedText style={StyleSheet.flatten([styles.sectionTitleWithIcon, { color: colors.text }])}>Alterar Senha</ThemedText>
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Senha atual</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          value={currentPassword}
                          onChangeText={setCurrentPassword}
                          secureTextEntry
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Nova senha</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Confirmar senha</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry
                        />
                      </View>
                    </View>
                  </View>
                )}
                {internalAccountTab === 'dados' && (
                  <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                    <View style={styles.sectionContent}>
                      <View style={styles.sectionHeaderRow}>
                        <IconSymbol name="flame" size={20} color={colors.primary} />
                        <ThemedText style={StyleSheet.flatten([styles.sectionTitleWithIcon, { color: colors.text }])}>Calculadora de Metas</ThemedText>
                      </View>
                      <ThemedText style={{ color: colors.mutedForeground, marginBottom: 8 }}>Meta: {goalWeight} kg</ThemedText>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Idade</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          keyboardType="number-pad"
                          value={age}
                          onChangeText={setAge}
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Altura (cm)</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          keyboardType="number-pad"
                          value={height}
                          onChangeText={setHeight}
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Peso (kg)</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          keyboardType="number-pad"
                          value={weight}
                          onChangeText={setWeight}
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                      <View style={styles.inputGroup}>
                      <ThemedText style={styles.label}>Nível de atividade</ThemedText>
                      <Pressable
                        style={StyleSheet.flatten([styles.selectInput, { borderColor: colors.border, backgroundColor: colors.card }])}
                        onPress={() => setActivityDropdownVisible(true)}
                      >
                        <ThemedText style={{ color: colors.text }}>
                          {activityLevel === 'sedentary' ? 'Sedentário (Pouco exercício)' :
                           activityLevel === 'light' ? 'Levemente ativo (1-3 dias/sem)' :
                           activityLevel === 'moderate' ? 'Moderadamente ativo (3-4 dias/sem)' :
                           activityLevel === 'active' ? 'Muito ativo (6-7 dias/sem)' : 'Extremamente ativo'}
                        </ThemedText>
                      </Pressable>
                      </View>
                      <View style={styles.inputGroup}>
                        <ThemedText style={styles.label}>Meta de peso (kg)</ThemedText>
                        <TextInput
                          style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                          keyboardType="number-pad"
                          value={goalWeight}
                          onChangeText={setGoalWeight}
                          placeholderTextColor={colors.icon}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
            <Pressable 
              style={StyleSheet.flatten([styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }])}
              onPress={() => {
                setActiveLocalSettings(activeLocalSettings === 'goals' ? 'none' : 'goals');
              }}
            >
             <View style={styles.settingLeft}>
                <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: colors.secondary }])}>
                  <MaterialIcons name="track-changes" size={20} color={colors.text} />
                </View>
                <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Metas</ThemedText>
              </View>
             <MaterialIcons 
               name={activeLocalSettings === 'goals' ? 'expand-less' : 'expand-more'} 
               size={24} 
               color={colors.mutedForeground} 
             />
            </Pressable>
            {activeLocalSettings === 'goals' && (
              <View style={{ paddingTop: 12, paddingHorizontal: 4 }}>
                <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                  <View style={styles.sectionContent}>
                    <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Metas Nutricionais</ThemedText>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.label}>Meta diária de calorias (kcal)</ThemedText>
                      <TextInput
                        style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }])}
                        keyboardType="number-pad"
                        value={goalCalories}
                        onChangeText={setGoalCalories}
                        placeholderTextColor={colors.icon}
                      />
                    </View>
                    <ThemedText type="mini" style={{ opacity: 0.7 }}>Ajuste educativo da meta diária. Valores são estimativos.</ThemedText>
                  </View>
                </View>
                <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                  <View style={styles.sectionContent}>
                    <View style={styles.sectionHeaderRow}>
                      <IconSymbol name="flame" size={20} color={colors.primary} />
                      <ThemedText style={StyleSheet.flatten([styles.sectionTitleWithIcon, { color: colors.text }])}>Calculadora de Metas</ThemedText>
                    </View>
                    <ThemedText style={{ color: colors.mutedForeground, marginBottom: 8 }}>Meta: {goalWeight} kg</ThemedText>
                    <View style={{ marginTop: 8 }}>
                      <View style={{ flexDirection: 'column', gap: 12 }}>
                        {[
                          { title: 'Emagrecimento', cal: '2.302', p: 201, c: 201, g: 77 },
                          { title: 'Manutenção', cal: '2.802', p: 210, c: 281, g: 93 },
                          { title: 'Hipertrofia', cal: '3.102', p: 233, c: 349, g: 86 },
                        ].map((item) => (
                          <View key={item.title} style={StyleSheet.flatten([styles.section, { borderColor: colors.border }])}>
                            <View style={StyleSheet.flatten([styles.sectionContent, { gap: 8 }])}>
                              <View style={StyleSheet.flatten([styles.sectionHeaderRow, { justifyContent: 'space-between' }])}>
                                <View>
                                  <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>{item.title}</ThemedText>
                                  <ThemedText style={{ color: colors.mutedForeground }}>Estimativa educativa</ThemedText>
                                </View>
                                <View style={StyleSheet.flatten([{ flexDirection: 'row', alignItems: 'center', gap: 8 }])}>
                                  <View style={StyleSheet.flatten([{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: colors.primary.replace('hsl', 'hsla').replace(')', ', 0.1)') }])}>
                                    <IconSymbol name="flame" size={14} color={colors.primary} />
                                    <ThemedText style={{ color: colors.primary }}>{item.cal} kcal</ThemedText>
                                  </View>
                                  <Pressable
                                    style={StyleSheet.flatten([{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }])}
                                    onPress={async () => {
                                      const v = parseInt(String(item.cal).replace(/\D/g, ''), 10);
                                      if (!isNaN(v)) {
                                        setGoalCalories(String(v));
                                        await AsyncStorage.setItem('nutra:goal:calories', String(v));
                                      }
                                    }}
                                  >
                                    <MaterialIcons name="add" size={18} color={colors.primaryForeground} />
                                  </Pressable>
                                </View>
                              </View>
                              <View style={{ flexDirection: 'row', gap: 12 }}>
                                <ThemedText style={{ color: colors.protein }}>P: {item.p}g</ThemedText>
                                <ThemedText style={{ color: colors.carbs }}>C: {item.c}g</ThemedText>
                                <ThemedText style={{ color: colors.fat }}>G: {item.g}g</ThemedText>
                              </View>
                            </View>
                          </View>
                        ))}
                      </View>
                      <ThemedText type="mini" style={{ opacity: 0.7, marginTop: 8 }}>
                        Valores educativos e estimativos; ajuste conforme preferência.
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            )}

             <View style={StyleSheet.flatten([styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }])}>
              <View style={styles.settingLeft}>
                <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: colors.secondary }])}>
                   <MaterialIcons name="dark-mode" size={20} color={colors.text} />
                 </View>
                 <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Modo Escuro</ThemedText>
               </View>
              <Pressable
                accessibilityRole="switch"
                accessibilityState={{ checked: theme === 'dark' }}
                onPress={() => setTheme(isDark ? 'light' : 'dark')}
                style={StyleSheet.flatten([
                  styles.toggle,
                  { 
                    borderColor: colors.border,
                    backgroundColor: '#ffffff'
                  }
                ])}
              >
                <View
                  style={StyleSheet.flatten([
                    styles.toggleThumb,
                    { 
                      backgroundColor: '#000000',
                      left: isDark ? 22 : 2,
                      borderColor: colors.border
                    }
                  ])}
                />
              </Pressable>
             </View>

             <View style={StyleSheet.flatten([styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'column', alignItems: 'flex-start', gap: 12 }])}>
               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                 <View style={styles.settingLeft}>
                   <View style={StyleSheet.flatten([styles.settingIconBox, { backgroundColor: colors.secondary }])}>
                     <MaterialIcons name="shopping-basket" size={20} color={colors.text} />
                   </View>
                   <ThemedText style={StyleSheet.flatten([styles.settingLabel, { color: colors.text }])}>Tema da Fruta</ThemedText>
                 </View>
               </View>
               
               <View style={styles.themeSelector}>
                         <Pressable 
                           onPress={() => handleSelectFruit('default')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                               backgroundColor: selectedFruit === 'default' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                               borderColor: selectedFruit === 'default' ? colors.primary : colors.border
                              }
                            ])}
                          >
                           <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'default' ? colors.primary : colors.text }])}>PADRÃO</ThemedText>
                           <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: isDark ? '#ffffff' : '#000000' }])} />
                          </Pressable>

                         <Pressable 
                           onPress={() => handleSelectFruit('pear')}
                           style={StyleSheet.flatten([
                             styles.themeOption, 
                             { 
                               backgroundColor: selectedFruit === 'pear' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                               borderColor: selectedFruit === 'pear' ? colors.primary : colors.border
                             }
                           ])}
                         >
                           <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'pear' ? colors.primary : colors.text }])}>PERA</ThemedText>
                           <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#22C55E' }])} />
                         </Pressable>

                          <Pressable 
                            onPress={() => handleSelectFruit('banana')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'banana' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'banana' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'banana' ? colors.primary : colors.text }])}>BANANA</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#F59E0B' }])} />
                          </Pressable>

                          <Pressable 
                            onPress={() => handleSelectFruit('apple')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'apple' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'apple' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'apple' ? colors.primary : colors.text }])}>MAÇÃ</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#EF4444' }])} />
                          </Pressable>

                          <Pressable 
                            onPress={() => handleSelectFruit('orange')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'orange' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'orange' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'orange' ? colors.primary : colors.text }])}>LARANJA</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#F97316' }])} />
                          </Pressable>

                          <Pressable 
                            onPress={() => handleSelectFruit('grape')}
                            style={StyleSheet.flatten([
                              styles.themeOption, 
                              { 
                                backgroundColor: selectedFruit === 'grape' ? (isDark ? '#27272a' : '#f9fafb') : 'transparent',
                                borderColor: selectedFruit === 'grape' ? colors.primary : colors.border
                              }
                            ])}
                          >
                            <ThemedText style={StyleSheet.flatten([styles.themeName, { color: selectedFruit === 'grape' ? colors.primary : colors.text }])}>UVA</ThemedText>
                            <View style={StyleSheet.flatten([styles.themeDot, { backgroundColor: '#6D28D9' }])} />
                          </Pressable>
               </View>
             </View>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  hello: {
    fontSize: 12,
    fontWeight: '700',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderWidth: 1,
    borderRadius: 24,
    paddingRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  assistantButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsInfo: {
    flex: 1,
    gap: 6,
  },
  statsValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statsTarget: {
    fontSize: 18,
    fontWeight: '700',
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  chartContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chartIconContainer: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  macroCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
  },
  macroChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroIconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroTextCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  sectionContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0,
  },
  settingItem: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  internalTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  internalTabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  internalTabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionContent: {
    padding: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  uploadContainer: {
    gap: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
  },
  uploadText: {
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  selectInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValue: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  saveButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionTitleWithIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownMenu: {
    width: '100%',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    maxHeight: 400,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 999,
    position: 'relative',
    borderWidth: 1,
    padding: 2,
  },
  toggleThumb: {
    position: 'absolute',
    top: 2,
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
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
