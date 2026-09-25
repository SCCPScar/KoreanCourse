import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  STORAGE_PREFIX,
  clearAppData,
  readJSON,
  removeKey,
  writeJSON,
} from '../../public/js/core/storage.js';
import { createFakeStorage } from '../helpers/fakeStorage.js';

describe('storage', () => {
  let storage;

  beforeEach(() => {
    storage = createFakeStorage();
    vi.stubGlobal('localStorage', storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('salva e lê valores JSON com o prefixo da app', () => {
    writeJSON('level', 'basico');
    expect(storage.getItem(`${STORAGE_PREFIX}level`)).toBe('"basico"');
    expect(readJSON('level')).toBe('basico');
  });

  it('retorna o fallback quando a chave não existe', () => {
    expect(readJSON('nada', 42)).toBe(42);
  });

  it('retorna o fallback quando o JSON está corrompido', () => {
    storage.setItem(`${STORAGE_PREFIX}level`, '{isto não é json');
    expect(readJSON('level', 'zero')).toBe('zero');
  });

  it('não quebra quando o localStorage lança erros (ex.: modo privado)', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('cheio');
      },
    });
    expect(readJSON('level', 'zero')).toBe('zero');
    expect(writeJSON('level', 'basico')).toBe(false);
  });

  it('remove uma chave', () => {
    writeJSON('theme', 'dark');
    removeKey('theme');
    expect(readJSON('theme')).toBeNull();
  });

  it('clearAppData apaga só as chaves da app', () => {
    writeJSON('level', 'basico');
    writeJSON('theme', 'dark');
    storage.setItem('outra-app', 'mantém-me');

    expect(clearAppData()).toBe(true);
    expect(storage.length).toBe(1);
    expect(storage.getItem('outra-app')).toBe('mantém-me');
  });
});
