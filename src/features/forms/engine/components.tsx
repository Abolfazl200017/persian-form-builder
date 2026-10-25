'use client';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  useAriaErrorMessage,
  useComponentData,
  useErrorMessage,
  type ErrorWrapperProps,
  type FormViewerWrapperComponentProps,
} from '@react-form-builder/core';
import { toEnglishDigits, toPersianDigits } from '@/lib/digits';
import { splitRequiredLabel } from '@/lib/labels';
import { Autocomplete } from '@/components/autocomplete';
import { Button, Input, Label, Textarea } from '@/components/ui';
import { useGridItem } from './grid';
import type { GridSpanProps } from './grid-math';

export function FieldLabel({ label }: { label: string }) {
  const { text, separator, required } = splitRequiredLabel(label);
  return (
    <>
      {text}
      {separator}
      {required && <span className="text-destructive">*</span>}
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
function Field({
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
    <div ref={rootRef} className={`grid min-w-0 gap-2 py-1 ${className ?? ''}`} style={style}>
      <div className="flex min-h-5 items-center">{label && <Label>{labelNode(label)}</Label>}</div>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
      ) : (
        <Input
          type={inputType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
      <div className="min-h-4 text-xs text-destructive" aria-live="polite">
        {error ?? <span aria-hidden="true">&nbsp;</span>}
      </div>
    </div>
  );
}
export function PersianText(props: TextProps) {
  return <Field {...props} />;
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
    <div ref={rootRef} className={`grid min-w-0 gap-2 py-1 ${className ?? ''}`} style={style}>
      <div className="flex min-h-5 items-center">{label && <Label>{labelNode(label)}</Label>}</div>
      <Input
        value={toPersianDigits(display)}
        onChange={(event) => {
          const next = toEnglishDigits(event.target.value).replace(/[٬,]/g, '');
          if (/^\d*$/.test(next) && (!maxLength || next.length <= maxLength)) onChange?.(next);
        }}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        inputMode="numeric"
        className="text-right"
      />
      <div className="min-h-4 text-xs text-destructive" aria-live="polite">
        {error ?? <span aria-hidden="true">&nbsp;</span>}
      </div>
    </div>
  );
}
export function IranMobile(props: TextProps) {
  return <DigitField {...props} maxLength={11} error={useErrorMessage()} />;
}
export function NationalId(props: TextProps) {
  return <DigitField {...props} maxLength={10} error={useErrorMessage()} />;
}
export function PersianAmount(props: TextProps) {
  return <DigitField {...props} amount error={useErrorMessage()} />;
}
const fieldsWithInlineErrors = new Set([
  'PersianText',
  'ShadcnInput',
  'ShadcnTextarea',
  'IranMobile',
  'NationalId',
  'PersianAmount',
  'Consent',
]);
export function InlineErrorWrapper({ children, error }: ErrorWrapperProps) {
  const { model } = useComponentData();
  const aria = useAriaErrorMessage();
  const errorIsInsideControl = fieldsWithInlineErrors.has(model.type);
  return (
    <div className="grid min-w-0 content-start gap-1 text-right" dir="rtl">
      {children}
      {!errorIsInsideControl && (
        <div
          className="min-h-4 text-xs text-destructive"
          id={aria['aria-errormessage']}
          aria-live="polite"
          role={error ? 'alert' : undefined}
        >
          {error ?? <span aria-hidden="true">&nbsp;</span>}
        </div>
      )}
    </div>
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
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  const error = useErrorMessage();
  return (
    <div ref={ref} className="py-1">
      <label className="inline-flex min-h-5 cursor-pointer items-center gap-2 text-sm" dir="rtl">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={value}
          disabled={disabled}
          aria-readonly={readOnly}
          onChange={(e) => {
            if (!readOnly) onChange?.(e.target.checked);
          }}
        />
        {labelNode(label ?? '')}
      </label>
      <div className="min-h-4 text-xs text-destructive" aria-live="polite">
        {error ?? <span aria-hidden="true">&nbsp;</span>}
      </div>
    </div>
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
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div ref={ref} className="mb-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
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
  const ref = useRef<HTMLButtonElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <Button ref={ref} type="button" onClick={onClick} disabled={disabled || readOnly}>
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
    <div
      ref={setRef}
      className={`flex flex-col gap-4 ${className ?? ''}`}
      style={style}
      data-fe-grid-container=""
    >
      {children}
    </div>
  );
});
export function ViewerWrapper({ children }: FormViewerWrapperComponentProps) {
  return (
    <div className="grid gap-4" dir="rtl">
      {children}
    </div>
  );
}

export function ShadcnInput(props: TextProps) {
  return <PersianText {...props} />;
}
export function ShadcnTextarea(props: TextProps) {
  return <Field {...props} multiline />;
}
export interface ChoiceProps extends GridSpanProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  options?: string[] | string;
  disabled?: boolean;
  clearable?: boolean;
}
function parseOptions(options?: string[] | string) {
  if (Array.isArray(options)) return options.map((option) => String(option).trim()).filter(Boolean);
  return (options ?? 'گزینه اول\nگزینه دوم')
    .replace(/\\n/g, '\n')
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);
}
function AutocompleteField({
  value = '',
  onChange,
  label,
  options,
  disabled,
  clearable = true,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ChoiceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div ref={ref} className="grid gap-2 py-1">
      <div className="flex min-h-5 items-center">
        {label && <Label htmlFor={`${id}-input`}>{labelNode(label)}</Label>}
      </div>
      <Autocomplete
        id={`${id}-input`}
        options={parseOptions(options)}
        value={value}
        onChange={(nextValue) => onChange?.(nextValue)}
        clearable={clearable}
        disabled={disabled}
      />
    </div>
  );
}
export function ShadcnSelect({ ...props }: ChoiceProps) {
  return <AutocompleteField {...props} />;
}
export function ShadcnCheckbox({
  value = 'false',
  onChange,
  label,
  disabled,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ChoiceProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  const checked = value === 'true';
  return (
    <div ref={ref} className="py-1">
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="size-4 accent-primary"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(String(e.target.checked))}
        />
        {labelNode(label ?? '')}
      </label>
    </div>
  );
}
export function ShadcnRadioGroup({
  value = '',
  onChange,
  label,
  options,
  disabled,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ChoiceProps) {
  const ref = useRef<HTMLFieldSetElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <fieldset ref={ref} className="grid gap-2 py-1">
      <legend className="mb-1 text-sm font-medium">{labelNode(label ?? '')}</legend>
      {parseOptions(options).map((option) => (
        <label key={option} className="inline-flex items-center gap-2 text-sm">
          <input
            type="radio"
            className="size-4 accent-primary"
            name={`radio-${label}`}
            value={option}
            checked={value === option}
            disabled={disabled}
            onChange={() => onChange?.(option)}
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}
export function ShadcnSwitch({
  value = 'false',
  onChange,
  label,
  disabled,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ChoiceProps) {
  const checked = value === 'true';
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div ref={ref}>
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          role="switch"
          className="size-4 accent-primary"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(String(e.target.checked))}
        />
        {labelNode(label ?? '')}
      </label>
    </div>
  );
}
export interface ShadcnButtonProps extends GridSpanProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}
export function ShadcnButton({
  label = 'دکمه',
  onClick,
  disabled,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <Button ref={ref} onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  );
}
export function ShadcnDatePicker({
  value = '',
  onChange,
  label,
  disabled,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: TextProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div ref={ref} className="grid gap-2 py-1">
      {label && <Label>{labelNode(label)}</Label>}
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        dir="ltr"
      />
    </div>
  );
}

export const ShadcnCalendar = ShadcnDatePicker;

export function ShadcnCombobox({ ...props }: ChoiceProps) {
  return <AutocompleteField {...props} />;
}

export function ShadcnSlider({
  value = '50',
  onChange,
  label,
  disabled,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ChoiceProps & { value?: string | number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div ref={ref} className="grid gap-2 py-1">
      {label && <Label>{labelNode(label)}</Label>}
      <Input
        type="range"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-2 cursor-pointer border-0 px-0 shadow-none accent-primary"
      />
    </div>
  );
}

export function ShadcnLabel({
  text = '',
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnContainerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <span ref={ref} className="text-sm font-medium leading-none">
      {text}
    </span>
  );
}
export function ShadcnTooltip({
  text = '',
  label,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnContainerProps & { label?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <span
      ref={ref}
      title={text}
      className="cursor-help underline decoration-dotted underline-offset-4"
    >
      {label || text}
    </span>
  );
}
export function ShadcnSeparator({ mobileSpan, tabletSpan, desktopSpan }: GridSpanProps) {
  const ref = useRef<HTMLHRElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return <hr ref={ref} className="my-2 border-0 border-t border-border" />;
}
export interface ShadcnContainerProps extends GridSpanProps {
  children?: ReactNode;
  className?: string;
  text?: string;
}
export const ShadcnCard = forwardRef<HTMLDivElement, ShadcnContainerProps>(function ShadcnCard(
  { children, className, mobileSpan, tabletSpan, desktopSpan },
  ref,
) {
  const local = useRef<HTMLDivElement>(null);
  useGridItem(local, true, { mobileSpan, tabletSpan, desktopSpan });
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      local.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  return (
    <div
      ref={setRef}
      data-fe-grid-container=""
      className={`glass-panel p-4 text-card-foreground ${className ?? ''}`}
    >
      {children}
    </div>
  );
});
export function ShadcnBadge({
  text = '',
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnContainerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <span
      ref={ref}
      className="inline-flex w-fit items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold"
    >
      {text}
    </span>
  );
}
export function ShadcnAlert({
  text = '',
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div
      ref={ref}
      role="status"
      className="rounded-md border border-border bg-muted/50 p-4 text-sm"
    >
      {text}
    </div>
  );
}
export function ShadcnProgress({
  value = 0,
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnContainerProps & { value?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGridItem(ref, false, { mobileSpan, tabletSpan, desktopSpan });
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full bg-primary"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function ShadcnDialog({
  children,
  label = 'باز کردن پنجره',
  mobileSpan,
  tabletSpan,
  desktopSpan,
}: ShadcnContainerProps & { label?: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useGridItem(rootRef, false, { mobileSpan, tabletSpan, desktopSpan });
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <div ref={rootRef}>
      <Button type="button" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="glass-panel fixed inset-0 m-auto max-h-[min(85dvh,48rem)] w-[min(92vw,40rem)] overflow-auto p-0 text-card-foreground shadow-xl backdrop:bg-black/50"
      >
        <div className="flex items-center justify-end border-b border-border p-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dialogRef.current?.close()}
            aria-label="بستن پنجره"
          >
            ×
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </dialog>
    </div>
  );
}
