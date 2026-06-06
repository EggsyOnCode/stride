import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { BackupPayload, DomainData, KPI, KPILog } from '../types/domain';

export interface ImportPreview { goalCount: number; habitCount: number; logCount: number; conflicts: string[] }

export async function writeBackup(payload: BackupPayload): Promise<string> {
  const uri = `${FileSystem.documentDirectory}GoalPlanner_${Date.now()}.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/json' });
  return uri;
}

export async function pickBackup(): Promise<{ payload: BackupPayload; preview: ImportPreview } | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  if (result.canceled) return null;
  const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
  const payload = JSON.parse(content) as BackupPayload;
  if (payload.version !== 1 || !payload.data) throw new Error('Invalid backup file');
  return { payload, preview: previewBackup(payload.data) };
}

export function previewBackup(data: DomainData): ImportPreview {
  return { goalCount: data.goals.length, habitCount: data.habits.length, logCount: data.kpiLogs.length + data.habitKpiLogs.length, conflicts: [] };
}

export async function exportKpiCsv(kpi: KPI, logs: KPILog[]): Promise<string> {
  const rows = ['date,value,note', ...logs.map((log) => `${new Date(log.logDate).toISOString()},${log.value},"${(log.note ?? '').replaceAll('"', '""')}"`)];
  const uri = `${FileSystem.documentDirectory}${kpi.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`;
  await FileSystem.writeAsStringAsync(uri, rows.join('\n'));
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'text/csv' });
  return uri;
}
