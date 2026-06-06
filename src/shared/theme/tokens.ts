export interface ThemeTokens {
  colors: {
    primary: string; primaryLight: string; background: string; surface: string; surfaceElevated: string;
    border: string; borderSubtle: string; textPrimary: string; textSecondary: string; textTertiary: string;
    textOnPrimary: string; success: string; successLight: string; warning: string; warningLight: string;
    danger: string; dangerLight: string; info: string; infoLight: string; tagHealth: string; tagFinance: string;
    tagCareer: string; tagPersonal: string; tagLearning: string; tagSocial: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number };
  radius: { sm: number; md: number; lg: number; xl: number; full: number };
  typography: { fontFamily: { regular: string; medium: string; bold: string }; sizes: { xs: number; sm: number; md: number; lg: number; xl: number; xxl: number; display: number }; lineHeights: { tight: number; normal: number; relaxed: number } };
  shadows: { sm: object; md: object; lg: object };
}

export const baseTokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: {
    fontFamily: { regular: 'System', medium: 'System', bold: 'System' },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, display: 30 },
    lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  },
};
