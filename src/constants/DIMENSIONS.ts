import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const DIMENSIONS = {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  IS_SMALL_DEVICE: width < 375,
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',

  // Spacing
  PADDING_HORIZONTAL: 20,
  PADDING_VERTICAL: 16,
  CARD_RADIUS: 16,
  BUTTON_RADIUS: 14,
  INPUT_RADIUS: 12,

  // Heights
  HEADER_HEIGHT: Platform.OS === 'ios' ? 54 : 50,
  TAB_BAR_HEIGHT: Platform.OS === 'ios' ? 84 : 64,
  BUTTON_HEIGHT: 50,
  INPUT_HEIGHT: 50,
};

export default DIMENSIONS;
