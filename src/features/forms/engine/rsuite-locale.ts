import { faIR } from 'rsuite/esm/locales/index.js';

/** RSuite's Persian bundle omits the picker placeholder. */
export const persianRsuiteLocale = {
  ...faIR,
  SelectPicker: { placeholder: 'انتخاب' },
  Combobox: { ...faIR.Combobox, placeholder: 'انتخاب' },
};
