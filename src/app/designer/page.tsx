import { Stack, Typography } from '@mui/material';
import { FormWorkspace } from '@/features/forms/ui/form-workspace';
export const metadata = { title: 'طراحی فرم' };
export default function DesignerPage() {
  return (
    <Stack spacing={3}>
      <BoxHeading />
      <FormWorkspace mode="designer" />
    </Stack>
  );
}
function BoxHeading() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        طراحی فرم
      </Typography>
      <Typography color="text.secondary">
        مؤلفه‌ها را به فرم اضافه کنید و ویژگی‌های آن‌ها را تنظیم کنید.
      </Typography>
    </div>
  );
}
