'use client';

import { ThemeProvider } from 'next-themes';
import siteMetadata from '../../data/siteMetadata';

export function ThemeProviders({ children }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme={siteMetadata.theme}
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}
