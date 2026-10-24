'use client';
import { forwardRef, useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
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
import {
  useAriaErrorMessage,
  useBuilderTheme,
  useComponentData,
  useErrorMessage,
  type ErrorWrapperProps,
} from '@react-form-builder/core';
import { CustomProvider } from 'rsuite';
import { toEnglishDigits, toPersianDigits } from '@/lib/digits';
import { splitRequiredLabel } from '@/lib/labels';
import { useGridItem } from './grid';
import type { GridSpanProps } from './grid-math';
import { persianRsuiteLocale } from './rsuite-locale';
import rtlStyles from './rtl.module.css';

export function FieldLabel({ label }: { label: string }) {
  const { text, separator, required } = splitRequiredLabel(label);
  if (!required) return <>{label}</>;
  return (
    <>
      {text}
      {separator}
      <Box component="span" sx={{ color: 'error.main' }}>
        *
      </Box>
    </>
  );
}

function labelNode(label?: string) {
  return label ? <FieldLabel label={label} /> : undefined;
}

export interface TextProps extends GridSpanProps {
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
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: TextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useGridItem(rootRef, false, { mobileSpan, tabletSpan, desktopSpan });
  const error = useErrorMessage();
  return (
    <TextField
      ref={rootRef}
      className={className}
      style={style}
      label={labelNode(label)}
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
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: TextProps & { maxLength?: number; amount?: boolean; error?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useGridItem(rootRef, false, { mobileSpan, tabletSpan, desktopSpan });
  const canonical = toEnglishDigits(value);
  const display = amount ? canonical.replace(/\B(?=(\d{3})+(?!\d))/g, '٬') : canonical;
  return (
    <TextField
      ref={rootRef}
      className={className}
      style={style}
      label={labelNode(label)}
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
const fieldsWithInlineErrors = new Set([
  'PersianText',
  'IranMobile',
  'NationalId',
  'PersianAmount',
  'Consent',
]);

/** Persian fields own their helper text; other controls use the engine error. */
export function InlineErrorWrapper({ children, error }: ErrorWrapperProps) {
  const { model } = useComponentData();
  const aria = useAriaErrorMessage();
  return (
    <>
      {children}
      {error && !fieldsWithInlineErrors.has(model.type) && (
        <FormHelperText error id={aria['aria-errormessage']} role="alert">
          {error}
        </FormHelperText>
      )}
    </>
  );
}

export interface ConsentProps extends GridSpanProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export function Consent({
  value = false,
  onChange,
  label,
  disabled,
  readOnly,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ConsentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useGridItem(rootRef, false, { mobileSpan, tabletSpan, desktopSpan });
  const error = useErrorMessage();
  return (
    <Box ref={rootRef}>
      <FormControlLabel
        label={labelNode(label)}
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
export interface SectionTitleProps extends GridSpanProps {
  title?: string;
  description?: string;
}

export function SectionTitle({
  title,
  description,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: SectionTitleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useGridItem(rootRef, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <Box ref={rootRef} sx={{ mb: 1 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {description}
      </Typography>
    </Box>
  );
}
export interface SubmitButtonProps extends GridSpanProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function SubmitButton({
  label,
  onClick,
  disabled,
  readOnly,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: SubmitButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  useGridItem(rootRef, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <Button
      ref={rootRef}
      type="button"
      variant="contained"
      onClick={onClick}
      disabled={disabled || readOnly}
    >
      {label}
    </Button>
  );
}
export interface FormSectionProps extends GridSpanProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(function FormSection(
  { children, className, style, mobileSpan, tabletSpan, desktopSpan },
  forwardedRef,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  useGridItem(rootRef, true, { mobileSpan, tabletSpan, desktopSpan });
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );
  return (
    <Stack ref={setRef} className={className} style={style} spacing={2} data-fe-grid-container="">
      {children}
    </Stack>
  );
});
export function ViewerWrapper({ children }: { children?: ReactNode }) {
  const theme = useBuilderTheme();
  return (
    <CustomProvider theme={theme} rtl locale={persianRsuiteLocale}>
      <Box
        className={`rsuite ${rtlStyles.rtl}`}
        dir="rtl"
        sx={{
          '& > div': { gap: 2 },
          '& .MuiTextField-root': { my: 1 },
          '& .MuiButton-root': { my: 1 },
        }}
      >
        {children}
      </Box>
    </CustomProvider>
  );
}
