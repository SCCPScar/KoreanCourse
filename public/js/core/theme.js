/**
 * Modo claro/escuro.
 *
 * Três modos: 'system' (segue prefers-color-scheme), 'light' e 'dark'.
 * O CSS trata das cores; aqui só se define o atributo data-theme no <html>.
 */
import { readJSON, writeJSON } from './storage.js';

const STORAGE_KEY = 'theme';
export const THEME_MODES = ['system', 'light', 'dark'];

const THEME_LABELS = {
  system: { icon: '🖥️', name: 'automático' },
  light: { icon: '☀️', name: 'claro' },
  dark: { icon: '🌙', name: 'escuro' },
};

/** Devolve o modo seguinte no ciclo automático → claro → escuro → automático. */
export function nextThemeMode(mode) {
  const index = THEME_MODES.indexOf(mode);
  return THEME_MODES[(index + 1) % THEME_MODES.length];
}

function getStoredMode() {
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

function updateButton(button, mode) {
  const current = THEME_LABELS[mode];
  const next = THEME_LABELS[nextThemeMode(mode)];
  button.textContent = current.icon;
  button.setAttribute('aria-label', `Tema ${current.name}. Mudar para ${next.name}`);
  button.title = `Tema: ${current.name}`;
}

/** Aplica o tema guardado e liga o botão de alternância. */
export function initTheme(button) {
  let mode = getStoredMode();
  applyTheme(mode);
  updateButton(button, mode);

  button.addEventListener('click', () => {
    mode = nextThemeMode(mode);
    applyTheme(mode);
    updateButton(button, mode);
    writeJSON(STORAGE_KEY, mode);
  });
}
