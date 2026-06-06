import { baseTokens, ThemeTokens } from './tokens';

export const darkTheme: ThemeTokens = {
  colors: {
    primary: '#818CF8', primaryLight: '#1E2054', background: '#0F1117', surface: '#1A1D27', surfaceElevated: '#22263A',
    border: '#2A2D3E', borderSubtle: '#1E2133', textPrimary: '#F1F3F9', textSecondary: '#9CA3AF', textTertiary: '#6B7280', textOnPrimary: '#FFFFFF',
    success: '#4ADE80', successLight: '#052E16', warning: '#FCD34D', warningLight: '#1C1400', danger: '#F87171', dangerLight: '#2D0000', info: '#60A5FA', infoLight: '#0C1A35',
    tagHealth: '#34D399', tagFinance: '#818CF8', tagCareer: '#FCD34D', tagPersonal: '#F472B6', tagLearning: '#A78BFA', tagSocial: '#2DD4BF',
  },
  ...baseTokens,
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  },
};
