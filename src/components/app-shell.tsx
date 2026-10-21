'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar,
  Box,
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { MoonIcon, SunIcon } from '@/components/icons';
import { useThemeMode } from '@/theme/theme-mode-provider';

const NAV_ITEMS = [
  { href: '/', label: 'خانه' },
  { href: '/forms', label: 'فرم‌ها' },
] as const;

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  onNavigate,
  block = false,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
  block?: boolean;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <ButtonBase
      component={Link}
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      sx={{
        width: block ? '100%' : 'auto',
        minHeight: 38,
        px: 1.5,
        borderRadius: '6px',
        justifyContent: 'flex-start',
        color: active ? 'primary.main' : 'text.secondary',
        bgcolor: active ? 'action.selected' : 'transparent',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 500,
        '&:hover': { bgcolor: active ? 'action.selected' : 'action.hover' },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      {label}
    </ButtonBase>
  );
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ButtonBase
      component={Link}
      href="/"
      onClick={onNavigate}
      aria-label="فرم‌ساز، خانه"
      sx={{
        gap: 1.25,
        p: 0.5,
        borderRadius: '6px',
        '&:hover': { bgcolor: 'action.hover' },
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 34,
          height: 34,
          borderRadius: '6px',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontSize: 17,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        ف
      </Box>
      <Box sx={{ textAlign: 'start', lineHeight: 1.3 }}>
        <Typography component="span" sx={{ display: 'block', fontSize: '0.9375rem', fontWeight: 700 }}>
          فرم‌ساز
        </Typography>
        <Typography
          component="span"
          sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary', fontSize: '0.6875rem' }}
        >
          پنل مدیریت فرم
        </Typography>
      </Box>
    </ButtonBase>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="a"
        href="#main"
        sx={{
          position: 'absolute',
          top: 8,
          insetInlineStart: 8,
          zIndex: 1300,
          transform: 'translateY(-200%)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '6px',
          bgcolor: 'background.paper',
          px: 1.5,
          py: 1,
          '&:focus': { transform: 'none' },
        }}
      >
        پرش به محتوا
      </Box>

      <AppBar>
        <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 }, px: { xs: 2, sm: 3, xl: 4 } }}>
          <IconButton
            aria-label="باز کردن منو"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            ☰
          </IconButton>
          <Brand />
          <Stack
            component="nav"
            aria-label="منوی اصلی"
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: 'none', md: 'flex' }, ms: 1 }}
          >
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </Stack>
          <Box sx={{ flex: 1 }} />
          <IconButton
            aria-label={mode === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
            onClick={toggleMode}
            size="small"
            sx={{
              width: 34,
              height: 34,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: 'divider',
              color: 'text.secondary',
            }}
          >
            {mode === 'dark' ? <SunIcon sx={{ fontSize: 18 }} /> : <MoonIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MUI swaps left/right anchors in RTL, so "left" opens from the physical right. */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 280, bgcolor: 'background.paper' } } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          <Brand onNavigate={() => setOpen(false)} />
          <Divider />
          <Stack component="nav" aria-label="منوی موبایل" spacing={0.5}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} block onNavigate={() => setOpen(false)} />
            ))}
          </Stack>
        </Box>
      </Drawer>

      <Box
        component="main"
        id="main"
        sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          px: { xs: 2, sm: 3, xl: 4 },
          py: { xs: 3, md: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
