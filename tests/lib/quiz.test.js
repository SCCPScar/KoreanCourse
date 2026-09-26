import { describe, expect, it } from 'vitest';
import { buildQuiz, makeQuestion, quizScore } from '../../public/js/lib/quiz.js';

/** Gerador "aleatório" previsível para os testes. */
function seeded(seed = 1) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const W = (id, ko, rom, pt, category) => ({ id, ko, rom, pt, category });
const POOL = [
  W('c:사과', '사과', 'sagwa', 'maçã', 'comida'),
  W('c:빵', '빵', 'ppang', 'pão', 'comida'),
  W('c:물', '물', 'mul', 'água', 'comida'),
  W('c:밥', '밥', 'bap', 'arroz', 'comida'),
  W('c:우유', '우유', 'uyu', 'leite', 'comida'),
  W('p:친구', '친구', 'chingu', 'amigo', 'pessoas'),
  W('p:엄마', '엄마', 'eomma', 'mãe', 'pessoas'),
  W('p:물', '물', 'mul', 'água', 'pessoas'), // mesma resposta de outra palavra
];

describe('makeQuestion', () => {
  it('tem 4 opções diferentes e inclui a resposta', () => {
    const question = makeQuestion(POOL[0], POOL, 'ko-pt', seeded());
    expect(question.options).toHaveLength(4);
    expect(new Set(question.options).size).toBe(4);
    expect(question.options).toContain('maçã');
    expect(question.answer).toBe('maçã');
  });

  it('prefere distratores da mesma categoria', () => {
    const question = makeQuestion(POOL[0], POOL, 'pt-ko', seeded(7));
    const comida = POOL.filter((word) => word.category === 'comida').map((word) => word.ko);
    question.options.forEach((option) => expect(comida).toContain(option));
  });

  it('nunca repete como distrator uma resposta igual à certa', () => {
    const question = makeQuestion(POOL[2], POOL, 'ko-pt', seeded(3));
    expect(question.options.filter((option) => option === 'água')).toHaveLength(1);
  });

  it('usa a romanização no treino de leitura', () => {
    const question = makeQuestion(POOL[5], POOL, 'ko-rom', seeded());
    expect(question.answer).toBe('chingu');
    expect(question.options).toContain('chingu');
  });

  it('funciona com poucas palavras (menos opções)', () => {
    expect(makeQuestion(POOL[0], POOL.slice(0, 2), 'ko-pt', seeded()).options).toHaveLength(2);
  });

  it('recusa tipos desconhecidos', () => {
    expect(() => makeQuestion(POOL[0], POOL, 'xx')).toThrow();
  });
});

describe('buildQuiz e quizScore', () => {
  it('cria perguntas com palavras diferentes e alterna os tipos', () => {
    const quiz = buildQuiz(POOL, { count: 6, random: seeded(5) });
    expect(quiz).toHaveLength(6);
    expect(new Set(quiz.map((q) => q.word.id)).size).toBe(6);
    expect(quiz.map((q) => q.kind)).toEqual([
      'ko-pt',
      'pt-ko',
      'listen',
      'ko-pt',
      'pt-ko',
      'listen',
    ]);
  });

  it('calcula acertos e o maior combo', () => {
    expect(quizScore([true, true, false, true, true, true])).toEqual({
      correct: 5,
      total: 6,
      bestCombo: 3,
    });
    expect(quizScore([])).toEqual({ correct: 0, total: 0, bestCombo: 0 });
  });
});
