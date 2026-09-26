import { describe, expect, it } from 'vitest';
import { authErrorMessage, passwordProblem } from '../../public/js/lib/auth-errors.js';

describe('authErrorMessage', () => {
  it('traduz os códigos conhecidos', () => {
    expect(authErrorMessage({ code: 'invalid_credentials' })).toBe('Email ou senha incorretos.');
  });

  it('reconhece falta de internet', () => {
    expect(authErrorMessage({ name: 'AuthRetryableFetchError' })).toMatch(/Sem conexão/);
    expect(authErrorMessage(new TypeError('Failed to fetch'))).toMatch(/Sem conexão/);
  });

  it('tem uma mensagem genérica para o resto', () => {
    expect(authErrorMessage({ code: 'algo_novo' })).toMatch(/Tente de novo/);
    expect(authErrorMessage(null)).toMatch(/Tente de novo/);
  });
});

describe('passwordProblem', () => {
  it('pede 8 caracteres com letras e números', () => {
    expect(passwordProblem('abc1')).toMatch(/8 caracteres/);
    expect(passwordProblem('abcdefgh')).toMatch(/letras e números/);
    expect(passwordProblem('12345678')).toMatch(/letras e números/);
    expect(passwordProblem('coreano2026')).toBeNull();
  });
});
