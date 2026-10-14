import { toEnglishDigits } from '@/lib/digits';
export function isIranMobile(value: unknown): boolean {
  return typeof value === 'string' && /^09\d{9}$/.test(toEnglishDigits(value));
}
export function isIranNationalId(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const digits = toEnglishDigits(value);
  if (!/^\d{10}$/.test(digits) || /^(\d)\1{9}$/.test(digits)) return false;
  const sum = [...digits.slice(0, 9)].reduce(
    (total, digit, index) => total + Number(digit) * (10 - index),
    0,
  );
  const remainder = sum % 11;
  return Number(digits[9]) === (remainder < 2 ? remainder : 11 - remainder);
}
