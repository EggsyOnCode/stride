import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from './BottomSheet';
import { useTheme } from '../theme/ThemeProvider';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectProps<T extends string> {
  label?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

export function Select<T extends string>({ label, value, options, onChange }: SelectProps<T>) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const current = options.find((option) => option.value === value);
  return (
    <View style={{ gap: theme.spacing.xs }}>
      {label ? <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceElevated, paddingHorizontal: theme.spacing.md, minHeight: 44 }}
      >
        <Text style={{ color: theme.colors.textPrimary, fontWeight: '600' }}>{current?.label ?? 'Select'}</Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        {label ? <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.lg, fontWeight: '800', marginBottom: theme.spacing.sm }}>{label}</Text> : null}
        <View style={{ gap: theme.spacing.xs }}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => { onChange(option.value); setOpen(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.sm, borderRadius: theme.radius.md, backgroundColor: selected ? theme.colors.surface : 'transparent' }}
              >
                <Text style={{ color: selected ? theme.colors.primary : theme.colors.textPrimary, fontWeight: selected ? '800' : '500' }}>{option.label}</Text>
                {selected ? <Ionicons name="checkmark" size={18} color={theme.colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}
