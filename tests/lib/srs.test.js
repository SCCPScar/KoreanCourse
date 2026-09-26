import { describe, expect, it } from 'vitest';
import {
  MAX_INTERVAL,
  MIN_EASE,
  START_EASE,
  intervalLabel,
  isDue,
  previewIntervals,
  review,
} from '../../public/js/lib/srs.js';

const TODAY = '2026-09-26';
const NOW = new Date('2026-09-26T10:00:00.000Z');

describe('review (SM-2)', () => {
  it('cartão novo + "Bom" volta amanhã', () => {
    const state = review(null, 'good', TODAY, NOW);
    expect(state).toEqual({
      reps: 1,
      interval: 1,
      ease: START_EASE,
      due: '2026-09-27',
      lapses: 0,
      added: TODAY,
      reviewedAt: NOW.toISOString(),
    });
  });

  it('respostas "Bom" seguidas fazem o intervalo crescer: 1 → 3 → 8 → 20', () => {
    let state = review(null, 'good', TODAY);
    const intervals = [state.interval];
    for (let i = 0; i < 3; i += 1) {
      state = review(state, 'good', state.due);
      intervals.push(state.interval);
    }
    expect(intervals).toEqual([1, 3, 8, 20]);
  });

  it('"Errei" zera as repetições, volta amanhã, baixa a facilidade e conta um esquecimento', () => {
    const learned = { ...review(null, 'good', TODAY), reps: 4, interval: 30 };
    const state = review(learned, 'again', TODAY);
    expect(state.reps).toBe(0);
    expect(state.interval).toBe(1);
    expect(state.ease).toBe(2.3);
    expect(state.lapses).toBe(1);
  });

  it('"Errei" num cartão novo não conta como esquecimento', () => {
    expect(review(null, 'again', TODAY).lapses).toBe(0);
  });

  it('"Fácil" dá mais tempo e sobe a facilidade', () => {
    expect(review(null, 'easy', TODAY).interval).toBe(3);
    expect(review(null, 'easy', TODAY).ease).toBe(2.65);
  });

  it('"Difícil" cresce devagar, mas sempre pelo menos 1 dia a mais', () => {
    const state = { reps: 3, interval: 10, ease: 2.5, lapses: 0, added: TODAY };
    expect(review(state, 'hard', TODAY).interval).toBe(12);
    const short = { ...state, interval: 2 };
    expect(review(short, 'hard', TODAY).interval).toBe(3);
  });

  it('a facilidade nunca fica abaixo do mínimo', () => {
    let state = review(null, 'good', TODAY);
    for (let i = 0; i < 20; i += 1) state = review(state, 'again', TODAY);
    expect(state.ease).toBe(MIN_EASE);
  });

  it('o intervalo tem um teto de 1 ano', () => {
    const state = { reps: 10, interval: 300, ease: 3, lapses: 0, added: TODAY };
    expect(review(state, 'easy', TODAY).interval).toBe(MAX_INTERVAL);
  });

  it('mantém o dia em que o cartão começou', () => {
    const first = review(null, 'good', '2026-01-01');
    expect(review(first, 'good', TODAY).added).toBe('2026-01-01');
  });

  it('não altera o estado antigo', () => {
    const first = review(null, 'good', TODAY);
    const copy = { ...first };
    review(first, 'again', TODAY);
    expect(first).toEqual(copy);
  });

  it('recusa respostas desconhecidas', () => {
    expect(() => review(null, 'talvez', TODAY)).toThrow();
  });
});

describe('previewIntervals, intervalLabel e isDue', () => {
  it('mostra o intervalo de cada botão', () => {
    expect(previewIntervals(null, TODAY)).toEqual({ again: 1, hard: 1, good: 1, easy: 3 });
  });

  it('escreve intervalos em português', () => {
    expect(intervalLabel(1)).toBe('amanhã');
    expect(intervalLabel(3)).toBe('3 dias');
    expect(intervalLabel(31)).toBe('1 mês');
    expect(intervalLabel(95)).toBe('3 meses');
    expect(intervalLabel(365)).toBe('1 ano');
  });

  it('um cartão vence no dia marcado e depois dele', () => {
    const state = { due: TODAY };
    expect(isDue(state, '2026-09-25')).toBe(false);
    expect(isDue(state, TODAY)).toBe(true);
    expect(isDue(state, '2026-10-01')).toBe(true);
    expect(isDue(undefined, TODAY)).toBe(false);
  });
});
