/**
 * Nível do aluno: salvar, ler, avisar quando muda e filtrar conteúdos.
 *
 * Os outros módulos não precisam de saber onde o nível está salvo:
 * usam getLevel() e onLevelChange().
 */
import { LEVELS, findLevel } from '../data/levels.js';
import { readJSON, removeKey, writeJSON } from './storage.js';

const LEVEL_KEY = 'level';
const CHANGE_EVENT = 'haru:levelchange';

/** Nível atual (id), ou null se o aluno ainda não escolheu. */
export function getLevel() {
  const id = readJSON(LEVEL_KEY);
  return findLevel(id) ? id : null;
}

/** Salva o nível e avisa quem estiver escutando. */
export function setLevel(id) {
  if (!findLevel(id)) return;
  writeJSON(LEVEL_KEY, id);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: id }));
}

/** Esquece o nível (ex.: ao sair da conta) e avisa quem estiver escutando. */
export function clearLevel() {
  removeKey(LEVEL_KEY);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

export function onLevelChange(callback) {
  document.addEventListener(CHANGE_EVENT, callback);
}

/**
 * true se um conteúdo do nível `itemLevel` é adequado para quem está em `userLevel`
 * (ou seja, é do mesmo nível ou de um nível abaixo). Sem nível escolhido, mostra tudo.
 */
export function isWithinLevel(itemLevel, userLevel) {
  if (!userLevel) return true;
  const order = LEVELS.map((level) => level.id);
  return order.indexOf(itemLevel) <= order.indexOf(userLevel);
}
