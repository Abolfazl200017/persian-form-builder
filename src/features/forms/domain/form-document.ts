export interface FormNode {
  key: string;
  type: string;
  children?: FormNode[];
  [key: string]: unknown;
}
export interface FormDocument {
  form: FormNode;
  [key: string]: unknown;
}
export const MAX_FORM_BYTES = 2_000_000;
/** Structural boundary guard, not a sandbox for executable FormEngine expressions. */
export function parseFormDocument(json: string): FormDocument {
  if (new TextEncoder().encode(json).length > MAX_FORM_BYTES)
    throw new Error('حجم فرم نباید بیشتر از ۲ مگابایت باشد');
  const value: unknown = JSON.parse(json);
  if (!value || typeof value !== 'object' || !('form' in value))
    throw new Error('ساختار فرم معتبر نیست');
  const keys = new Set<string>();
  let count = 0;
  function validateNode(node: unknown, depth: number): asserts node is FormNode {
    if (depth > 50 || ++count > 2000) throw new Error('فرم بیش از حد پیچیده است');
    if (
      !node ||
      typeof node !== 'object' ||
      !('key' in node) ||
      typeof node.key !== 'string' ||
      !node.key ||
      !('type' in node) ||
      typeof node.type !== 'string' ||
      !node.type
    )
      throw new Error('هر مؤلفه باید کلید و نوع معتبر داشته باشد');
    if (keys.has(node.key)) throw new Error('کلید مؤلفه‌ها باید یکتا باشد');
    keys.add(node.key);
    if ('children' in node && node.children !== undefined) {
      if (!Array.isArray(node.children)) throw new Error('فرزندان مؤلفه نامعتبر هستند');
      node.children.forEach((child) => validateNode(child, depth + 1));
    }
  }
  validateNode(value.form, 0);
  if (value.form.type !== 'Screen') throw new Error('ریشه فرم باید Screen باشد');
  return value as FormDocument;
}
