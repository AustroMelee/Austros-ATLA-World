import { createTheme } from '@vanilla-extract/css';

export const [darkThemeClass, vars] = createTheme({
  colors: {
    primary: '#18181a',
    primarySoft: '#23232a',
    accent: '#0094ff',
    border: '#333',
    heading: '#f7f7fa',
    text: '#f7f7fa',
    onPrimary: '#fff',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2.5rem',
  },
  radius: {
    sm: '8px',
    md: '18px',
    lg: '36px',
  },
  fonts: {
    heading: `'Segoe UI', 'Inter', sans-serif`,
    body: `'Segoe UI', 'Inter', sans-serif`,
  },
});
