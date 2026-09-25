import { describe, expect, it } from 'vitest';
import { formulaText } from '../../public/js/features/hangul-trainer.js';

describe('formulaText', () => {
  it('mostra a fórmula Unicode com o resultado em hexadecimal', () => {
    expect(formulaText(0, 0, 0)).toBe('0xAC00 + (0 × 21 + 0) × 28 + 0 = 0xAC00');
    expect(formulaText(18, 0, 4)).toBe('0xAC00 + (18 × 21 + 0) × 28 + 4 = 0xD55C'); // 한
  });
});
