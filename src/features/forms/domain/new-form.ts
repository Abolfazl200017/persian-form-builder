export const NEW_FORM_NAME = 'فرم جدید';
export const DEFAULT_MODAL_TEMPLATE_NAME = 'محتوای مودال';

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

/** A local starter template so FormEngine's built-in Modal can be selected and previewed. */
export const defaultModalTemplateJson = JSON.stringify({
  ...newFormDocument,
  form: {
    key: 'Screen',
    type: 'Screen',
    props: {},
    children: [
      {
        key: 'modal-title',
        type: 'SectionTitle',
        props: {
          title: { value: 'عنوان پنجره' },
          description: { value: 'محتوای این پنجره از الگوی فرم بارگذاری می‌شود.' },
        },
      },
    ],
  },
});
