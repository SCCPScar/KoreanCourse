/**
 * Recordes dos jogos (ex.: quantas palavras você leu em 60 segundos).
 * Ficam só neste navegador. Formato salvo: { idDoJogo: número }.
 */
import { readJSON, removeKey, writeJSON } from './storage.js';

const RECORDS_KEY = 'game-records';

export function getRecords() {
  const records = readJSON(RECORDS_KEY, {});
  return records && typeof records === 'object' && !Array.isArray(records) ? records : {};
}

export const getRecord = (game) => getRecords()[game] ?? 0;

/** Salva a pontuação se for um novo recorde. Retorna true se bateu o recorde. */
export function saveIfRecord(game, score) {
  const records = getRecords();
  if (score <= (records[game] ?? 0)) return false;
  records[game] = score;
  writeJSON(RECORDS_KEY, records);
  return true;
}

export const clearRecords = () => removeKey(RECORDS_KEY);
