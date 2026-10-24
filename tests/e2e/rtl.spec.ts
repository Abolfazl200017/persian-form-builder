import type { Locator } from '@playwright/test';
import { test, expect } from './fixtures';
import { editSchema } from './designer';
import { newFormDocument } from '../../src/features/forms/domain/new-form';

async function expectCenteredRadio(radio: Locator) {
  await expect
    .poll(() =>
      radio.evaluate((element) => {
        const inner = element.querySelector('.rs-radio-inner')!;
        const center = (pseudo: string) => {
          const style = getComputedStyle(inner, pseudo);
          const px = (value: string) => Number.parseFloat(value) || 0;
          const contentBox = style.boxSizing === 'content-box';
          const width =
            px(style.width) +
            (contentBox ? px(style.borderLeftWidth) + px(style.borderRightWidth) : 0);
          const height =
            px(style.height) +
            (contentBox ? px(style.borderTopWidth) + px(style.borderBottomWidth) : 0);
          return {
            x: px(style.left) + px(style.marginLeft) + width / 2,
            y: px(style.top) + px(style.marginTop) + height / 2,
          };
        };
        const outer = center('::before');
        const dot = center('::after');
        return Math.max(Math.abs(outer.x - dot.x), Math.abs(outer.y - dot.y));
      }),
    )
    .toBeLessThan(0.5);
}

test('form components use RTL alignment and centered radio markers in designer and preview', async ({
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
        { key: 'input', type: 'RsInput', props: { label: { value: 'عنوان ورودی' } } },
        {
          key: 'radio',
          type: 'RsRadioGroup',
          props: {
            label: { value: 'عنوان انتخاب' },
            items: {
              value: [
                { label: 'انتخاب اول', value: 'first' },
                { label: 'انتخاب دوم', value: 'second' },
              ],
            },
            value: { value: 'first' },
          },
        },
        { key: 'dropdown', type: 'RsDropdown', props: { label: { value: 'عنوان فهرست' } } },
        {
          key: 'rich',
          type: 'RichTextEditor',
          props: {
            initialValue: {
              value:
                '<p>متن راست‌به‌چپ</p><ol><li>آیتم اول</li></ol><p class="ql-align-center">متن وسط</p>',
            },
          },
        },
        { key: 'signature', type: 'RsSignature', props: { label: { value: 'عنوان امضا' } } },
        {
          key: 'email',
          type: 'PersianText',
          props: { label: { value: 'ایمیل' }, inputType: { value: 'email' } },
        },
        { key: 'digits', type: 'NationalId', props: { label: { value: 'شناسه' } } },
      ],
    },
  });
  const canvas = page.locator('.FE_FormContainer');

  for (const mode of ['designer', 'preview']) {
    if (mode === 'preview')
      await page.getByRole('button', { name: 'پیش نمایش', exact: true }).click();
    const radio = canvas.locator('.rs-radio-checked');
    await expect(radio).toHaveCount(1);
    await expectCenteredRadio(radio);
    const control = (await radio.locator('.rs-radio-control').boundingBox())!;
    const label = (await radio.locator('.rs-radio-label').boundingBox())!;
    expect(control.x).toBeGreaterThan(label.x + label.width);

    for (const title of ['عنوان ورودی', 'عنوان انتخاب', 'عنوان فهرست', 'عنوان امضا']) {
      const fieldLabel = canvas.getByText(title, { exact: true });
      await expect(fieldLabel).toHaveCSS('text-align', 'start');
      await expect(fieldLabel).toHaveCSS('direction', 'rtl');
    }
    const editor = canvas.locator('.ql-editor');
    await expect(editor).toHaveCSS('direction', 'rtl');
    await expect(editor).toHaveCSS('text-align', 'start');
    await expect(editor.getByText('متن وسط', { exact: true })).toHaveCSS('text-align', 'center');
    await expect(editor.locator('li')).toHaveCSS('padding-left', '0px');
    await expect(canvas.getByRole('textbox', { name: 'ایمیل', exact: true })).toHaveCSS(
      'direction',
      'ltr',
    );
    await expect(canvas.getByRole('textbox', { name: 'شناسه', exact: true })).toHaveCSS(
      'direction',
      'ltr',
    );
  }

  await page.getByRole('radio', { name: 'انتخاب دوم', exact: true }).check();
  await expectCenteredRadio(canvas.locator('.rs-radio-checked'));
  await page.getByRole('button', { name: 'تغییر به حالت تاریک' }).click();
  await expectCenteredRadio(canvas.locator('.rs-radio-checked'));
  await page.setViewportSize({ width: 390, height: 844 });
  await expectCenteredRadio(canvas.locator('.rs-radio-checked'));
});
