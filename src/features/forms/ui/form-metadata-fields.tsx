'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, MenuItem, TextField } from '@mui/material';
import { FORM_TYPES, type FormDraft, type FormType } from '../domain/form-draft';

export const FORM_TYPE_LABELS: Record<FormType, string> = {
  mobile: 'موبایل',
  web: 'وب',
};

export function FormMetadataFields() {
  const { control } = useFormContext<FormDraft>();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => {
          const { ref, ...fieldProps } = field;
          return (
            <TextField
              {...fieldProps}
              slotProps={{ htmlInput: { ref } }}
              label="نام فرم"
              placeholder="مثلاً: نظرسنجی رضایت مشتری"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          );
        }}
      />
      <Controller
        name="code"
        control={control}
        render={({ field, fieldState }) => {
          const { ref, ...fieldProps } = field;
          return (
            <TextField
              {...fieldProps}
              slotProps={{ htmlInput: { ref, dir: 'ltr' } }}
              label="کد فرم"
              placeholder="مثلاً: customer-feedback"
              required
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          );
        }}
      />
      <Controller
        name="type"
        control={control}
        render={({ field, fieldState }) => {
          const { ref, ...fieldProps } = field;
          return (
            <TextField
              {...fieldProps}
              slotProps={{ htmlInput: { ref } }}
              select
              label="نوع فرم"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              {FORM_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {FORM_TYPE_LABELS[type]}
                </MenuItem>
              ))}
            </TextField>
          );
        }}
      />
    </Box>
  );
}
