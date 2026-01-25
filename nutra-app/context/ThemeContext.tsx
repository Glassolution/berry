import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { getThemeColors, FruitTheme } from '@/constants/Colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fruit: FruitTheme;
  setFruit: (fruit: FruitTheme) => void;
  colors: ReturnType<typeof getThemeColors>;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  fruit: 'pear',
  setFruit: () => {},
  colors: getThemeColors('light', 'pear'),
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useNativeColorScheme();
  const [theme, setTheme] = useState<Theme>('light');
  const [fruit, setFruit] = useState<FruitTheme>('pear');

  const colors = getThemeColors(theme, fruit);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fruit, setFruit, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
