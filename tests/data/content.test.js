/**
 * Testes de integridade dos dados: garantem que ninguém adicione uma palavra
 * sem tradução, com nível errado ou com texto que não é Hangul.
 */
import { describe, expect, it } from 'vitest';
import { LINES, STATIONS } from '../../public/js/data/course.js';
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
  it('tem pelo menos 300 palavras', () => {
    expect(WORDS.length).toBeGreaterThanOrEqual(300);
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

describe('percurso (mapa do metrô)', () => {
  it('estações têm ids únicos, linha válida e selo', () => {
    expect(new Set(STATIONS.map((s) => s.id)).size).toBe(STATIONS.length);
    STATIONS.forEach((station) => {
      expect(LINES.map((line) => line.id)).toContain(station.line);
      expect(station.stamp.ko).toMatch(HANGUL_TEXT);
      expect(station.stamp.pt).not.toBe('');
    });
  });

  // Linhas 1 e 2: seis meses de curso completos. Linhas 3 e 4: versão introdutória.
  const EXPECTED_STATIONS = { l1: 30, l2: 30, l3: 10, l4: 10 };

  it.each(LINES)('a $name tem todas as estações completas', (line) => {
    const stations = STATIONS.filter((s) => s.line === line.id);
    expect(stations).toHaveLength(EXPECTED_STATIONS[line.id]);
    stations.forEach((station) => {
      expect(station.steps.length).toBeGreaterThanOrEqual(8);
      expect(station.steps.filter((step) => step.type !== 'learn').length).toBeGreaterThanOrEqual(
        5,
      );
    });
  });

  it.each(
    STATIONS.filter((s) => s.steps).flatMap((s) => s.steps.map((step, i) => [s.id, i, step])),
  )('%s passo %i é válido', (_id, _index, step) => {
    if (step.type === 'learn') {
      step.items.forEach((item) => {
        expect(item.ko).toMatch(HANGUL_TEXT);
        expect(item.rom).toMatch(ROMANIZATION);
      });
    } else if (step.type === 'choice') {
      expect(step.options).toContain(step.answer);
      expect(new Set(step.options).size).toBe(step.options.length);
      expect(['ko', 'pt', 'rom']).toContain(step.lang);
      if (step.ko) expect(step.ko).toMatch(HANGUL_TEXT);
    } else if (step.type === 'build') {
      const all = [...step.tiles, ...step.extra];
      expect(new Set(all).size).toBe(all.length);
      all.forEach((tile) => expect(tile).toMatch(HANGUL_TEXT));
    } else if (step.type === 'read') {
      expect(step.ko).toMatch(HANGUL_TEXT);
      step.answers.forEach((answer) => expect(answer).toMatch(ROMANIZATION));
    } else {
      throw new Error(`Tipo de passo desconhecido: ${step.type}`);
    }
  });
});
