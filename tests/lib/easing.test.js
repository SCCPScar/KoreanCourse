import { describe, expect, it } from 'vitest';
import { buildEasings, elasticIn, elasticOut, toLinearEasing } from '../../public/js/lib/easing.js';

describe('curvas elásticas', () => {
  it('começam em 0 e terminam em 1', () => {
    expect(elasticOut(0)).toBe(0);
    expect(elasticOut(1)).toBe(1);
    expect(elasticIn(0, 1, 0.72)).toBeCloseTo(0);
    expect(elasticIn(1, 1, 0.72)).toBeCloseTo(1);
  });

  it('a de saída passa do fim antes de parar (efeito elástico)', () => {
    const samples = Array.from({ length: 100 }, (_, i) => elasticOut(i / 100, 1, 0.72));
    expect(Math.max(...samples)).toBeGreaterThan(1);
  });
});

describe('toLinearEasing', () => {
  it('gera o texto da função CSS linear()', () => {
    expect(toLinearEasing((t) => t, 4)).toBe('linear(0, 0.25, 0.5, 0.75, 1)');
  });

  it('usa curvas simples quando o navegador não conhece linear()', () => {
    expect(buildEasings(false).elasticOut).toMatch(/^cubic-bezier/);
    expect(buildEasings(true).elasticOut).toMatch(/^linear\(/);
  });
});
