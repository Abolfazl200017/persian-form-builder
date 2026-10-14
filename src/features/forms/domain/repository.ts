export interface FormRepository {
  list(): Promise<string[]>;
  load(name: string): Promise<string>;
  save(name: string, json: string): Promise<void>;
  remove(name: string): Promise<void>;
}
