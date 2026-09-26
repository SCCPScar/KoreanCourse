import { describe, expect, it } from 'vitest';
import {
  advance,
  correctAnswerText,
  createSession,
  currentItem,
  isCorrect,
  isFinished,
  normalizeRomanization,
  progressOf,
  scoreOf,
  shuffle,
} from '../../public/js/lib/lesson.js';

const learn = { type: 'learn', title: 'x', text: 'y', items: [] };
const choice = { type: 'choice', options: ['a', 'b'], answer: 'a' };
const build = { type: 'build', tiles: ['저는', '학생이에요'], extra: ['의사예요'] };
const read = { type: 'read', ko: '김치', answers: ['gimchi', 'kimchi'] };

describe('normalizeRomanization', () => {
  it('ignora maiúsculas, espaços, hífens e pontuação', () => {
    expect(normalizeRomanization(' Annyeong-haseyo! ')).toBe('annyeonghaseyo');
  });

  it('ignora acentos', () => {
    expect(normalizeRomanization('ómma')).toBe('omma');
  });
});

describe('isCorrect', () => {
  it('confere cada tipo de exercício', () => {
    expect(isCorrect(choice, 'a')).toBe(true);
    expect(isCorrect(choice, 'b')).toBe(false);
    expect(isCorrect(build, ['저는', '학생이에요'])).toBe(true);
    expect(isCorrect(build, ['학생이에요', '저는'])).toBe(false);
    expect(isCorrect(read, 'Kimchi')).toBe(true);
    expect(isCorrect(read, 'kimci')).toBe(false);
  });

  it('mostra a resposta certa em texto', () => {
    expect(correctAnswerText(build)).toBe('저는 학생이에요');
    expect(correctAnswerText(read)).toBe('gimchi');
    expect(correctAnswerText(choice)).toBe('a');
  });
});

describe('sessão da lição', () => {
  it('um exercício errado volta uma vez no fim e não conta como acerto', () => {
    let session = createSession([learn, choice, read]);
    session = advance(session); // learn
    session = advance(session, false); // choice errado → volta no fim
    session = advance(session, true); // read certo
    expect(isFinished(session)).toBe(false);
    expect(currentItem(session).step).toBe(choice);
    expect(currentItem(session).retry).toBe(true);
    session = advance(session, false); // errou de novo: não volta outra vez
    expect(isFinished(session)).toBe(true);
    expect(scoreOf(session)).toEqual({ correct: 1, total: 2 });
  });

  it('calcula o progresso e não altera a sessão anterior', () => {
    const start = createSession([learn, choice]);
    const next = advance(start);
    expect(progressOf(start)).toBe(0);
    expect(progressOf(next)).toBe(0.5);
  });
});

describe('shuffle', () => {
  it('mantém os mesmos itens e não altera a lista original', () => {
    const list = [1, 2, 3, 4];
    const result = shuffle(list, () => 0);
    expect(result.sort()).toEqual([1, 2, 3, 4]);
    expect(list).toEqual([1, 2, 3, 4]);
  });
});
