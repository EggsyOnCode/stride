import { useAppStore } from '../../../shared/hooks/useAppStore';

export function useSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  return { settings, updateSettings };
}
