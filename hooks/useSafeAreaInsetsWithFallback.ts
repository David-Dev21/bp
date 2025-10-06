import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeAreaInsetsWithFallback = () => {
  try {
    return useSafeAreaInsets();
  } catch (error) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
};
