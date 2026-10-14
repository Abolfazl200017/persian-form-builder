import type { IFormStorage } from '@react-form-builder/designer';
import type { FormRepository } from '../domain/repository';
import { SAMPLE_NAME } from '../domain/sample';
export function createDesignerStorage(repository: FormRepository): IFormStorage {
  return {
    getFormNames: () => repository.list(),
    getForm: (name) => repository.load(name ?? SAMPLE_NAME),
    saveForm: (name, json) => repository.save(name, json),
    removeForm: (name) => repository.remove(name),
  };
}
