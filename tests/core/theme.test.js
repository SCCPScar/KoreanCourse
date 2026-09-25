import { describe, expect, it } from 'vitest';
import { THEME_MODES, nextThemeMode } from '../../public/js/core/theme.js';

describe('nextThemeMode', () => {
  it('percorre automático → claro → escuro → automático', () => {
    expect(nextThemeMode('system')).toBe('light');
    expect(nextThemeMode('light')).toBe('dark');
    expect(nextThemeMode('dark')).toBe('system');
  });

  it('um modo desconhecido volta ao início do ciclo', () => {
    expect(nextThemeMode('roxo')).toBe(THEME_MODES[0]);
  });
});
