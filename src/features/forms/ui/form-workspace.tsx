'use client';
import dynamic from 'next/dynamic';
import { Alert, CircularProgress } from '@mui/material';
import { EngineBoundary } from './engine-boundary';
const Designer = dynamic(
  async () => {
    const { configureMonaco } = await import('../engine/monaco');
    configureMonaco();
    return import('./designer-workspace');
  },
  {
    ssr: false,
    loading: () => <CircularProgress aria-label="بارگذاری طراح" />,
  },
);
const Viewer = dynamic(() => import('./viewer-workspace'), {
  ssr: false,
  loading: () => <CircularProgress aria-label="بارگذاری فرم" />,
});
export function FormWorkspace({ mode }: { mode: 'designer' | 'viewer' }) {
  return (
    <EngineBoundary>
      {mode === 'designer' ? (
        <>
          <Alert severity="info" sx={{ mb: 2 }}>
            طراح به مجوز FormEngine نیاز دارد. فرم‌ها در مرورگر شما ذخیره می‌شوند.
          </Alert>
          <Designer />
        </>
      ) : (
        <Viewer />
      )}
    </EngineBoundary>
  );
}
