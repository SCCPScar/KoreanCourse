/**
 * Estado dos flashcards (um registro SM-2 por cartão, ver lib/srs.js).
 * Formato salvo: { idDoCartão: estado }.
 * Cada mudança dispara 'haru:cardschange' (detail = id do cartão, ou null se trocou tudo).
 */
import { readJSON, writeJSON } from './storage.js';

const CARDS_KEY = 'cards';
const CHANGE_EVENT = 'haru:cardschange';

export function getCardStates() {
  const states = readJSON(CARDS_KEY, {});
  return states && typeof states === 'object' && !Array.isArray(states) ? states : {};
}

export function saveCardState(id, state) {
  const states = getCardStates();
  states[id] = state;
  writeJSON(CARDS_KEY, states);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: id }));
}

/** Troca todos os estados (usado ao baixar os dados da conta). */
export function replaceCardStates(states) {
  writeJSON(CARDS_KEY, states);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

export function onCardsChange(callback) {
  document.addEventListener(CHANGE_EVENT, callback);
}
