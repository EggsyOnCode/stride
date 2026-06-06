import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import type { ThemeTokens } from './tokens';
import { useAppStore } from '../hooks/useAppStore';

const ThemeContext = createContext<ThemeTokens>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const themeSetting = useAppStore((state) => state.settings.theme);
  const value = useMemo(() => {
    if (themeSetting === 'light') return lightTheme;
    if (themeSetting === 'dark') return darkTheme;
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  }, [systemScheme, themeSetting]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext);
}
