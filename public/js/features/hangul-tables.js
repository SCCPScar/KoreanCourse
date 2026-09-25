/**
 * Tabelas de consoantes e vogais (com áudio) e tabela de batchim.
 */
import { byId, el } from '../core/dom.js';
import { BATCHIM_SOUNDS, CONSONANTS, CONSONANT_TYPES, VOWELS } from '../data/hangul.js';
import { audioButton } from './audio.js';

const VOWEL_TYPES = {
  básica: 'Vogais básicas',
  composta: 'Vogais compostas',
};

/** Cartão clicável: ao clicar, ouve-se a sílaba de exemplo. */
function jamoCard(item) {
  return el(
    'button',
    {
      className: 'jamo-card',
      attrs: { type: 'button' },
      data: { action: 'speak', speak: item.sample },
    },
    [
      el('span', { className: 'visually-hidden', text: 'Ouvir:' }),
      el('span', { className: 'jamo-card__char', text: item.jamo, lang: 'ko' }),
      item.name ? el('span', { className: 'jamo-card__name', text: item.name, lang: 'ko' }) : '',
      el('span', { className: 'jamo-card__rom', text: item.rom }),
      el('span', { className: 'jamo-card__tip', text: item.tip }),
    ],
  );
}

/** Agrupa os itens por tipo e cria um título + grelha para cada grupo. */
function renderGroups(container, items, typeLabels) {
  const groups = Object.entries(typeLabels).map(([type, label]) =>
    el('div', { className: 'jamo-group' }, [
      el('h3', { text: label }),
      el(
        'div',
        { className: 'jamo-grid' },
        items.filter((item) => item.type === type).map(jamoCard),
      ),
    ]),
  );
  container.replaceChildren(...groups);
}

function renderBatchim(tbody) {
  const rows = BATCHIM_SOUNDS.map(({ sound, letters, example }) =>
    el('tr', {}, [
      el('th', { text: `[${sound}]`, attrs: { scope: 'row' } }),
      el('td', { text: letters.join(' '), lang: 'ko' }),
      el('td', {}, [
        el('span', { text: example.ko, lang: 'ko' }),
        ` (${example.rom}) = ${example.pt} `,
        audioButton(example.ko),
      ]),
    ]),
  );
  tbody.replaceChildren(...rows);
}

export function initHangulTables() {
  renderGroups(byId('consonant-groups'), CONSONANTS, CONSONANT_TYPES);
  renderGroups(byId('vowel-groups'), VOWELS, VOWEL_TYPES);
  renderBatchim(byId('batchim-rows'));
}
