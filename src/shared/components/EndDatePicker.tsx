import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';
import { DatePicker } from './DatePicker';
import { Input } from './Input';
import { useTheme } from '../theme/ThemeProvider';
import { addDuration, DurationUnit, formatDate, fromIsoDate, isoDate } from '../utils/formatters';

interface EndDatePickerProps {
  label: string;
  startMs: number;
  value?: number;
  onChange: (value: number | undefined) => void;
  allowNone?: boolean;
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function EndDatePicker({ label, startMs, value, onChange, allowNone }: EndDatePickerProps) {
  const theme = useTheme();
  const [mode, setMode] = React.useState<'date' | 'duration'>('date');
  const [dateText, setDateText] = React.useState(isoDate(value ?? addDuration(startMs, 30, 'day')));
  const [count, setCount] = React.useState('30');
  const [unit, setUnit] = React.useState<DurationUnit>('day');

  const handleDateText = (text: string) => {
    setDateText(text);
    if (ISO_RE.test(text)) {
      const ms = fromIsoDate(text);
      if (!Number.isNaN(ms)) onChange(ms);
    }
  };

  const applyDuration = (nextCount: string, nextUnit: DurationUnit) => {
    const n = Math.max(1, Number(nextCount || 1));
    onChange(addDuration(startMs, n, nextUnit));
  };

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: theme.spacing.xs }}>
        <Button label="Exact date" variant={mode === 'date' ? 'primary' : 'secondary'} onPress={() => setMode('date')} style={{ flex: 1 }} />
        <Button label="Duration" variant={mode === 'duration' ? 'primary' : 'secondary'} onPress={() => { setMode('duration'); applyDuration(count, unit); }} style={{ flex: 1 }} />
        {allowNone ? <Button label="None" variant={value === undefined ? 'primary' : 'secondary'} onPress={() => onChange(undefined)} style={{ flex: 1 }} /> : null}
      </View>
      {mode === 'date' ? (
        <DatePicker label="" value={dateText} onChange={handleDateText} />
      ) : (
        <View style={{ gap: theme.spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <Text style={{ color: theme.colors.textPrimary }}>For</Text>
            <View style={{ width: 72 }}>
              <Input value={count} onChangeText={(text) => { setCount(text); applyDuration(text, unit); }} keyboardType="numeric" />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.xs, flex: 1 }}>
              {(['day', 'week', 'month'] as DurationUnit[]).map((item) => (
                <Button key={item} label={`${item}s`} variant={unit === item ? 'primary' : 'secondary'} onPress={() => { setUnit(item); applyDuration(count, item); }} style={{ flex: 1 }} />
              ))}
            </View>
          </View>
          <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>Ends {value ? formatDate(value) : '-'}</Text>
        </View>
      )}
    </View>
  );
}
