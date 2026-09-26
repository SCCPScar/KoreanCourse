/**
 * Quiz relâmpago: 10 perguntas de vocabulário do nível do aluno.
 *
 * Cada pergunta é respondida com um clique (ou as teclas 1 a 4), sem botão
 * "Verificar": o retorno aparece na hora e o "combo" conta os acertos seguidos.
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';
import { speak } from '../core/speech.js';
import { recordStudy } from '../core/study-log.js';
import { buildQuiz, quizScore } from '../lib/quiz.js';
import { audioButton } from './audio.js';
import {
  focusPracticeHeading,
  openPractice,
  practiceHeading,
  setPracticeProgress,
} from './practice-dialog.js';
import { practicePool } from './practice-pool.js';

const QUIZ_SIZE = 10;
const QUIZ_MINUTES = 2;

const PROMPTS = {
  'ko-pt': 'O que significa?',
  'pt-ko': 'Como se diz em coreano?',
  listen: 'Ouça e escolha o significado',
};

let ui;
let state;

function questionBody(question) {
  const { word, kind } = question;
  if (kind === 'pt-ko') return el('p', { className: 'quiz__prompt', text: `“${word.pt}”` });
  if (kind === 'listen') {
    speak(word.ko);
    return el('div', { className: 'lesson__listen' }, [
      el('button', {
        className: 'btn btn--primary lesson__play',
        text: '🔊 Ouvir de novo',
        attrs: { type: 'button' },
        data: { action: 'speak', speak: word.ko },
      }),
    ]);
  }
  return el('div', { className: 'lesson__ko-row' }, [
    el('span', { className: 'lesson__ko', text: word.ko, lang: 'ko' }),
    audioButton(word.ko),
  ]);
}

function renderQuestion() {
  const question = state.questions[state.index];
  state.answered = false;
  const combo = state.combo >= 2 ? ` · combo ${state.combo}` : '';

  const options = question.options.map((option, index) =>
    el('button', {
      className: 'opt',
      text: option,
      lang: question.kind === 'pt-ko' ? 'ko' : undefined,
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

  ui.stage.replaceChildren(
    el('p', {
      className: 'lesson__eyebrow',
      text: `Pergunta ${state.index + 1} de ${state.questions.length}${combo}`,
    }),
    practiceHeading(PROMPTS[question.kind]),
    questionBody(question),
    group,
  );
  ui.footer.replaceChildren(
    el('p', { className: 'review__keys', text: 'Atalhos do teclado: 1 a 4 escolhem a opção' }),
  );
  setPracticeProgress(state.index / state.questions.length);
  focusPracticeHeading();
}

function answer(value) {
  if (state.answered) return;
  state.answered = true;
  const question = state.questions[state.index];
  const correct = value === question.answer;
  state.results.push(correct);
  state.combo = correct ? state.combo + 1 : 0;

  ui.stage.querySelectorAll('.opt').forEach((option) => {
    option.disabled = true;
    if (option.dataset.value === question.answer) option.classList.add('is-right');
    else if (option.dataset.value === value) option.classList.add('is-wrong');
  });

  const { word } = question;
  const feedback = el(
    'div',
    {
      className: `lesson__feedback ${correct ? 'is-right' : 'is-wrong'}`,
      attrs: { role: 'status' },
    },
    [
      el('strong', {
        text: correct ? '정답! Muito bem.' : `A resposta certa é: ${question.answer}`,
      }),
      el('p', { text: `${word.ko} (${word.rom}) = ${word.pt}` }),
    ],
  );
  const next = el('button', {
    className: 'btn btn--primary lesson__primary',
    text: state.index + 1 < state.questions.length ? 'Próxima' : 'Ver resultado',
    attrs: { type: 'button' },
  });
  next.addEventListener('click', () => {
    state.index += 1;
    if (state.index < state.questions.length) renderQuestion();
    else renderFinish();
  });
  ui.footer.replaceChildren(feedback, next);
  next.focus();
}

function renderFinish() {
  const score = quizScore(state.results);
  recordStudy({ minutes: QUIZ_MINUTES });
  setPracticeProgress(1);
  state.finished = true;

  const again = el('button', {
    className: 'btn btn--primary lesson__primary',
    text: 'Jogar de novo',
    attrs: { type: 'button' },
  });
  again.addEventListener('click', openQuiz);
  ui.stage.replaceChildren(
    practiceHeading('Quiz concluído!'),
    el('div', { className: 'lesson__finish' }, [
      el('p', {
        className: 'lesson__score',
        text: `Você acertou ${score.correct} de ${score.total}.`,
      }),
      el('p', { className: 'review__streak', text: `Maior combo: ${score.bestCombo}` }),
      el('p', {
        text:
          score.correct === score.total
            ? '참 잘했어요! Perfeito.'
            : 'As palavras que você errou valem ser marcadas no Vocabulário para entrar nas revisões.',
      }),
    ]),
  );
  ui.footer.replaceChildren(again);
  focusPracticeHeading();
}

export function openQuiz() {
  ui = openPractice({ game: 'quiz', label: 'Quiz relâmpago' });
  state = {
    questions: buildQuiz(practicePool(), { count: QUIZ_SIZE }),
    index: 0,
    results: [],
    combo: 0,
    answered: false,
    finished: false,
  };
  renderQuestion();
}

export function initQuiz() {
  registerAction('open-quiz', openQuiz);
  // Teclas 1 a 4 escolhem a opção, enquanto a pergunta está aberta.
  byId('practice-dialog').addEventListener('keydown', (event) => {
    if (!state || state.answered || state.finished || ui?.dialog.dataset.game !== 'quiz') return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const option = ui.stage.querySelectorAll('.opt')[Number(event.key) - 1];
    if (option) {
      event.preventDefault();
      answer(option.dataset.value);
    }
  });
}
