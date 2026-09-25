/**
 * Dados pedagógicos do Hangul: consoantes, vogais e batchim.
 *
 * `rom` mostra "início / fim de sílaba" quando o som muda no batchim (ex.: ㅅ → s / t).
 *
 * `sample` é a sílaba usada no áudio: a síntese de voz lê mal letras soltas,
 * por isso as consoantes são lidas com ㅏ (가) e as vogais com ㅇ mudo (아).
 */

// prettier-ignore
export const CONSONANTS = [
  { jamo: 'ㄱ', name: '기역', rom: 'g / k', type: 'simples', sample: '가', tip: 'Entre o "g" de "gato" e o "c" de "casa".' },
  { jamo: 'ㄴ', name: '니은', rom: 'n', type: 'simples', sample: '나', tip: 'Como o "n" de "nada".' },
  { jamo: 'ㄷ', name: '디귿', rom: 'd / t', type: 'simples', sample: '다', tip: 'Entre o "d" de "dado" e o "t" de "tu".' },
  { jamo: 'ㄹ', name: '리을', rom: 'r / l', type: 'simples', sample: '라', tip: 'Entre o "r" de "caro" e o "l". No fim da sílaba soa "l".' },
  { jamo: 'ㅁ', name: '미음', rom: 'm', type: 'simples', sample: '마', tip: 'Como o "m" de "mala".' },
  { jamo: 'ㅂ', name: '비읍', rom: 'b / p', type: 'simples', sample: '바', tip: 'Entre o "b" de "bola" e o "p" de "pato".' },
  { jamo: 'ㅅ', name: '시옷', rom: 's / t', type: 'simples', sample: '사', tip: 'Como o "s" de "sapo". Antes de ㅣ soa quase "x" (시 ≈ "xi").' },
  { jamo: 'ㅇ', name: '이응', rom: '— / ng', type: 'simples', sample: '아', tip: 'Mudo no início da sílaba; no fim soa "ng", como em inglês "sing".' },
  { jamo: 'ㅈ', name: '지읒', rom: 'j / t', type: 'simples', sample: '자', tip: 'Como o "di" de "dia" no sotaque carioca ou paulista ("djia").' },
  { jamo: 'ㅎ', name: '히읗', rom: 'h / t', type: 'simples', sample: '하', tip: 'Um "h" aspirado, como o "r" de "rato" em muitos sotaques brasileiros, mas mais suave.' },
  { jamo: 'ㅊ', name: '치읓', rom: 'ch / t', type: 'aspirada', sample: '차', tip: 'Como o "ti" de "tia" no Rio ou em SP ("tchia"), com um sopro de ar.' },
  { jamo: 'ㅋ', name: '키읔', rom: 'k', type: 'aspirada', sample: '카', tip: '"K" com um sopro de ar forte.' },
  { jamo: 'ㅌ', name: '티읕', rom: 't', type: 'aspirada', sample: '타', tip: '"T" com um sopro de ar forte.' },
  { jamo: 'ㅍ', name: '피읖', rom: 'p', type: 'aspirada', sample: '파', tip: '"P" com um sopro de ar forte.' },
  { jamo: 'ㄲ', name: '쌍기역', rom: 'kk / k', type: 'tensa', sample: '까', tip: '"K" tenso, sem ar — como o "c" de "casa" dito com força.' },
  { jamo: 'ㄸ', name: '쌍디귿', rom: 'tt', type: 'tensa', sample: '따', tip: '"T" tenso, sem ar — como o "t" de "tatu", bem firme.' },
  { jamo: 'ㅃ', name: '쌍비읍', rom: 'pp', type: 'tensa', sample: '빠', tip: '"P" tenso, sem ar — como o "p" de "pato", bem firme.' },
  { jamo: 'ㅆ', name: '쌍시옷', rom: 'ss / t', type: 'tensa', sample: '싸', tip: '"S" forte e sibilante.' },
  { jamo: 'ㅉ', name: '쌍지읒', rom: 'jj', type: 'tensa', sample: '짜', tip: '"Tch" tenso e sem ar, como em "tchau" dito com força.' },
];

export const CONSONANT_TYPES = {
  simples: 'Simples',
  aspirada: 'Aspirada (com sopro)',
  tensa: 'Tensa (dupla)',
};

