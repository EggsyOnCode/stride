export function required(value: string, field: string): string | undefined {
  return value.trim() ? undefined : `${field} is required`;
}

export function dateRange(start: number, end: number): string | undefined {
  return end >= start ? undefined : 'Due date must be after start date';
}

export function numberValue(value: string, field: string): string | undefined {
  if (value.trim() === '') return `${field} is required`;
  return Number.isFinite(Number(value)) ? undefined : `${field} must be numeric`;
}
