'use client';
import { Alert, Button } from '@/components/ui';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid gap-4">
      <Alert>خطایی رخ داد. لطفاً دوباره تلاش کنید.</Alert>
      <Button onClick={reset}>تلاش دوباره</Button>
    </div>
  );
}
