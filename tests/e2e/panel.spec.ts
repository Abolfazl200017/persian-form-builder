import { test, expect } from './fixtures';

test('home exposes exactly the two-page horizontal navigation at full width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'منوی اصلی' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('link')).toHaveCount(2);
  await expect(navigation.getByRole('link', { name: 'خانه' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(navigation.getByRole('link', { name: 'فرم‌ها' })).toBeVisible();
  await expect(page.getByText('فارسی · راست‌به‌چپ')).toHaveCount(0);
  await expect(page.locator('.MuiDrawer-paper')).toHaveCount(0);
  const main = await page.locator('main').boundingBox();
  expect(main).not.toBeNull();
  expect(main!.x).toBe(0);
  expect(main!.width).toBe(1440);
});

test('forms page sends the create button to the add form page', async ({ page }) => {
  await page.goto('/forms');
  await expect(page.getByRole('heading', { level: 1, name: 'فرم‌ها' })).toBeVisible();
  const createForm = page.getByRole('link', { name: 'ایجاد فرم' });
  await expect(createForm).toBeVisible();
  await createForm.click();
  await expect(page).toHaveURL(/\/forms\/new$/);
  await expect(page.getByRole('heading', { level: 1, name: 'افزودن فرم' })).toBeVisible();
  await expect(page.getByLabel('نام فرم')).toBeVisible();
  await expect(page.getByLabel('کد فرم')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'نوع فرم' })).toBeVisible();
  await expect(page.getByText('تغییرات در این نسخه ذخیره نمی‌شوند')).toHaveCount(0);
});

test('designer spans the panel width and loads Monaco locally', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  const monacoLoaded = page.waitForResponse(
    (response) =>
      response.url().endsWith('/vendor/monaco/0.55.1/vs/editor/editor.main.js') && response.ok(),
  );
  await page.goto('/forms/new');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible({
    timeout: 45000,
  });
  const main = await page.locator('main').boundingBox();
  const designer = await page.locator('.engine-host').boundingBox();
  expect(main).not.toBeNull();
  expect(designer).not.toBeNull();
  expect(designer!.x).toBeGreaterThanOrEqual(main!.x);
  expect(designer!.width).toBeGreaterThan(main!.width * 0.95);
  expect(designer!.width).toBeGreaterThan(1450);
  const canvas = page.locator('.engine-host .FE_FormContainer');
  await expect(canvas).toHaveCSS('overflow-y', 'auto');
  expect(
    await page.evaluate(() => {
      const container = document.querySelector('.engine-host .FE_FormContainer');
      if (!container) return false;
      const probe = document.createElement('div');
      probe.style.height = '1600px';
      probe.style.flex = '0 0 auto';
      container.appendChild(probe);
      container.scrollTop = 500;
      const scrolled = container.scrollTop > 0;
      probe.remove();
      container.scrollTop = 0;
      return scrolled;
    }),
  ).toBe(true);
  await page.getByRole('button', { name: 'ویرایش JSON' }).click();
  await expect(page.locator('.monaco-editor').first()).toBeVisible();
  await expect(page.locator('.monaco-editor .view-lines').first()).toContainText('Screen');
  await monacoLoaded;
});

test('add form metadata is editable and logs the page data', async ({ page }) => {
  await page.goto('/forms/new');
  await page.getByLabel('نام فرم').fill('نظرسنجی مشتری');
  await page.getByLabel('کد فرم').fill('customer-survey');
  await expect(page.getByLabel('نام فرم')).toHaveValue('نظرسنجی مشتری');
  await expect(page.getByLabel('کد فرم')).toHaveValue('customer-survey');
  await expect(page.getByText('customer-survey', { exact: true })).toHaveCount(0);

  const formType = page.getByRole('combobox', { name: 'نوع فرم' });
  await expect(formType).toContainText('وب');
  await formType.click();
  await page.getByRole('option', { name: 'موبایل' }).click();
  await expect(formType).toContainText('موبایل');

  const logPromise = page.waitForEvent('console', {
    predicate: (message) => message.text().startsWith('form-data'),
  });
  await page.getByRole('button', { name: 'دریافت داده فرم' }).click();
  const payload = await (await logPromise).args()[1].jsonValue();
  expect(payload).toMatchObject({
    formName: 'نظرسنجی مشتری',
    code: 'customer-survey',
    type: 'mobile',
  });
  expect(payload.jsonData.form.type).toBe('Screen');
  await expect(page.getByText('داده فرم در کنسول ثبت شد.')).toBeVisible();
});

