export function startOfDayMs(value: number | Date = new Date()): number {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function isoDate(value: number | Date = new Date()): string {
  const date = value instanceof Date ? value : new Date(value);
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromIsoDate(value: string): number {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function formatDate(value: number): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export function formatShortDate(value: number): string {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value));
}

export function formatNumber(value?: number): string {
  if (value === undefined || Number.isNaN(value)) return '-';
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function daysBetween(start: number, end: number): number {
  return Math.round((startOfDayMs(end) - startOfDayMs(start)) / 86400000);
}

export type DurationUnit = 'day' | 'week' | 'month';

export function addDuration(startMs: number, count: number, unit: DurationUnit): number {
  const date = new Date(startMs);
  if (unit === 'day') date.setDate(date.getDate() + count);
  if (unit === 'week') date.setDate(date.getDate() + count * 7);
  if (unit === 'month') date.setMonth(date.getMonth() + count);
  return date.getTime();
}
