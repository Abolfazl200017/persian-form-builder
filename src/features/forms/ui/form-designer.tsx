'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { EngineBoundary } from './engine-boundary';

/** Keeps the designer edge-to-edge and tall enough to be usable. */
const designerFrameSx: SxProps<Theme> = {
  width: '100%',
  height: { xs: 760, md: 'calc(100dvh - 420px)' },
  minHeight: { md: 560 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '6px',
  bgcolor: 'background.paper',
  overflow: 'hidden',
};

const DesignerRuntime = dynamic(
  async () => {
    const { configureMonaco } = await import('../engine/monaco');
    configureMonaco();
    return import('./designer-runtime');
  },
  {
    ssr: false,
    loading: () => (
      <Stack
        sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}
        spacing={1.5}
      >
        <CircularProgress size={28} />
        <Typography variant="body2" color="text.secondary">
          در حال بارگذاری طراح…
        </Typography>
      </Stack>
    ),
  },
);

export function FormDesigner() {
  return (
    <EngineBoundary>
      <Box className="engine-host" dir="rtl" sx={designerFrameSx}>
        <DesignerRuntime />
      </Box>
    </EngineBoundary>
  );
}
