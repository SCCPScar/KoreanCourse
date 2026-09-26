/**
 * Mapa do metrô: as 4 linhas do curso, cada uma com as suas estações.
 *
 * Cada estação mostra o estado: concluída (✓), aberta (pode começar),
 * bloqueada (conclua a anterior) ou "em breve" (ainda sem conteúdo).
 */
import { byId, el } from '../core/dom.js';
import { getCourseProgress, onCourseProgressChange } from '../core/course-progress.js';
import { getLevel, onLevelChange } from '../core/level.js';
import { LINES, stationsOfLine } from '../data/course.js';
import { lineStats, nextStation, stationState } from '../lib/course-progress.js';

const STATE_TEXT = {
  done: 'Concluída',
  open: 'Disponível',
  locked: 'Conclua a estação anterior',
  soon: 'Em breve',
};

function stationMeta(station, state, progress) {
  if (state === 'done') {
    const { correct, total } = progress.stations[station.id];
    return `✓ Concluída · ${correct}/${total} de primeira`;
  }
  if (state === 'open') return `${station.minutes} min · selo "${station.stamp.pt}"`;
  return STATE_TEXT[state];
}

function stationItem(station, progress, level, nextId) {
  const state = stationState(station, progress, level);
  const isNext = station.id === nextId;
  const content = [
    el('span', { className: 'station__dot', attrs: { 'aria-hidden': 'true' } }),
    el('span', { className: 'station__text' }, [
      el('span', { className: 'station__title', text: station.title }),
      el('span', { className: 'station__meta', text: stationMeta(station, state, progress) }),
    ]),
  ];
  const playable = state === 'open' || state === 'done';
  const body = playable
    ? el(
        'button',
        {
          className: 'station__btn',
          attrs: { type: 'button' },
          data: { action: 'open-station', station: station.id },
        },
        content,
      )
    : el('div', { className: 'station__btn', attrs: { 'aria-disabled': 'true' } }, content);

  return el('li', { className: `station station--${state}${isNext ? ' station--next' : ''}` }, [
    body,
  ]);
}

function lineCard(line, progress, level, nextId) {
  const stats = lineStats(line.id, progress);
  return el('article', { className: `line line--${line.number}` }, [
    el('header', { className: 'line__head' }, [
      el('span', {
        className: 'line__badge',
        text: String(line.number),
        attrs: { 'aria-hidden': 'true' },
      }),
      el('div', {}, [
        el('h2', { className: 'line__name', text: `Linha ${line.number} · ${line.name}` }),
        el('p', { className: 'line__meta', text: `${line.months} · ${line.tag}` }),
      ]),
    ]),
    el(
      'ol',
      { className: 'stations' },
      stationsOfLine(line.id).map((station) => stationItem(station, progress, level, nextId)),
    ),
    el('p', {
      className: 'line__goal',
      text: `Meta: ${line.goal} · ${stats.done} de ${stats.total} estações`,
    }),
  ]);
}

export function initMetroMap() {
  const container = byId('metro-lines');

  function render() {
    const progress = getCourseProgress();
    const level = getLevel();
    const nextId = nextStation(progress, level)?.id;
    container.replaceChildren(...LINES.map((line) => lineCard(line, progress, level, nextId)));
  }

  onCourseProgressChange(render);
  onLevelChange(render);
  render();
}
