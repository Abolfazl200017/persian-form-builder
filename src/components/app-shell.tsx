'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { useThemeMode } from '@/theme/theme-mode-provider';

const NAV_ITEMS = [
  { href: '/', label: 'خانه' },
  { href: '/forms', label: 'فرم‌ها' },
] as const;
function isActive(path: string, href: string) {
  return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
}
function NavLinks({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const path = usePathname();
  return (
    <nav
      aria-label={mobile ? 'منوی موبایل' : 'منوی اصلی'}
      className={mobile ? 'grid gap-1' : 'hidden items-center gap-1 md:flex'}
    >
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          aria-current={isActive(path, item.href) ? 'page' : undefined}
          className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${isActive(path, item.href) ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-md"
      aria-label="فرم‌ساز، خانه"
    >
      <span className="grid size-9 place-items-center rounded-md bg-primary text-lg font-extrabold text-primary-foreground">
        ف
      </span>
      <span className="grid leading-tight">
        <strong className="text-sm">فرم‌ساز</strong>
        <small className="hidden text-muted-foreground sm:block">پنل مدیریت فرم</small>
      </span>
    </Link>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();
  return (
    <div className="glass-page flex min-h-dvh flex-col text-foreground">
      <a
        href="#main"
        className="absolute start-2 top-2 z-[1400] -translate-y-24 rounded-md border border-border bg-card px-4 py-2 focus:translate-y-0"
      >
        پرش به محتوا
      </a>
      <header className="glass-chrome sticky top-0 z-40 border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 xl:px-8">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            aria-label="باز کردن منو"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            ☰
          </Button>
          <Brand />
          <NavLinks />
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            className="size-9 p-0"
            aria-label={mode === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
            onClick={toggleMode}
          >
            {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
        {open && (
          <div className="glass-chrome border-t border-border p-3 md:hidden">
            <NavLinks mobile onNavigate={() => setOpen(false)} />
          </div>
        )}
      </header>
      <main
        id="main"
        className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 md:py-8 xl:px-8"
      >
        {children}
      </main>
    </div>
  );
}
