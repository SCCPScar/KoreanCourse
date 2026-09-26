import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getThemeMode } from '../../public/js/core/theme.js';
import { STORAGE_PREFIX } from '../../public/js/core/storage.js';
import { createFakeStorage } from '../helpers/fakeStorage.js';

describe('getThemeMode', () => {
  let storage;

  beforeEach(() => {
    storage = createFakeStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('usa "automático" quando nada foi escolhido', () => {
    expect(getThemeMode()).toBe('system');
  });

  it('lê o modo salvo', () => {
    storage.setItem(`${STORAGE_PREFIX}theme`, '"dark"');
    expect(getThemeMode()).toBe('dark');
  });

  it('ignora valores inválidos', () => {
    storage.setItem(`${STORAGE_PREFIX}theme`, '"roxo"');
    expect(getThemeMode()).toBe('system');
  });
});
