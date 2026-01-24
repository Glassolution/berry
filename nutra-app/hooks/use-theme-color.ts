import { useTheme } from '@/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  const { theme, colors } = useTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  // Mapping legacy keys to new design tokens
  if (colorName === 'text') return colors.foreground;
  if (colorName === 'background') return colors.background;
  if (colorName === 'tint') return colors.primary;
  if (colorName === 'icon') return colors.mutedForeground;
  if (colorName === 'tabIconDefault') return colors.mutedForeground;
  if (colorName === 'tabIconSelected') return colors.primary;

  // Allow direct access if key exists
  if (colorName in colors) {
    return (colors as any)[colorName];
  }

  return colors.foreground;
}
