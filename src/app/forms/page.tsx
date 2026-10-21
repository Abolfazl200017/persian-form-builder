import type { Metadata } from 'next';
import { Box, Card, Stack, Typography } from '@mui/material';
import { FormIcon } from '@/components/icons';
import { CreateFormButton } from '@/features/forms/ui/create-form-button';

export const metadata: Metadata = { title: 'فرم‌ها' };

export default function FormsPage() {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            فرم‌ها
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            فرم‌های سازمان را در یک‌جا بسازید.
          </Typography>
        </Box>
        <CreateFormButton />
      </Stack>

      <Card sx={{ borderStyle: 'dashed', bgcolor: 'transparent' }}>
        <Stack
          spacing={1.5}
          sx={{ alignItems: 'center', textAlign: 'center', px: 3, py: { xs: 6, md: 9 } }}
        >
          <Box
            aria-hidden
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 48,
              height: 48,
              borderRadius: '6px',
              bgcolor: 'action.selected',
              color: 'primary.main',
            }}
          >
            <FormIcon sx={{ fontSize: 26 }} />
          </Box>
          <Typography variant="h6" component="h2">
            هنوز فرمی ساخته نشده است
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440 }}>
            با دکمه «ایجاد فرم» اولین فرم را بسازید؛ نام، کد و نوع فرم را تعیین می‌کنید و سپس با
            طراح بصری ادامه می‌دهید.
          </Typography>
        </Stack>
      </Card>
    </Stack>
  );
}