// prettier-ignore
export const VOWELS = [
  { jamo: 'ㅏ', rom: 'a', type: 'básica', sample: '아', tip: 'Como o "á" de "pá".' },
  { jamo: 'ㅑ', rom: 'ya', type: 'básica', sample: '야', tip: 'Como "iá".' },
  { jamo: 'ㅓ', rom: 'eo', type: 'básica', sample: '어', tip: 'Um "ó" aberto, sem arredondar os lábios.' },
  { jamo: 'ㅕ', rom: 'yeo', type: 'básica', sample: '여', tip: 'Como "i" + ㅓ ("ió" aberto).' },
  { jamo: 'ㅗ', rom: 'o', type: 'básica', sample: '오', tip: 'Um "ô" fechado, com os lábios arredondados.' },
  { jamo: 'ㅛ', rom: 'yo', type: 'básica', sample: '요', tip: 'Como "iô".' },
  { jamo: 'ㅜ', rom: 'u', type: 'básica', sample: '우', tip: 'Como o "u" de "tu".' },
  { jamo: 'ㅠ', rom: 'yu', type: 'básica', sample: '유', tip: 'Como "iu".' },
  { jamo: 'ㅡ', rom: 'eu', type: 'básica', sample: '으', tip: 'Diga "u" com os lábios esticados, como num sorriso. Não existe em português.' },
  { jamo: 'ㅣ', rom: 'i', type: 'básica', sample: '이', tip: 'Como o "i" de "vi".' },
  { jamo: 'ㅐ', rom: 'ae', type: 'composta', sample: '애', tip: 'Como o "é" de "pé".' },
  { jamo: 'ㅒ', rom: 'yae', type: 'composta', sample: '얘', tip: 'Como "ié".' },
  { jamo: 'ㅔ', rom: 'e', type: 'composta', sample: '에', tip: 'Como o "ê". Hoje soa quase igual a ㅐ.' },
  { jamo: 'ㅖ', rom: 'ye', type: 'composta', sample: '예', tip: 'Como "iê".' },
  { jamo: 'ㅘ', rom: 'wa', type: 'composta', sample: '와', tip: 'Como "uá" (ㅗ + ㅏ).' },
  { jamo: 'ㅙ', rom: 'wae', type: 'composta', sample: '왜', tip: 'Como "ué" (ㅗ + ㅐ).' },
  { jamo: 'ㅚ', rom: 'oe', type: 'composta', sample: '외', tip: 'Hoje soa como "ué".' },
  { jamo: 'ㅝ', rom: 'wo', type: 'composta', sample: '워', tip: 'Como "uó" (ㅜ + ㅓ).' },
  { jamo: 'ㅞ', rom: 'we', type: 'composta', sample: '웨', tip: 'Como "uê" (ㅜ + ㅔ).' },
  { jamo: 'ㅟ', rom: 'wi', type: 'composta', sample: '위', tip: 'Como "ui" (ㅜ + ㅣ).' },
  { jamo: 'ㅢ', rom: 'ui', type: 'composta', sample: '의', tip: 'ㅡ + ㅣ dito rapidamente.' },
];

/**
 * Batchim (받침): a consoante no fim da sílaba.
 * Por mais consoantes que existam, no fim da sílaba só se escutam 7 sons.
 */
// prettier-ignore
export const BATCHIM_SOUNDS = [
  { sound: 'k', letters: ['ㄱ', 'ㄲ', 'ㅋ'], example: { ko: '부엌', rom: 'bueok', pt: 'cozinha' } },
  { sound: 'n', letters: ['ㄴ'], example: { ko: '산', rom: 'san', pt: 'montanha' } },
  { sound: 't', letters: ['ㄷ', 'ㅅ', 'ㅆ', 'ㅈ', 'ㅊ', 'ㅌ', 'ㅎ'], example: { ko: '옷', rom: 'ot', pt: 'roupa' } },
  { sound: 'l', letters: ['ㄹ'], example: { ko: '물', rom: 'mul', pt: 'água' } },
  { sound: 'm', letters: ['ㅁ'], example: { ko: '밤', rom: 'bam', pt: 'noite' } },
  { sound: 'p', letters: ['ㅂ', 'ㅍ'], example: { ko: '앞', rom: 'ap', pt: 'frente' } },
  { sound: 'ng', letters: ['ㅇ'], example: { ko: '강', rom: 'gang', pt: 'rio' } },
];
