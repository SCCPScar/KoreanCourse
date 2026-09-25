/**
 * Gramática: lista de pontos em acordeão (<details>), ordenados por nível.
 */
import { byId, el } from '../core/dom.js';
import { GRAMMAR } from '../data/grammar.js';
import { LEVELS, findLevel } from '../data/levels.js';
import { audioButton } from './audio.js';

const levelIndex = (id) => LEVELS.findIndex((level) => level.id === id);

function grammarTable({ head, rows }) {
  return el('div', { className: 'table-wrap' }, [
    el('table', { className: 'data-table' }, [
      el('thead', {}, [
        el(
          'tr',
          {},
          head.map((text) => el('th', { text, attrs: { scope: 'col' } })),
        ),
      ]),
      el(
        'tbody',
        {},
        rows.map((row) =>
          el(
            'tr',
            {},
            row.map((text) => el('td', { text, lang: 'ko' })),
          ),
        ),
      ),
    ]),
  ]);
}

function example({ ko, rom, pt }) {
  return el('li', { className: 'example' }, [
    el('div', { className: 'example__line' }, [
      el('span', { className: 'example__ko', text: ko, lang: 'ko' }),
      audioButton(ko),
    ]),
    el('span', { className: 'example__rom', text: rom }),
    el('span', { className: 'example__pt', text: pt }),
  ]);
}

function grammarPoint(point) {
  return el('details', { className: 'accordion' }, [
    el('summary', { className: 'accordion__summary' }, [
      el('span', { className: 'accordion__pattern', text: point.pattern, lang: 'ko' }),
      el('span', { className: 'accordion__title', text: point.title }),
      el('span', { className: 'badge', text: findLevel(point.level).name }),
    ]),
    el('div', { className: 'accordion__body' }, [
      ...point.explanation.map((text) => el('p', { text })),
      point.table ? grammarTable(point.table) : '',
      el('h3', { className: 'accordion__subtitle', text: 'Exemplos' }),
      el('ul', { className: 'example-list' }, point.examples.map(example)),
    ]),
  ]);
}

export function initGrammar() {
  const sorted = [...GRAMMAR].sort((a, b) => levelIndex(a.level) - levelIndex(b.level));
  byId('grammar-list').replaceChildren(...sorted.map(grammarPoint));
}
