import { describe, expect, it } from 'vitest';
import {
  mergeLevel,
  mergeStations,
  mergeWords,
  pickBetterRecord,
  rowsToStations,
  stationToRow,
  stationsToUpload,
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
