'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { CollapseIcon, ExpandIcon } from '@/components/icons';
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
  p: '8px',
};

const fullscreenWrapperSx: SxProps<Theme> = {
  position: 'fixed',
  inset: 0,
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  p: { xs: 1, md: 1.5 },
  bgcolor: 'background.default',
};

const fullscreenFrameSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  width: '100%',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '6px',
  bgcolor: 'background.paper',
  overflow: 'hidden',
  p: '8px',
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

export function FormDesigner({
  onSchemaChange,
}: {
  onSchemaChange?: (formSchema: string) => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!fullscreen) return;
    exitButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('.rs-modal')) setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen]);

  return (
    <Box component="section" aria-labelledby="designer-heading">
      <Stack
        direction="row"
        sx={{
          display: fullscreen ? 'none' : 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography id="designer-heading" variant="h6" component="h2">
          طراح فرم
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setFullscreen(true)}
          startIcon={<ExpandIcon sx={{ fontSize: 17 }} />}
          sx={{ ms: 'auto' }}
        >
          تمام‌صفحه
        </Button>
      </Stack>

      <Box sx={fullscreen ? fullscreenWrapperSx : undefined}>
        <Stack
          direction="row"
          sx={{
            display: fullscreen ? 'flex' : 'none',
            alignItems: 'center',
            gap: 1,
            px: 0.5,
          }}
        >
          <Typography variant="subtitle1" component="h2">
            طراح فرم
          </Typography>
          <Button
            ref={exitButtonRef}
            size="small"
            variant="outlined"
            onClick={() => setFullscreen(false)}
            startIcon={<CollapseIcon sx={{ fontSize: 17 }} />}
            sx={{ ms: 'auto' }}
          >
            حالت پنجره
          </Button>
        </Stack>

        <EngineBoundary>
          <Box
            className="engine-host"
            dir="rtl"
            sx={fullscreen ? fullscreenFrameSx : designerFrameSx}
          >
            <DesignerRuntime onSchemaChange={onSchemaChange} />
          </Box>
        </EngineBoundary>
      </Box>
    </Box>
  );
}
