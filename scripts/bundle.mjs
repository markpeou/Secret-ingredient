// Builds single-file versions of the app. No dependencies.
//   node scripts/bundle.mjs
// dist/secret-ingredient.html  – one self-contained file you can open or host anywhere
// dist/artifact.html           – the same, without <html>/<head>/<body> wrappers (for claude.ai artifacts)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
let html = read('index.html');

html = html.replace(/<link rel="stylesheet" href="css\/styles.css">/, () => `<style>\n${read('css/styles.css')}\n</style>`);
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, src) => `<script>\n${read(src).replace(/<\/script/g, '<\\/script')}\n</script>`);

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/secret-ingredient.html'), html);

const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/<meta charset[^>]*>\s*/, '')
  .replace(/<meta name="viewport"[^>]*>\s*/, '');
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
writeFileSync(join(root, 'dist/artifact.html'), head.trim() + '\n' + body.trim() + '\n');
console.log('Built dist/secret-ingredient.html and dist/artifact.html');
