import { BiDi, Language } from '@react-form-builder/core';
import type { FormBuilderI18n } from '@react-form-builder/designer';
import fa from '@react-form-builder/designer/locales/fa-IR.json';
import { faIR } from 'rsuite/esm/locales/index.js';
export const designerI18n: FormBuilderI18n = {
  languages: [new Language('fa', 'IR', 'فارسی', 'فارسی ایران', BiDi.RTL)],
  getData: async () => ({ data: fa, componentsLocale: faIR }),
};
