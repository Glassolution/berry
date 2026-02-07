// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle, StyleSheet } from 'react-native';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'calendar': 'calendar-today',
  'chart.bar.fill': 'bar-chart',
  'fork.knife': 'restaurant',
  'magnifyingglass': 'search',
  'sparkles': 'auto-awesome',
  'bell.fill': 'notifications',
  'person.circle': 'person',
  'leaf': 'spa',
  'bowl': 'rice-bowl',
  'dumbbell': 'fitness-center',
  'snack': 'emoji-food-beverage',
  'drink': 'local-drink',
  'square.grid.2x2': 'grid-view',
  'book': 'menu-book',
  'plus': 'add',
  'person': 'person',
  'shield': 'security',
  'paintpalette': 'palette',
  'camera': 'camera-alt',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'sun.max': 'wb-sunny',
  'moon': 'nightlight-round',
  'trash': 'delete',
  'logout': 'logout',
  'rectangle.portrait.and.arrow.right': 'logout',
  'checkmark': 'check',
  'chevron.down': 'keyboard-arrow-down',
  'xmark': 'close',
  'flame': 'local-fire-department',
  'clock': 'schedule',
} as const satisfies Record<string, MaterialIconName>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const mappedName = MAPPING[name] ?? 'help';
  return <MaterialIcons color={color} size={size} name={mappedName} style={StyleSheet.flatten(style)} />;
}
