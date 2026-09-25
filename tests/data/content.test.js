/**
 * Testes de integridade dos dados: garantem que ninguém adiciona uma palavra
 * sem tradução, com nível errado ou com texto que não é Hangul.
 */
import { describe, expect, it } from 'vitest';
import { FACTS } from '../../public/js/data/facts.js';
import { GRAMMAR } from '../../public/js/data/grammar.js';
import { BATCHIM_SOUNDS, CONSONANTS, VOWELS } from '../../public/js/data/hangul.js';
import { LEVELS, findLevel } from '../../public/js/data/levels.js';
import { STROKES } from '../../public/js/data/strokes.js';
import { CATEGORIES, WORDS } from '../../public/js/data/vocabulary.js';
import { FINALS, INITIALS, MEDIALS } from '../../public/js/lib/hangul-unicode.js';

const HANGUL_TEXT = /^[가-힣 .,?!0-9]+$/;
const ROMANIZATION = /^[a-z .,?!-]+$/;
const levelIds = LEVELS.map((level) => level.id);

describe('vocabulário', () => {
  it('tem pelo menos 200 palavras', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(200);
  });

  it('tem ids únicos', () => {
    expect(new Set(WORDS.map((word) => word.id)).size).toBe(WORDS.length);
  });

  it.each(WORDS)('$id tem hangul, romanização, tradução e nível válidos', (word) => {
    expect(word.ko).toMatch(HANGUL_TEXT);
    expect(word.rom).toMatch(ROMANIZATION);
    expect(word.pt.trim()).not.toBe('');
    expect(levelIds).toContain(word.level);
    expect(CATEGORIES.map((category) => category.id)).toContain(word.category);
  });

  it('todas as categorias têm palavras', () => {
    CATEGORIES.forEach((category) => {
      expect(WORDS.some((word) => word.category === category.id)).toBe(true);
    });
  });
});

describe('gramática', () => {
  it('tem ids únicos', () => {
    expect(new Set(GRAMMAR.map((point) => point.id)).size).toBe(GRAMMAR.length);
  });

  it('cobre os pontos pedidos no programa', () => {
    const ids = GRAMMAR.map((point) => point.id);
    [
      'topico',
      'sujeito',
      'objeto',
      'lugar-destino',
      'lugar-acao',
      'presente',
      'passado',
      'futuro',
      'formalidade',
      'negacao-an',
      'negacao-ji',
      'conector-go',
      'conector-aseo',
      'conector-jiman',
    ].forEach((id) => expect(ids).toContain(id));
  });

  it.each(GRAMMAR)('$id tem explicação e exemplos completos', (point) => {
    expect(findLevel(point.level)).toBeDefined();
    expect(point.explanation.length).toBeGreaterThan(0);
    expect(point.examples.length).toBeGreaterThan(0);
    point.examples.forEach((example) => {
      expect(example.ko).toMatch(HANGUL_TEXT);
      expect(example.rom).toMatch(ROMANIZATION);
      expect(example.pt.trim()).not.toBe('');
    });
    point.table?.rows.forEach((row) => expect(row).toHaveLength(point.table.head.length));
  });
});

describe('hangul', () => {
  it('tem as 19 consoantes iniciais e as 21 vogais do Unicode', () => {
    expect(CONSONANTS.map((c) => c.jamo).sort()).toEqual([...INITIALS].sort());
    expect(VOWELS.map((v) => v.jamo).sort()).toEqual([...MEDIALS].sort());
  });

  it('as sílabas de áudio são blocos Hangul', () => {
    [...CONSONANTS, ...VOWELS].forEach((item) => expect(item.sample).toMatch(HANGUL_TEXT));
  });

  it('o batchim cobre todas as consoantes finais simples e duplas', () => {
    const covered = BATCHIM_SOUNDS.flatMap((row) => row.letters);
    const singleFinals = FINALS.filter((f) => f && INITIALS.includes(f));
    expect([...covered].sort()).toEqual([...singleFinals].sort());
  });

  it('há traços para as 14 consoantes e 10 vogais básicas', () => {
    expect(Object.keys(STROKES)).toHaveLength(24);
    Object.values(STROKES).forEach((strokes) => {
      expect(strokes.length).toBeGreaterThan(0);
      expect(strokes.length).toBeLessThanOrEqual(4); // o CSS tem atrasos para 4 traços
      strokes.forEach((d) => expect(d).toMatch(/^M[\d. HVLQA]+$/));
    });
  });
});

describe('curiosidades', () => {
  it('cada parte é texto ou { ko } com Hangul', () => {
    FACTS.forEach((parts) => {
      expect(parts.length).toBeGreaterThan(0);
      parts.forEach((part) => {
        if (typeof part === 'string') expect(part).not.toBe('');
        else expect(part.ko).toMatch(HANGUL_TEXT);
      });
    });
  });
});
