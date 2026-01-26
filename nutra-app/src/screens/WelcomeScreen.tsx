import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'WelcomeScreen'>;

const WelcomeScreen = ({ navigation }: Props) => {
  const handleStart = () => {
    navigation.navigate('DashboardScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heroContainer}>
        <Image
          source={require('../../assets/images/react-logo.png')}
          resizeMode="cover"
          style={styles.heroImage}
        />
      </View>

      <View style={styles.content}>
        <Text selectable style={styles.title}>Seu assistente nutricional inteligente</Text>
        <Text selectable style={styles.subtitle}>
          Descubra o que há em cada alimento e construa uma rotina mais saudável
          com o NutriScan.
        </Text>

        <Pressable style={styles.primaryButton} onPress={handleStart}>
          <Text style={styles.primaryButtonText}>Começar com o NutriScan</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleStart}>
          <Text style={styles.secondaryButtonText}>Explorar como assistente</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <Pressable onPress={handleStart}>
            <Text style={styles.footerLink}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroContainer: {
    flex: 3,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 2,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
  },
  primaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111827',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerLink: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
});

export default WelcomeScreen;
