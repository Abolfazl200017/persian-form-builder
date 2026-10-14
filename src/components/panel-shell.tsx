'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
const links = [
  { href: '/', label: 'داشبورد', icon: '◈' },
  { href: '/designer', label: 'طراحی فرم', icon: '▦' },
  { href: '/viewer', label: 'نمایش فرم', icon: '▤' },
];
export function PanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menu = (
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 5 }}>
        <Avatar variant="rounded" sx={{ bgcolor: 'primary.main' }}>
          ف
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 800 }}>فرم‌ساز</Typography>
          <Typography variant="caption" color="text.secondary">
            فضای کار مدیریت
          </Typography>
        </Box>
      </Stack>
      <Typography variant="overline" color="text.secondary">
        منوی اصلی
      </Typography>
      <List>
        {links.map((item) => (
          <ListItemButton
            key={item.href}
            component={Link}
            href={item.href}
            selected={pathname === item.href}
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&.Mui-selected': { bgcolor: '#e5eee9', color: 'primary.main' },
            }}
          >
            <Box aria-hidden sx={{ mr: 1.5, fontSize: 22 }}>
              {item.icon}
            </Box>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: 6, p: 2, bgcolor: '#f5f8f6', borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          فرم‌های شما، به زبان شما
        </Typography>
        <Typography variant="caption" color="text.secondary">
          طراحی بصری با مؤلفه‌های فارسی
        </Typography>
      </Box>
    </Box>
  );
  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Box component="nav" aria-label="منوی اصلی" sx={{ width: { md: 248 }, flexShrink: 0 }}>
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: 248, boxSizing: 'border-box' },
          }}
        >
          {menu}
        </Drawer>
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: 248 } }}
        >
          {menu}
        </Drawer>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: '1px solid #e4e9eb' }}
        >
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              aria-label="باز کردن منو"
              onClick={() => setOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              ☰
            </IconButton>
            <Typography sx={{ flex: 1, fontWeight: 600 }}>
              {links.find((item) => item.href === pathname)?.label ?? 'پنل مدیریت'}
            </Typography>
            <Chip label="فارسی · راست‌به‌چپ" size="small" variant="outlined" />
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: '#e5eee9',
                color: 'primary.main',
                fontSize: 14,
              }}
            >
              مد
            </Avatar>
          </Toolbar>
        </AppBar>
        <Box component="main" id="main" sx={{ p: { xs: 2, md: 4 }, maxWidth: 1800, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
