import type { Validators } from '@react-form-builder/core';
import { isIranMobile, isIranNationalId } from '../domain/validation';
export const validators: Validators = {
  string: {
    iranMobile: {
      validate: (value) => isIranMobile(value) || 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود',
    },
    iranNationalId: { validate: (value) => isIranNationalId(value) || 'کد ملی معتبر نیست' },
  },
  boolean: { accepted: { validate: (value) => value === true || 'تأیید اطلاعات الزامی است' } },
};
