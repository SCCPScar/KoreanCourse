/**
 * Copia bibliotecas de terceiros do node_modules para public/vendor.
 *
 * Por quê: o site não tem etapa de build e a CSP só aceita scripts do próprio
 * site ('self'). Então servimos a versão "UMD" (um arquivo só, pronto para o
 * navegador) a partir da nossa pasta, junto com a licença.
 *
 * Uso: npm run vendor (rodar de novo ao atualizar a biblioteca).
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendorDir = path.join(root, 'public', 'vendor');

const files = [
  ['node_modules/@supabase/supabase-js/dist/umd/supabase.js', 'supabase.js'],
  ['node_modules/@supabase/supabase-js/LICENSE', 'LICENSE-supabase-js.txt'],
];

await mkdir(vendorDir, { recursive: true });
for (const [from, to] of files) {
  await copyFile(path.join(root, from), path.join(vendorDir, to));
}
console.log('Bibliotecas copiadas para public/vendor.');
