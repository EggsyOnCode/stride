import React from 'react';
import { Text, View } from 'react-native';
import { Button, Input } from '../../../shared/components';
import type { FrequencyUnit } from '../../../shared/types/domain';
import { useTheme } from '../../../shared/theme/ThemeProvider';

interface FrequencyPickerProps {
  count: string;
  unit: FrequencyUnit;
  onChangeCount: (value: string) => void;
  onChangeUnit: (value: FrequencyUnit) => void;
}

export function FrequencyPicker({ count, unit, onChangeCount, onChangeUnit }: FrequencyPickerProps) {
  const theme = useTheme();
  const numeric = Math.max(1, Number(count || 1));
  const units: FrequencyUnit[] = ['hour', 'day', 'week'];
  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>Frequency</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
        <Text style={{ color: theme.colors.textPrimary }}>Every</Text>
        <View style={{ width: 72 }}>
          <Input value={count} onChangeText={onChangeCount} keyboardType="numeric" />
        </View>
        <View style={{ flexDirection: 'row', gap: theme.spacing.xs, flex: 1 }}>
          {units.map((item) => (
            <Button
              key={item}
              label={numeric === 1 ? item : `${item}s`}
              variant={unit === item ? 'primary' : 'secondary'}
              onPress={() => onChangeUnit(item)}
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </View>
      <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>
        {numeric === 1 ? `Once every ${unit}` : `Repeats every ${numeric} ${unit}s`}
      </Text>
    </View>
  );
}
