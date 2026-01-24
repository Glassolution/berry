
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type FruitTheme = 'pear' | 'banana' | 'apple' | 'grape' | 'orange';

const baseColors = {
  light: {
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(220, 20%, 6%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(220, 20%, 6%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(220, 20%, 6%)',
    secondary: 'hsl(220, 14%, 96%)',
    secondaryForeground: 'hsl(220, 20%, 6%)',
    muted: 'hsl(220, 14%, 96%)',
    mutedForeground: 'hsl(220, 8%, 46%)',
    destructive: 'hsl(0, 84%, 60%)',
    destructiveForeground: 'hsl(0, 0%, 98%)',
    border: 'hsl(220, 13%, 91%)',
    input: 'hsl(220, 13%, 91%)',
    ring: 'hsl(84, 85%, 45%)',
    protein: 'hsl(199, 89%, 48%)',
    carbs: 'hsl(45, 93%, 47%)',
    fat: 'hsl(340, 82%, 52%)',
    calories: 'hsl(142, 70%, 45%)',
  },
  dark: {
    background: 'hsl(220, 20%, 6%)',
    foreground: 'hsl(0, 0%, 98%)',
    text: 'hsl(0, 0%, 98%)',
    card: 'hsl(220, 18%, 10%)',
    cardForeground: 'hsl(0, 0%, 98%)',
    popover: 'hsl(220, 18%, 10%)',
    popoverForeground: 'hsl(0, 0%, 98%)',
    secondary: 'hsl(220, 15%, 15%)',
    secondaryForeground: 'hsl(0, 0%, 90%)',
    muted: 'hsl(220, 15%, 18%)',
    mutedForeground: 'hsl(220, 10%, 55%)',
    destructive: 'hsl(0, 72%, 51%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    border: 'hsl(220, 15%, 18%)',
    input: 'hsl(220, 15%, 15%)',
    ring: 'hsl(84, 85%, 45%)',
    protein: 'hsl(199, 89%, 48%)',
    carbs: 'hsl(45, 93%, 47%)',
    fat: 'hsl(340, 82%, 52%)',
    calories: 'hsl(142, 70%, 52%)',
  },
};

const fruitThemes = {
  pear: {
    light: { primary: 'hsl(142, 70%, 45%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(142, 70%, 45%)', accentForeground: 'hsl(220, 20%, 6%)', calories: 'hsl(142, 70%, 45%)' },
    dark: { primary: 'hsl(142, 70%, 45%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(142, 70%, 45%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(142, 70%, 45%)' },
  },
  banana: {
    light: { primary: 'hsl(45, 96%, 46%)', primaryForeground: 'hsl(220, 20%, 6%)', accent: 'hsl(45, 96%, 46%)', accentForeground: 'hsl(220, 20%, 6%)', calories: 'hsl(45, 96%, 46%)' },
    dark: { primary: 'hsl(45, 96%, 53%)', primaryForeground: 'hsl(220, 20%, 6%)', accent: 'hsl(45, 96%, 53%)', accentForeground: 'hsl(220, 20%, 6%)', calories: 'hsl(45, 96%, 53%)' },
  },
  apple: {
    light: { primary: 'hsl(0, 98%, 58%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(0, 98%, 58%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(0, 98%, 58%)' },
    dark: { primary: 'hsl(0, 98%, 62%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(0, 98%, 62%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(0, 98%, 62%)' },
  },
  grape: {
    light: { primary: 'hsl(270, 78%, 48%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(270, 78%, 48%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(270, 78%, 48%)' },
    dark: { primary: 'hsl(270, 78%, 58%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(270, 78%, 58%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(270, 78%, 58%)' },
  },
  orange: {
    light: { primary: 'hsl(24, 95%, 50%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(24, 95%, 50%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(24, 95%, 50%)' },
    dark: { primary: 'hsl(24, 95%, 53%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(24, 95%, 53%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(24, 95%, 53%)' },
  },
  strawberry: {
    light: { primary: 'hsl(0, 0%, 20%)', primaryForeground: 'hsl(0, 0%, 100%)', accent: 'hsl(0, 0%, 20%)', accentForeground: 'hsl(0, 0%, 100%)', calories: 'hsl(0, 0%, 20%)' },
    dark: { primary: 'hsl(0, 0%, 98%)', primaryForeground: 'hsl(220, 20%, 6%)', accent: 'hsl(0, 0%, 98%)', accentForeground: 'hsl(220, 20%, 6%)', calories: 'hsl(0, 0%, 98%)' },
  },
};

export const getThemeColors = (mode: 'light' | 'dark', fruit: FruitTheme = 'pear') => {
  const base = baseColors[mode];
  const fruitColors = fruitThemes[fruit][mode];
  return { ...base, ...fruitColors };
};

export const Colors = {
  light: {
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    tint: tintColorDark,
    icon: '#E5E7EB',
    tabIconDefault: '#E5E7EB',
    tabIconSelected: tintColorDark,
  },
};
