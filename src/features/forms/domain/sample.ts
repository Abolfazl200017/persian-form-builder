const field = (key: string, type: string, label: string, validation?: string) => ({
  key,
  type,
  props: { label: { value: label } },
  schema: {
    validations: validation
      ? [
          { key: 'required', args: { message: 'تکمیل این فیلد الزامی است' } },
          ...(validation === 'required'
            ? []
            : [
                {
                  key: validation,
                  type: validation.startsWith('iran') ? 'custom' : 'internal',
                  ...(validation === 'email' ? { args: { message: 'ایمیل معتبر وارد کنید' } } : {}),
                },
              ]),
        ]
      : [],
  },
});
export const SAMPLE_NAME = 'فرم ثبت درخواست';
export const sampleForm = {
  version: '1',
  form: {
    key: 'Screen',
    type: 'Screen',
    props: {},
    children: [
      {
        key: 'heading',
        type: 'SectionTitle',
        props: {
          title: { value: 'ثبت درخواست همکاری' },
          description: { value: 'اطلاعات زیر را تکمیل کنید. فیلدهای ضروری بررسی می‌شوند.' },
        },
      },
      field('fullName', 'PersianText', 'نام و نام خانوادگی', 'required'),
      {
        ...field('email', 'PersianText', 'ایمیل', 'email'),
        props: { label: { value: 'ایمیل' }, inputType: { value: 'email' } },
      },
      field('mobile', 'IranMobile', 'شماره موبایل', 'iranMobile'),
      field('nationalId', 'NationalId', 'کد ملی', 'iranNationalId'),
      field('budget', 'PersianAmount', 'بودجه پیشنهادی (تومان)'),
      {
        key: 'description',
        type: 'PersianText',
        props: { label: { value: 'توضیحات' }, multiline: { value: true } },
      },
      {
        key: 'consent',
        type: 'Consent',
        props: { label: { value: 'صحت اطلاعات واردشده را تأیید می‌کنم' } },
        schema: { validations: [{ key: 'accepted', type: 'custom' }] },
      },
      {
        key: 'submit',
        type: 'SubmitButton',
        props: { label: { value: 'ثبت درخواست' } },
        events: {
          onClick: [
            { name: 'validate', type: 'common', args: { failOnError: true } },
            { name: 'submit', type: 'custom' },
          ],
        },
      },
    ],
  },
  localization: {},
  languages: [
    { code: 'fa', dialect: 'IR', name: 'فارسی', description: 'فارسی ایران', bidi: 'rtl' },
  ],
  defaultLanguage: 'fa-IR',
};
export const sampleJson = JSON.stringify(sampleForm);
