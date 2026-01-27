import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/context/ThemeContext';

export default function ModalScreen() {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ThemedView style={StyleSheet.flatten([styles.container, { backgroundColor: colors.background }])}>
      <View style={StyleSheet.flatten([styles.card, { borderColor: colors.border, backgroundColor: 'transparent' }])}>
        <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        <View style={styles.cardContent}>
          <ThemedText type="title">Modal de Exemplo</ThemedText>
          <ThemedText style={{ color: colors.text, marginTop: 8 }}>
            Esta é uma tela modal com o novo design system.
          </ThemedText>
          
          <Link href="/" dismissTo style={StyleSheet.flatten([styles.link, { backgroundColor: colors.primary }])}>
            <ThemedText style={styles.linkText}>Fechar Modal</ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
  },
});
