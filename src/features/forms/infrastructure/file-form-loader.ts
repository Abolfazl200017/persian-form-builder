import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const FORM_DATA_DIRECTORY = path.join(process.cwd(), 'src', 'features', 'forms', 'data');

/** Loads the checked-in JSON form fixtures on the server. */
export async function loadFileFormSchemas(): Promise<Record<string, unknown>> {
  const files = await readdir(FORM_DATA_DIRECTORY, { withFileTypes: true });
  const jsonFiles = files.filter(
    (file) =>
      file.isFile() &&
      file.name.endsWith('.json') &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(file.name),
  );
  const pairs = await Promise.all(
    jsonFiles.map(async (file) => {
      const code = file.name.slice(0, -'.json'.length);
      const json = await readFile(path.join(FORM_DATA_DIRECTORY, file.name), 'utf8');
      return [code, JSON.parse(json) as unknown] as const;
    }),
  );
  return Object.fromEntries(pairs);
}
