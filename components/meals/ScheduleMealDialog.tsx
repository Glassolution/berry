import React, { useState, useMemo } from 'react';
import { Modal, StyleSheet, View, Pressable, TextInput, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMealNotifications } from '@/hooks/useMealNotifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RECIPES, Goal } from '@/app/(tabs)/recipes';
import { useNutritionStore } from '@/hooks/useNutritionStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export function ScheduleMealDialog({ isOpen, onClose, selectedDate }: Props) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const { time, enable, setReminder, scheduleOnce } = useMealNotifications();
  const { addReminder } = useNutritionStore();
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<'water' | 'recipe'>('water');
  const [selRecipe, setSelRecipe] = useState<{ id: string; name: string } | null>(null);
  const [titleInput, setTitleInput] = useState<string>('');
  const [pickedHour, setPickedHour] = useState<number>(time.hour);
  const [pickedMinute, setPickedMinute] = useState<number>(time.minute);
  const [showRecipeList, setShowRecipeList] = useState(false);
  const [selGoal, setSelGoal] = useState<Goal>('maintain');

  const filteredRecipes = useMemo(() => {
    return RECIPES[selGoal].map(r => ({ id: r.id, name: r.name }));
  }, [selGoal]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={StyleSheet.flatten([styles.modalView, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: colors.border, paddingBottom: 24 + insets.bottom }])}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Adicionar</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </Pressable>
          </View>
          
          <View style={styles.content}>
             <ThemedText>Nome do Lembrete</ThemedText>
             <View style={styles.row}>
               <Pressable
                 style={StyleSheet.flatten([
                   styles.chip,
                   { borderColor: colors.border, backgroundColor: kind === 'water' ? colors.primary : 'transparent' },
                 ])}
                 onPress={() => setKind('water')}
               >
                 <ThemedText style={{ color: kind === 'water' ? colors.primaryForeground : colors.foreground }}>
                  Lembrete
                 </ThemedText>
               </Pressable>
               <Pressable
                 style={StyleSheet.flatten([
                   styles.chip,
                   { borderColor: colors.border, backgroundColor: kind === 'recipe' ? colors.primary : 'transparent' },
                 ])}
                 onPress={() => setKind('recipe')}
               >
                 <ThemedText style={{ color: kind === 'recipe' ? colors.primaryForeground : colors.foreground }}>
                  Rotina
                 </ThemedText>
               </Pressable>
             </View>
             {kind === 'water' ? (
               <View style={styles.row}>
                 <TextInput
                   value={titleInput}
                   onChangeText={setTitleInput}
                    placeholder="Ex: Beber água"
                   placeholderTextColor={colors.mutedForeground as string}
                   style={StyleSheet.flatten([styles.input, { borderColor: colors.border, color: colors.foreground }])}
                 />
               </View>
             ) : (
               <View>
                 <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                    {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setSelGoal(g)}
                        style={StyleSheet.flatten([
                          styles.chip,
                          {
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            backgroundColor: selGoal === g ? colors.primary : 'transparent',
                            borderColor: colors.border
                          }
                        ])}
                      >
                        <ThemedText style={{ fontSize: 12, color: selGoal === g ? colors.primaryForeground : colors.foreground }}>
                          {g === 'lose' ? 'Emagrecimento' : g === 'maintain' ? 'Manutenção' : 'Hipertrofia'}
                        </ThemedText>
                      </Pressable>
                    ))}
                 </View>

                 <Pressable
                   style={StyleSheet.flatten([styles.input, { borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }])}
                   onPress={() => setShowRecipeList(!showRecipeList)}
                 >
                   <ThemedText style={{ color: selRecipe ? colors.foreground : colors.mutedForeground }}>
                     {selRecipe ? selRecipe.name : 'Escolher receita...'}
                   </ThemedText>
                   <IconSymbol name="chevron.down" size={16} color={colors.icon} />
                 </Pressable>
                 
                 {showRecipeList && (
                   <View style={StyleSheet.flatten([styles.recipeListContainer, { borderColor: colors.border, backgroundColor: isDark ? '#2a2a2a' : '#f9f9f9' }])}>
                     <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                       {filteredRecipes.map((r) => (
                         <Pressable
                           key={r.id}
                           style={styles.recipeItem}
                           onPress={() => {
                             setSelRecipe(r);
                             setShowRecipeList(false);
                           }}
                         >
                           <ThemedText>{r.name}</ThemedText>
                         </Pressable>
                       ))}
                     </ScrollView>
                   </View>
                 )}
               </View>
             )}
             {kind === 'water' ? (
               <View style={styles.row}>
                 <View style={styles.timeBox}>
                   <Pressable
                     style={StyleSheet.flatten([styles.timeButton, { borderColor: colors.border }])}
                     onPress={() => setPickedHour((h) => (h + 23) % 24)}
                   >
                     <ThemedText>-</ThemedText>
                   </Pressable>
                   <ThemedText style={styles.timeValue}>
                     {String(pickedHour).padStart(2, '0')}
                   </ThemedText>
                   <Pressable
                     style={StyleSheet.flatten([styles.timeButton, { borderColor: colors.border }])}
                     onPress={() => setPickedHour((h) => (h + 1) % 24)}
                   >
                     <ThemedText>+</ThemedText>
                   </Pressable>
                   <ThemedText style={styles.timeValue}>:</ThemedText>
                   <Pressable
                     style={StyleSheet.flatten([styles.timeButton, { borderColor: colors.border }])}
                     onPress={() => setPickedMinute((m) => (m + 59) % 60)}
                   >
                     <ThemedText>-</ThemedText>
                   </Pressable>
                   <ThemedText style={styles.timeValue}>
                     {String(pickedMinute).padStart(2, '0')}
                   </ThemedText>
                   <Pressable
                     style={StyleSheet.flatten([styles.timeButton, { borderColor: colors.border }])}
                     onPress={() => setPickedMinute((m) => (m + 1) % 60)}
                   >
                     <ThemedText>+</ThemedText>
                   </Pressable>
                 </View>
               </View>
             ) : null}
             
          </View>

          <View style={{ gap: 12, marginTop: 16 }}>
            <Pressable 
              style={StyleSheet.flatten([styles.button, { backgroundColor: colors.primary }])}
              onPress={async () => {
                const reminderTitle = kind === 'water' ? (titleInput?.trim() || 'Lembrete') : (selRecipe?.name || 'Rotina');
                const chosenTime = kind === 'water' ? { hour: pickedHour, minute: pickedMinute } : { hour: time.hour, minute: time.minute };
                const when = new Date(selectedDate);
                when.setHours(chosenTime.hour, chosenTime.minute, 0, 0);
                
                // Save specific date reminder to store
                const reminder: RoutineReminder = {
                  id: Math.random().toString(36).slice(2),
                  hour: chosenTime.hour,
                  minute: chosenTime.minute,
                  name: reminderTitle,
                  type: kind,
                  date: when.toISOString(), // Specific date
                  active: true
                };
                await addReminder(reminder);

                await scheduleOnce(when, reminderTitle);
                onClose();
              }}
            >
              <ThemedText style={{ color: isDark ? '#000' : '#fff' }}>Adicionar Lembrete</ThemedText>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable 
                style={StyleSheet.flatten([styles.button, { borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent', flex: 1 }])}
                onPress={async () => {
                  const reminderTitle = kind === 'water' ? (titleInput?.trim() || 'Lembrete') : (selRecipe?.name || 'Rotina');
                  const chosenTime = kind === 'water' ? { hour: pickedHour, minute: pickedMinute } : { hour: time.hour, minute: time.minute };
                  
                  // Add to global store
                  const reminder: RoutineReminder = {
                    id: Math.random().toString(36).slice(2),
                    hour: chosenTime.hour,
                    minute: chosenTime.minute,
                    name: reminderTitle,
                    type: kind,
                    // Treat as daily recurring - no specific date bound
                    date: undefined, 
                    active: true
                  };
                  await addReminder(reminder);

                  // Schedule system notification
                  await setReminder(chosenTime, reminderTitle);
                  await enable(true);
                  onClose();
                }}
              >
                <ThemedText style={{ textAlign: 'center' }}>Adicionar à Rotina</ThemedText>
              </Pressable>
              <Pressable 
                style={StyleSheet.flatten([styles.button, { borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent', flex: 1 }])}
                onPress={onClose}
              >
                <ThemedText style={{ textAlign: 'center' }}>Cancelar</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderBottomWidth: 0,
    elevation: 5,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  content: {
    flex: 1,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 240,
  },
  recipeListContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipeItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  button: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
