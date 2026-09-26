/**
 * Início em grade de cartões ("bento"): responde logo a "o que faço hoje?".
 *
 * Só mostra dados reais: a próxima estação do percurso, os dias seguidos e a
 * meta de hoje, as revisões à espera, a linha atual, os selos do passaporte,
 * a palavra do dia, o vocabulário aprendido e uma curiosidade cultural.
 */
import { onCardsChange } from '../core/cards.js';
import { byId, el } from '../core/dom.js';
import { getCourseProgress, onCourseProgressChange } from '../core/course-progress.js';
import { getDailyGoal, onDailyGoalChange } from '../core/daily-goal.js';
import { getLearnedIds, onLearnedWordsChange } from '../core/learned-words.js';
import { getLevel, isWithinLevel, onLevelChange } from '../core/level.js';
import { getStudyDays, onStudyChange, studiedDayKeys } from '../core/study-log.js';
import { findLine, stationsOfLine } from '../data/course.js';
import { FACTS } from '../data/facts.js';
import { GRAMMAR } from '../data/grammar.js';
import { WORDS } from '../data/vocabulary.js';
import { currentLine, isCompleted, lineStats, nextStation } from '../lib/course-progress.js';
import { pickDaily } from '../lib/daily.js';
import { dayKey } from '../lib/days.js';
import { computeStreak, lastSevenDays } from '../lib/streak.js';
import { audioButton } from './audio.js';
import { reviewSummary } from './flashcards.js';
import { countStamps } from './passport.js';

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

const plural = (count, one, many) => `${count} ${count === 1 ? one : many}`;

const WEEK_STATE_TEXT = {
  studied: 'estudou',
  rest: 'dia de descanso',
  today: 'hoje, ainda sem estudo',
  missed: 'sem estudo',
};

/** Cartão "Dias seguidos": número, os últimos 7 dias e a meta de hoje. */
function renderStreak(ui, today) {
  const days = getStudyDays();
  const studied = studiedDayKeys(days);
  const streak = computeStreak(studied, today);
  ui.count.textContent = plural(streak.count, 'dia', 'dias');
  ui.week.replaceChildren(
    ...lastSevenDays(studied, today, streak.restDays).map((day) =>
      el('li', {
        className: `week__day is-${day.state}`,
        text: day.short,
        attrs: { 'aria-label': `${day.name}: ${WEEK_STATE_TEXT[day.state]}` },
      }),
    ),
  );

  let note;
  if (streak.studiedToday) note = 'Hoje já conta. Até amanhã!';
  else if (streak.count > 0) note = 'Estude hoje para somar mais um dia.';
  else note = 'Uma lição ou uma revisão hoje começa a sequência.';
  if (streak.count > 0) {
    note += streak.restAvailable
      ? ' Você tem 1 dia de descanso nesta semana.'
      : ' O descanso desta semana já foi usado.';
  }
  ui.note.textContent = note;

  const goal = getDailyGoal();
  const minutes = Math.floor(days[today]?.minutes ?? 0);
  const percent = Math.min(100, Math.round((minutes / goal) * 100));
  ui.goalMeter.setAttribute('aria-valuenow', String(percent));
  ui.goalFill.style.width = `${percent}%`;
  ui.goalText.textContent =
    minutes >= goal
      ? `Meta de hoje cumprida: ${minutes} de ${goal} min ✓`
      : `Meta de hoje: ${minutes} de ${goal} min`;
}

/** Cartão "Revisões": quantos flashcards esperam o aluno hoje. */
function renderReviews(ui, today) {
  const { deck, dueCount, newCount } = reviewSummary(today);
  const waiting = dueCount + newCount;
  ui.count.textContent = plural(waiting, 'cartão', 'cartões');
  if (deck.length === 0) {
    ui.text.textContent = 'Os cartões aparecem quando você conclui estações ou aprende palavras.';
  } else if (waiting === 0) {
    ui.text.textContent = 'Tudo revisado por hoje.';
  } else {
    ui.text.textContent = `${waiting === 1 ? 'Está' : 'Estão'} à sua espera: ${dueCount} para rever e ${newCount} ${newCount === 1 ? 'novo' : 'novos'}.`;
  }
}

export function initHome() {
  const streak = {
    count: byId('home-streak-count'),
    week: byId('home-streak-week'),
    note: byId('home-streak-note'),
    goalMeter: byId('home-goal-meter'),
    goalFill: byId('home-goal-fill'),
    goalText: byId('home-goal-text'),
  };
  const reviews = {
    count: byId('home-review-count'),
    text: byId('home-review-text'),
  };
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
    const today = dayKey();
    renderNext(next, progress, level);
    renderStreak(streak, today);
    renderReviews(reviews, today);
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
  onLearnedWordsChange(render);
  onCardsChange(render);
  onStudyChange(render);
  onDailyGoalChange(render);
  render();
  // O vocabulário muda em outra seção: redesenha sempre que o Início é aberto.
  return render;
}
