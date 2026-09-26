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
 *  4. A primeira estação da linha do NÍVEL do aluno também abre: quem escolheu
 *     "Intermédio" começa direto na Linha 3.
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
  const startsOwnLine = previous?.line !== station.line && line?.level === level;

  if (
    index === 0 ||
    isCompleted(progress, previous.id) ||
    isLineBelowLevel(line, level) ||
    startsOwnLine
  ) {
    return 'open';
  }
  return 'locked';
}

/**
 * Próxima estação a estudar (ou null): a primeira aberta e não concluída,
 * dando preferência às linhas do nível do aluno para cima (as de baixo são revisão).
 */
export function nextStation(progress, level, stations = STATIONS) {
  const open = stations.filter(
    (station) => stationState(station, progress, level, stations) === 'open',
  );
  const atLevel = open.find((station) => !isLineBelowLevel(findLine(station.line), level));
  return atLevel ?? open[0] ?? null;
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
