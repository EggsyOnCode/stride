import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const theme = useTheme();
  const content = <View style={{ flex: 1, gap: theme.spacing.md, padding: theme.spacing.md }}>{children}</View>;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="always"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: theme.spacing.xxl * 5 }}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
