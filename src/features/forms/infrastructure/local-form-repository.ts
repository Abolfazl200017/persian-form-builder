import type { FormRepository } from '../domain/repository';
import { parseFormDocument } from '../domain/form-document';
import { SAMPLE_NAME, sampleJson } from '../domain/sample';
import {
  DEFAULT_MODAL_TEMPLATE_NAME,
  defaultModalTemplateJson,
  NEW_FORM_NAME,
  newFormJson,
} from '../domain/new-form';
const PREFIX = 'persian-form-panel:v1:form:';
const INITIALIZED_KEY = `${PREFIX}__initialized`;
export class LocalFormRepository implements FormRepository {
  constructor(private readonly storage: Storage) {
    if (storage.getItem(INITIALIZED_KEY) !== 'true') {
      const initialForms = [
        [SAMPLE_NAME, sampleJson],
        [NEW_FORM_NAME, newFormJson],
        [DEFAULT_MODAL_TEMPLATE_NAME, defaultModalTemplateJson],
      ] as const;
      for (const [name, json] of initialForms) {
        const key = PREFIX + name;
        if (!storage.getItem(key)) storage.setItem(key, json);
      }
      storage.setItem(INITIALIZED_KEY, 'true');
    }
  }
  listSync() {
    const names = Array.from({ length: this.storage.length }, (_, i) => this.storage.key(i))
      .filter((key): key is string => !!key?.startsWith(PREFIX))
      .filter((key) => key !== INITIALIZED_KEY)
      .map((key) => key.slice(PREFIX.length));
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'fa'));
  }
  async list() {
    return this.listSync();
  }
  async load(name: string) {
    const json = this.storage.getItem(PREFIX + name);
    if (!json) throw new Error('فرم پیدا نشد');
    parseFormDocument(json);
    return json;
  }
  async save(name: string, json: string) {
    if (!name.trim() || name.length > 120) throw new Error('نام فرم معتبر نیست');
    parseFormDocument(json);
    this.storage.setItem(PREFIX + name, json);
  }
  async remove(name: string) {
    this.storage.removeItem(PREFIX + name);
  }
}
