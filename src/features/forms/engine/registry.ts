import {
  boolean,
  BuilderView,
  createView,
  define,
  disabled,
  readOnly,
  event,
  node,
  oneOf,
  string,
} from '@react-form-builder/core';
import {
  Consent,
  FormSection,
  IranMobile,
  NationalId,
  PersianAmount,
  PersianText,
  SectionTitle,
  SubmitButton,
  ViewerWrapper,
} from './components';
const textProps = {
  value: string.valued.uncontrolledValue(''),
  label: string.default('عنوان فیلد').named('عنوان'),
  placeholder: string.named('راهنمای ورودی'),
  disabled: disabled.default(false).named('غیرفعال'),
  readOnly: readOnly.default(false).named('فقط خواندنی'),
  onChange: event,
};
const definitions = [
  define(PersianText, 'PersianText')
    .name('ورودی متن')
    .category('ورودی‌ها')
    .props({
      ...textProps,
      multiline: boolean.default(false).named('چندخطی'),
      inputType: oneOf('text', 'email').default('text').named('نوع ورودی'),
    }),
  define(IranMobile, 'IranMobile')
    .name('موبایل ایران')
    .category('ورودی‌ها')
    .props({ ...textProps, label: string.default('شماره موبایل').named('عنوان') }),
  define(NationalId, 'NationalId')
    .name('کد ملی')
    .category('ورودی‌ها')
    .props({ ...textProps, label: string.default('کد ملی').named('عنوان') }),
  define(PersianAmount, 'PersianAmount')
    .name('مبلغ فارسی')
    .category('ورودی‌ها')
    .props({ ...textProps, label: string.default('مبلغ (تومان)').named('عنوان') }),
  define(Consent, 'Consent')
    .name('تأیید و پذیرش')
    .category('ورودی‌ها')
    .props({
      value: boolean.valued.uncontrolledValue(false),
      label: string.default('تأیید می‌کنم').named('عنوان'),
      disabled: disabled.default(false),
      readOnly: readOnly.default(false),
      onChange: event,
    }),
  define(SectionTitle, 'SectionTitle')
    .name('عنوان بخش')
    .category('چیدمان')
    .props({
      title: string.default('عنوان بخش').named('عنوان'),
      description: string.default('توضیحات بخش').named('توضیحات'),
    }),
  define(FormSection, 'FormSection')
    .name('بخش فرم')
    .category('چیدمان')
    .kind('container')
    .props({ children: node }),
  define(SubmitButton, 'SubmitButton')
    .name('دکمه ارسال')
    .category('عملیات')
    .props({
      label: string.default('ارسال').named('عنوان'),
      readOnly: readOnly.default(false),
      onClick: event,
      disabled: disabled.default(false),
    }),
];
export const componentMetadata = definitions.map((definition) => definition.build());
export const viewerView = createView(
  componentMetadata.map((component) => component.model),
).withViewerWrapper(ViewerWrapper);
export const builderView = new BuilderView(componentMetadata)
  .withTemplates([])
  .withViewerWrapper(ViewerWrapper);
