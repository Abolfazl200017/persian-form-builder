import {
  array,
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
  ShadcnInput,
  ShadcnTextarea,
  ShadcnSelect,
  ShadcnCheckbox,
  ShadcnRadioGroup,
  ShadcnSwitch,
  ShadcnCard,
  ShadcnBadge,
  ShadcnAlert,
  ShadcnProgress,
  ShadcnButton,
  ShadcnDatePicker,
  ShadcnCalendar,
  ShadcnCombobox,
  ShadcnSlider,
  ShadcnLabel,
  ShadcnTooltip,
  ShadcnSeparator,
  ShadcnModalRenderer,
  ViewerWrapper,
} from './components';
import { FormGrid } from './grid';
import { libraryComponents, libraryDescriptions } from './component-library';

const countOptions = Array.from({ length: 12 }, (_, index) => String(index + 1));
const gridSpanProps = {
  mobileSpan: oneOf(...countOptions)
    .default('1')
    .named('گستره ستون در موبایل'),
  tabletSpan: oneOf(...countOptions)
    .default('1')
    .named('گستره ستون در تبلت'),
  desktopSpan: oneOf(...countOptions)
    .default('1')
    .named('گستره ستون در دسکتاپ'),
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
  define(ShadcnInput, 'ShadcnInput')
    .name('ورودی متن')
    .category('ورودی‌ها')
    .props({ ...textProps }),
  define(ShadcnTextarea, 'ShadcnTextarea')
    .name('ناحیه متن')
    .category('ورودی‌ها')
    .props({ ...textProps }),
  define(ShadcnSelect, 'ShadcnSelect')
    .name('فهرست انتخاب')
    .category('ورودی‌ها')
    .props({
      value: string.valued.uncontrolledValue(''),
      label: string.default('انتخاب گزینه').named('عنوان'),
      options: array.ofString.default(['گزینه اول', 'گزینه دوم']).named('گزینه‌ها'),
      disabled: disabled.default(false).named('غیرفعال'),
      clearable: boolean.default(true).named('امکان پاک کردن مقدار'),
      onChange: event,
      ...gridSpanProps,
    }),
  define(ShadcnCheckbox, 'ShadcnCheckbox')
    .name('چک‌باکس')
    .category('ورودی‌ها')
    .props({
      value: string.valued.uncontrolledValue('false'),
      label: string.default('تأیید می‌کنم').named('عنوان'),
      disabled: disabled.default(false),
      onChange: event,
      ...gridSpanProps,
    }),
  define(ShadcnRadioGroup, 'ShadcnRadioGroup')
    .name('گروه رادیویی')
    .category('ورودی‌ها')
    .props({
      value: string.valued.uncontrolledValue(''),
      label: string.default('انتخاب گزینه').named('عنوان'),
      options: array.ofString.default(['گزینه اول', 'گزینه دوم']).named('گزینه‌ها'),
      disabled: disabled.default(false),
      onChange: event,
      ...gridSpanProps,
    }),
  define(ShadcnSwitch, 'ShadcnSwitch')
    .name('کلید روشن/خاموش')
    .category('ورودی‌ها')
    .props({
      value: string.valued.uncontrolledValue('false'),
      label: string.default('فعال').named('عنوان'),
      disabled: disabled.default(false),
      onChange: event,
      ...gridSpanProps,
    }),
  define(ShadcnDatePicker, 'ShadcnDatePicker')
    .name('انتخاب‌گر تاریخ')
    .category('ورودی‌ها')
    .props({ ...textProps }),
  define(ShadcnCalendar, 'ShadcnCalendar')
    .name('تقویم')
    .category('ورودی‌ها')
    .props({ ...textProps }),
  define(ShadcnCombobox, 'ShadcnCombobox')
    .name('انتخاب‌گر جست‌وجو')
    .category('ورودی‌ها')
    .props({
      value: string.valued.uncontrolledValue(''),
      label: string.default('انتخاب گزینه').named('عنوان'),
      options: array.ofString.default(['گزینه اول', 'گزینه دوم']).named('گزینه‌ها'),
      disabled: disabled.default(false),
      clearable: boolean.default(true).named('امکان پاک کردن مقدار'),
      onChange: event,
      ...gridSpanProps,
    }),
  define(ShadcnSlider, 'ShadcnSlider')
    .name('لغزنده')
    .category('ورودی‌ها')
    .props({
      value: string.valued.uncontrolledValue('50'),
      label: string.default('مقدار').named('عنوان'),
      disabled: disabled.default(false),
      onChange: event,
      ...gridSpanProps,
    }),
  define(ShadcnLabel, 'ShadcnLabel')
    .name('برچسب')
    .category('نمایش')
    .props({ text: string.default('برچسب').named('متن'), ...gridSpanProps }),
  define(ShadcnTooltip, 'ShadcnTooltip')
    .name('راهنما')
    .category('نمایش')
    .props({
      text: string.default('توضیحات راهنما').named('متن راهنما'),
      label: string.default('راهنما').named('عنوان'),
      ...gridSpanProps,
    }),
  define(ShadcnSeparator, 'ShadcnSeparator')
    .name('جداکننده')
    .category('چیدمان')
    .props({ ...gridSpanProps }),
  define(ShadcnButton, 'ShadcnButton')
    .name('دکمه')
    .category('عملیات')
    .props({
      label: string.default('ادامه').named('عنوان'),
      disabled: disabled.default(false),
      onClick: event,
      ...gridSpanProps,
    }),
  define(ShadcnCard, 'ShadcnCard')
    .name('کارت')
    .category('چیدمان')
    .kind('container')
    .props({ children: node, ...gridSpanProps }),
  define(ShadcnModalRenderer, 'ShadcnModalRenderer')
    .name('نمایشگر مودال')
    .componentRole('modal')
    .hideFromComponentPalette(),
  define(ShadcnBadge, 'ShadcnBadge')
    .name('نشان')
    .category('نمایش')
    .props({ text: string.default('نشان').named('متن'), ...gridSpanProps }),
  define(ShadcnAlert, 'ShadcnAlert')
    .name('پیام')
    .category('بازخورد')
    .props({ text: string.default('پیام').named('متن'), ...gridSpanProps }),
  define(ShadcnProgress, 'ShadcnProgress')
    .name('نوار پیشرفت')
    .category('بازخورد')
    .props({
      value: oneOf(...Array.from({ length: 101 }, (_, i) => String(i)))
        .default('50')
        .named('درصد'),
      ...gridSpanProps,
    }),
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
      mobileColumns: oneOf(...countOptions)
        .default('1')
        .named('ستون‌های موبایل'),
      tabletColumns: oneOf(...countOptions)
        .default('2')
        .named('ستون‌های تبلت'),
      desktopColumns: oneOf(...countOptions)
        .default('3')
        .named('ستون‌های دسکتاپ'),
      children: node,
    }),
  define(FormSection, 'GridItem')
    .name('عنصر شبکه')
    .category('چیدمان')
    .kind('container')
    .props({ children: node, ...gridSpanProps }),
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
export const componentMetadata = [
  ...libraryComponents,
  ...definitions.map((definition) => definition.build()),
];
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

export function createBuilderView(templateNames: string[] = []) {
  const view = new BuilderView(componentMetadata)
    .withTemplates(templateNames)
    .withViewerWrapper(ViewerWrapper);

  for (const description of libraryDescriptions) {
    view.withComponentLibraryDescription(description);
  }
  // Apply the project's wording last so it overrides vendor descriptions.
  view.withComponentLibraryDescription(persianComponentLibrary);
  return view;
}
