'use client';
import { Controller, useFormContext } from 'react-hook-form';
import { FORM_TYPES, type FormDraft, type FormType } from '../domain/form-draft';
import { Autocomplete } from '@/components/autocomplete';
import { Input, Label } from '@/components/ui';

export const FORM_TYPE_LABELS: Record<FormType, string> = { mobile: 'موبایل', web: 'وب' };
export function FormMetadataFields() {
  const { control } = useFormContext<FormDraft>();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <div className="grid content-start gap-2 text-right" dir="rtl">
            <Label className="flex min-h-5 items-center" htmlFor="form-name">
              نام فرم
            </Label>
            <Input
              id="form-name"
              {...field}
              placeholder="مثلاً: نظرسنجی رضایت مشتری"
              aria-invalid={!!fieldState.error}
            />
            <div className="min-h-4 text-xs text-destructive" aria-live="polite">
              {fieldState.error?.message ?? <span aria-hidden="true">&nbsp;</span>}
            </div>
          </div>
        )}
      />
      <Controller
        name="code"
        control={control}
        render={({ field, fieldState }) => (
          <div className="grid content-start gap-2 text-right" dir="rtl">
            <Label className="flex min-h-5 items-center" htmlFor="form-code">
              کد فرم
            </Label>
            <Input
              id="form-code"
              {...field}
              placeholder="مثلاً: customer-feedback"
              aria-invalid={!!fieldState.error}
            />
            <div className="min-h-4 text-xs text-destructive" aria-live="polite">
              {fieldState.error?.message ?? <span aria-hidden="true">&nbsp;</span>}
            </div>
          </div>
        )}
      />
      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => (
          <div className="grid content-start gap-2 text-right" dir="rtl">
            <Label className="flex min-h-5 items-center" htmlFor="form-type">
              نوع فرم
            </Label>
            <Autocomplete
              id="form-type"
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              options={FORM_TYPES.map((type) => ({ value: type, label: FORM_TYPE_LABELS[type] }))}
              clearable
              aria-invalid={!!fieldState.error}
              aria-label="نوع فرم"
            />
            <div className="min-h-4 text-xs text-destructive" aria-live="polite">
              {fieldState.error?.message ?? <span aria-hidden="true">&nbsp;</span>}
            </div>
          </div>
        )}
      />
    </div>
  );
}
