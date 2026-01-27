import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface Props {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const SparkleIcon = ({ size = 24, color = '#FFFFFF', style }: Props) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d="M12 5C12 9 15 12 19 12C15 12 12 15 12 19C12 15 9 12 5 12C9 12 12 9 12 5Z"
        fill={color}
      />
      <Path
        d="M20 1.5C20 3 21.5 4 22.5 4C21.5 4 20 5 20 6.5C20 5 18.5 4 17.5 4C18.5 4 20 3 20 1.5Z"
        fill={color}
      />
      <Path
        d="M4 17.5C4 19 5.5 20 6.5 20C5.5 20 4 21 4 22.5C4 21 2.5 20 1.5 20C2.5 20 4 19 4 17.5Z"
        fill={color}
      />
    </Svg>
  );
};
