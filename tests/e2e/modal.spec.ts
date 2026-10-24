import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { NEW_FORM_NAME, newFormDocument } from '../../src/features/forms/domain/new-form';
import { editSchema } from './designer';

async function expectCentered(page: Page, dialog: Locator) {
  await expect
    .poll(async () => {
      const box = await dialog.boundingBox();
      const viewport = page.viewportSize();
      if (!box || !viewport) return Number.POSITIVE_INFINITY;
      return Math.max(
        Math.abs(box.x + box.width / 2 - viewport.width / 2),
        Math.abs(box.y + box.height / 2 - viewport.height / 2),
      );
    })
    .toBeLessThan(2);
}

async function prepareModal(page: Page, dismissible = true) {
  await page.goto('/forms/new');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible();

  // Save a real template through the designer's session-only storage.
  await editSchema(page, {
    ...newFormDocument,
    form: {
      ...newFormDocument.form,
      children: [
        { key: 'message', type: 'PersianText', props: { label: { value: 'متن داخل مودال' } } },
        {
          key: 'confirm',
          type: 'SubmitButton',
          props: { label: { value: 'تأیید مودال' } },
          events: {
            onClick: [{ name: 'closeModal', type: 'common', args: { result: 'confirmed' } }],
          },
        },
      ],
    },
  });
  await expect(page.getByRole('button', { name: 'تأیید مودال' })).toBeVisible();
  await page.getByTestId('header-save-form-button').click();
  await expect(page.getByText('فرم ذخیره می شود', { exact: true })).toBeVisible();

  await editSchema(page, {
    ...newFormDocument,
    modalType: 'RsModal',
    actions: {
      opened: { body: 'e.data.status = "opened"' },
      closed: { body: 'e.data.status = "closed"' },
    },
    form: {
      ...newFormDocument.form,
      children: [
        { key: 'message', type: 'PersianText', props: { label: { value: 'متن اصلی' } } },
        { key: 'status', type: 'PersianText', props: { label: { value: 'وضعیت مودال' } } },
        {
          key: 'open',
          type: 'SubmitButton',
          props: { label: { value: 'باز کردن مودال' } },
          events: {
            onClick: [
              {
                name: 'openModal',
                type: 'common',
                args: {
                  modalKey: 'dialog',
                  useFormData: true,
                  beforeHide: { type: 'fn', body: 'return { message: e.data.message }' },
                },
              },
            ],
          },
        },
        {
          key: 'dialog',
          type: 'Modal',
          props: { modalTemplate: { value: NEW_FORM_NAME } },
          modal: {
            props: {
              size: { value: 'sm' },
              keyboard: { value: dismissible },
              backdrop: { value: dismissible },
              dialogClassName: { value: 'form-modal-regression' },
            },
            events: {
              onOpen: [{ name: 'opened', type: 'code' }],
              onClose: [{ name: 'closed', type: 'code' }],
            },
          },
        },
      ],
    },
  });
  await expect(page.getByTestId('modal-type-not-specified')).toHaveCount(0);
  await expect(
    page.locator('.FE_FormContainer').getByText(`Modal: '${NEW_FORM_NAME}'`),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'پیش نمایش', exact: true }).click();
}

test('adding the built-in Modal automatically selects its native renderer and properties', async ({
  page,
}) => {
  await page.goto('/forms/new');
  await page.getByTestId('Modal-palette-component').dblclick();
  await expect(page.getByTestId('modal-template-not-specified')).toBeVisible();
  await expect(page.getByTestId('modal-type-not-specified')).toHaveCount(0);
  await expect(page.getByTestId('RsModal-palette-component')).toHaveCount(0);
  await expect(page.getByText('فوکوس خودکار', { exact: true })).toBeVisible();
  await expect(page.locator('.engine-host').getByRole('checkbox').first()).toBeChecked();
  await page.getByTestId('Settings_Tab').click();
  await expect(
    page.locator('.engine-host').getByRole('combobox').filter({ hasText: 'Rs Modal' }),
  ).toBeVisible();
});

test('native modal loads a template, returns data, and closes without leaving fullscreen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await prepareModal(page);
  await page.getByRole('button', { name: 'تمام‌صفحه', exact: true }).click();
  await page.getByRole('textbox', { name: 'متن اصلی', exact: true }).fill('داده اولیه');
  const open = page.getByRole('button', { name: 'باز کردن مودال', exact: true });
  const dialog = page.getByRole('dialog');
  const status = page.getByRole('textbox', { name: 'وضعیت مودال', exact: true });

  await open.click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveClass(/rs-modal-sm/);
  await expect(dialog.locator('.rs-modal-dialog')).toHaveClass(/form-modal-regression/);
  await expect(status).toHaveValue('opened');
  await expectCentered(page, dialog);
  await expect(dialog.getByRole('textbox', { name: 'متن داخل مودال' })).toHaveValue('داده اولیه');
  await expect(page.locator('.rs-modal-wrapper')).toBeFocused();
  await dialog.getByRole('textbox', { name: 'متن داخل مودال' }).fill('داده تأیید شده');
  await dialog.getByRole('button', { name: 'تأیید مودال' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(status).toHaveValue('closed');
  await expect(page.getByRole('textbox', { name: 'متن اصلی', exact: true })).toHaveValue(
    'داده تأیید شده',
  );

  await open.click();
  await expect(dialog).toBeVisible();
  await expect(status).toHaveValue('opened');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(status).toHaveValue('closed');
  await expect(page.getByRole('button', { name: 'حالت پنجره', exact: true })).toBeVisible();
  await expect(open).toBeFocused();

  await open.click();
  await expect(dialog).toBeVisible();
  await page.locator('.rs-modal-wrapper').click({ position: { x: 5, y: 5 } });
  await expect(dialog).toHaveCount(0);
  await expect(status).toHaveValue('closed');
  await expect(page.getByRole('button', { name: 'حالت پنجره', exact: true })).toBeVisible();
});

test('native modal respects disabled keyboard and backdrop dismissal', async ({ page }) => {
  await prepareModal(page, false);
  await page.getByRole('button', { name: 'باز کردن مودال', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expectCentered(page, dialog);
  await expect(page.locator('.rs-modal-backdrop')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'تأیید مودال' }).click();
  await expect(dialog).toHaveCount(0);
});

test('modal stays centered after resizing and tall content remains scrollable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepareModal(page);
  await page.getByRole('button', { name: 'باز کردن مودال', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expectCentered(page, dialog);

  await page.setViewportSize({ width: 390, height: 844 });
  await expectCentered(page, dialog);
  await expect(dialog.getByRole('textbox', { name: 'متن داخل مودال' })).toBeInViewport();

  // Exercise a long template without relying on vendor body component markup.
  await dialog.locator('.rs-modal-content').evaluate((content) => {
    const spacer = document.createElement('div');
    spacer.style.height = '1400px';
    content.insertBefore(spacer, content.lastElementChild);
  });
  const box = await dialog.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  const confirm = dialog.getByRole('button', { name: 'تأیید مودال' });
  await confirm.scrollIntoViewIfNeeded();
  await expect(confirm).toBeInViewport();
  await confirm.click();
  await expect(dialog).toHaveCount(0);
});
