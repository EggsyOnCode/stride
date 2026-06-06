import React from 'react';
import { Input } from './Input';

interface DatePickerProps { label: string; value: string; onChange: (value: string) => void }

export function DatePicker({ label, value, onChange }: DatePickerProps) {
  return <Input label={label} value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" autoCapitalize="none" />;
}
