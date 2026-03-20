import { BrandTheme } from './config';

export const getThemeStyles = (theme: BrandTheme) => {
  return {
    '--brand-primary': theme.primary,
    '--brand-secondary': theme.secondary,
    '--brand-accent': theme.accent,
  } as React.CSSProperties;
};
