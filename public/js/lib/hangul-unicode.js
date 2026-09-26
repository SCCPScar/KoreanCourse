/**
 * Composição e decomposição de sílabas Hangul com Unicode.
 *
 * O Unicode tem um bloco com TODAS as 11 172 sílabas possíveis (U+AC00 a U+D7A3),
 * ordenadas de forma matemática:
 *
 *   código = 0xAC00 + (inicial × 21 + vogal) × 28 + final
 *
 * onde 21 é o número de vogais e 28 o número de finais (27 + "sem final").
 * As listas abaixo seguem exatamente a ordem do Unicode — não podem ser reordenadas.
 */

export const SYLLABLE_BASE = 0xac00;
export const MEDIAL_COUNT = 21;
export const FINAL_COUNT = 28;

// prettier-ignore
export const INITIALS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// prettier-ignore
export const MEDIALS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
  'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

// prettier-ignore
export const FINALS = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

/* Romanização Revista (sistema oficial da Coreia do Sul), para uma sílaba isolada. */
// prettier-ignore
const INITIAL_ROMAN = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's',
  'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
];

// prettier-ignore
const MEDIAL_ROMAN = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae',
  'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
];

// No fim da sílaba só existem 7 sons: k, n, t, l, m, p, ng.
// prettier-ignore
const FINAL_ROMAN = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k',
  'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't',
  't', 'ng', 't', 't', 'k', 't', 'p', 't',
];

function assertIndex(value, max, name) {
  if (!Number.isInteger(value) || value < 0 || value >= max) {
    throw new RangeError(`Índice de ${name} inválido: ${value}`);
  }
}

/** Retorna o código Unicode da sílaba formada pelos índices dados. */
export function syllableCodePoint(initial, medial, final = 0) {
  assertIndex(initial, INITIALS.length, 'consoante inicial');
  assertIndex(medial, MEDIALS.length, 'vogal');
  assertIndex(final, FINALS.length, 'consoante final');
  return SYLLABLE_BASE + (initial * MEDIAL_COUNT + medial) * FINAL_COUNT + final;
}

/** Junta consoante inicial + vogal (+ final) numa sílaba. Ex.: (0, 0, 4) → '간'. */
export function composeSyllable(initial, medial, final = 0) {
  return String.fromCodePoint(syllableCodePoint(initial, medial, final));
}

/** Separa uma sílaba nos seus índices, ou retorna null se não for uma sílaba Hangul. */
export function decomposeSyllable(char) {
  const offset = (char?.codePointAt(0) ?? -1) - SYLLABLE_BASE;
  if (char?.length !== 1 || offset < 0 || offset >= INITIALS.length * MEDIAL_COUNT * FINAL_COUNT) {
    return null;
  }
  return {
    initial: Math.floor(offset / (MEDIAL_COUNT * FINAL_COUNT)),
    medial: Math.floor(offset / FINAL_COUNT) % MEDIAL_COUNT,
    final: offset % FINAL_COUNT,
  };
}

/** Romanização de uma sílaba ISOLADA (sem regras de ligação entre sílabas). */
export function romanizeSyllable(initial, medial, final = 0) {
  syllableCodePoint(initial, medial, final); // valida os índices
  return INITIAL_ROMAN[initial] + MEDIAL_ROMAN[medial] + FINAL_ROMAN[final];
}
