'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { FormViewer } from '@react-form-builder/core';
import { viewerView } from '../engine/registry';
import { InlineErrorWrapper } from '../engine/components';
import { validators } from '../engine/validators';
import { LocalFormRepository } from '../infrastructure/local-form-repository';
import { SAMPLE_NAME } from '../domain/sample';
import { MAX_FORM_BYTES } from '../domain/form-document';
import { normalizeSubmission } from '@/lib/digits';
export default function ViewerWorkspace() {
  const repository = useMemo(() => new LocalFormRepository(window.localStorage), []);
  const [names, setNames] = useState([SAMPLE_NAME]);
  const [name, setName] = useState(SAMPLE_NAME);
  const [version, setVersion] = useState(0);
  const [readOnly, setReadOnly] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<unknown>(null);
  const getForm = useCallback(() => repository.load(name), [repository, name]);
  useEffect(() => {
    repository
      .list()
      .then(setNames)
      .catch(() => setError('خواندن فرم‌های ذخیره‌شده ناموفق بود'));
  }, [repository, version]);
  async function exportForm() {
    try {
      const json = await repository.load(name);
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${name}.json`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError('خروجی فرم ناموفق بود');
    }
  }
  async function importForm(file?: File) {
    if (!file) return;
    try {
      if (file.size > MAX_FORM_BYTES) throw new Error('حجم فایل بیش از حد مجاز است');
      const importedName = file.name.replace(/\.json$/i, '');
      await repository.save(importedName, await file.text());
      setName(importedName);
      setVersion((v) => v + 1);
      setError('');
      setSubmitted(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فایل نامعتبر است');
    }
  }
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' } }}
      >
        <TextField
          select
          label="انتخاب فرم"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setSubmitted(null);
          }}
          sx={{ maxWidth: 360 }}
        >
          {[...new Set([...names, name])].map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" onClick={exportForm}>
          خروجی JSON
        </Button>
        <Button variant="outlined" component="label">
          ورود JSON
          <input
            hidden
            type="file"
            accept=".json,application/json"
            onChange={(event) => {
              void importForm(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </Button>
        <FormControlLabel
          control={
            <Switch checked={readOnly} onChange={(event) => setReadOnly(event.target.checked)} />
          }
          label="فقط خواندنی"
        />
      </Stack>
      <Alert severity="info">
        فقط فایل‌های JSON مورد اعتماد را وارد کنید. ارسال فرم در این پروژه نمایشی است و اطلاعات به
        سرور ارسال نمی‌شود.
      </Alert>
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' },
          gap: 3,
        }}
      >
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box className="engine-host" dir="rtl">
              <FormViewer
                key={`${name}:${version}`}
                view={viewerView}
                getForm={getForm}
                language="fa-IR"
                validators={validators}
                errorWrapper={InlineErrorWrapper}
                readOnly={readOnly}
                actions={{
                  submit: (event) => {
                    setSubmitted(normalizeSubmission(event.data));
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700 }} gutterBottom>
                داده‌های ارسالی
              </Typography>
              <Typography variant="body2" color="text.secondary">
                اعداد ورودی به فارسی نمایش داده می‌شوند و برای ارسال به رقم انگلیسی تبدیل می‌شوند.
              </Typography>
              {submitted !== null ? (
                <>
                  <Alert severity="success" sx={{ my: 2 }}>
                    اعتبارسنجی موفق بود
                  </Alert>
                  <Box
                    component="pre"
                    sx={{ fontSize: 12, bgcolor: '#f5f7f8', p: 2, borderRadius: 2 }}
                  >
                    {JSON.stringify(submitted, null, 2)}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" sx={{ mt: 3 }} color="text.secondary">
                  پس از تکمیل و ثبت فرم، نتیجه اینجا نمایش داده می‌شود.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
