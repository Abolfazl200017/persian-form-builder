'use client';
import Link from 'next/link';
import { Button, Stack, Typography } from '@mui/material';
export default function NotFound() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">صفحه پیدا نشد</Typography>
      <Button component={Link} href="/">
        بازگشت به داشبورد
      </Button>
    </Stack>
  );
}
