'use client';
import { Alert, Button, Stack } from '@mui/material';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Stack spacing={2}>
      <Alert severity="error">خطایی رخ داد. لطفاً دوباره تلاش کنید.</Alert>
      <Button onClick={reset}>تلاش دوباره</Button>
    </Stack>
  );
}
