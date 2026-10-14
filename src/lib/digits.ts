export function toEnglishDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) =>
    String(digit.charCodeAt(0) - (digit >= '۰' ? 0x06f0 : 0x0660)),
  );
}
export function toPersianDigits(value: string): string {
  return toEnglishDigits(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}
/** Preserve object keys and non-string primitives at the submission boundary. */
export function normalizeSubmission(value: unknown): unknown {
  if (typeof value === 'string') return toEnglishDigits(value);
  if (Array.isArray(value)) return value.map(normalizeSubmission);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeSubmission(item)]),
    );
  return value;
}
