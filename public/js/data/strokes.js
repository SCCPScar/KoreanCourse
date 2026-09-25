/**
 * Ordem dos traços das 14 consoantes e 10 vogais básicas, em SVG próprio
 * (o HanziWriter só suporta caracteres chineses).
 *
 * Cada letra é uma lista de traços, pela ordem em que se escrevem. Cada traço é
 * um "path" SVG numa grelha de 100 × 100. Regras gerais da escrita coreana:
 * de cima para baixo e da esquerda para a direita.
 *
 * As letras compostas (ㄲ, ㅐ, ㅘ, …) escrevem-se juntando estas letras básicas.
 */
export const STROKES = {
  // Consoantes
  ㄱ: ['M22 25 H74 V82'],
  ㄴ: ['M28 20 V76 H80'],
  ㄷ: ['M25 22 H75', 'M25 22 V78 H78'],
  ㄹ: ['M25 18 H72 V48', 'M28 48 H72', 'M28 48 V82 H78'],
  ㅁ: ['M25 20 V80', 'M25 20 H75 V80', 'M25 80 H75'],
  ㅂ: ['M28 18 V82', 'M72 18 V82', 'M28 50 H72', 'M28 82 H72'],
  ㅅ: ['M50 18 Q45 55 18 82', 'M50 45 Q62 68 82 82'],
  ㅇ: ['M49.9 20 A30 30 0 1 0 50 20'],
  ㅈ: ['M20 22 H78 Q55 60 18 84', 'M50 50 Q64 70 84 84'],
  ㅊ: ['M42 10 L58 18', 'M20 30 H78 Q55 65 18 86', 'M50 56 Q64 74 84 86'],
  ㅋ: ['M22 25 H74 V82', 'M24 52 H74'],
  ㅌ: ['M25 20 H75', 'M25 50 H72', 'M25 20 V80 H78'],
  ㅍ: ['M18 22 H82', 'M36 22 V78', 'M64 22 V78', 'M14 78 H86'],
  ㅎ: ['M42 10 L58 16', 'M20 28 H80', 'M49.9 42 A20 20 0 1 0 50 42'],

  // Vogais
  ㅏ: ['M40 10 V90', 'M40 50 H68'],
  ㅑ: ['M40 10 V90', 'M40 38 H68', 'M40 62 H68'],
  ㅓ: ['M32 50 H60', 'M60 10 V90'],
  ㅕ: ['M32 38 H60', 'M32 62 H60', 'M60 10 V90'],
  ㅗ: ['M50 40 V70', 'M14 70 H86'],
  ㅛ: ['M38 40 V70', 'M62 40 V70', 'M14 70 H86'],
  ㅜ: ['M14 34 H86', 'M50 34 V70'],
  ㅠ: ['M14 34 H86', 'M38 34 V70', 'M62 34 V70'],
  ㅡ: ['M14 50 H86'],
  ㅣ: ['M50 10 V90'],
};
