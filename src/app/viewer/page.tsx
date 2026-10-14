import { Stack, Typography } from '@mui/material';
import { FormWorkspace } from '@/features/forms/ui/form-workspace';
export const metadata = { title: 'نمایش فرم' };
export default function ViewerPage() {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" gutterBottom>
          نمایش و آزمایش فرم
        </Typography>
        <Typography color="text.secondary">
          فرم ذخیره‌شده را باز کنید و تجربه کاربر را بررسی کنید.
        </Typography>
      </div>
      <FormWorkspace mode="viewer" />
    </Stack>
  );
}
