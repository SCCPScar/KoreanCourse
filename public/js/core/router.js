/**
 * Navegação entre seções com o hash do URL (#inicio, #hangul, …).
 *
 * Por que o hash: funciona no GitHub Pages sem configuração de servidor,
 * e os botões "voltar/avançar" do navegador funcionam naturalmente.
 *
 * Cada seção é um <section class="view" id="view-NOME" data-title="Nome"> e cada
 * link do menu é um <a class="site-nav__link" href="#NOME">.
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
 * @param {object} options
 * @param {string} options.fallback - rota padrão (ex.: 'inicio')
 * @param {(route: string) => void} [options.onChange] - chamado sempre que uma seção abre
 */
export function initRouter({ fallback, onChange }) {
  const views = [...document.querySelectorAll('.view')];
  const links = [...document.querySelectorAll('.site-nav__link')];
  const routes = views.map((view) => view.id.replace(/^view-/, ''));

  function show(moveFocus) {
    const route = resolveRoute(window.location.hash, routes, fallback);

    views.forEach((view) => {
      view.hidden = view.id !== `view-${route}`;
      if (!view.hidden) document.title = `${view.dataset.title} · ${APP_NAME}`;
    });
    links.forEach((link) => {
      if (link.hash === `#${route}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Leva o foco para o título da seção: quem usa leitor de tela percebe que a página mudou.
    if (moveFocus) {
      document.querySelector(`#view-${route} .view__title`)?.focus();
      window.scrollTo(0, 0);
    }
    onChange?.(route);
  }

  // Âncoras internas (ex.: o link "Pular para o conteúdo" → #conteudo) não são rotas:
  // nesse caso deixamos o navegador fazer a rolagem e não mudamos de seção.
  window.addEventListener('hashchange', () => {
    if (isInPageAnchor(window.location.hash, routes)) return;
    show(true);
  });
  show(false);
}
