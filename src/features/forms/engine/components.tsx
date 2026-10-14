'use client';
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useErrorMessage, type ErrorWrapperProps } from '@react-form-builder/core';
import { toEnglishDigits, toPersianDigits } from '@/lib/digits';
export interface TextProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  multiline?: boolean;
  inputType?: 'text' | 'email';
  className?: string;
  style?: CSSProperties;
}
export function PersianText({
  value = '',
  onChange,
  label,
  placeholder,
  disabled,
  readOnly,
  multiline,
  inputType = 'text',
  className,
  style,
}: TextProps) {
  const error = useErrorMessage();
  return (
    <TextField
      className={className}
      style={style}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      disabled={disabled}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      type={inputType}
      error={!!error}
      helperText={error}
      slotProps={{ input: { readOnly }, htmlInput: { dir: inputType === 'email' ? 'ltr' : 'rtl' } }}
    />
  );
}
export function DigitField({
  value = '',
  onChange,
  label,
  placeholder,
  disabled,
  readOnly,
  className,
  style,
  maxLength,
  amount,
  error,
}: TextProps & { maxLength?: number; amount?: boolean; error?: string }) {
  const canonical = toEnglishDigits(value);
  const display = amount ? canonical.replace(/\B(?=(\d{3})+(?!\d))/g, '٬') : canonical;
  return (
    <TextField
      className={className}
      style={style}
      label={label}
      placeholder={placeholder}
      value={toPersianDigits(display)}
      onChange={(event) => {
        const next = toEnglishDigits(event.target.value).replace(/[٬,]/g, '');
        if (/^\d*$/.test(next) && (!maxLength || next.length <= maxLength)) onChange?.(next);
      }}
      disabled={disabled}
      error={!!error}
      helperText={error}
      slotProps={{
        input: { readOnly },
        htmlInput: { inputMode: 'numeric', dir: 'ltr', style: { textAlign: 'right' } },
      }}
    />
  );
}
export function IranMobile(props: TextProps) {
  const error = useErrorMessage();
  return <DigitField {...props} maxLength={11} error={error} />;
}
export function NationalId(props: TextProps) {
  const error = useErrorMessage();
  return <DigitField {...props} maxLength={10} error={error} />;
}
export function PersianAmount(props: TextProps) {
  const error = useErrorMessage();
  return <DigitField {...props} amount error={error} />;
}
/** Fields own their accessible MUI helper text; avoid duplicate engine errors. */
export function InlineErrorWrapper({ children }: ErrorWrapperProps) {
  return <>{children}</>;
}

export function Consent({
  value = false,
  onChange,
  label,
  disabled,
  readOnly,
}: {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const error = useErrorMessage();
  return (
    <Box>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            checked={value}
            onChange={(event) => {
              if (!readOnly) onChange?.(event.target.checked);
            }}
            disabled={disabled}
            slotProps={{ input: { 'aria-readonly': readOnly } }}
          />
        }
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}
export function SectionTitle({ title, description }: { title?: string; description?: string }) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {description}
      </Typography>
    </Box>
  );
}
export function SubmitButton({
  label,
  onClick,
  disabled,
  readOnly,
}: {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <Button type="button" variant="contained" onClick={onClick} disabled={disabled || readOnly}>
      {label}
    </Button>
  );
}
export const FormSection = forwardRef<
  HTMLDivElement,
  { children?: ReactNode; className?: string; style?: CSSProperties }
>(function FormSection(props, ref) {
  return <Stack {...props} ref={ref} spacing={2} />;
});
export function ViewerWrapper({ children }: { children?: ReactNode }) {
  return (
    <Box
      dir="rtl"
      sx={{
        '& > div': { gap: 2 },
        '& .MuiTextField-root': { my: 1 },
        '& .MuiButton-root': { my: 1 },
      }}
    >
      {children}
    </Box>
  );
}
