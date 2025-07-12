// Strongly-typed theme contract for vanilla-extract theme imports
export type ThemeVars = {
  colors: {
    primary: string;
    primarySoft: string;
    accent: string;
    border: string;
    heading: string;
    text: string;
    onPrimary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}; 