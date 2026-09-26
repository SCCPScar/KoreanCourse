/**
 * Transição entre seções com uma "cortina" de linha SVG.
 *
 * SAÍDA  (leave): o traço ondulado é desenhado de cima a baixo, engrossa até
 *                 cobrir a tela e o logo do Haru aparece girando no centro.
 * ENTRADA (enter): o traço "se apaga" do começo para o fim, o logo some,
 *                 a barra de navegação desce e o título entra palavra por palavra.
 *
 * Usa a Web Animations API (elemento.animate), que já vem no navegador:
 * nada de bibliotecas, e funciona com a CSP do site (só scripts próprios).
 *
 * Truque do "desenhar": o path tem pathLength="1", então o traço inteiro mede 1.
 * Com stroke-dasharray "1 1" (traço de 1, espaço de 1), mudar o stroke-dashoffset
 * mostra só um pedaço: de 1 → 0 desenha; de 0 → -1 apaga a partir do início.
 */
import { el } from './dom.js';
import { buildEasings } from '../lib/easing.js';

const DRAW_MS = 1250;
const LOGO_IN = { duration: 650, delay: 500 };
const LOGO_OUT_MS = 450;
const WORD_STAGGER_MS = 50;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Divide o texto do título em <span class="word">, mantendo os <span lang="ko">. */
function wrapWords(node) {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWords(child);
      return;
    }
    if (child.nodeType !== Node.TEXT_NODE) return;
    const fragment = document.createDocumentFragment();
    child.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      fragment.append(/^\s+$/.test(part) ? part : el('span', { className: 'word', text: part }));
    });
    child.replaceWith(fragment);
  });
}

export function splitWords(title) {
  if (!title.dataset.wordsSplit) {
    wrapWords(title);
    title.dataset.wordsSplit = 'true';
  }
  return [...title.querySelectorAll('.word')];
}

/**
 * @param {object} parts
 * @param {HTMLElement} parts.curtain - o overlay que cobre a tela
 * @param {SVGPathElement} parts.path - o traço ondulado
 * @param {HTMLElement} parts.logo - o logo do centro
 * @param {HTMLElement} parts.nav - a barra de navegação
 */
export function createPageTransition({ curtain, path, logo, nav }) {
  const easings = buildEasings(CSS.supports('animation-timing-function', 'linear(0, 1)'));
  let running = [];

  const finishAll = () => Promise.all(running.map((animation) => animation.finished));
  const cancelAll = () => {
    running.forEach((animation) => animation.cancel());
    running = [];
  };

  function show() {
    curtain.hidden = false;
    curtain.classList.add('is-animating'); // bloqueia cliques só durante a animação
  }

  function hide() {
    curtain.classList.remove('is-animating');
    curtain.hidden = true;
    cancelAll();
  }

  async function leave() {
    if (prefersReducedMotion()) return;
    cancelAll();
    show();
    running = [
      path.animate(
        [
          { strokeDashoffset: 1, strokeWidth: '8%', easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
          {
            strokeDashoffset: 0,
            strokeWidth: '8%',
            offset: 0.62,
            easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
          },
          { strokeDashoffset: 0, strokeWidth: '70%' },
        ],
        { duration: DRAW_MS, fill: 'forwards' },
      ),
      logo.animate(
        [
          { transform: 'scale(0) rotate(-64deg)', opacity: 1 },
          { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        ],
        { ...LOGO_IN, easing: easings.elasticOut, fill: 'both' },
      ),
    ];
    await finishAll();
  }

  async function enter(view) {
    if (prefersReducedMotion()) return;
    cancelAll();
    show();
    const title = view?.querySelector('.view__title');
    const words = title ? splitWords(title) : [];

    running = [
      path.animate(
        [
          { strokeDashoffset: 0, strokeWidth: '70%' },
          { strokeDashoffset: -1, strokeWidth: '70%' },
        ],
        { duration: DRAW_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
      ),
      logo.animate(
        [
          { transform: 'scale(1) rotate(0deg)', opacity: 1 },
          { transform: 'scale(0) rotate(64deg)', opacity: 1 },
        ],
        { duration: LOGO_OUT_MS, easing: easings.elasticIn, fill: 'forwards' },
      ),
      nav.animate(
        [{ transform: 'translateY(calc(-100% - 24px))' }, { transform: 'translateY(0)' }],
        { duration: 700, delay: 350, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'backwards' },
      ),
      ...words.map((word, index) =>
        word.animate(
          [
            { transform: 'translateY(0.6em)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 },
          ],
          {
            duration: 800,
            delay: 450 + index * WORD_STAGGER_MS,
            easing: easings.softElastic,
            fill: 'backwards',
          },
        ),
      ),
    ];
    await finishAll();
    hide();
  }

  return { leave, enter };
}
