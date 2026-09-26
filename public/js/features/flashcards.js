/**
 * Janela de revisão com flashcards (repetição espaçada).
 *
 * Fluxo de cada cartão:
 *   frente (hangul) → "Mostrar resposta" → o cartão vira (450 ms) →
 *   verso (romanização + tradução) → o aluno diz como foi:
 *   Errei · Difícil · Bom · Fácil (ou as teclas 1 a 4).
 *
 * Cada resposta é salva NA HORA (fechar a janela no meio não perde nada).
 * "Errei" coloca o cartão de novo no fim da fila desta sessão (uma vez só).
 * A matemática dos intervalos vive em lib/srs.js; a fila, em lib/deck.js.
 */
import { registerAction } from '../core/actions.js';
import { getCardStates, saveCardState } from '../core/cards.js';
import { getCourseProgress } from '../core/course-progress.js';
import { getDailyGoal } from '../core/daily-goal.js';
import { byId, el } from '../core/dom.js';
import { getLearnedIds } from '../core/learned-words.js';
import { MINUTES_PER_CARD, getStudyDays, recordStudy, studiedDayKeys } from '../core/study-log.js';
import { STATIONS } from '../data/course.js';
import { WORDS } from '../data/vocabulary.js';
import { dayKey, daysBetween } from '../lib/days.js';
import { NEW_PER_DAY, buildDeck, dueQueue } from '../lib/deck.js';
import { GRADES, intervalLabel, previewIntervals, review } from '../lib/srs.js';
import { computeStreak } from '../lib/streak.js';
import { audioButton } from './audio.js';

const GRADE_LABELS = { again: 'Errei', hard: 'Difícil', good: 'Bom', easy: 'Fácil' };

let ui;
let state;

/** Baralho atual e a fila de hoje (usado também pelo Início). */
export function reviewSummary(today = dayKey()) {
  const deck = buildDeck({
    learnedIds: getLearnedIds(),
    completedStations: Object.keys(getCourseProgress().stations),
    words: WORDS,
    stations: STATIONS,
  });
  const states = getCardStates();
  return { deck, states, ...dueQueue(deck, states, today) };
}

/* ───────── Peças visuais ───────── */

function heading(text) {
  return el('h2', {
    className: 'lesson__heading',
    text,
    attrs: { id: 'review-heading', tabindex: '-1' },
  });
}

function updateMeter() {
  const total = state.done + state.queue.length;
  const percent = total === 0 ? 100 : Math.round((state.done / total) * 100);
  ui.meterFill.style.width = `${percent}%`;
  ui.meter.setAttribute('aria-valuenow', String(percent));
}

function flashcard(card) {
  return el('div', { className: 'flashcard', data: { flipped: 'false' } }, [
    el('div', { className: 'flashcard__inner' }, [
      el('div', { className: 'flashcard__face flashcard__front' }, [
        el('span', { className: 'flashcard__ko', text: card.ko, lang: 'ko' }),
        el('span', { className: 'flashcard__hint', text: 'O que significa?' }),
      ]),
      el(
        'div',
        {
          className: 'flashcard__face flashcard__back',
          attrs: { id: 'review-answer', tabindex: '-1', 'aria-hidden': 'true' },
        },
        [
          el('span', {
            className: 'flashcard__ko flashcard__ko--small',
            text: card.ko,
            lang: 'ko',
          }),
          el('span', { className: 'flashcard__rom', text: card.rom }),
          el('span', { className: 'flashcard__pt', text: card.pt }),
        ],
      ),
    ]),
  ]);
}

/* ───────── Fases ───────── */

function renderCard() {
  const item = state.queue[0];
  const isNew = !getCardStates()[item.card.id];
  const position = state.done + 1;
  const total = state.done + state.queue.length;
  state.phase = 'front';

  const labels = [`Cartão ${position} de ${total}`];
  if (item.retry) labels.push('de novo');
  else if (isNew) labels.push('novo');

  const card = flashcard(item.card);
  card.addEventListener('click', () => {
    if (state.phase === 'front') flip();
  });
  ui.stage.replaceChildren(
    el('p', { className: 'lesson__eyebrow', text: labels.join(' · ') }),
    heading('Você lembra desta palavra?'),
    card,
    el('div', { className: 'review__audio' }, [audioButton(item.card.ko)]),
  );

  const show = el('button', {
    className: 'btn btn--primary lesson__primary',
    text: 'Mostrar resposta',
    attrs: { type: 'button' },
  });
  show.addEventListener('click', flip);
  ui.footer.replaceChildren(show);
  updateMeter();
  show.focus();
}

function flip() {
  const item = state.queue[0];
  state.phase = 'back';
  const card = ui.stage.querySelector('.flashcard');
  card.dataset.flipped = 'true';
  card.querySelector('.flashcard__front').setAttribute('aria-hidden', 'true');
  const answer = byId('review-answer');
  answer.removeAttribute('aria-hidden');

  const intervals = previewIntervals(getCardStates()[item.card.id] ?? null, state.today);
  const buttons = GRADES.map((grade, index) =>
    el(
      'button',
      {
        className: `btn grade grade--${grade}`,
        attrs: {
          type: 'button',
          'aria-keyshortcuts': String(index + 1),
          'aria-label': `${GRADE_LABELS[grade]}: volta ${intervalLabel(intervals[grade])}`,
        },
        data: { grade },
      },
      [
        el('span', { className: 'grade__label', text: GRADE_LABELS[grade] }),
        el('span', { className: 'grade__when', text: intervalLabel(intervals[grade]) }),
      ],
    ),
  );
  const group = el(
    'div',
    { className: 'grades', attrs: { role: 'group', 'aria-label': 'Como foi?' } },
    buttons,
  );
  group.addEventListener('click', (event) => {
    const button = event.target.closest('[data-grade]');
    if (button) answerWith(button.dataset.grade);
  });
  ui.footer.replaceChildren(
    group,
    el('p', {
      className: 'review__keys',
      text: 'Atalhos do teclado: 1 Errei · 2 Difícil · 3 Bom · 4 Fácil',
    }),
  );
  // O leitor de tela lê a resposta; depois, Tab leva aos botões.
  answer.focus();
}

