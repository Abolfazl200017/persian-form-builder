export const NEW_FORM_NAME = 'فرم جدید';

/** A blank FormEngine Screen used as the starting point of every new form. */
export const newFormDocument = {
  version: '1',
  form: {
    key: 'Screen',
    type: 'Screen',
    props: {},
    children: [],
  },
  localization: {},
  languages: [
    { code: 'fa', dialect: 'IR', name: 'فارسی', description: 'فارسی ایران', bidi: 'rtl' },
  ],
  defaultLanguage: 'fa-IR',
};

export const newFormJson = JSON.stringify(newFormDocument);
