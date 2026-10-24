import { test, expect } from './fixtures';
import { editSchema } from './designer';
import { newFormDocument } from '../../src/features/forms/domain/new-form';

test('the full component palette includes standard, advanced, and Persian controls', async ({
  page,
}) => {
  await page.goto('/forms/new');
  await expect(page.getByTestId('RsInput-palette-component')).toBeVisible({ timeout: 45000 });
  const expectedTypes = [
    'RsAutoComplete',
    'RsCalendar',
    'RsCheckbox',
    'RsDatePicker',
    'RsDropdown',
    'RsInput',
    'RsNumberFormat',
    'RsPatternFormat',
    'RsRadioGroup',
    'RsSearch',
    'RsTagPicker',
    'RsTextArea',
    'RsTimePicker',
    'RsToggle',
    'RsUploader',
    'RsButton',
    'RsDivider',
    'RsHeader',
    'RsImage',
    'RsLabel',
    'RsLink',
    'RsMenu',
    'RsMessage',
    'RsPlaceholderGraph',
    'RsPlaceholderGrid',
    'RsPlaceholderParagraph',
    'RsProgressCircle',
    'RsProgressLine',
    'RsStaticContent',
    'RsTooltip',
    'RsModalLayout',
    'RsBreadcrumb',
    'RsCard',
    'RsContainer',
    'RsTab',
    'RsWizard',
    'RsWizardStep',
    'RsTable',
    'RsColumn',
    'RsColumnGroup',
    'RsCell',
    'RsHeaderCell',
    'RichTextEditor',
    'RsSignature',
    'FastQR',
    'GoogleMap',
    'PageBreak',
    'PrintSettings',
    'Modal',
    'Repeater',
    'EmbeddedForm',
    'Slot',
    'PersianText',
    'IranMobile',
    'NationalId',
    'PersianAmount',
    'Consent',
    'FormSection',
    'FormGrid',
    'SectionTitle',
    'SubmitButton',
  ];
  const paletteTypes = await page
    .locator('.FE_Palette_Component')
    .evaluateAll((elements) =>
      elements.map((element) =>
        element.getAttribute('data-testid')?.replace('-palette-component', ''),
      ),
    );
  expect(paletteTypes.sort()).toEqual(expectedTypes.sort());
  expect(new Set(paletteTypes).size).toBe(paletteTypes.length);
  await expect(page.getByTestId('RsModal-palette-component')).toHaveCount(0);
  await expect(page.getByTestId('RsErrorMessage-palette-component')).toHaveCount(0);
});

test('RSuite fields remain interactive and display validation errors in preview', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/forms/new');
  await expect(page.getByTestId('RsInput-palette-component')).toBeVisible();
  await editSchema(page, {
    ...newFormDocument,
    form: {
      ...newFormDocument.form,
      children: [
        {
          key: 'name',
          type: 'RsInput',
          props: { label: { value: 'نام آزمایشی' } },
          schema: { validations: [{ key: 'required', args: { message: 'نام را وارد کنید' } }] },
        },
        {
          key: 'city',
          type: 'RsDropdown',
          props: {
            label: { value: 'شهر' },
            data: {
              value: [
                { label: 'تهران', value: 'tehran' },
                { label: 'شیراز', value: 'shiraz' },
              ],
            },
          },
        },
        {
          key: 'kind',
          type: 'RsRadioGroup',
          props: {
            items: {
              value: [
                { label: 'شخصی', value: 'personal' },
                { label: 'تجاری', value: 'business' },
              ],
            },
          },
        },
        { key: 'accept', type: 'RsCheckbox', props: { children: { value: 'پذیرش شرایط' } } },
        { key: 'date', type: 'RsDatePicker', props: { label: { value: 'تاریخ' } } },
        {
          key: 'validate',
          type: 'RsButton',
          props: { children: { value: 'بررسی فرم' } },
          events: { onClick: [{ name: 'validate', type: 'common' }] },
        },
      ],
    },
  });
  await page.getByRole('button', { name: 'پیش نمایش', exact: true }).click();
  await page.getByRole('button', { name: 'بررسی فرم', exact: true }).click();
  await expect(page.getByText('نام را وارد کنید', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'نام آزمایشی*', exact: true }).fill('علی');
  await page.getByRole('combobox', { name: 'شهر', exact: true }).click();
  await page.getByRole('option', { name: 'تهران', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'شهر', exact: true })).toContainText('تهران');
  await page.getByRole('radio', { name: 'تجاری', exact: true }).check();
  await expect(page.getByRole('radio', { name: 'تجاری', exact: true })).toBeChecked();
  await page.getByRole('checkbox', { name: 'پذیرش شرایط', exact: true }).check();
  await expect(page.getByRole('checkbox', { name: 'پذیرش شرایط', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'بررسی فرم', exact: true }).click();
  await expect(page.getByText('نام را وارد کنید', { exact: true })).toHaveCount(0);
});

