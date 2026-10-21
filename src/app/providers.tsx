'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { ThemeModeProvider } from '@/theme/theme-mode-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] }}>
      <ThemeModeProvider>{children}</ThemeModeProvider>
    </AppRouterCacheProvider>
  );
}
