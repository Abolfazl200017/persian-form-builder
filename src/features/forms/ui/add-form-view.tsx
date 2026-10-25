'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Card, CardContent } from '@/components/ui';
import { INITIAL_FORM_DRAFT, formDraftSchema, type FormDraft } from '../domain/form-draft';
import { parseFormDocument } from '../domain/form-document';
import { NEW_FORM_NAME, newFormJson } from '../domain/new-form';
import { LocalFormRepository } from '../infrastructure/local-form-repository';
import { FormDesigner } from './form-designer';
import { FormMetadataFields } from './form-metadata-fields';
export function AddFormView() {
  const router = useRouter();
  const [schema, setSchema] = useState(newFormJson);
  const [feedback, setFeedback] = useState('');
  const methods = useForm<FormDraft>({
    resolver: zodResolver(formDraftSchema),
    defaultValues: INITIAL_FORM_DRAFT,
    mode: 'onTouched',
  });
  async function submitForm(data: FormDraft) {
    try {
      parseFormDocument(schema);
      await new LocalFormRepository(window.localStorage).save(data.code, schema);
      setFeedback('فرم ذخیره شد.');
      router.push(`/forms/${encodeURIComponent(data.code)}/edit`);
    } catch (error) {
      console.error('Failed to save form', error);
      setFeedback(error instanceof Error ? error.message : 'ذخیره فرم انجام نشد.');
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
      <FormDesigner
        onSchemaChange={setSchema}
        initialFormName={NEW_FORM_NAME}
        persistFormName={false}
      />
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
