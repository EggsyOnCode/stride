import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function BottomSheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
          <Pressable style={{ backgroundColor: theme.colors.surfaceElevated, borderTopLeftRadius: theme.radius.xl, borderTopRightRadius: theme.radius.xl, maxHeight: '88%' }}>
            <ScrollView
              keyboardShouldPersistTaps="always"
              automaticallyAdjustKeyboardInsets
              contentContainerStyle={{ gap: theme.spacing.md, padding: theme.spacing.lg, paddingBottom: theme.spacing.xxl * 3 }}
            >
              {children}
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
