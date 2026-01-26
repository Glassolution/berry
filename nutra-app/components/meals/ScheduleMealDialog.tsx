import React from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export function ScheduleMealDialog({ isOpen, onClose, selectedDate }: Props) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={StyleSheet.flatten([styles.modalView, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: colors.border }])}>
          <View style={styles.header}>
            <ThemedText type="subtitle">Agendar Refeição</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.icon} />
            </Pressable>
          </View>
          
          <View style={styles.content}>
             <ThemedText>Para o dia {selectedDate.toLocaleDateString()}</ThemedText>
             {/* Form would go here */}
          </View>

          <Pressable 
            style={StyleSheet.flatten([styles.button, { backgroundColor: colors.primary }])}
            onPress={onClose}
          >
            <ThemedText style={{ color: '#fff' }}>Salvar</ThemedText>
          </Pressable>
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
  button: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
