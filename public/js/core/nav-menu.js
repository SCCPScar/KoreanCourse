/**
 * Menu "hambúrguer" da barra de navegação no celular.
 *
 * Acessibilidade:
 *  - o botão tem aria-expanded (true/false) e aria-controls apontando para a lista;
 *  - ao abrir, o foco vai para o primeiro link; Tab navega normalmente pelos links;
 *  - Esc fecha o menu e devolve o foco ao botão;
 *  - clicar num link, fora do menu ou aumentar a tela para desktop também fecha.
 */
const DESKTOP_QUERY = '(min-width: 768px)';

export function initNavMenu({ nav, toggle, menu }) {
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function setOpen(open, { focusToggle = false } = {}) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) menu.querySelector('a')?.focus();
    else if (focusToggle) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false, { focusToggle: true });
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !nav.contains(event.target)) setOpen(false);
  });

  window.matchMedia(DESKTOP_QUERY).addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}
