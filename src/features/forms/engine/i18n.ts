import { BiDi, Language } from '@react-form-builder/core';
import type { FormBuilderI18n } from '@react-form-builder/designer';
import fa from '@react-form-builder/designer/locales/fa-IR.json';
import { faIR } from 'rsuite/esm/locales/index.js';

type Bundle = Record<string, unknown>;

/** Shallowly merges nested translation bundles without dropping vendor keys. */
function mergeBundle(base: Bundle, patch: Bundle): Bundle {
  const result: Bundle = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    const current = result[key];
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value) &&
      current && typeof current === 'object' && !Array.isArray(current)
        ? mergeBundle(current as Bundle, value as Bundle)
        : value;
  }
  return result;
}

/** Persian terms that were missing or awkward in the vendor translation. */
const overrides: Bundle = {
  testingEditor: {
    run: 'اجرا',
    autorun: 'اجرای خودکار',
  },
  annotation: {
    key: { name: 'کلید' },
    renderWhen: { name: 'زمان نمایش' },
    itemRenderWhen: { name: 'زمان نمایش آیتم' },
    errorType: { name: 'نوع خطا' },
    defaultErrorMessage: { name: 'پیام خطای پیش‌فرض' },
    tooltipType: { name: 'نوع راهنما' },
    modalType: { name: 'نوع مودال' },
    defaultLanguage: { name: 'زبان پیش‌فرض' },
    formName: { name: 'نام فرم' },
    options: { name: 'گزینه‌ها' },
  },
  leftPanel: {
    formSettings: {
      errorType: { name: 'نوع خطا' },
      defaultErrorMessage: { name: 'پیام خطای پیش‌فرض' },
      tooltipType: { name: 'نوع راهنما' },
      modalType: { name: 'نوع مودال' },
      defaultLanguage: { name: 'زبان پیش‌فرض' },
      formName: { name: 'نام فرم' },
    },
  },
};

const data = mergeBundle(fa as Bundle, overrides);

/**
 * RSuite's Persian locale leaves the picker placeholder undefined, which falls
 * back to "Select". Provide it explicitly alongside the vendor locale.
 */
const componentsLocale = {
  ...faIR,
  SelectPicker: { placeholder: 'انتخاب' },
  Combobox: { ...faIR.Combobox, placeholder: 'انتخاب' },
};

export const designerI18n: FormBuilderI18n = {
  languages: [new Language('fa', 'IR', 'فارسی', 'فارسی ایران', BiDi.RTL)],
  getData: async () => ({ data, componentsLocale }),
};
