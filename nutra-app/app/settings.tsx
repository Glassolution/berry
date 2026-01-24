import React, { useState } from 'react';
import { StyleSheet, TextInput, Pressable, ScrollView, View, Modal, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';
import { FruitTheme } from '@/constants/Colors';

type TabType = 'account' | 'security' | 'appearance';

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const { theme, setTheme, fruit, setFruit, colors } = useTheme();
  const isDark = theme === 'dark';

  // Account State
  const [name, setName] = useState('Cas');
  const [email, setEmail] = useState('seu@email.com');
  const [phone, setPhone] = useState('+55');
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Theme Dropdown State
  const [themeDropdownVisible, setThemeDropdownVisible] = useState(false);

  const fruitOptions: { value: FruitTheme; label: string; emoji: string }[] = [
    { value: 'pear', label: 'Pera (Verde)', emoji: '🥝' },
    { value: 'apple', label: 'Maçã (Vermelho)', emoji: '🍎' },
    { value: 'banana', label: 'Banana (Amarelo)', emoji: '🍌' },
    { value: 'orange', label: 'Laranja (Laranja)', emoji: '🍊' },
    { value: 'grape', label: 'Uva (Roxo)', emoji: '🍇' },
    { value: 'strawberry', label: 'Padrão (Branco)', emoji: ' ' },
  ];

  const selectedFruit = fruitOptions.find(f => f.value === fruit) || fruitOptions[0];

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <Pressable 
        style={StyleSheet.flatten([styles.tabButton, activeTab === 'account' ? { backgroundColor: colors.primary } : undefined])} 
        onPress={() => setActiveTab('account')}
      >
        <IconSymbol name="person" size={20} color={activeTab === 'account' ? colors.primaryForeground : colors.text} />
        <ThemedText style={StyleSheet.flatten([styles.tabText, activeTab === 'account' ? { color: colors.primaryForeground } : { color: colors.text }])}>Conta</ThemedText>
      </Pressable>
      <Pressable 
        style={StyleSheet.flatten([styles.tabButton, activeTab === 'security' ? { backgroundColor: colors.primary } : undefined])} 
        onPress={() => setActiveTab('security')}
      >
        <IconSymbol name="shield" size={20} color={activeTab === 'security' ? colors.primaryForeground : colors.text} />
        <ThemedText style={StyleSheet.flatten([styles.tabText, activeTab === 'security' ? { color: colors.primaryForeground } : { color: colors.text }])}>Segurança</ThemedText>
      </Pressable>
      <Pressable 
        style={StyleSheet.flatten([styles.tabButton, activeTab === 'appearance' ? { backgroundColor: colors.primary } : undefined])} 
        onPress={() => setActiveTab('appearance')}
      >
        <IconSymbol name="paintpalette" size={20} color={activeTab === 'appearance' ? colors.primaryForeground : colors.text} />
        <ThemedText style={StyleSheet.flatten([styles.tabText, activeTab === 'appearance' ? { color: colors.primaryForeground } : { color: colors.text }])}>Aparência</ThemedText>
      </Pressable>
    </View>
  );

  const renderAccountTab = () => (
    <View style={styles.tabContent}>
      {/* Profile Photo */}
      <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border, backgroundColor: 'transparent' }])}>
        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.sectionContent}>
          <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Foto de Perfil</ThemedText>
          <View style={styles.profileRow}>
            <View style={StyleSheet.flatten([styles.avatarLarge, { backgroundColor: colors.primary }])}>
              <IconSymbol name="person" size={40} color={colors.primaryForeground} />
            </View>
            <View style={styles.uploadContainer}>
              <Pressable style={StyleSheet.flatten([styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }])}>
                <IconSymbol name="camera" size={18} color={colors.text} />
                <ThemedText style={StyleSheet.flatten([styles.uploadText, { color: colors.text }])}>Enviar foto</ThemedText>
              </Pressable>
              <ThemedText type="mini" style={{ opacity: 0.7 }}>Máximo 2MB (JPG, PNG)</ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* Personal Info */}
      <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border, backgroundColor: 'transparent' }])}>
        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.sectionContent}>
          <ThemedText style={StyleSheet.flatten([styles.sectionTitle, { color: colors.text }])}>Informações Pessoais</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Nome</ThemedText>
            <TextInput 
              style={StyleSheet.flatten([styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }])} 
              value={name} 
              onChangeText={setName}
              placeholderTextColor={colors.icon}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Email</ThemedText>
            <TextInput 
              style={StyleSheet.flatten([styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }])} 
              value={email} 
              onChangeText={setEmail}
              placeholderTextColor={colors.icon}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Telefone</ThemedText>
            <TextInput 
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]} 
              value={phone} 
              onChangeText={setPhone}
              placeholderTextColor={colors.icon}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>País</ThemedText>
            <View style={[styles.selectInput, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <ThemedText style={[styles.selectValue, { color: colors.text }]}>Brasil</ThemedText>
              <IconSymbol name="chevron.down" size={20} color={colors.icon} />
            </View>
          </View>

          <Pressable style={[styles.saveButton, { backgroundColor: colors.primary }]}>
            <ThemedText style={{ color: colors.primaryForeground, fontWeight: 'bold', fontSize: 16 }}>Alterar Senha</ThemedText>
          </Pressable>
        </View>
      </View>

      {/* Actions */}
      <Pressable style={[styles.logoutButton, { borderColor: colors.border }]}>
        <ThemedText style={[styles.logoutText, { color: colors.text }]}>Sair da conta</ThemedText>
      </Pressable>

      <Pressable style={styles.deleteButton}>
        <IconSymbol name="trash" size={16} color="#ef4444" />
        <ThemedText style={styles.deleteText}>Excluir minha conta</ThemedText>
      </Pressable>
    </View>
  );

  const renderSecurityTab = () => (
    <View style={styles.tabContent}>
      <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border, backgroundColor: 'transparent' }])}>
        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.sectionContent}>
          <View style={styles.sectionHeaderRow}>
            <IconSymbol name="shield" size={20} color={colors.primary} />
            <ThemedText style={[styles.sectionTitleWithIcon, { color: colors.text }]}>Alterar Senha</ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Senha atual</ThemedText>
            <View style={[styles.passwordContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput 
                style={[styles.passwordInput, { color: colors.text }]} 
                value={currentPassword} 
                onChangeText={setCurrentPassword}
                placeholder="Digite sua senha atual"
                placeholderTextColor={colors.icon}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol name={showPassword ? "eye.slash" : "eye"} size={20} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Nova senha</ThemedText>
            <View style={[styles.passwordContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput 
                style={[styles.passwordInput, { color: colors.text }]} 
                value={newPassword} 
                onChangeText={setNewPassword}
                placeholder="Digite a nova senha"
                placeholderTextColor={colors.icon}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol name={showPassword ? "eye.slash" : "eye"} size={20} color={colors.text} />
              </Pressable>
            </View>
            <ThemedText type="mini" style={{ marginTop: 4, opacity: 0.7 }}>Mínimo de 8 caracteres</ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Confirmar nova senha</ThemedText>
            <View style={[styles.passwordContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <TextInput 
                style={[styles.passwordInput, { color: colors.text }]} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword}
                placeholder="Confirme a nova senha"
                placeholderTextColor={colors.icon}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <IconSymbol name={showPassword ? "eye.slash" : "eye"} size={20} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <Pressable style={[styles.saveButton, { backgroundColor: colors.primary }]}>
            <ThemedText style={{ color: colors.primaryForeground, fontWeight: 'bold', fontSize: 16 }}>Alterar Senha</ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderAppearanceTab = () => (
    <View style={styles.tabContent}>
      <View style={StyleSheet.flatten([styles.section, { borderColor: colors.border, backgroundColor: 'transparent' }])}>
        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.sectionContent}>
          <View style={styles.sectionHeaderRow}>
            <IconSymbol name="paintpalette" size={20} color={colors.primary} />
            <ThemedText style={[styles.sectionTitleWithIcon, { color: colors.text }]}>Aparência</ThemedText>
          </View>
          <ThemedText style={[styles.sectionSubtitle, { color: colors.text, opacity: 0.7 }]}>Personalize como o aplicativo se parece para você.</ThemedText>

          <ThemedText type="caption" style={{ marginBottom: 8 }}>Modo</ThemedText>
          <View style={styles.modeRow}>
            <Pressable 
              style={[styles.modeButton, { backgroundColor: colors.background, borderColor: colors.border }, theme === 'light' && { borderColor: colors.primary }]} 
              onPress={() => setTheme('light')}
            >
              <IconSymbol name="sun.max" size={24} color={theme === 'light' ? colors.primary : colors.text} />
              <ThemedText style={[styles.modeText, { color: colors.text }]}>Claro</ThemedText>
            </Pressable>
            <Pressable 
              style={[styles.modeButton, { backgroundColor: colors.background, borderColor: colors.border }, theme === 'dark' && { borderColor: colors.primary }]} 
              onPress={() => setTheme('dark')}
            >
              <IconSymbol name="moon" size={24} color={theme === 'dark' ? colors.primary : colors.text} />
              <ThemedText style={[styles.modeText, { color: colors.text }]}>Escuro</ThemedText>
            </Pressable>
          </View>

          <View style={[styles.inputGroup, { marginTop: 20 }]}>
            <ThemedText type="caption" style={{ marginBottom: 8 }}>Tema</ThemedText>
            
            {/* Theme Dropdown Trigger */}
            <Pressable 
              style={[styles.dropdownTrigger, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => setThemeDropdownVisible(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ThemedText>{selectedFruit.emoji}</ThemedText>
                <ThemedText style={{ color: colors.text }}>{selectedFruit.label}</ThemedText>
              </View>
              <IconSymbol name="chevron.down" size={20} color={colors.icon} />
            </Pressable>

            {/* Theme Dropdown Modal */}
            <Modal
              visible={themeDropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setThemeDropdownVisible(false)}
            >
              <Pressable 
                style={styles.modalOverlay} 
                onPress={() => setThemeDropdownVisible(false)}
              >
                <View style={[styles.dropdownMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {fruitOptions.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.dropdownItem,
                        fruit === item.value && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => {
                        setFruit(item.value);
                        setThemeDropdownVisible(false);
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {fruit === item.value && (
                          <IconSymbol name="checkmark" size={16} color="#fff" />
                        )}
                        <ThemedText style={{ fontSize: 16 }}>{item.emoji}</ThemedText>
                        <ThemedText style={[
                          styles.dropdownItemText, 
                          { color: fruit === item.value ? '#fff' : colors.text }
                        ]}>
                          {item.label}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Pressable>
            </Modal>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: 'Configurações',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      {renderTabs()}
      <ScrollView style={styles.scrollView}>
        {activeTab === 'account' && renderAccountTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'appearance' && renderAppearanceTab()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  activeTabButton: {
    // handled inline
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabContent: {
    padding: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
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
  logoutButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  logoutText: {
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderRadius: 12,
    gap: 12,
  },
  modeText: {
    fontWeight: '600',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
