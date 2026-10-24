import type { Page } from '@playwright/test';
import { expect } from './fixtures';

export async function editSchema(page: Page, document: unknown) {
  await page.getByRole('button', { name: 'ویرایش JSON' }).click();
  const editor = page.getByRole('dialog', { name: 'ویرایش JSON' });
  await expect(editor.locator('.monaco-editor')).toBeVisible();
  await page.evaluate((json) => {
    const { monaco } = window as Window & {
      monaco?: { editor: { getModels: () => { setValue: (value: string) => void }[] } };
    };
    if (!monaco) throw new Error('Monaco is not ready');
    monaco.editor.getModels()[0].setValue(json);
  }, JSON.stringify(document));
  await editor.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(editor).toBeHidden();
}
