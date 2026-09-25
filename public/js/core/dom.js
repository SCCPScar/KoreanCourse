/**
 * Utilitários de DOM.
 *
 * Regra de segurança do projeto: texto vindo do usuário ou da IA nunca é
 * inserido com innerHTML sem passar por esc(). Sempre que possível, usamos
 * el(), que cria elementos com textContent (seguro por definição).
 */

const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapa caracteres especiais de HTML. `<script>` passa a ser texto inofensivo. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

/**
 * Cria um elemento.
 * @param {string} tag - ex.: 'button'
 * @param {object} [options]
 * @param {string} [options.className]
 * @param {string} [options.text] - conteúdo em texto simples (textContent)
 * @param {string} [options.lang] - ex.: 'ko' para texto coreano
 * @param {object} [options.attrs] - atributos extra (aria-*, type, …)
 * @param {object} [options.data] - atributos data-*
 * @param {Array<Node|string>} [children]
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  if (options.lang) node.lang = options.lang;
  Object.entries(options.attrs ?? {}).forEach(([name, value]) => node.setAttribute(name, value));
  Object.assign(node.dataset, options.data ?? {});
  node.append(...children);
  return node;
}

/**
 * Busca um elemento pelo id e falha com uma mensagem clara se ele não existir.
 * Assim, um id errado é detectado logo na inicialização em vez de causar erros escondidos.
 */
export function byId(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Elemento #${id} não existe no HTML.`);
  return node;
}
