import { baseTokens, ThemeTokens } from './tokens';

export const lightTheme: ThemeTokens = {
  colors: {
    primary: '#5B6AF0', primaryLight: '#EEF0FD', background: '#FFFFFF', surface: '#F7F8FC', surfaceElevated: '#FFFFFF',
    border: '#E2E5F0', borderSubtle: '#F0F2F8', textPrimary: '#111827', textSecondary: '#6B7280', textTertiary: '#9CA3AF', textOnPrimary: '#FFFFFF',
    success: '#22C55E', successLight: '#F0FDF4', warning: '#F59E0B', warningLight: '#FFFBEB', danger: '#EF4444', dangerLight: '#FEF2F2', info: '#3B82F6', infoLight: '#EFF6FF',
    tagHealth: '#10B981', tagFinance: '#6366F1', tagCareer: '#F59E0B', tagPersonal: '#EC4899', tagLearning: '#8B5CF6', tagSocial: '#14B8A6',
  },
  ...baseTokens,
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  },
};
