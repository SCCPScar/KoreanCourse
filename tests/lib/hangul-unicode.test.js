import { describe, expect, it } from 'vitest';
import {
  FINALS,
  INITIALS,
  MEDIALS,
  composeSyllable,
  decomposeSyllable,
  romanizeSyllable,
  syllableCodePoint,
} from '../../public/js/lib/hangul-unicode.js';

const idx = (list, jamo) => list.indexOf(jamo);

describe('composeSyllable', () => {
  it('forma 가 (ㄱ + ㅏ) no início do bloco Unicode', () => {
    expect(syllableCodePoint(0, 0, 0)).toBe(0xac00);
    expect(composeSyllable(0, 0)).toBe('가');
  });

  it('forma 한 (ㅎ + ㅏ + ㄴ) e 글 (ㄱ + ㅡ + ㄹ)', () => {
    expect(composeSyllable(idx(INITIALS, 'ㅎ'), idx(MEDIALS, 'ㅏ'), idx(FINALS, 'ㄴ'))).toBe('한');
    expect(composeSyllable(idx(INITIALS, 'ㄱ'), idx(MEDIALS, 'ㅡ'), idx(FINALS, 'ㄹ'))).toBe('글');
  });

  it('a última sílaba possível é 힣 (U+D7A3)', () => {
    expect(composeSyllable(18, 20, 27)).toBe('힣');
  });

  it('rejeita índices inválidos', () => {
    expect(() => composeSyllable(19, 0)).toThrow(RangeError);
    expect(() => composeSyllable(0, -1)).toThrow(RangeError);
    expect(() => composeSyllable(0, 0, 1.5)).toThrow(RangeError);
  });
});

describe('decomposeSyllable', () => {
  it('é o inverso de composeSyllable para todas as 11 172 sílabas', () => {
    for (let i = 0; i < INITIALS.length; i += 1) {
      for (let m = 0; m < MEDIALS.length; m += 1) {
        for (let f = 0; f < FINALS.length; f += 1) {
          expect(decomposeSyllable(composeSyllable(i, m, f))).toEqual({
            initial: i,
            medial: m,
            final: f,
          });
        }
      }
    }
  });

  it('devolve null para texto que não é uma sílaba Hangul', () => {
    expect(decomposeSyllable('a')).toBeNull();
    expect(decomposeSyllable('ㄱ')).toBeNull();
    expect(decomposeSyllable('가나')).toBeNull();
    expect(decomposeSyllable('')).toBeNull();
    expect(decomposeSyllable(undefined)).toBeNull();
  });
});

describe('romanizeSyllable', () => {
  it('segue a Romanização Revista', () => {
    const r = (char) => {
      const { initial, medial, final } = decomposeSyllable(char);
      return romanizeSyllable(initial, medial, final);
    };
    expect(r('한')).toBe('han');
    expect(r('글')).toBe('geul');
    expect(r('아')).toBe('a');
    expect(r('강')).toBe('gang');
    expect(r('밖')).toBe('bak');
    expect(r('옷')).toBe('ot');
    expect(r('앞')).toBe('ap');
    expect(r('쌀')).toBe('ssal');
    expect(r('의')).toBe('ui');
  });
});
