'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import { PlusIcon } from '@/components/icons';

export function CreateFormButton() {
  return (
    <Button
      component={Link}
      href="/forms/new"
      variant="contained"
      startIcon={<PlusIcon sx={{ fontSize: 18 }} />}
    >
      ایجاد فرم
    </Button>
  );
}
