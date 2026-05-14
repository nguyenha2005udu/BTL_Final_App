import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base design at 390px wide (iPhone 14 / Pixel 7)
const BASE_WIDTH = 390;

/**
 * Scale a size proportionally to the screen width.
 * Clamps between 0.8x and 1.3x to avoid extremes on very small/large screens.
 */
export function scale(size: number): number {
  const ratio = SCREEN_WIDTH / BASE_WIDTH;
  const clamped = Math.min(Math.max(ratio, 0.8), 1.3);
  return Math.round(PixelRatio.roundToNearestPixel(size * clamped));
}

/**
 * Scale fonts — less aggressive than layout scaling.
 * Clamps between 0.85x and 1.2x.
 */
export function fontScale(size: number): number {
  const ratio = SCREEN_WIDTH / BASE_WIDTH;
  const clamped = Math.min(Math.max(ratio, 0.85), 1.2);
  return Math.round(PixelRatio.roundToNearestPixel(size * clamped));
}

/** Screen dimensions */
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 360,   // small phones: Galaxy A series, older iPhones
  isMedium: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 430, // most phones
  isLarge: SCREEN_WIDTH >= 430,  // large phones: Pro Max, tablets
};

/** Common spacing tokens */
export const SPACING = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
};

/** Common font sizes */
export const FONT_SIZE = {
  caption: fontScale(11),
  small: fontScale(12),
  body: fontScale(13),
  bodyMd: fontScale(14),
  bodyLg: fontScale(15),
  subtitle: fontScale(16),
  title: fontScale(18),
  titleLg: fontScale(20),
  heading: fontScale(22),
  headingLg: fontScale(24),
  display: fontScale(28),
};

/** Common border radius tokens */
export const RADIUS = {
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(18),
  xxl: scale(20),
  pill: 999,
};

/** Bottom nav height — account for bottom inset on notched devices */
export const BOTTOM_NAV_HEIGHT = scale(60);
