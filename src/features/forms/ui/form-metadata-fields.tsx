'use client';
import { Controller, useFormContext } from 'react-hook-form';
import { FORM_TYPES, type FormDraft, type FormType } from '../domain/form-draft';
import { Input, Label, Select } from '@/components/ui';

export const FORM_TYPE_LABELS: Record<FormType, string> = { mobile: 'موبایل', web: 'وب' };
export function FormMetadataFields() {
  const { control } = useFormContext<FormDraft>();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <div className="grid gap-2">
            <Label htmlFor="form-name">نام فرم</Label>
            <Input
              id="form-name"
              {...field}
              placeholder="مثلاً: نظرسنجی رضایت مشتری"
              aria-invalid={!!fieldState.error}
            />
            {fieldState.error && (
              <p className="text-xs text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="code"
        control={control}
        render={({ field, fieldState }) => (
          <div className="grid gap-2">
            <Label htmlFor="form-code">کد فرم</Label>
            <Input
              id="form-code"
              {...field}
              dir="ltr"
              placeholder="مثلاً: customer-feedback"
              aria-invalid={!!fieldState.error}
            />
            {fieldState.error && (
              <p className="text-xs text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => (
          <div className="grid gap-2">
            <Label htmlFor="form-type">نوع فرم</Label>
            <Select id="form-type" {...field}>
              {FORM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {FORM_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
            {fieldState.error && (
              <p className="text-xs text-destructive">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
