import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('import-in-the-middle/hook.mjs', import.meta.url);
