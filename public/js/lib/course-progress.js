/**
 * Regras do percurso (lógica pura, sem DOM nem armazenamento).
 *
 * `progress` tem o formato salvo em core/course-progress.js:
 *   { stations: { [idDaEstação]: { completedAt, correct, total } } }
 *
 * Regras de desbloqueio:
 *  1. A primeira estação com conteúdo está sempre aberta.
 *  2. Uma estação abre quando a estação anterior (com conteúdo) foi concluída.
 *  3. Linhas ABAIXO do nível do aluno ficam abertas por inteiro — quem já
 *     sabe o básico não precisa refazer tudo para chegar ao que interessa.
 */
import { isWithinLevel } from '../core/level.js';
import { LINES, STATIONS, findLine, hasContent } from '../data/course.js';

export const isCompleted = (progress, stationId) => Boolean(progress?.stations?.[stationId]);

/** A linha está abaixo do nível do aluno (e não é o próprio nível)? */
function isLineBelowLevel(line, level) {
  return Boolean(level) && line.level !== level && isWithinLevel(line.level, level);
}

/** Estado de uma estação: 'done' | 'open' | 'locked' | 'soon'. */
export function stationState(station, progress, level, stations = STATIONS) {
  if (!hasContent(station)) return 'soon';
  if (isCompleted(progress, station.id)) return 'done';

  const playable = stations.filter(hasContent);
  const index = playable.indexOf(station);
  const previous = playable[index - 1];
  const line = findLine(station.line);

  if (index === 0 || isCompleted(progress, previous.id) || isLineBelowLevel(line, level)) {
    return 'open';
  }
  return 'locked';
}

/** Próxima estação a estudar: a primeira aberta e não concluída (ou null). */
export function nextStation(progress, level, stations = STATIONS) {
  return (
    stations.find((station) => stationState(station, progress, level, stations) === 'open') ?? null
  );
}

/** Quantas estações de uma linha estão concluídas. */
export function lineStats(lineId, progress, stations = STATIONS) {
  const ofLine = stations.filter((station) => station.line === lineId);
  const done = ofLine.filter((station) => isCompleted(progress, station.id)).length;
  return { done, total: ofLine.length };
}

/** Linha "atual" do aluno: a da próxima estação, ou a primeira se não houver. */
export function currentLine(progress, level, stations = STATIONS) {
  const next = nextStation(progress, level, stations);
  return findLine(next?.line) ?? LINES[0];
}
