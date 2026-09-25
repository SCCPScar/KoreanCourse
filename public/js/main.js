/**
 * Ponto de arranque ÚNICO da aplicação.
 * Cada funcionalidade exporta uma função init*() que é chamada aqui, por ordem.
 */
import { initActions } from './core/actions.js';
import { byId } from './core/dom.js';
import { initRouter } from './core/router.js';
import { initTheme } from './core/theme.js';
import { initOnboarding } from './features/onboarding.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme(byId('theme-toggle'));
  initActions();
  initRouter({ fallback: 'inicio' });
  initOnboarding();
});
