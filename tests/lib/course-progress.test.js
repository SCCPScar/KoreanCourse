import { describe, expect, it } from 'vitest';
import { lineStats, nextStation, stationState } from '../../public/js/lib/course-progress.js';

const stations = [
  { id: 'a1', line: 'l1', steps: [{}] },
  { id: 'a2', line: 'l1', steps: [{}] },
  { id: 'b1', line: 'l2', steps: [{}] },
  { id: 'b2', line: 'l2' }, // sem conteúdo
];
const done = (...ids) => ({
  stations: Object.fromEntries(ids.map((id) => [id, { correct: 1, total: 1 }])),
});

describe('stationState', () => {
  it('abre só a primeira estação no começo', () => {
    const empty = { stations: {} };
    expect(stationState(stations[0], empty, 'zero', stations)).toBe('open');
    expect(stationState(stations[1], empty, 'zero', stations)).toBe('locked');
  });

  it('abre a seguinte quando a anterior é concluída', () => {
    expect(stationState(stations[0], done('a1'), 'zero', stations)).toBe('done');
    expect(stationState(stations[1], done('a1'), 'zero', stations)).toBe('open');
  });

  it('estações sem conteúdo aparecem como "em breve"', () => {
    expect(stationState(stations[3], done('a1', 'a2', 'b1'), 'zero', stations)).toBe('soon');
  });

  it('linhas abaixo do nível do aluno ficam abertas', () => {
    const empty = { stations: {} };
    expect(stationState(stations[1], empty, 'basico', stations)).toBe('open');
    expect(stationState(stations[2], empty, 'basico', stations)).toBe('locked');
  });
});

describe('nextStation e lineStats', () => {
  it('sugere a primeira estação aberta e não concluída', () => {
    expect(nextStation(done('a1'), 'zero', stations).id).toBe('a2');
    expect(nextStation(done('a1', 'a2', 'b1'), 'zero', stations)).toBeNull();
  });

  it('conta as estações concluídas da linha', () => {
    expect(lineStats('l1', done('a1'), stations)).toEqual({ done: 1, total: 2 });
  });
});
