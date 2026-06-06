import { useAppStore } from './useAppStore';
import { pickBackup, writeBackup } from '../utils/backup';

export function useBackup() {
  const exportData = useAppStore((s) => s.exportData);
  const replaceAllData = useAppStore((s) => s.replaceAllData);
  const exportBackup = async () => writeBackup(exportData());
  const importBackup = async () => {
    const picked = await pickBackup();
    if (!picked) return null;
    replaceAllData(picked.payload.data);
    return picked.preview;
  };
  return { exportBackup, importBackup };
}