test('advanced components render locally and support editing, signing, and table data', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/forms/new');
  await expect(page.getByTestId('RichTextEditor-palette-component')).toBeVisible();
  const wasmLoaded = page.waitForResponse(
    (response) => response.url().includes('.wasm') && response.ok(),
  );
  await editSchema(page, {
    ...newFormDocument,
    form: {
      ...newFormDocument.form,
      children: [
        {
          key: 'rich',
          type: 'RichTextEditor',
          props: { initialValue: { value: '<p>متن اولیه</p>' } },
        },
        {
          key: 'qr',
          type: 'FastQR',
          props: {
            content: { value: 'local-library-test' },
            width: { value: 180 },
            'data-testid': { value: 'preview-qr' },
          },
        },
        {
          key: 'signature',
          type: 'RsSignature',
          props: { clearButtonText: { value: 'پاک کردن امضا' } },
        },
        {
          key: 'table',
          type: 'RsTable',
          props: {
            data: { value: [{ key: '1', name: 'ردیف آزمایشی' }] },
            autoHeight: { value: true },
          },
          children: [
            {
              key: 'column',
              type: 'RsColumn',
              props: { width: { value: 250 } },
              children: [
                { key: 'heading', type: 'RsHeaderCell', props: { children: { value: 'نام' } } },
                { key: 'cell', type: 'RsCell', props: { dataKey: { value: 'name' } } },
              ],
            },
          ],
        },
        { key: 'break', type: 'PageBreak', props: {} },
        { key: 'print', type: 'PrintSettings', props: { header: { value: 'صفحه {page}' } } },
        { key: 'map', type: 'GoogleMap', props: {} },
      ],
    },
  });
  await expect(page.getByTestId('page-break-placeholder')).toHaveText('شکست صفحه');
  await page.getByRole('button', { name: 'پیش نمایش', exact: true }).click();
  const canvas = page.locator('.FE_FormContainer');
  await expect(canvas.locator('.ql-editor')).toContainText('متن اولیه');
  await canvas.locator('.ql-editor').fill('متن ویرایش‌شده');
  await expect(canvas.locator('.ql-editor')).toContainText('متن ویرایش‌شده');
  await wasmLoaded;
  await expect(page.getByTestId('preview-qr').locator('svg')).toBeVisible();
  await expect(canvas.getByText('ردیف آزمایشی', { exact: true })).toBeVisible();
  await expect(page.getByTestId('page-break-placeholder')).toHaveCount(0);
  await expect
    .poll(() => page.locator('style[data-print-settings]').textContent())
    .toContain('صفحه');
  await expect(canvas.getByText('برای نمایش نقشه گوگل، کلید API لازم است.')).toBeVisible();

  const signature = canvas.locator('canvas');
  await signature.scrollIntoViewIfNeeded();
  const box = (await signature.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + 30);
  await page.mouse.down();
  await page.mouse.move(box.x + 120, box.y + 80, { steps: 12 });
  await page.mouse.up();
  const clear = page.getByRole('button', { name: 'پاک کردن امضا', exact: true });
  await expect(clear).toBeEnabled();
  await clear.click();
  await expect(clear).toBeDisabled();
  expect(errors).toEqual([]);
});
