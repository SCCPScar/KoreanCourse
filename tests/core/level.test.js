import { describe, expect, it } from 'vitest';
import { isWithinLevel } from '../../public/js/core/level.js';

describe('isWithinLevel', () => {
  it('mostra conteúdos do mesmo nível e de níveis abaixo', () => {
    expect(isWithinLevel('zero', 'basico')).toBe(true);
    expect(isWithinLevel('basico', 'basico')).toBe(true);
  });

  it('esconde conteúdos de níveis acima', () => {
    expect(isWithinLevel('intermedio', 'basico')).toBe(false);
    expect(isWithinLevel('avancado', 'zero')).toBe(false);
  });

  it('sem nível escolhido mostra tudo', () => {
    expect(isWithinLevel('avancado', null)).toBe(true);
  });
});
