import type { Metadata } from 'next';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import './globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/app-shell';
export const metadata: Metadata = {
  title: { default: 'فرم‌ساز | پنل مدیریت', template: '%s | فرم‌ساز' },
  description: 'پنل فارسی طراحی و نمایش فرم با FormEngine و Material UI',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
