/**
 * Leitura rápida: quantas palavras em Hangul você lê em 60 segundos?
 *
 * Aparece uma palavra e quatro romanizações; um clique responde e já vem a
 * próxima. Há um modo "sem cronômetro" (20 palavras, no seu ritmo), porque
 * limite de tempo não pode ser obrigatório para ninguém (WCAG 2.2.1).
 * O recorde fica salvo neste navegador.
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';
import { getRecord, saveIfRecord } from '../core/game-records.js';
import { recordStudy } from '../core/study-log.js';
import { shuffle } from '../lib/lesson.js';
import { makeQuestion } from '../lib/quiz.js';
import {
  focusPracticeHeading,
  openPractice,
  practiceHeading,
  setPracticeProgress,
} from './practice-dialog.js';
import { practicePool } from './practice-pool.js';

const GAME = 'reading';
const SECONDS = 60;
const UNTIMED_WORDS = 20;
const WRONG_PAUSE_MS = 900;

let ui;
let state;

const primaryButton = (text, onClick) => {
  const button = el('button', {
    className: 'btn btn--primary lesson__primary',
    text,
    attrs: { type: 'button' },
  });
  button.addEventListener('click', onClick);
  return button;
};

function stopTimer() {
  clearInterval(state?.timer);
  clearTimeout(state?.pause);
}

function renderIntro() {
  const record = getRecord(GAME);
  const untimed = el('input', { attrs: { id: 'reading-untimed', type: 'checkbox' } });
  ui.stage.replaceChildren(
    practiceHeading('Leitura rápida'),
    el('p', {
      className: 'lesson__text',
      text: `Leia a palavra em Hangul e escolha a romanização certa. Você tem ${SECONDS} segundos: quantas consegue?`,
    }),
    el('p', {
      className: 'review__streak',
      text: record ? `Seu recorde: ${record} palavras` : 'Ainda sem recorde',
    }),
    el('label', { className: 'choice-inline', attrs: { for: 'reading-untimed' } }, [
      untimed,
      ` Sem cronômetro (${UNTIMED_WORDS} palavras, no seu ritmo)`,
    ]),
  );
  ui.footer.replaceChildren(primaryButton('Começar', () => start(untimed.checked)));
  focusPracticeHeading();
}

function start(untimed) {
  state = {
    ...state,
    untimed,
    queue: shuffle(practicePool()),
    score: 0,
    seen: 0,
    left: SECONDS,
    answered: false,
    finished: false,
  };
  if (!untimed) {
    state.timer = setInterval(tick, 1000);
  }
  renderRound();
}

function tick() {
  state.left -= 1;
  setPracticeProgress((SECONDS - state.left) / SECONDS);
  const clock = byId('reading-clock');
  if (clock) clock.textContent = `${state.left} s`;
  if (state.left <= 0) finish();
}

function renderRound() {
  if (state.queue.length === 0) state.queue = shuffle(practicePool());
  const word = state.queue.pop();
  const question = makeQuestion(word, practicePool(), 'ko-rom');
  state.question = question;
  state.answered = false;

  const options = question.options.map((option, index) =>
    el('button', {
      className: 'opt',
      text: option,
      attrs: { type: 'button', 'aria-keyshortcuts': String(index + 1) },
      data: { value: option },
    }),
  );
  const group = el(
    'div',
    {
      className: 'lesson__options',
      attrs: { role: 'group', 'aria-labelledby': 'practice-heading' },
    },
    options,
  );
  group.addEventListener('click', (event) => {
    const option = event.target.closest('.opt');
    if (option) answer(option.dataset.value);
  });

  const status = state.untimed
    ? `Palavra ${state.seen + 1} de ${UNTIMED_WORDS} · ${state.score} certas`
    : `${state.score} certas`;
  ui.stage.replaceChildren(
    el('div', { className: 'reading__bar' }, [
      el('p', { className: 'lesson__eyebrow', text: status }),
      state.untimed
        ? ''
        : el('p', {
            className: 'reading__clock',
            text: `${state.left} s`,
            attrs: { id: 'reading-clock', 'aria-hidden': 'true' },
          }),
    ]),
    practiceHeading('Como se lê?'),
    el('p', { className: 'reading__word', text: word.ko, lang: 'ko' }),
    group,
  );
  ui.footer.replaceChildren(
    el('p', { className: 'review__keys', text: 'Atalhos do teclado: 1 a 4 escolhem a opção' }),
  );
  if (state.untimed) setPracticeProgress(state.seen / UNTIMED_WORDS);
  options[0].focus();
}

function answer(value) {
  if (state.answered || state.finished) return;
  state.answered = true;
  state.seen += 1;
  const { question } = state;
  const correct = value === question.answer;
  if (correct) state.score += 1;

  ui.stage.querySelectorAll('.opt').forEach((option) => {
    option.disabled = true;
    if (option.dataset.value === question.answer) option.classList.add('is-right');
    else if (option.dataset.value === value) option.classList.add('is-wrong');
  });

  const next = () => {
    if (state.finished) return;
    if (state.untimed && state.seen >= UNTIMED_WORDS) finish();
    else renderRound();
  };
  // Acertou: segue logo. Errou: mostra a resposta certa por um instante.
  if (correct) next();
  else state.pause = setTimeout(next, WRONG_PAUSE_MS);
}

function finish() {
  if (state.finished) return;
  state.finished = true;
  stopTimer();
  setPracticeProgress(1);
  recordStudy({ minutes: 1 });

  const isRecord = !state.untimed && saveIfRecord(GAME, state.score);
  const text = state.untimed
    ? `Você leu ${state.score} de ${UNTIMED_WORDS} palavras certas.`
    : `Você leu ${state.score} ${state.score === 1 ? 'palavra' : 'palavras'} em ${SECONDS} segundos.`;
  ui.stage.replaceChildren(
    practiceHeading(state.untimed ? 'Fim de jogo!' : 'Tempo!'),
    el('div', { className: 'lesson__finish' }, [
      el('p', { className: 'lesson__score', text }),
      isRecord ? el('p', { className: 'review__streak', text: 'Novo recorde! 참 잘했어요!' }) : '',
    ]),
  );
  ui.footer.replaceChildren(primaryButton('Jogar de novo', renderIntro));
  focusPracticeHeading();
}

export function openReadingGame() {
  ui = openPractice({ game: GAME, label: 'Leitura rápida', onClose: stopTimer });
  state = { finished: false };
  renderIntro();
}

export function initReadingGame() {
  registerAction('open-reading', openReadingGame);
  byId('practice-dialog').addEventListener('keydown', (event) => {
    if (ui?.dialog.dataset.game !== GAME || !state?.question || state.answered) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const option = ui.stage.querySelectorAll('.opt')[Number(event.key) - 1];
    if (option) {
      event.preventDefault();
      answer(option.dataset.value);
    }
  });
}
