import { describe, expect, it } from 'vitest';
import {
  bestSimilarity,
  editDistance,
  hangulOnly,
  similarity,
  verdict,
} from '../../public/js/lib/pronunciation.js';

describe('pronúncia', () => {
  it('ignora espaços, pontuação e letras latinas', () => {
    expect(hangulOnly('안녕 하세요! ok')).toEqual(['안', '녕', '하', '세', '요']);
  });

  it('calcula a distância de edição', () => {
    expect(editDistance('감사합니다', '감사합니다')).toBe(0);
    expect(editDistance('감사합니다', '감사함니다')).toBe(1);
    expect(editDistance('', '물')).toBe(1);
    expect(editDistance('abc', 'yabd')).toBe(2);
  });

  it('frase igual = 100%, mesmo com espaços diferentes', () => {
    expect(similarity('안녕하세요', '안녕 하세요.')).toBe(1);
  });

  it('uma sílaba errada em cinco = 80%', () => {
    expect(similarity('감사합니다', '감사함니다')).toBeCloseTo(0.8);
  });

  it('nada reconhecido = 0', () => {
    expect(similarity('물', '')).toBe(0);
    expect(similarity('', '물')).toBe(0);
  });

  it('fica com a melhor alternativa', () => {
    expect(bestSimilarity('김치', ['김시', '김치', '기치'])).toBe(1);
    expect(bestSimilarity('김치', [])).toBe(0);
  });

  it('dá o resultado para o aluno', () => {
    expect(verdict(1)).toBe('great');
    expect(verdict(0.85)).toBe('great');
    expect(verdict(0.6)).toBe('close');
    expect(verdict(0.2)).toBe('retry');
  });
});
