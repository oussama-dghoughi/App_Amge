import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  background: '#FFFFFF',
  card: '#F2F2F7',
  text: '#000000',
  subText: '#8E8E93',
  border: '#C7C7CC',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  error: '#FF3B30',
  transparent: 'transparent',
  glass: 'rgba(255, 255, 255, 0.8)',
  shadow: '#000000',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  padding: 24,
  radius: 12,
  width,
  height,
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 8,
  },
};

export const ANIMATIONS = {
  spring: {
    tension: 50,
    friction: 7,
    useNativeDriver: true,
  },
  timing: {
    duration: 350,
    useNativeDriver: true,
  },
  layout: {
    duration: 300,
    create: {
      type: 'spring',
      property: 'opacity',
      springDamping: 0.7,
    },
    update: {
      type: 'spring',
      springDamping: 0.7,
    },
    delete: {
      type: 'spring',
      property: 'opacity',
      springDamping: 0.7,
    },
  },
}; 