/**
 * Navegação entre secções com o hash do URL (#inicio, #hangul, …).
 *
 * Porquê o hash: funciona no GitHub Pages sem configuração de servidor,
 * e os botões "voltar/avançar" do browser funcionam naturalmente.
 *
 * Cada secção é um <section class="view" id="view-NOME"> e cada link do menu
 * é um <a class="site-nav__link" href="#NOME">.
 */

/** Escolhe a rota a mostrar: a do hash se existir, senão a rota por omissão. */
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
 * @param {string} options.fallback - rota por omissão (ex.: 'inicio')
 */
export function initRouter({ fallback }) {
  const views = [...document.querySelectorAll('.view')];
  const links = [...document.querySelectorAll('.site-nav__link')];
  const routes = views.map((view) => view.id.replace(/^view-/, ''));

  function show(moveFocus) {
    const route = resolveRoute(window.location.hash, routes, fallback);

    views.forEach((view) => {
      view.hidden = view.id !== `view-${route}`;
    });
    links.forEach((link) => {
      if (link.hash === `#${route}`) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Leva o foco para o título da secção: quem usa leitor de ecrã percebe que a página mudou.
    if (moveFocus) {
      document.querySelector(`#view-${route} .view__title`)?.focus();
      window.scrollTo(0, 0);
    }
  }

  // Âncoras internas (ex.: o link "Pular para o conteúdo" → #conteudo) não são rotas:
  // nesse caso deixamos o browser fazer o scroll e não mudamos de secção.
  window.addEventListener('hashchange', () => {
    if (isInPageAnchor(window.location.hash, routes)) return;
    show(true);
  });
  show(false);
}
