/**
 * De onde os jogos tiram as palavras: o vocabulário do nível do aluno
 * (e dos níveis abaixo). Sem nível escolhido, usa as palavras do nível zero.
 */
import { getLevel, isWithinLevel } from '../core/level.js';
import { WORDS } from '../data/vocabulary.js';

export function practicePool() {
  const level = getLevel() ?? 'zero';
  return WORDS.filter((word) => isWithinLevel(word.level, level));
}
