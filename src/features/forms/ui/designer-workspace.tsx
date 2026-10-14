'use client';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { FormBuilder } from '@react-form-builder/designer';
import { builderView } from '../engine/registry';
import { designerI18n } from '../engine/i18n';
import { InlineErrorWrapper } from '../engine/components';
import { validators } from '../engine/validators';
import { createDesignerStorage } from '../engine/storage-adapter';
import { LocalFormRepository } from '../infrastructure/local-form-repository';
import { SAMPLE_NAME, sampleJson } from '../domain/sample';
export default function DesignerWorkspace() {
  const repository = useMemo(() => new LocalFormRepository(window.localStorage), []);
  const storage = useMemo(() => createDesignerStorage(repository), [repository]);
  const getForm = useCallback(
    (name?: string) => repository.load(name ?? SAMPLE_NAME),
    [repository],
  );
  const [json, setJson] = useState(sampleJson);
  const [name, setName] = useState(SAMPLE_NAME);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function save() {
    try {
      await repository.save(name, json);
      setMessage('فرم ذخیره شد؛ اکنون در نمایش فرم قابل انتخاب است');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره فرم ناموفق بود');
    }
  }
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="نام ذخیره فرم"
          value={name}
          onChange={(event) => setName(event.target.value)}
          sx={{ maxWidth: 360 }}
        />
        <Button variant="contained" onClick={save}>
          ذخیره فرم
        </Button>
      </Stack>
      {message && (
        <Alert severity="success" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Box
        className="engine-host"
        dir="rtl"
        sx={{
          height: 'calc(100dvh - 290px)',
          minHeight: 650,
          border: '1px solid #e4e9eb',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <FormBuilder
          view={builderView}
          getForm={getForm}
          formName={SAMPLE_NAME}
          formStorage={storage}
          i18n={designerI18n}
          defaultBuilderLanguage="fa-IR"
          defaultViewerLanguage="fa-IR"
          validators={validators}
          errorWrapper={InlineErrorWrapper}
          onFormSchemaChange={setJson}
          licenseKey={process.env.NEXT_PUBLIC_FORMENGINE_LICENSE_KEY || undefined}
          actions={{
            submit: () => setMessage('پیش‌نمایش طراح: ارسال واقعی در صفحه نمایش فرم انجام می‌شود'),
          }}
        />
      </Box>
    </Stack>
  );
}
