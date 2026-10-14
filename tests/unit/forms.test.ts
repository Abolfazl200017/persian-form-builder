import { describe, expect, it } from 'vitest';
import { normalizeSubmission, toEnglishDigits, toPersianDigits } from '@/lib/digits';
import { isIranMobile, isIranNationalId } from '@/features/forms/domain/validation';
import { parseFormDocument } from '@/features/forms/domain/form-document';
import { sampleJson } from '@/features/forms/domain/sample';
import { LocalFormRepository } from '@/features/forms/infrastructure/local-form-repository';
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
});
