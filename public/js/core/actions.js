/**
 * Delegação de eventos com data-action.
 *
 * Em vez de onclick="" no HTML (proibido pelas regras do projeto e pela CSP),
 * os botões têm data-action="nome" e registamos aqui o que cada ação faz.
 * Um único listener no documento trata todos os cliques — incluindo botões
 * criados mais tarde pelo JavaScript.
 */
const handlers = new Map();

/** Associa uma função a uma ação. O handler recebe (elemento, evento). */
export function registerAction(name, handler) {
  if (handlers.has(name)) throw new Error(`A ação "${name}" já está registada.`);
  handlers.set(name, handler);
}

/** Liga o listener global de cliques. Chamar uma só vez, em main.js. */
export function initActions() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const handler = handlers.get(target.dataset.action);
    handler?.(target, event);
  });
}
