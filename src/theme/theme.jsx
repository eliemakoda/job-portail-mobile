export const theme = {
  colors: {
    primary: '#2A5C99',       // Deep blue - for primary actions and headers
    primaryDark: '#1E3F66',   // Darker blue - for pressed states
    secondary: '#4A8FE7',     // Lighter blue - for secondary elements
    background: '#FFFFFF',    // Pure white background
    surface: '#F8F9FA',       // Light gray for surfaces/cards
    error: '#D32F2F',         // Red for errors
    text: '#212121',          // Dark gray for primary text
    textSecondary: '#757575', // Medium gray for secondary text
    textTertiary: '#BDBDBD',  // Light gray for placeholder/disabled
    border: '#E0E0E0',        // Very light gray for borders
    success: '#388E3C',       // Green for success messages
    warning: '#F57C00',       // Orange for warnings
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body1: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
    borderWidth: 1,
  },
    shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    }
  }
};