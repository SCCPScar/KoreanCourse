/**
 * Início em grade de cartões ("bento"): responde logo a "o que faço hoje?".
 *
 * Só mostra dados reais: a próxima estação do percurso, a linha atual,
 * os selos do passaporte, a palavra do dia, o vocabulário aprendido e uma
 * curiosidade cultural.
 */
import { byId, el } from '../core/dom.js';
import { getCourseProgress, onCourseProgressChange } from '../core/course-progress.js';
import { getLevel, isWithinLevel, onLevelChange } from '../core/level.js';
import { findLine, stationsOfLine } from '../data/course.js';
import { FACTS } from '../data/facts.js';
import { GRAMMAR } from '../data/grammar.js';
import { WORDS } from '../data/vocabulary.js';
import { currentLine, isCompleted, lineStats, nextStation } from '../lib/course-progress.js';
import { pickDaily } from '../lib/daily.js';
import { audioButton } from './audio.js';
import { countStamps } from './passport.js';
import { getLearnedIds } from './vocabulary.js';

function renderFact(container, parts) {
  const nodes = parts.map((part) =>
    typeof part === 'string' ? part : el('span', { text: part.ko, lang: 'ko' }),
  );
  container.replaceChildren(...nodes);
}

/** Cartão "Próximo passo": a próxima estação, ou o mapa se tudo estiver feito. */
function renderNext(ui, progress, level) {
  const station = nextStation(progress, level);
  if (!station) {
    ui.label.textContent = 'Percurso em dia';
    ui.title.textContent = 'Todas as estações disponíveis concluídas!';
    ui.text.textContent = 'Novas estações chegam em breve. Enquanto isso, revise o vocabulário.';
    ui.link.textContent = 'Ver o mapa';
    return;
  }
  const line = findLine(station.line);
  const position = stationsOfLine(line.id).indexOf(station) + 1;
  ui.label.textContent = `Próximo passo · Linha ${line.number} · Estação ${position}`;
  ui.title.textContent = station.title;
  ui.text.textContent = `${station.minutes} minutos. No fim, você ganha o selo "${station.stamp.pt}".`;
  ui.link.textContent = 'Começar lição';
}

/** Cartão da linha atual: uma bolinha por estação (cheia = concluída). */
function renderLine(ui, progress, level) {
  const line = currentLine(progress, level);
  const next = nextStation(progress, level);
  const stations = stationsOfLine(line.id);
  const stats = lineStats(line.id, progress);
  ui.name.textContent = `Linha ${line.number} · ${line.name}`;
  ui.dots.replaceChildren(
    ...stations.map((station) => {
      const done = isCompleted(progress, station.id);
      const now = station.id === next?.id;
      const label = `${station.title}: ${done ? 'concluída' : now ? 'próxima' : 'a fazer'}`;
      return el('li', {
        className: done ? 'dots__dot is-done' : now ? 'dots__dot is-now' : 'dots__dot',
        attrs: { 'aria-label': label },
      });
    }),
  );
  ui.count.textContent = `${stats.done} de ${stats.total} estações · meta: ${line.goal}`;
}

export function initHome() {
  const next = {
    label: byId('home-next-label'),
    title: byId('home-next-title'),
    text: byId('home-next-text'),
    link: byId('home-next-link'),
  };
  const line = {
    name: byId('home-line-name'),
    dots: byId('home-line-dots'),
    count: byId('home-line-count'),
  };
  const word = {
    ko: byId('home-word-ko'),
    rom: byId('home-word-rom'),
    pt: byId('home-word-pt'),
    audio: byId('home-word-audio'),
  };
  const vocab = {
    count: byId('home-progress-count'),
    meter: byId('home-progress-meter'),
    fill: byId('home-progress-fill'),
  };
  const stamps = byId('home-stamps');
  const grammarCount = byId('home-grammar-count');
  const fact = byId('home-fact');

  function render() {
    const level = getLevel();
    const progress = getCourseProgress();
    renderNext(next, progress, level);
    renderLine(line, progress, level);

    const { earned, total } = countStamps(progress);
    stamps.textContent = `${earned} de ${total} selos`;

    const wordsAtLevel = WORDS.filter((item) => isWithinLevel(item.level, level));
    const learned = getLearnedIds();
    const learnedAtLevel = wordsAtLevel.filter((item) => learned.has(item.id)).length;
    const percent = Math.round((learnedAtLevel / wordsAtLevel.length) * 100);
    vocab.count.textContent = `${learnedAtLevel} de ${wordsAtLevel.length}`;
    vocab.meter.setAttribute('aria-valuenow', String(percent));
    vocab.fill.style.width = `${percent}%`;

    const daily = pickDaily(wordsAtLevel);
    word.ko.textContent = daily.ko;
    word.rom.textContent = daily.rom;
    word.pt.textContent = daily.pt;
    word.audio.replaceChildren(audioButton(daily.ko));

    grammarCount.textContent = String(
      GRAMMAR.filter((point) => isWithinLevel(point.level, level)).length,
    );
    renderFact(fact, pickDaily(FACTS));
  }

  onLevelChange(render);
  onCourseProgressChange(render);
  render();
  // O vocabulário muda em outra seção: redesenha sempre que o Início é aberto.
  return render;
}
