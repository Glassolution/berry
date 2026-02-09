import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/context/AuthContext';

const COLORS = {
  berryRed: "#ee2b5b",
  berryOrange: "#FF8C42",
  berryBg: "#FFFFFF",
  gray900: "#111827",
  gray700: "#374151",
  gray400: "#9CA3AF",
  gray100: "#F3F4F6",
  white: "#FFFFFF",
};

interface ScanLog {
  id: number;
  food_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  image_url: string;
  created_at: string;
  date: string;
}

export default function ScanHistoryScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<ScanLog[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!session?.user) return;

    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScans(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ScanLog }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={item.image_url ? { uri: item.image_url } : require('@/assets/images/prato 1.png')}
          style={styles.image}
          contentFit="cover"
        />
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.foodName} numberOfLines={1}>{item.food_name}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="local-fire-department" size={16} color={COLORS.berryRed} />
            <Text style={styles.statValue}>{Math.round(item.calories)} kcal</Text>
          </View>
          <View style={styles.macros}>
            <Text style={styles.macroText}>P: {Math.round(item.protein)}g</Text>
            <Text style={styles.macroText}>C: {Math.round(item.carbs)}g</Text>
            <Text style={styles.macroText}>G: {Math.round(item.fat)}g</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.gray900} />
        </Pressable>
        <Text style={styles.title}>Histórico de Scans</Text>
        <View style={{ width: 40 }} /> 
      </SafeAreaView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.berryRed} />
        </View>
      ) : (
        <FlatList
          data={scans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="photo-camera" size={48} color={COLORS.gray400} />
              <Text style={styles.emptyText}>Nenhum scan realizado ainda</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray900,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Manrope_700Bold',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Manrope_700Bold',
    color: COLORS.gray900,
    marginBottom: 8,
  },
  statsRow: {
    gap: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Manrope_800ExtraBold',
    color: COLORS.gray900,
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macroText: {
    fontSize: 12,
    fontFamily: 'Manrope_500Medium',
    color: COLORS.gray700,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Manrope_600SemiBold',
    color: COLORS.gray400,
  },
});
