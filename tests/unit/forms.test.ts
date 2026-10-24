import { describe, expect, it } from 'vitest';
import { normalizeSubmission, toEnglishDigits, toPersianDigits } from '@/lib/digits';
import { splitRequiredLabel } from '@/lib/labels';
import { isIranMobile, isIranNationalId } from '@/features/forms/domain/validation';
import { parseFormDocument } from '@/features/forms/domain/form-document';
import { formDraftSchema } from '@/features/forms/domain/form-draft';
import {
  clampGridSpan,
  resolveGridColumns,
  resolveGridSpan,
} from '@/features/forms/engine/grid-math';
import { sampleJson } from '@/features/forms/domain/sample';
import { NEW_FORM_NAME, newFormJson } from '@/features/forms/domain/new-form';
import { LocalFormRepository } from '@/features/forms/infrastructure/local-form-repository';
import { MemoryFormRepository } from '@/features/forms/infrastructure/memory-form-repository';
class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}
describe('Persian form boundaries', () => {
  it('converts both Persian and Arabic digits without changing other text', () => {
    expect(toEnglishDigits('۰۱۲٣٤٥ test')).toBe('012345 test');
    expect(toPersianDigits('0935')).toBe('۰۹۳۵');
  });
  it('splits a trailing asterisk so the marker can be colored', () => {
    expect(splitRequiredLabel('نام*')).toEqual({ text: 'نام', separator: '', required: true });
    expect(splitRequiredLabel('نام *')).toEqual({ text: 'نام', separator: ' ', required: true });
    expect(splitRequiredLabel('نام خانوادگی')).toEqual({
      text: 'نام خانوادگی',
      separator: '',
      required: false,
    });
    expect(splitRequiredLabel('a*b')).toEqual({ text: 'a*b', separator: '', required: false });
  });
  it('validates the add form draft with zod', () => {
    expect(
      formDraftSchema.safeParse({ name: 'نظرسنجی', code: 'survey-1', type: 'mobile' }).success,
    ).toBe(true);
    const empty = formDraftSchema.safeParse({ name: '  ', code: '', type: 'web' });
    expect(empty.success).toBe(false);
    if (!empty.success) {
      expect(empty.error.issues.map((issue) => issue.message)).toEqual(
        expect.arrayContaining(['نام فرم الزامی است', 'کد فرم الزامی است']),
      );
    }
    expect(
      formDraftSchema.safeParse({ name: 'فرم', code: 'Bad Code', type: 'web' }).success,
    ).toBe(false);
    expect(formDraftSchema.parse({ name: '  فرم  ', code: ' sample ', type: 'web' })).toEqual({
      name: 'فرم',
      code: 'sample',
      type: 'web',
    });
  });
  it('resolves responsive grid columns and clamps spans', () => {
    const columns = { mobileColumns: '1', tabletColumns: '2', desktopColumns: '3' };
    expect(resolveGridColumns('mobile', columns)).toBe(1);
    expect(resolveGridColumns('tablet', columns)).toBe(2);
    expect(resolveGridColumns('desktop', columns)).toBe(3);
    expect(resolveGridColumns('desktop', { desktopColumns: '99' })).toBe(12);
    expect(resolveGridColumns('desktop', { desktopColumns: 'not-a-number' })).toBe(1);

    const spans = { mobileSpan: '1', tabletSpan: '2', desktopSpan: '5' };
    expect(resolveGridSpan('mobile', spans)).toBe(1);
    expect(resolveGridSpan('tablet', spans)).toBe(2);
    expect(resolveGridSpan('desktop', spans)).toBe(5);
    expect(clampGridSpan(5, 3)).toBe(3);
    expect(clampGridSpan(0, 3)).toBe(1);
    expect(clampGridSpan(2, 2)).toBe(2);
  });
  it('normalizes nested submitted values while retaining key names and types', () => {
    expect(normalizeSubmission({ فیلد۱: ['۱۲', 5, false, null] })).toEqual({
      فیلد۱: ['12', 5, false, null],
    });
  });
  it('checks mobile length and prefix', () => {
    expect(isIranMobile('۰۹۱۲۳۴۵۶۷۸۹')).toBe(true);
    expect(isIranMobile('98123456789')).toBe(false);
  });
  it('checks national ID checksum and rejects repeated digits', () => {
    expect(isIranNationalId('1234567891')).toBe(true);
    expect(isIranNationalId('1234567890')).toBe(false);
    expect(isIranNationalId('1111111111')).toBe(false);
  });
  it('rejects malformed form trees and duplicate keys', () => {
    expect(parseFormDocument(sampleJson).form.type).toBe('Screen');
    expect(() => parseFormDocument('{"form":{}}')).toThrow();
    expect(() =>
      parseFormDocument(
        JSON.stringify({
          form: { key: 'a', type: 'Screen', children: [{ key: 'a', type: 'PersianText' }] },
        }),
      ),
    ).toThrow();
  });
  it('round-trips named forms without overwriting unrelated storage', async () => {
    const storage = new MemoryStorage();
    storage.setItem('other', 'keep');
    const repository = new LocalFormRepository(storage);
    await repository.save('نمونه دوم', sampleJson);
    expect(await repository.load('نمونه دوم')).toBe(sampleJson);
    expect(await repository.list()).toContain('نمونه دوم');
    await repository.remove('نمونه دوم');
    await expect(repository.load('نمونه دوم')).rejects.toThrow();
    expect(storage.getItem('other')).toBe('keep');
  });
  it('keeps draft forms in memory only', async () => {
    const repository = new MemoryFormRepository();
    expect(await repository.load(NEW_FORM_NAME)).toBe(newFormJson);
    await repository.save('پیش‌نویس', newFormJson);
    expect(await repository.list()).toContain('پیش‌نویس');
    await repository.remove('پیش‌نویس');
    await expect(repository.load('پیش‌نویس')).rejects.toThrow();
  });
});
