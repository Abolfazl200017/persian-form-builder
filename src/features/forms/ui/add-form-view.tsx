'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { FormDesigner } from './form-designer';
import {
  FORM_TYPE_LABELS,
  FormMetadataFields,
  type FormDraft,
} from './form-metadata-fields';

const INITIAL_DRAFT: FormDraft = { name: '', code: '', type: 'web' };

export function AddFormView() {
  const [draft, setDraft] = useState<FormDraft>(INITIAL_DRAFT);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.75}>
        <Button
          component={Link}
          href="/forms"
          size="small"
          sx={{
            alignSelf: 'flex-start',
            minHeight: 0,
            px: 0.5,
            py: 0.5,
            color: 'text.secondary',
            fontWeight: 500,
            '&:hover': { bgcolor: 'transparent', color: 'text.primary' },
          }}
        >
          بازگشت به فرم‌ها
        </Button>
        <Typography variant="h4" component="h1">
          افزودن فرم
        </Typography>
        <Typography color="text.secondary">
          اطلاعات پایه فرم را وارد کنید و سپس طرح آن را در طراح بسازید.
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
          <Typography variant="subtitle1" component="h2" sx={{ mb: 2 }}>
            اطلاعات فرم
          </Typography>
          <FormMetadataFields
            value={draft}
            onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          />
        </CardContent>
      </Card>

      <Box component="section" aria-labelledby="designer-heading">
        <Stack
          direction="row"
          sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}
        >
          <Typography id="designer-heading" variant="h6" component="h2">
            طراح فرم
          </Typography>
          <Chip
            label={FORM_TYPE_LABELS[draft.type]}
            size="small"
            variant="outlined"
            color="primary"
          />
          {draft.code && (
            <Chip
              dir="ltr"
              label={draft.code}
              size="small"
              variant="outlined"
              sx={{ maxWidth: 220, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
          )}
          <Typography variant="caption" color="text.secondary" sx={{ ms: { md: 'auto' } }}>
            تغییرات در این نسخه ذخیره نمی‌شوند
          </Typography>
        </Stack>
        <FormDesigner />
      </Box>
    </Stack>
  );
}