test('designer toggles fullscreen and the JSON editor stays above it', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/forms/new');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible({
    timeout: 45000,
  });
  await page.getByRole('button', { name: 'تمام‌صفحه' }).click();
  await expect(page.getByRole('button', { name: 'حالت پنجره' })).toBeVisible();
  const fullscreenBox = await page.locator('.engine-host').boundingBox();
  expect(fullscreenBox).not.toBeNull();
  expect(fullscreenBox!.width).toBeGreaterThan(1500);
  expect(fullscreenBox!.height).toBeGreaterThan(900);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await page.getByRole('button', { name: 'ویرایش JSON' }).click();
  await expect(page.locator('.monaco-editor').first()).toBeVisible();
  expect(
    await page.evaluate(() => {
      const modal = document.querySelector('.rs-modal');
      if (!modal) return false;
      const box = modal.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + 40);
      return !!hit && modal.contains(hit);
    }),
  ).toBe(true);
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.monaco-editor').first()).toBeHidden();
  await expect(page.getByRole('button', { name: 'حالت پنجره' })).toBeVisible();

  await page.getByRole('button', { name: 'حالت پنجره' }).click();
  const windowedBox = await page.locator('.engine-host').boundingBox();
  expect(windowedBox!.height).toBeLessThan(fullscreenBox!.height);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

  await page.getByRole('button', { name: 'تمام‌صفحه' }).click();
  await expect(page.getByRole('button', { name: 'حالت پنجره' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'تمام‌صفحه' })).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('designer built-ins and form settings are translated to Persian', async ({ page }) => {
  await page.goto('/forms/new');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible({
    timeout: 45000,
  });
  await expect(page.getByText('تکرارشونده', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('جایگاه', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('فرم جاسازی‌شده', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Repeater', { exact: true })).toHaveCount(0);
  await expect(page.getByText('EmbeddedForm', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Slot', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Modal', { exact: true })).toHaveCount(0);

  await page.getByText('تنظیمات', { exact: true }).click();
  await expect(page.getByText('نوع خطا', { exact: true })).toBeVisible();
  await expect(page.getByText('نوع راهنما', { exact: true })).toBeVisible();
  await expect(page.getByText('نوع مودال', { exact: true })).toBeVisible();
  await expect(page.getByText('زبان پیش‌فرض', { exact: true })).toBeVisible();
  await expect(page.getByText('پیام خطای پیش‌فرض', { exact: true })).toBeVisible();
  await expect(page.getByText('Error Type', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Default Error Message', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Select', { exact: true })).toHaveCount(0);
});

test('mobile navigation stays accessible and pages never overflow horizontally', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/forms');
  await expect(page.getByRole('navigation', { name: 'منوی اصلی' })).toBeHidden();
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  const drawerNavigation = page.getByRole('navigation', { name: 'منوی موبایل' });
  await expect(drawerNavigation).toBeVisible();
  await expect(drawerNavigation.getByRole('link', { name: 'خانه' })).toBeVisible();
  await expect(drawerNavigation.getByRole('link', { name: 'فرم‌ها' })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
  await drawerNavigation.getByRole('link', { name: 'فرم‌ها' }).click();
  await expect(page).toHaveURL(/\/forms$/);

  await page.goto('/forms/new');
  await expect(page.getByLabel('نام فرم')).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test('panel theme follows the designer token palette', async ({ page }) => {
  await page.goto('/forms');
  const createForm = page.getByRole('link', { name: 'ایجاد فرم' });
  await expect(createForm).toHaveCSS('background-color', 'rgb(52, 152, 255)');
  await expect(createForm).toHaveCSS('border-radius', '6px');
  await expect(page.locator('header')).toHaveCSS('z-index', '10');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 247, 250)');
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain(
    'Vazirmatn',
  );
});

test('header theme button switches the panel and designer together', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/forms/new');
  await expect(page.getByText('ورودی متن', { exact: true }).first()).toBeVisible({
    timeout: 45000,
  });
  const body = page.locator('body');
  await expect(body).toHaveClass(/rs-theme-light/);
  await expect(body).toHaveCSS('background-color', 'rgb(247, 247, 250)');
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const designerButton = page.locator('.engine-host .rs-btn').first();
  expect(
    await designerButton.evaluate((element) => getComputedStyle(element).fontFamily),
  ).toContain('Vazirmatn');

  await page.getByRole('button', { name: 'تغییر به حالت تاریک' }).click();
  await expect(body).toHaveCSS('background-color', 'rgb(15, 19, 26)');
  await expect(body).toHaveClass(/rs-theme-dark/);
  await expect(page.locator('header')).toHaveCSS('background-color', 'rgb(26, 29, 36)');
  await expect(page.locator('.engine-host')).toHaveCSS('background-color', 'rgb(26, 29, 36)');
  await expect(page.getByRole('button', { name: 'تغییر به حالت روشن' })).toBeVisible();

  await page.getByRole('button', { name: 'تغییر به حالت روشن' }).click();
  await expect(body).toHaveCSS('background-color', 'rgb(247, 247, 250)');
  await expect(body).toHaveClass(/rs-theme-light/);
});

test('home sends the same-origin resource policy and bundles Persian fonts', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain("default-src 'self'");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px Vazirmatn'))).toBe(true);
});
