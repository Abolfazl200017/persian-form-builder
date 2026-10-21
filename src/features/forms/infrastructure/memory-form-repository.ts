import type { FormRepository } from '../domain/repository';
import { parseFormDocument } from '../domain/form-document';
import { NEW_FORM_NAME, newFormJson } from '../domain/new-form';

/**
 * Session-only FormEngine storage. Nothing is written to localStorage: the
 * Add Form page is a drafting surface until persistence is specified.
 */
export class MemoryFormRepository implements FormRepository {
  private readonly forms = new Map<string, string>();

  constructor(initialJson: string = newFormJson) {
    this.forms.set(NEW_FORM_NAME, initialJson);
  }

  async list() {
    return [...this.forms.keys()];
  }

  async load(name: string) {
    const json = this.forms.get(name);
    if (!json) throw new Error('فرم پیدا نشد');
    return json;
  }

  async save(name: string, json: string) {
    if (!name.trim() || name.length > 120) throw new Error('نام فرم معتبر نیست');
    parseFormDocument(json);
    this.forms.set(name, json);
  }

  async remove(name: string) {
    this.forms.delete(name);
  }
}