function answerWith(grade) {
  if (state.phase !== 'back') return;
  const item = state.queue.shift();
  const previous = getCardStates()[item.card.id] ?? null;
  saveCardState(item.card.id, review(previous, grade, state.today));
  recordStudy({ minutes: MINUTES_PER_CARD, cards: 1 });

  if (grade === 'again' && !item.retry) {
    state.queue.push({ card: item.card, retry: true });
  } else {
    state.done += 1;
  }
  if (!item.retry) {
    state.reviewed += 1;
    if (grade !== 'again') state.firstTry += 1;
  }

  if (state.queue.length > 0) renderCard();
  else renderFinish();
}

function goalLine(today) {
  const goal = getDailyGoal();
  const minutes = Math.floor(getStudyDays()[today]?.minutes ?? 0);
  return minutes >= goal
    ? `Meta de hoje cumprida: ${minutes} de ${goal} minutos. 참 잘했어요!`
    : `Meta de hoje: ${minutes} de ${goal} minutos.`;
}

function renderFinish() {
  state.phase = 'finish';
  updateMeter();
  const streak = computeStreak(studiedDayKeys(), state.today);
  const more = reviewSummary(state.today).cards.length;

  ui.stage.replaceChildren(
    heading('Revisão concluída!'),
    el('div', { className: 'lesson__finish' }, [
      el('p', {
        className: 'lesson__score',
        text: `Você revisou ${state.reviewed} ${state.reviewed === 1 ? 'cartão' : 'cartões'} e lembrou de ${state.firstTry} de primeira.`,
      }),
      el('p', {
        className: 'review__streak',
        text: `Dias seguidos: ${streak.count}`,
      }),
      el('p', { text: goalLine(state.today) }),
    ]),
  );

  const primary = el('button', {
    className: 'btn btn--primary lesson__primary',
    text: more > 0 ? `Mais uma rodada (${more})` : 'Fechar',
    attrs: { type: 'button' },
  });
  primary.addEventListener('click', () => (more > 0 ? openReview() : closeReview()));
  ui.footer.replaceChildren(primary);
  byId('review-heading').focus();
}

function renderEmpty({ deck, states }) {
  state.phase = 'empty';
  updateMeter();
  const nextDue = deck
    .map((card) => states[card.id]?.due)
    .filter(Boolean)
    .sort()[0];
  const hasNew = deck.some((card) => !states[card.id]);
  let text;
  if (deck.length === 0) {
    text =
      'Os cartões nascem do que você já estudou: conclua uma estação do Percurso ou marque palavras como aprendidas no Vocabulário.';
  } else if (hasNew || !nextDue) {
    text = `Você já começou ${NEW_PER_DAY} cartões novos hoje, que é o limite para não sobrecarregar a memória. Os próximos chegam amanhã.`;
  } else {
    const wait = daysBetween(state.today, nextDue);
    text = `Você está em dia! A próxima revisão chega ${wait <= 1 ? 'amanhã' : `em ${intervalLabel(wait)}`}.`;
  }
  ui.stage.replaceChildren(
    heading('Nenhum cartão por agora'),
    el('p', { className: 'lesson__text', text }),
  );
  const close = el('button', {
    className: 'btn btn--primary lesson__primary',
    text: 'Fechar',
    attrs: { type: 'button' },
  });
  close.addEventListener('click', closeReview);
  ui.footer.replaceChildren(close);
  byId('review-heading').focus();
}

/* ───────── Abrir e fechar ───────── */

export function openReview() {
  const today = dayKey();
  const summary = reviewSummary(today);
  state = {
    today,
    queue: summary.cards.map((card) => ({ card, retry: false })),
    done: 0,
    reviewed: 0,
    firstTry: 0,
    phase: 'front',
  };
  if (!ui.dialog.open) ui.dialog.showModal();
  if (state.queue.length === 0) renderEmpty(summary);
  else renderCard();
}

function closeReview() {
  ui.dialog.close();
}

export function initFlashcards() {
  ui = {
    dialog: byId('review-dialog'),
    stage: byId('review-stage'),
    footer: byId('review-footer'),
    meter: byId('review-meter'),
    meterFill: byId('review-meter-fill'),
  };
  registerAction('open-review', openReview);
  registerAction('review-close', closeReview);

  // Teclas 1 a 4 respondem quando o verso está à mostra.
  ui.dialog.addEventListener('keydown', (event) => {
    if (state?.phase !== 'back' || event.altKey || event.ctrlKey || event.metaKey) return;
    const grade = GRADES[Number(event.key) - 1];
    if (grade) {
      event.preventDefault();
      answerWith(grade);
    }
  });
}
