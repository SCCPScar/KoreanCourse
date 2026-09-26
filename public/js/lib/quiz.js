/**
 * Perguntas de múltipla escolha geradas a partir do vocabulário.
 * Usadas no Quiz relâmpago e no jogo de Leitura rápida.
 *
 * Tipos de pergunta:
 *  - 'ko-pt':  mostra o Hangul, escolher a tradução;
 *  - 'pt-ko':  mostra a tradução, escolher o Hangul;
 *  - 'listen': toca o áudio, escolher a tradução;
 *  - 'ko-rom': mostra o Hangul, escolher a romanização (treino de leitura).
 *
 * As opções erradas ("distratores") vêm de preferência da MESMA categoria,
 * para a pergunta não ficar fácil demais (ex.: frutas com frutas).
 *
 * Lógica pura: `random` pode ser trocado nos testes para dar sempre o mesmo resultado.
 */
import { shuffle } from './lesson.js';

export const QUIZ_KINDS = ['ko-pt', 'pt-ko', 'listen'];

/** Qual campo da palavra aparece como resposta em cada tipo. */
const ANSWER_FIELD = { 'ko-pt': 'pt', 'pt-ko': 'ko', listen: 'pt', 'ko-rom': 'rom' };

/** Até `count` palavras diferentes de `word` (e com resposta diferente), mesma categoria primeiro. */
function distractors(word, pool, field, count, random) {
  const seen = new Set([word[field]]);
  const pick = (list) =>
    shuffle(list, random).filter((other) => {
      if (seen.has(other[field])) return false;
      seen.add(other[field]);
      return true;
    });
  const sameCategory = pick(pool.filter((other) => other.category === word.category));
  const others = pick(pool.filter((other) => other.category !== word.category));
  return [...sameCategory, ...others].slice(0, count);
}

/** Uma pergunta sobre `word`, com 4 opções (ou menos, se o conjunto for pequeno). */
export function makeQuestion(word, pool, kind, random = Math.random) {
  const field = ANSWER_FIELD[kind];
  if (!field) throw new Error(`Tipo de pergunta desconhecido: ${kind}`);
  const wrong = distractors(word, pool, field, 3, random);
  return {
    kind,
    word,
    answer: word[field],
    options: shuffle([word[field], ...wrong.map((other) => other[field])], random),
  };
}

/** Um quiz com `count` palavras diferentes e tipos de pergunta alternados. */
export function buildQuiz(pool, { count = 10, kinds = QUIZ_KINDS, random = Math.random } = {}) {
  return shuffle(pool, random)
    .slice(0, count)
    .map((word, index) => makeQuestion(word, pool, kinds[index % kinds.length], random));
}

/**
 * Pontuação de um quiz: acertos, total e o maior "combo" (acertos seguidos).
 * @param {boolean[]} results
 */
export function quizScore(results) {
  let combo = 0;
  let bestCombo = 0;
  results.forEach((correct) => {
    combo = correct ? combo + 1 : 0;
    bestCombo = Math.max(bestCombo, combo);
  });
  return { correct: results.filter(Boolean).length, total: results.length, bestCombo };
}
