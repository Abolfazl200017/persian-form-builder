'use client';

import { ThemeModeProvider } from '@/theme/theme-mode-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeModeProvider>{children}</ThemeModeProvider>;
}
