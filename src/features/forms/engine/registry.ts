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
  type ComponentLibraryDescription,
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
import { FormGrid } from './grid';

const countOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
const gridSpanProps = {
  mobileSpan: oneOf(...countOptions).default('1').named('ستون در موبایل'),
  tabletSpan: oneOf(...countOptions).default('1').named('ستون در تبلت'),
  desktopSpan: oneOf(...countOptions).default('1').named('ستون در دسکتاپ'),
};
const textProps = {
  value: string.valued.uncontrolledValue(''),
  label: string.default('عنوان فیلد').named('عنوان'),
  placeholder: string.named('راهنمای ورودی'),
  disabled: disabled.default(false).named('غیرفعال'),
  readOnly: readOnly.default(false).named('فقط خواندنی'),
  onChange: event,
  ...gridSpanProps,
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
      ...gridSpanProps,
    }),
  define(SectionTitle, 'SectionTitle')
    .name('عنوان بخش')
    .category('چیدمان')
    .props({
      title: string.default('عنوان بخش').named('عنوان'),
      description: string.default('توضیحات بخش').named('توضیحات'),
      ...gridSpanProps,
    }),
  define(FormGrid, 'FormGrid')
    .name('شبکه')
    .category('چیدمان')
    .kind('container')
    .props({
      mobileColumns: oneOf(...countOptions).default('1').named('ستون‌های موبایل'),
      tabletColumns: oneOf(...countOptions).default('2').named('ستون‌های تبلت'),
      desktopColumns: oneOf(...countOptions).default('3').named('ستون‌های دسکتاپ'),
      children: node,
    }),
  define(FormSection, 'FormSection')
    .name('بخش فرم')
    .category('چیدمان')
    .kind('container')
    .props({ children: node, ...gridSpanProps }),
  define(SubmitButton, 'SubmitButton')
    .name('دکمه ارسال')
    .category('عملیات')
    .props({
      label: string.default('ارسال').named('عنوان'),
      readOnly: readOnly.default(false),
      onClick: event,
      disabled: disabled.default(false),
      ...gridSpanProps,
    }),
];
export const componentMetadata = definitions.map((definition) => definition.build());
export const viewerView = createView(
  componentMetadata.map((component) => component.model),
).withViewerWrapper(ViewerWrapper);

/** Persian titles for the designer's built-in components and shared properties. */
const persianComponentLibrary: Record<string, ComponentLibraryDescription> = {
  'fa-IR': {
    components: {
      Modal: { name: 'مودال' },
      Key: { name: 'کلید' },
      Tooltip: { name: 'راهنما' },
      DefaultErrorMessage: { name: 'پیام خطای پیش‌فرض' },
      Repeater: {
        name: 'تکرارشونده',
        props: { itemRenderWhen: { name: 'زمان نمایش آیتم' } },
      },
      Slot: { name: 'جایگاه' },
      EmbeddedForm: {
        name: 'فرم جاسازی‌شده',
        props: {
          formName: { name: 'نام فرم' },
          options: { name: 'گزینه‌ها' },
        },
      },
    },
    commonProperties: {
      key: { name: 'کلید' },
      renderWhen: { name: 'زمان نمایش' },
      itemRenderWhen: { name: 'زمان نمایش آیتم' },
    },
  },
};

export const builderView = new BuilderView(componentMetadata)
  .withTemplates([])
  .withViewerWrapper(ViewerWrapper)
  .withComponentLibraryDescription(persianComponentLibrary);

