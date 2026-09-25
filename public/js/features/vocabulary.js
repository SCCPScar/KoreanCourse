/**
 * Vocabulário por categorias, com áudio e "marcar como aprendida".
 * As palavras aprendidas ficam guardadas no localStorage (usadas também no Progresso).
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';
import { readJSON, writeJSON } from '../core/storage.js';
import { findLevel } from '../data/levels.js';
import { CATEGORIES, WORDS } from '../data/vocabulary.js';
import { audioButton } from './audio.js';

const STORAGE_KEY = 'learned-words';

/** Conjunto de ids das palavras aprendidas. */
export function getLearnedIds() {
  const ids = readJSON(STORAGE_KEY, []);
  return new Set(Array.isArray(ids) ? ids : []);
}

/** Marca/desmarca uma palavra e devolve o novo estado (true = aprendida). */
function toggleLearned(id) {
  const learned = getLearnedIds();
  const isLearned = !learned.has(id);
  if (isLearned) learned.add(id);
  else learned.delete(id);
  writeJSON(STORAGE_KEY, [...learned]);
  return isLearned;
}

function learnedButton(word, isLearned) {
  return el('button', {
    className: 'btn btn--small btn--toggle',
    text: isLearned ? '✓ Aprendida' : 'Marcar como aprendida',
    attrs: {
      type: 'button',
      'aria-pressed': String(isLearned),
      'aria-label': `${word.ko} (${word.pt}): aprendida`,
    },
    data: { action: 'toggle-learned', wordId: word.id },
  });
}

function wordCard(word, isLearned) {
  return el('li', { className: 'word-card' }, [
    el('div', { className: 'word-card__head' }, [
      el('span', { className: 'word-card__ko', text: word.ko, lang: 'ko' }),
      audioButton(word.ko),
    ]),
    el('span', { className: 'word-card__rom', text: word.rom }),
    el('span', { className: 'word-card__pt', text: word.pt }),
    el('div', { className: 'word-card__foot' }, [
      el('span', { className: 'badge', text: findLevel(word.level).name }),
      learnedButton(word, isLearned),
    ]),
  ]);
}

export function initVocabulary() {
  const tabs = byId('vocab-categories');
  const description = byId('vocab-description');
  const hideLearned = byId('vocab-hide-learned');
  const counter = byId('vocab-counter');
  const list = byId('vocab-list');
  let category = CATEGORIES[0].id;

  const categoryWords = () => WORDS.filter((word) => word.category === category);

  function updateCounter(learned) {
    const words = categoryWords();
    const learnedCount = words.filter((word) => learned.has(word.id)).length;
    counter.textContent = `${learnedCount} de ${words.length} palavras aprendidas nesta categoria.`;
  }

  function render() {
    const learned = getLearnedIds();
    const words = categoryWords();
    const visible = hideLearned.checked ? words.filter((word) => !learned.has(word.id)) : words;

    description.textContent = CATEGORIES.find((item) => item.id === category).description;
    updateCounter(learned);
    list.replaceChildren(...visible.map((word) => wordCard(word, learned.has(word.id))));
    tabs.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.category === category));
    });
  }

  tabs.replaceChildren(
    ...CATEGORIES.map((item) =>
      el('button', {
        className: 'chip',
        text: item.name,
        attrs: { type: 'button', 'aria-pressed': 'false' },
        data: { action: 'vocab-category', category: item.id },
      }),
    ),
  );

  registerAction('vocab-category', (button) => {
    category = button.dataset.category;
    render();
  });
  registerAction('toggle-learned', (button) => {
    const word = WORDS.find((item) => item.id === button.dataset.wordId);
    const isLearned = toggleLearned(word.id);
    if (hideLearned.checked) {
      render();
      return;
    }
    // Troca só este botão, para quem usa o teclado não perder o foco.
    const updated = learnedButton(word, isLearned);
    button.replaceWith(updated);
    updated.focus();
    updateCounter(getLearnedIds());
  });
  hideLearned.addEventListener('change', render);

  render();
}
