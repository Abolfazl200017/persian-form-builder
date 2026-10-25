import type { IFormStorage } from '@react-form-builder/designer';
import type { FormRepository } from '../domain/repository';
import { SAMPLE_NAME } from '../domain/sample';
export function createDesignerStorage(
  repository: FormRepository,
  onFormNamesChange?: () => void,
): IFormStorage {
  return {
    getFormNames: () => repository.list(),
    getForm: (name) => repository.load(name ?? SAMPLE_NAME),
    saveForm: async (name, json) => {
      const isNew = !(await repository.list()).includes(name);
      await repository.save(name, json);
      if (isNew) onFormNamesChange?.();
    },
    removeForm: async (name) => {
      await repository.remove(name);
      onFormNamesChange?.();
    },
  };
}
