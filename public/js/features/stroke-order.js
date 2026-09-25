/**
 * Animação da ordem dos traços das letras básicas, em SVG.
 *
 * Técnica: cada traço tem pathLength="1" e um tracejado do mesmo tamanho;
 * a animação CSS move o tracejado de 1 para 0, o que "desenha" o traço.
 * O atraso de cada traço vem da classe .stroke-draw--N (definida no CSS).
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';
import { STROKES } from '../data/strokes.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgElement(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([name, value]) => node.setAttribute(name, value));
  return node;
}

/** Cria o SVG: primeiro a letra em cinzento (guia) e depois os traços animados. */
function buildSvg(jamo) {
  const svg = svgElement('svg', {
    viewBox: '0 0 100 100',
    class: 'stroke-svg',
    role: 'img',
    'aria-label': `Ordem dos traços de ${jamo}`,
  });
  const strokes = STROKES[jamo];
  strokes.forEach((d) => svg.append(svgElement('path', { d, class: 'stroke-ghost' })));
  strokes.forEach((d, index) =>
    svg.append(
      svgElement('path', { d, pathLength: '1', class: `stroke-draw stroke-draw--${index}` }),
    ),
  );
  return svg;
}

export function initStrokeOrder() {
  const picker = byId('stroke-picker');
  const canvas = byId('stroke-canvas');
  const caption = byId('stroke-caption');
  let current = 'ㄱ';

  function show(jamo) {
    current = jamo;
    canvas.replaceChildren(buildSvg(jamo));
    const count = STROKES[jamo].length;
    caption.textContent = `${jamo}: ${count} ${count === 1 ? 'traço' : 'traços'}`;
    picker.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.jamo === jamo));
    });
  }

  const buttons = Object.keys(STROKES).map((jamo) =>
    el('button', {
      className: 'chip chip--ko',
      text: jamo,
      lang: 'ko',
      attrs: { type: 'button', 'aria-pressed': 'false' },
      data: { action: 'show-strokes', jamo },
    }),
  );
  picker.replaceChildren(...buttons);

  registerAction('show-strokes', (button) => show(button.dataset.jamo));
  // Recriar o SVG reinicia a animação.
  registerAction('replay-strokes', () => show(current));
  show(current);
}
