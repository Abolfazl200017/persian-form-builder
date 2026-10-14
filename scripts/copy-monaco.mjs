import { cp, mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const packageRoot = dirname(require.resolve('monaco-editor/package.json'));
const { version } = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const destination = join(projectRoot, 'public/vendor/monaco', version);
await mkdir(destination, { recursive: true });
// Keep the complete tree: editor code, CSS, fonts, language modules, and workers.
await cp(join(packageRoot, 'min/vs'), join(destination, 'vs'), { recursive: true });
await cp(join(packageRoot, 'LICENSE'), join(destination, 'LICENSE'));
console.log(`Monaco ${version} assets ready at /vendor/monaco/${version}/vs`);
