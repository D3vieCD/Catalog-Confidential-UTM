export const colors = {
  // Primary Colors (Emerald)
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Secondary Colors (Stone - warm neutral)
  secondary: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Accent Colors (Stone)
  accent: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Semantic Colors
  success: '#059669',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#0891B2',

  // Gradient Backgrounds (statice, fără animație)
  gradients: {
    primary: 'linear-gradient(135deg, #059669, #047857)',
    dark: 'linear-gradient(135deg, #065F46, #064E3B)',
  },
};

export type ColorTheme = typeof colors;
