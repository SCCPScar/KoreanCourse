/**
 * Passaporte: a coleção de selos, um por estação concluída.
 * Os selos ainda não ganhos aparecem tracejados, para mostrar o que falta.
 */
import { byId, el } from '../core/dom.js';
import { getCourseProgress, onCourseProgressChange } from '../core/course-progress.js';
import { LINES, STATIONS, hasContent, stationsOfLine } from '../data/course.js';
import { isCompleted } from '../lib/course-progress.js';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });

function stamp(station, progress) {
  if (!isCompleted(progress, station.id)) {
    return el('li', { className: 'passport__item' }, [
      el('span', { className: 'seal seal--empty', attrs: { 'aria-hidden': 'true' } }),
      el('span', { className: 'passport__label', text: station.stamp.pt }),
      el('span', { className: 'visually-hidden', text: 'ainda não conquistado' }),
    ]);
  }
  const date = new Date(progress.stations[station.id].completedAt);
  return el('li', { className: 'passport__item' }, [
    el('span', { className: 'seal seal--small', text: station.stamp.ko, lang: 'ko' }),
    el('span', { className: 'passport__label', text: station.stamp.pt }),
    el('span', { className: 'passport__date', text: dateFormat.format(date) }),
  ]);
}

export function countStamps(progress = getCourseProgress()) {
  const withContent = STATIONS.filter(hasContent);
  return {
    earned: withContent.filter((station) => isCompleted(progress, station.id)).length,
    total: withContent.length,
  };
}

export function initPassport() {
  const container = byId('passport');
  const summary = byId('passport-summary');

  function render() {
    const progress = getCourseProgress();
    const { earned, total } = countStamps(progress);
    summary.textContent = `${earned} de ${total} selos conquistados.`;

    const pages = LINES.map((line) => {
      const stations = stationsOfLine(line.id).filter(hasContent);
      if (stations.length === 0) return '';
      return el('section', { className: 'passport__page' }, [
        el('h2', { className: 'passport__title', text: `Linha ${line.number} · ${line.name}` }),
        el(
          'ul',
          { className: 'passport__grid' },
          stations.map((station) => stamp(station, progress)),
        ),
      ]);
    });
    container.replaceChildren(...pages);
  }

  onCourseProgressChange(render);
  render();
}
