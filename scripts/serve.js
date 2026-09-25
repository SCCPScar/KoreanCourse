/**
 * Servidor estático mínimo para desenvolvimento local da pasta public/.
 * Em produção, quem serve estes arquivos é o GitHub Pages.
 *
 * Uso: npm run dev  →  http://localhost:5173
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 5173;
const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

/** Converte o URL pedido num caminho dentro de public/ (ou null se tentar sair da pasta). */
function resolveFile(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const filePath = path.join(publicDir, relative);
  return filePath.startsWith(publicDir + path.sep) ? filePath : null;
}

const server = createServer(async (req, res) => {
  const filePath = resolveFile(req.url);
  if (!filePath) {
    res.writeHead(403).end('Proibido');
    return;
  }
  try {
    const body = await readFile(filePath);
    const type = MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
