import type { FormRepository } from '../domain/repository';
import { parseFormDocument } from '../domain/form-document';
import { SAMPLE_NAME, sampleJson } from '../domain/sample';
const PREFIX = 'persian-form-panel:v1:form:';
export class LocalFormRepository implements FormRepository {
  constructor(private readonly storage: Storage) {}
  async list() {
    const names = Array.from({ length: this.storage.length }, (_, i) => this.storage.key(i))
      .filter((key): key is string => !!key?.startsWith(PREFIX))
      .map((key) => key.slice(PREFIX.length));
    return [...new Set([SAMPLE_NAME, ...names])].sort((a, b) => a.localeCompare(b, 'fa'));
  }
  async load(name: string) {
    const json = this.storage.getItem(PREFIX + name) ?? (name === SAMPLE_NAME ? sampleJson : null);
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
