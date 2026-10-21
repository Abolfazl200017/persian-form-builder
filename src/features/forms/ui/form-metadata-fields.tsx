'use client';

import { Box, MenuItem, TextField } from '@mui/material';
import type { FormType } from '../domain/new-form';

export interface FormDraft {
  name: string;
  code: string;
  type: FormType;
}

export const FORM_TYPE_LABELS: Record<FormType, string> = {
  mobile: 'موبایل',
  web: 'وب',
};

export function FormMetadataFields({
  value,
  onChange,
}: {
  value: FormDraft;
  onChange: (patch: Partial<FormDraft>) => void;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      <TextField
        label="نام فرم"
        placeholder="مثلاً: نظرسنجی رضایت مشتری"
        value={value.name}
        onChange={(event) => onChange({ name: event.target.value })}
      />
      <TextField
        label="کد فرم"
        placeholder="مثلاً: customer-feedback"
        value={value.code}
        onChange={(event) => onChange({ code: event.target.value })}
        slotProps={{ htmlInput: { dir: 'ltr' } }}
      />
      <TextField
        select
        label="نوع فرم"
        value={value.type}
        onChange={(event) => onChange({ type: event.target.value as FormType })}
      >
        {Object.entries(FORM_TYPE_LABELS).map(([type, label]) => (
          <MenuItem key={type} value={type}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
