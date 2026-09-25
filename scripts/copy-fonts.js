/**
 * Copia as fontes (Inter + Noto Sans KR) do node_modules para public/fonts
 * e gera public/css/fonts.css com os caminhos corretos.
 *
 * Porquê: alojar as fontes localmente evita pedidos a CDNs de terceiros
 * (ex.: Google Fonts), que transmitem o IP do visitante — relevante para o RGPD.
 *
 * Uso: npm run fonts (só é preciso correr quando se atualizam as fontes).
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = path.join(root, 'public', 'fonts');
const cssOut = path.join(root, 'public', 'css', 'fonts.css');

// Só os subconjuntos latinos das fontes latinas: o site está em português.
const latinOnly = (name) => /-latin(-ext)?-/.test(name);

const packages = [
  {
    // Títulos
    dir: 'node_modules/@fontsource-variable/bricolage-grotesque',
    css: 'wght.css',
    license: 'OFL-BricolageGrotesque.txt',
    keepBlock: latinOnly,
  },
  {
    // Texto
    dir: 'node_modules/@fontsource-variable/lexend',
    css: 'wght.css',
    license: 'OFL-Lexend.txt',
    keepBlock: latinOnly,
  },
  {
    // Coreano do dia a dia. Todos os blocos: o browser só descarrega os que usa.
    dir: 'node_modules/@fontsource-variable/noto-sans-kr',
    css: 'wght.css',
    license: 'OFL-NotoSansKR.txt',
    keepBlock: () => true,
  },
  {
    // Coreano "de destaque" (logótipo e palavras grandes)
    dir: 'node_modules/@fontsource/jua',
    css: '400.css',
    license: 'OFL-Jua.txt',
    keepBlock: () => true,
  },
];

/** Divide o CSS do fontsource em blocos { name, css } (um por @font-face). */
function splitBlocks(css) {
  return css
    .split(/\/\* (.+?) \*\/\n/)
    .slice(1)
    .reduce((blocks, part, index, parts) => {
      if (index % 2 === 0) blocks.push({ name: part, css: parts[index + 1].trim() });
      return blocks;
    }, []);
}

async function processPackage(pkg) {
  const pkgDir = path.join(root, pkg.dir);
  const css = await readFile(path.join(pkgDir, pkg.css), 'utf8');
  const blocks = splitBlocks(css).filter((block) => pkg.keepBlock(block.name));

  for (const block of blocks) {
    const file = block.css.match(/url\(\.\/files\/(.+?\.woff2)\)/)[1];
    await copyFile(path.join(pkgDir, 'files', file), path.join(fontsDir, file));
  }
  await copyFile(path.join(pkgDir, 'LICENSE'), path.join(fontsDir, pkg.license));

  // Mantém só o formato woff2 (suportado por todos os browsers atuais).
  return blocks
    .map((block) =>
      block.css
        .replace(/, url\(\.\/files\/[^)]+\.woff\) format\('woff'\)/, '')
        .replace('./files/', '../fonts/'),
    )
    .join('\n\n');
}

async function main() {
  await mkdir(fontsDir, { recursive: true });
  await mkdir(path.dirname(cssOut), { recursive: true });
  const parts = [];
  for (const pkg of packages) parts.push(await processPackage(pkg));

  const header = '/* Ficheiro gerado por scripts/copy-fonts.js — não editar à mão. */\n\n';
  await writeFile(cssOut, header + parts.join('\n\n') + '\n');
  console.log('Fontes copiadas para public/fonts e public/css/fonts.css gerado.');
}

main();
