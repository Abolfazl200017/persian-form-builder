'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { newFormJson } from '../domain/new-form';
import { FormDesigner } from './form-designer';
import { FormMetadataFields, type FormDraft } from './form-metadata-fields';

const INITIAL_DRAFT: FormDraft = { name: '', code: '', type: 'web' };

export function AddFormView() {
  const [draft, setDraft] = useState<FormDraft>(INITIAL_DRAFT);
  const [schema, setSchema] = useState(newFormJson);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  function logFormData() {
    try {
      const payload = {
        formName: draft.name,
        code: draft.code,
        type: draft.type,
        jsonData: JSON.parse(schema || newFormJson),
      };
      console.log('form-data', payload);
      setSnackbarOpen(true);
    } catch {
      console.error('form-data: the designer returned invalid JSON');
    }
  }

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

      <FormDesigner onSchemaChange={setSchema} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
        <Button variant="contained" onClick={logFormData}>
          دریافت داده فرم
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="داده فرم در کنسول ثبت شد."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  );
}
