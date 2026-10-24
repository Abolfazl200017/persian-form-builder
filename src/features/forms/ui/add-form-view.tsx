'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Card, CardContent, Snackbar, Stack, Typography } from '@mui/material';
import { INITIAL_FORM_DRAFT, formDraftSchema, type FormDraft } from '../domain/form-draft';
import { parseFormDocument } from '../domain/form-document';
import { newFormJson } from '../domain/new-form';
import { FormDesigner } from './form-designer';
import { FormMetadataFields } from './form-metadata-fields';

export function AddFormView() {
  const [schema, setSchema] = useState(newFormJson);
  const [feedback, setFeedback] = useState('');
  const methods = useForm<FormDraft>({
    resolver: zodResolver(formDraftSchema),
    defaultValues: INITIAL_FORM_DRAFT,
    mode: 'onTouched',
  });

  function submitForm(data: FormDraft) {
    try {
      parseFormDocument(schema);
      const payload = {
        formName: data.name,
        code: data.code,
        type: data.type,
        jsonData: JSON.parse(schema),
      };
      console.log('form-data', payload);
      setFeedback('داده فرم در کنسول ثبت شد.');
    } catch (error) {
      console.error('form-data: the designer returned an invalid form document', error);
      setFeedback('ساختار فرم معتبر نیست.');
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

      <FormProvider {...methods}>
        <Box component="form" id="add-form" noValidate onSubmit={methods.handleSubmit(submitForm)}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
              <Typography variant="subtitle1" component="h2" sx={{ mb: 2 }}>
                اطلاعات فرم
              </Typography>
              <FormMetadataFields />
            </CardContent>
          </Card>
        </Box>
      </FormProvider>

      <FormDesigner onSchemaChange={setSchema} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
        <Button type="submit" form="add-form" variant="contained">
          ثبت فرم
        </Button>
      </Box>

      <Snackbar
        open={!!feedback}
        autoHideDuration={3000}
        onClose={() => setFeedback('')}
        message={feedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  );
}
