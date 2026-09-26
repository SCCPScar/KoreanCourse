/**
 * Palavras marcadas como aprendidas (usadas no Vocabulário, no Início e na
 * sincronização com a conta). Cada mudança dispara um evento, para quem
 * precisar reagir (ex.: enviar a mudança para a nuvem).
 */
import { readJSON, writeJSON } from './storage.js';

const LEARNED_WORDS_KEY = 'learned-words';
const CHANGE_EVENT = 'haru:wordschange';

/** Conjunto de ids das palavras aprendidas. */
export function getLearnedIds() {
  const ids = readJSON(LEARNED_WORDS_KEY, []);
  return new Set(Array.isArray(ids) ? ids : []);
}

/** Marca/desmarca uma palavra e retorna o novo estado (true = aprendida). */
export function toggleLearned(id) {
  const learned = getLearnedIds();
  const isLearned = !learned.has(id);
  if (isLearned) learned.add(id);
  else learned.delete(id);
  writeJSON(LEARNED_WORDS_KEY, [...learned]);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { id, learned: isLearned } }));
  return isLearned;
}

/** Troca a lista inteira (usado ao baixar os dados da conta). */
export function replaceLearnedIds(ids) {
  writeJSON(LEARNED_WORDS_KEY, [...ids]);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

export function onLearnedWordsChange(callback) {
  document.addEventListener(CHANGE_EVENT, callback);
}
