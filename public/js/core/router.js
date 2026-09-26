/**
 * Navegação entre seções com o hash do URL (#inicio, #hangul, …).
 *
 * Por que o hash: funciona no GitHub Pages sem configuração de servidor,
 * e os botões "voltar/avançar" do navegador funcionam naturalmente.
 *
 * Cada seção é um <section class="view" id="view-NOME" data-title="Nome"> e cada
 * link do menu é um <a class="site-nav__link" href="#NOME">.
 *
 * Com uma `transition` (ver core/page-transition.js), um clique num link interno
 * faz: animação de saída → troca de seção → animação de entrada.
 */

const APP_NAME = 'Haru';

/** Escolhe a rota a mostrar: a do hash se existir, senão a rota padrão. */
export function resolveRoute(hash, routes, fallback) {
  const route = hash.replace(/^#/, '');
  return routes.includes(route) ? route : fallback;
}

/** true se o hash aponta para um elemento da página que não é uma rota. */
export function isInPageAnchor(hash, routes, doc = document) {
  const id = hash.replace(/^#/, '');
  return id !== '' && !routes.includes(id) && doc.getElementById(id) !== null;
}

/**
 * Rota para onde um clique num link deve ir COM transição, ou null se o clique
 * deve seguir o comportamento normal do navegador. Ficam de fora:
 *  - links externos e âncoras que não são seções (ex.: #conteudo);
 *  - links com target="_blank" ou download;
 *  - cliques com Ctrl/⌘/Shift/Alt ou com o botão do meio (abrir em outra aba);
 *  - um link para a seção que já está aberta.
 */
export function routeForClick({ href, target, download, button, modified }, routes, current) {
  if (button !== 0 || modified || target === '_blank' || download) return null;
  if (!href?.startsWith('#')) return null;
  const route = href.slice(1);
  if (!routes.includes(route) || route === current) return null;
  return route;
}

/**
 * @param {object} options
 * @param {string} options.fallback - rota padrão (ex.: 'inicio')
 * @param {(route: string) => void} [options.onChange] - chamado sempre que uma seção abre
 * @param {{ leave: () => Promise<void>, enter: (view: HTMLElement) => Promise<void> }} [options.transition]
 */
export function initRouter({ fallback, onChange, transition }) {
  const views = [...document.querySelectorAll('.view')];
  const links = [...document.querySelectorAll('.site-nav__link')];
  const routes = views.map((view) => view.id.replace(/^view-/, ''));
  let current = null;
  let busy = false;

  function show(moveFocus) {
    const route = resolveRoute(window.location.hash, routes, fallback);
    current = route;

    views.forEach((view) => {
      view.hidden = view.id !== `view-${route}`;
      if (!view.hidden) document.title = `${view.dataset.title} · ${APP_NAME}`;
    });
    // O link da seção atual ganha aria-current="page" (leitores de tela anunciam "página atual").
    links.forEach((link) => {
      if (link.hash === `#${route}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Volta ao topo e leva o foco para o título: quem usa leitor de tela percebe a mudança.
    if (moveFocus) {
      window.scrollTo(0, 0);
      document.querySelector(`#view-${route} .view__title`)?.focus({ preventScroll: true });
    }
    // Reinicia o que depende da seção (ex.: o Início redesenha o progresso).
    onChange?.(route);
    return document.getElementById(`view-${route}`);
  }

  async function navigate(route) {
    if (busy) return;
    busy = true;
    try {
      await transition.leave();
      // pushState muda o endereço SEM disparar "hashchange" (senão a seção trocaria duas vezes).
      history.pushState(null, '', `#${route}`);
      await transition.enter(show(true));
    } finally {
      busy = false;
    }
  }

  if (transition) {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const route = routeForClick(
        {
          href: link.getAttribute('href'),
          target: link.target,
          download: link.hasAttribute('download'),
          button: event.button,
          modified: event.metaKey || event.ctrlKey || event.shiftKey || event.altKey,
        },
        routes,
        current,
      );
      if (!route) return;
      event.preventDefault();
      navigate(route);
    });
  }

  // Voltar/avançar do navegador (e links sem transição) chegam aqui, sem animação.
  // Âncoras internas (ex.: "Pular para o conteúdo" → #conteudo) não são rotas:
  // nesse caso deixamos o navegador fazer a rolagem e não mudamos de seção.
  window.addEventListener('hashchange', () => {
    if (isInPageAnchor(window.location.hash, routes)) return;
    show(true);
  });
  show(false);
}
