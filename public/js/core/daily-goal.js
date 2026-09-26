/**
 * Meta diária de estudo, em minutos (5, 10, 15 ou 30).
 * Escolhida nas configurações com botões de opção (radio), como o tema.
 */
import { readJSON, removeKey, writeJSON } from './storage.js';

const GOAL_KEY = 'daily-goal';
const CHANGE_EVENT = 'haru:goalchange';
export const GOAL_OPTIONS = [5, 10, 15, 30];
export const DEFAULT_GOAL = 10;

/** Meta escolhida, ou null se o aluno ainda não escolheu. */
export function getSavedGoal() {
  const goal = readJSON(GOAL_KEY, null);
  return GOAL_OPTIONS.includes(goal) ? goal : null;
}

/** Meta em uso (a escolhida ou a padrão). */
export const getDailyGoal = () => getSavedGoal() ?? DEFAULT_GOAL;

export function setDailyGoal(goal) {
  if (!GOAL_OPTIONS.includes(goal)) return;
  writeJSON(GOAL_KEY, goal);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: goal }));
}

export function clearDailyGoal() {
  removeKey(GOAL_KEY);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

export function onDailyGoalChange(callback) {
  document.addEventListener(CHANGE_EVENT, callback);
}

/** Liga o grupo de opções (inputs radio com name="daily-goal"). */
export function initDailyGoal(fieldset) {
  const sync = () => {
    const current = fieldset.querySelector(`input[value="${getDailyGoal()}"]`);
    if (current) current.checked = true;
  };
  sync();
  onDailyGoalChange(sync);
  fieldset.addEventListener('change', (event) => setDailyGoal(Number(event.target.value)));
}
