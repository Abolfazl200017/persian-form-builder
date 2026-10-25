'use client';
import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Card, CardContent } from '@/components/ui';
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
    <div className="grid gap-6">
      <header className="grid gap-2">
        <Link
          href="/forms"
          className="w-fit rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
        >
          بازگشت به فرم‌ها
        </Link>
        <h1 className="text-2xl font-bold">افزودن فرم</h1>
        <p className="text-muted-foreground">
          اطلاعات پایه فرم را وارد کنید و سپس طرح آن را در طراح بسازید.
        </p>
      </header>
      <FormProvider {...methods}>
        <form id="add-form" noValidate onSubmit={methods.handleSubmit(submitForm)}>
          <Card>
            <CardContent className="grid gap-5 p-4 md:p-6">
              <h2 className="font-semibold">اطلاعات فرم</h2>
              <FormMetadataFields />
            </CardContent>
          </Card>
        </form>
      </FormProvider>
      <FormDesigner onSchemaChange={setSchema} />
      <div className="flex justify-end">
        <Button type="submit" form="add-form">
          ثبت فرم
        </Button>
      </div>
      {feedback && (
        <p
          role="status"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md border border-border bg-card px-4 py-3 text-sm shadow-lg"
        >
          {feedback}
        </p>
      )}
    </div>
  );
}
