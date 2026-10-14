import { test, expect } from './fixtures';
test('RTL viewer displays Persian numerals and submits canonical values', async ({ page }) => {
  await page.goto('/viewer');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByLabel('نام و نام خانوادگی').fill('کاربر نمونه');
  await page.getByLabel('ایمیل', { exact: true }).fill('test@example.com');
  await page.getByLabel('شماره موبایل').fill('09123456789');
  await expect(page.getByLabel('شماره موبایل')).toHaveValue('۰۹۱۲۳۴۵۶۷۸۹');
  await page.getByLabel('کد ملی').fill('1234567891');
  await page.getByLabel('بودجه پیشنهادی (تومان)').fill('120000');
  await expect(page.getByLabel('بودجه پیشنهادی (تومان)')).toHaveValue('۱۲۰٬۰۰۰');
  await page.getByLabel('صحت اطلاعات واردشده را تأیید می‌کنم').check();
  await page.getByRole('button', { name: 'ثبت درخواست', exact: true }).click();
  await expect(page.getByText('اعتبارسنجی موفق بود')).toBeVisible();
  await expect(page.locator('pre')).toContainText('09123456789');
  await expect(page.locator('pre')).toContainText('120000');
});
test('invalid mobile prevents submission', async ({ page }) => {
  await page.goto('/viewer');
  await page.getByLabel('شماره موبایل').fill('123');
  await page.getByRole('button', { name: 'ثبت درخواست', exact: true }).click();
  await expect(page.getByText('شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود')).toBeVisible();
  await expect(page.getByText('اعتبارسنجی موفق بود')).not.toBeVisible();
});
test('designer loads Persian palette', async ({ page }) => {
  await page.goto('/designer');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible({
    timeout: 45000,
  });
});

test('designer saves a named form that the viewer can reopen', async ({ page }) => {
  await page.goto('/designer');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'ثبت درخواست همکاری' })).toBeVisible();
  await page.getByLabel('نام ذخیره فرم').fill('فرم آزمایشی');
  await page.getByRole('button', { name: 'ذخیره فرم', exact: true }).click();
  await expect(page.getByText('فرم ذخیره شد؛ اکنون در نمایش فرم قابل انتخاب است')).toBeVisible();
  await page.getByRole('link', { name: 'نمایش فرم', exact: true }).click();
  await page.getByRole('combobox', { name: 'انتخاب فرم' }).click();
  await page.getByRole('option', { name: 'فرم آزمایشی', exact: true }).click();
  await expect(page.getByLabel('شماره موبایل')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'خروجی JSON' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('فرم آزمایشی.json');
});

test('imported definitions render and read-only mode prevents edits', async ({ page }) => {
  await page.goto('/viewer');
  const definition = {
    form: {
      key: 'Screen',
      type: 'Screen',
      children: [
        { key: 'testField', type: 'PersianText', props: { label: { value: 'فیلد واردشده' } } },
      ],
    },
    languages: [{ code: 'fa', dialect: 'IR', name: 'فارسی', description: 'فارسی', bidi: 'rtl' }],
    defaultLanguage: 'fa-IR',
  };
  await page.locator('input[type=file]').setInputFiles({
    name: 'واردشده.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(definition)),
  });
  await expect(page.getByLabel('فیلد واردشده')).toBeVisible();
  await page.getByRole('switch', { name: 'فقط خواندنی' }).check();
  await expect(page.getByLabel('فیلد واردشده')).toHaveAttribute('readonly', '');
});

test('mobile shell and viewer fit the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/viewer');
  await expect(page.getByLabel('شماره موبایل')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  await expect(page.getByRole('link', { name: 'طراحی فرم' })).toBeVisible();
});

test('desktop RTL sidebar sits on the right without covering content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const navigation = await page.locator('nav .MuiDrawer-paper').boundingBox();
  const main = await page.locator('main').boundingBox();
  expect(navigation).not.toBeNull();
  expect(main).not.toBeNull();
  expect(navigation!.x).toBeGreaterThan(1100);
  expect(main!.x + main!.width).toBeLessThanOrEqual(navigation!.x + 1);
});

test('designer loads Monaco from the application with external requests blocked', async ({
  page,
}) => {
  const monacoLoaded = page.waitForResponse(
    (response) =>
      response.url().endsWith('/vendor/monaco/0.55.1/vs/editor/editor.main.js') && response.ok(),
  );
  await page.goto('/designer');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible();
  await monacoLoaded;
  await page.getByRole('button', { name: 'ویرایش JSON', exact: true }).click();
  await expect(page.locator('.monaco-editor').first()).toBeVisible();
  await expect(page.locator('.monaco-editor .view-lines').first()).toContainText('Screen');
});

test('dashboard sends the same-origin resource policy and bundles Persian fonts', async ({
  page,
}) => {
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain("default-src 'self'");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px Vazirmatn'))).toBe(true);
});
