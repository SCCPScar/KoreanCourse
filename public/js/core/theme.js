/**
 * Modo claro/escuro.
 *
 * Três modos: 'system' (segue prefers-color-scheme), 'light' e 'dark'.
 * O CSS trata das cores; aqui só definimos o atributo data-theme no <html>.
 * A escolha é feita com três botões de opção (radio) nas configurações.
 */
import { readJSON, writeJSON } from './storage.js';

const STORAGE_KEY = 'theme';
export const THEME_MODES = ['system', 'light', 'dark'];

/** Modo salvo (ou 'system' se não houver um válido). */
export function getThemeMode() {
  const mode = readJSON(STORAGE_KEY, 'system');
  return THEME_MODES.includes(mode) ? mode : 'system';
}

function applyTheme(mode) {
  if (mode === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.dataset.theme = mode;
  }
}

/** Aplica o tema salvo e liga o grupo de opções (inputs radio com name="theme"). */
export function initTheme(fieldset) {
  const mode = getThemeMode();
  applyTheme(mode);
  const current = fieldset.querySelector(`input[value="${mode}"]`);
  if (current) current.checked = true;

  fieldset.addEventListener('change', (event) => {
    const chosen = event.target.value;
    if (!THEME_MODES.includes(chosen)) return;
    applyTheme(chosen);
    writeJSON(STORAGE_KEY, chosen);
  });
}
