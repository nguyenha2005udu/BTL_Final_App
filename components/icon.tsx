import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

export const MaterialIcons: React.FC<IconProps> = ({ name, size = 24, color = 'black', style }) => {
  // Convert hyphen-case (arrow-back) to snake_case (arrow_back) for Google Material Icons ligature
  const iconName = name.replace(/-/g, '_');
  
  return (
    <Text 
      style={[
        styles.icon, 
        { fontSize: size, color }, 
        style
      ]}
    >
      {iconName}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'Material Icons',
    fontWeight: 'normal',
    fontStyle: 'normal',
    // @ts-ignore - web only property
    userSelect: 'none',
  },
});