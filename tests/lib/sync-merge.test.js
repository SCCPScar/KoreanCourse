import { describe, expect, it } from 'vitest';
import {
  cardToRow,
  cardsToUpload,
  daysToUpload,
  mergeCardStates,
  mergeGoal,
  mergeLevel,
  mergeStations,
  mergeStudyDays,
  mergeWords,
  pickBetterRecord,
  rowsToCards,
  rowsToStations,
  rowsToStudyDays,
  stationToRow,
  stationsToUpload,
  studyDayToRow,
  wordsToUpload,
} from '../../public/js/lib/sync-merge.js';

const rec = (correct, total, completedAt, attempts = 1) => ({
  correct,
  total,
  completedAt,
  attempts,
});

describe('pickBetterRecord', () => {
  it('fica com a melhor pontuação', () => {
    const a = rec(9, 10, '2026-01-01T00:00:00.000Z');
    const b = rec(5, 10, '2026-02-01T00:00:00.000Z');
    expect(pickBetterRecord(a, b).correct).toBe(9);
  });

  it('em empate, fica com o mais recente e soma a maior quantidade de tentativas', () => {
    const a = rec(8, 10, '2026-01-01T00:00:00.000Z', 3);
    const b = rec(8, 10, '2026-02-01T00:00:00.000Z', 1);
    expect(pickBetterRecord(a, b)).toEqual(rec(8, 10, '2026-02-01T00:00:00.000Z', 3));
  });

  it('aceita um dos lados vazio', () => {
    const a = rec(1, 2, '2026-01-01T00:00:00.000Z');
    expect(pickBetterRecord(a, undefined)).toBe(a);
    expect(pickBetterRecord(undefined, a)).toBe(a);
  });
});

describe('mergeStations e stationsToUpload', () => {
  const local = {
    a: rec(9, 10, '2026-03-01T00:00:00.000Z'),
    b: rec(4, 5, '2026-03-02T00:00:00.000Z'),
  };
  const remote = {
    b: rec(5, 5, '2026-01-01T00:00:00.000Z'),
    c: rec(3, 3, '2026-01-02T00:00:00.000Z'),
  };

  it('une as estações dos dois aparelhos sem perder nenhuma', () => {
    const merged = mergeStations(local, remote);
    expect(Object.keys(merged).sort()).toEqual(['a', 'b', 'c']);
    expect(merged.b.correct).toBe(5); // a nuvem tinha a melhor pontuação
  });

  it('só envia para a nuvem o que ela ainda não tem igual', () => {
    const merged = mergeStations(local, remote);
    expect(stationsToUpload(merged, remote)).toEqual(['a']);
  });
});

describe('palavras e nível', () => {
  it('une as palavras e envia só as que faltam na nuvem', () => {
    const merged = mergeWords(['x', 'y'], ['y', 'z']);
    expect(merged).toEqual(['x', 'y', 'z']);
    expect(wordsToUpload(merged, ['y', 'z'])).toEqual(['x']);
  });

  it('o nível da conta vence; sem nível na conta, vale o local', () => {
    expect(mergeLevel('zero', 'basico')).toBe('basico');
    expect(mergeLevel('zero', null)).toBe('zero');
    expect(mergeLevel(null, null)).toBeNull();
  });
});

describe('conversão banco ⇄ local', () => {
  it('ida e volta mantém os dados', () => {
    const record = rec(7, 8, '2026-09-26T01:16:50.566Z', 2);
    const row = stationToRow('u1', 'l1-vogais', record);
    expect(row).toEqual({
      user_id: 'u1',
      station_id: 'l1-vogais',
      completed_at: record.completedAt,
      correct: 7,
      total: 8,
      attempts: 2,
    });
    // O banco devolve a data no formato do Postgres; convertemos de volta para ISO.
    expect(rowsToStations([{ ...row, completed_at: '2026-09-26 01:16:50.566+00' }])).toEqual({
      'l1-vogais': record,
    });
  });
});

describe('flashcards: mergeCardStates e cardsToUpload', () => {
  const card = (reviewedAt, interval = 1) => ({
    reps: 1,
    interval,
    ease: 2.5,
    due: '2026-09-27',
    lapses: 0,
    added: '2026-09-26',
    reviewedAt,
  });

  it('vale a revisão mais recente', () => {
    const local = { a: card('2026-09-26T10:00:00.000Z', 1), b: card('2026-09-20T10:00:00.000Z') };
    const remote = { a: card('2026-09-25T10:00:00.000Z', 8), c: card('2026-09-21T10:00:00.000Z') };
    const merged = mergeCardStates(local, remote);
    expect(merged.a.interval).toBe(1);
    expect(Object.keys(merged).sort()).toEqual(['a', 'b', 'c']);
    expect(cardsToUpload(merged, remote).sort()).toEqual(['a', 'b']);
  });

  it('converte entre linhas do banco e o formato local, ida e volta', () => {
    const state = card('2026-09-26T10:00:00.000Z');
    const row = cardToRow('u1', 'comida:우유', state);
    expect(row).toMatchObject({ user_id: 'u1', card_id: 'comida:우유', interval_days: 1 });
    const back = rowsToCards([{ ...row, ease: '2.50', reviewed_at: '2026-09-26T10:00:00+00:00' }]);
    expect(back['comida:우유']).toEqual(state);
  });
});

describe('dias de estudo: mergeStudyDays e daysToUpload', () => {
  it('fica o maior valor de cada campo, sem somar', () => {
    const local = { '2026-09-26': { minutes: 5, cards: 20, lessons: 0 } };
    const remote = {
      '2026-09-26': { minutes: 6, cards: 0, lessons: 1 },
      '2026-09-25': { minutes: 7, cards: 0, lessons: 1 },
    };
    const merged = mergeStudyDays(local, remote);
    expect(merged['2026-09-26']).toEqual({ minutes: 6, cards: 20, lessons: 1 });
    expect(daysToUpload(merged, remote)).toEqual(['2026-09-26']);
  });

  it('converte linhas do banco (minutes chega como texto)', () => {
    const rows = [{ day: '2026-09-26', minutes: '5.25', cards: 1, lessons: 0 }];
    expect(rowsToStudyDays(rows)).toEqual({
      '2026-09-26': { minutes: 5.25, cards: 1, lessons: 0 },
    });
    expect(studyDayToRow('u1', '2026-09-26', { minutes: 1, cards: 2, lessons: 3 })).toEqual({
      user_id: 'u1',
      day: '2026-09-26',
      minutes: 1,
      cards: 2,
      lessons: 3,
    });
  });

  it('meta diária: a da conta vence', () => {
    expect(mergeGoal(10, 30)).toBe(30);
    expect(mergeGoal(15, null)).toBe(15);
    expect(mergeGoal(null, undefined)).toBe(null);
  });
});
