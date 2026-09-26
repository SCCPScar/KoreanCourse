/**
 * Ponto de entrada ÚNICO da aplicação.
 * Cada funcionalidade exporta uma função init*() que é chamada aqui, por ordem.
 */
import { initActions } from './core/actions.js';
import { byId } from './core/dom.js';
import { initNavMenu } from './core/nav-menu.js';
import { createPageTransition } from './core/page-transition.js';
import { initRouter } from './core/router.js';
import { initTabs } from './core/tabs.js';
import { initTheme } from './core/theme.js';
import { initAudio } from './features/audio.js';
import { initGrammar } from './features/grammar.js';
import { initHangulTables } from './features/hangul-tables.js';
import { initHangulTrainer } from './features/hangul-trainer.js';
import { initHome } from './features/home.js';
import { initLessonPlayer } from './features/lesson-player.js';
import { initMetroMap } from './features/metro-map.js';
import { initOnboarding } from './features/onboarding.js';
import { initPassport } from './features/passport.js';
import { initStrokeOrder } from './features/stroke-order.js';
import { initVocabulary } from './features/vocabulary.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme(byId('theme-toggle'));
  initActions();
  initNavMenu({ nav: byId('navbar'), toggle: byId('nav-toggle'), menu: byId('nav-menu') });
  initAudio(byId('voice-warning'), byId('voice-warning-text'));
  initTabs(byId('hangul-tabs'));
  initTabs(byId('route-tabs'));
  initLessonPlayer();
  initMetroMap();
  initPassport();
  initHangulTables();
  initHangulTrainer();
  initStrokeOrder();
  initVocabulary();
  initGrammar();
  const renderHome = initHome();
  initRouter({
    fallback: 'inicio',
    transition: createPageTransition({
      curtain: byId('curtain'),
      path: byId('curtain-path'),
      logo: byId('curtain-logo'),
      nav: byId('navbar'),
    }),
    onChange: (route) => {
      if (route === 'inicio') renderHome();
    },
  });
  initOnboarding();
});
