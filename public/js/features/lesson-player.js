/**
 * Janela da lição: mostra os passos de uma estação, confere as respostas,
 * dá o retorno (certo/errado) e, no fim, o selo 참 잘했어요.
 *
 * A lógica (ordem dos passos, pontuação, respostas certas) vive em lib/lesson.js;
 * aqui só fica a parte visual. Fases da janela:
 *   intro → question → feedback → question → … → finish
 */
import { registerAction } from '../core/actions.js';
import { byId, el } from '../core/dom.js';
import { completeStation, getCourseProgress } from '../core/course-progress.js';
import { getLevel } from '../core/level.js';
import { speak } from '../core/speech.js';
import { findLine, findStation, stationsOfLine } from '../data/course.js';
import { nextStation } from '../lib/course-progress.js';
import {
  advance,
  correctAnswerText,
  createSession,
  currentItem,
  isCorrect,
  isExercise,
  isFinished,
  progressOf,
  scoreOf,
  shuffle,
} from '../lib/lesson.js';
import { audioButton } from './audio.js';

const PRAISES = ['정답! Muito bem.', '정답! Isso mesmo.', '잘했어요! Perfeito.'];

let ui;
let state;

/* ───────── Peças visuais ───────── */

function heading(text, lang) {
  return el('h2', {
    className: 'lesson__heading',
    text,
    lang,
    attrs: { id: 'lesson-heading', tabindex: '-1' },
  });
}

function bigKorean(ko) {
  return el('div', { className: 'lesson__ko-row' }, [
    el('span', { className: 'lesson__ko', text: ko, lang: 'ko' }),
    audioButton(ko),
  ]);
}

function setPrimary(label, enabled = true) {
  ui.primary.textContent = label;
  ui.primary.disabled = !enabled;
}

function setSelection(value) {
  state.selection = value;
  const empty = value === null || value === '' || (Array.isArray(value) && value.length === 0);
  ui.primary.disabled = empty;
}

/* ───────── Um desenho para cada tipo de passo ───────── */

function renderLearn(step) {
  const items = step.items.map((item) =>
    el('li', { className: 'lesson__item' }, [
      bigKorean(item.ko),
      el('span', { className: 'lesson__rom', text: item.rom }),
      el('span', { className: 'lesson__pt', text: item.pt }),
    ]),
  );
  setPrimary('Continuar');
  return [
    heading(step.title),
    el('p', { className: 'lesson__text', text: step.text }),
    el('ul', { className: 'lesson__items' }, items),
  ];
}

function renderChoice(step) {
  const parts = [heading(step.prompt)];
  if (step.listen) {
    const reveal = el('button', {
      className: 'lesson__reveal',
      text: 'Não consigo ouvir: mostrar o texto',
      attrs: { type: 'button' },
    });
    reveal.addEventListener('click', () => reveal.replaceWith(bigKorean(step.ko)));
    parts.push(
      el('div', { className: 'lesson__listen' }, [
        el('button', {
          className: 'btn btn--primary lesson__play',
          text: '🔊 Ouvir de novo',
          attrs: { type: 'button' },
          data: { action: 'speak', speak: step.ko },
        }),
        reveal,
      ]),
    );
    speak(step.ko);
  } else if (step.ko) {
    parts.push(bigKorean(step.ko));
  }

  const options = shuffle(step.options).map((option) =>
    el('button', {
      className: 'opt',
      text: option,
      lang: step.lang === 'ko' ? 'ko' : undefined,
      attrs: { type: 'button', 'aria-pressed': 'false' },
      data: { value: option },
    }),
  );
  const group = el(
    'div',
    {
      className: 'lesson__options',
      attrs: { role: 'group', 'aria-labelledby': 'lesson-heading' },
    },
    options,
  );
  group.addEventListener('click', (event) => {
    const option = event.target.closest('.opt');
    if (!option || state.phase !== 'question') return;
    options.forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
    setSelection(option.dataset.value);
  });
  parts.push(group);
  setPrimary('Verificar', false);
  return parts;
}

function renderBuild(step) {
  const answer = el('div', {
    className: 'build__answer',
    attrs: { 'aria-label': 'Sua resposta', role: 'group' },
  });
  const pool = el('div', {
    className: 'build__pool',
    attrs: { 'aria-label': 'Peças disponíveis', role: 'group' },
  });
  const chosen = () => [...answer.children].map((tile) => tile.dataset.value);

  shuffle([...step.tiles, ...step.extra]).forEach((text) => {
    const tile = el('button', {
      className: 'tile-btn',
      text,
      lang: 'ko',
      attrs: { type: 'button' },
      data: { value: text },
    });
    tile.addEventListener('click', () => {
      if (state.phase !== 'question') return;
      // Um clique leva a peça para a resposta; outro clique devolve.
      (tile.parentElement === pool ? answer : pool).append(tile);
      setSelection(chosen());
    });
    pool.append(tile);
  });

  setPrimary('Verificar', false);
  return [
    heading('Monte a frase em coreano'),
    el('p', { className: 'lesson__translate', text: `“${step.pt}”` }),
    answer,
    pool,
  ];
}

function renderRead(step) {
  const input = el('input', {
    className: 'field__input lesson__input',
    attrs: {
      id: 'lesson-input',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      inputmode: 'latin',
    },
  });
  input.addEventListener('input', () => setSelection(input.value.trim()));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !ui.primary.disabled) ui.primary.click();
  });
  setPrimary('Verificar', false);
  return [
    heading('Como se lê esta palavra?'),
    bigKorean(step.ko),
    el('label', { className: 'field', attrs: { for: 'lesson-input' } }, [
      el('span', { className: 'field__label', text: 'Escreva a romanização (ex.: annyeong)' }),
    ]),
    input,
  ];
}

const RENDERERS = {
  learn: renderLearn,
  choice: renderChoice,
  build: renderBuild,
  read: renderRead,
};

/* ───────── Fluxo da lição ───────── */

function updateMeter() {
  const percent = Math.round(progressOf(state.session) * 100);
  ui.meterFill.style.width = `${percent}%`;
  ui.meter.setAttribute('aria-valuenow', String(percent));
}

function focusHeading() {
  byId('lesson-heading').focus();
}

function renderIntro() {
  const { station } = state;
  const line = findLine(station.line);
  const position = stationsOfLine(line.id).indexOf(station) + 1;
  const exercises = station.steps.filter(isExercise).length;
  state.phase = 'intro';
  ui.feedback.hidden = true;
  ui.stage.replaceChildren(
    el('p', { className: 'lesson__eyebrow', text: `Linha ${line.number} · Estação ${position}` }),
    heading(station.title),
    el('div', { className: 'lesson__stamp-preview' }, [
      el('span', { className: 'seal seal--small', text: station.stamp.ko, lang: 'ko' }),
      el('p', {
        text: `${station.minutes} minutos · ${exercises} exercícios. No fim, você ganha o selo "${station.stamp.pt}" no Passaporte.`,
      }),
    ]),
  );
  setPrimary('Começar');
  focusHeading();
}

function renderCurrent() {
  const item = currentItem(state.session);
  state.phase = 'question';
  state.selection = null;
  ui.feedback.hidden = true;
  const label = item.retry
    ? [el('p', { className: 'lesson__eyebrow', text: 'Revisão: vamos tentar de novo' })]
    : [];
  ui.stage.replaceChildren(...label, ...RENDERERS[item.step.type](item.step));
  updateMeter();
  focusHeading();
}

function markChoice(step, chosen) {
  ui.stage.querySelectorAll('.opt').forEach((option) => {
    option.disabled = true;
    if (option.dataset.value === step.answer) option.classList.add('is-right');
    else if (option.dataset.value === chosen) option.classList.add('is-wrong');
  });
}

function feedbackDetail(step) {
  if (step.type === 'read') return `${step.ko} (${step.answers[0]}) = ${step.pt}`;
  if (step.type === 'build') return `${correctAnswerText(step)} = ${step.pt}`;
  return '';
}

function check() {
  const { step } = currentItem(state.session);
  const correct = isCorrect(step, state.selection);
  state.lastCorrect = correct;
  state.phase = 'feedback';

  if (step.type === 'choice') markChoice(step, state.selection);
  ui.stage.querySelectorAll('.tile-btn, .lesson__input').forEach((node) => {
    node.disabled = true;
  });

  const title = correct
    ? PRAISES[state.session.position % PRAISES.length]
    : `Quase! A resposta certa é: ${correctAnswerText(step)}`;
  const detail = correct ? feedbackDetail(step) : step.explain || feedbackDetail(step);
  ui.feedback.className = `lesson__feedback ${correct ? 'is-right' : 'is-wrong'}`;
  ui.feedback.replaceChildren(
    el('strong', { text: title }),
    detail ? el('p', { text: detail }) : '',
  );
  ui.feedback.hidden = false;
  setPrimary('Continuar');
  ui.primary.focus();
}

function next(correct = true) {
  state.session = advance(state.session, correct);
  if (isFinished(state.session)) renderFinish();
  else renderCurrent();
}

function renderFinish() {
  const { station } = state;
  const score = scoreOf(state.session);
  completeStation(station.id, score);
  state.phase = 'finish';
  state.next = nextStation(getCourseProgress(), getLevel());
  ui.feedback.hidden = true;
  updateMeter();

  const seal = el('div', { className: 'seal seal--big is-stamping', lang: 'ko' }, [
    el('span', { text: '참' }),
    el('span', { text: '잘했어요' }),
  ]);
  ui.stage.replaceChildren(
    heading('Estação concluída!'),
    el('div', { className: 'lesson__finish' }, [
      seal,
      el('p', {
        className: 'lesson__score',
        text: `Você acertou ${score.correct} de ${score.total} de primeira.`,
      }),
      el('p', { text: `Novo selo no Passaporte: ${station.stamp.pt} (${station.stamp.ko}).` }),
    ]),
  );
  setPrimary(state.next ? `Próxima: ${state.next.title}` : 'Ver o mapa');
  focusHeading();
}

function onPrimary() {
  if (state.phase === 'intro') {
    state.session = createSession(state.station.steps);
    renderCurrent();
  } else if (state.phase === 'feedback') {
    next(state.lastCorrect);
  } else if (state.phase === 'question') {
    if (isExercise(currentItem(state.session).step)) check();
    else next();
  } else if (state.phase === 'finish') {
    if (state.next) openLesson(state.next.id);
    else closeLesson();
  }
}

/* ───────── Abrir e fechar ───────── */

export function openLesson(stationId) {
  const station = findStation(stationId);
  if (!station?.steps) return;
  state = { station, session: createSession(station.steps), phase: 'intro', selection: null };
  ui.exit.hidden = true;
  updateMeter();
  if (!ui.dialog.open) ui.dialog.showModal();
  renderIntro();
}

function closeLesson() {
  ui.exit.hidden = true;
  ui.dialog.close();
}

/** Sair a meio da lição pede confirmação (o progresso da lição seria perdido). */
function requestClose() {
  if (state?.phase === 'question' || state?.phase === 'feedback') {
    ui.exit.hidden = false;
    ui.exit.querySelector('.btn--primary').focus();
  } else {
    closeLesson();
  }
}

export function initLessonPlayer() {
  ui = {
    dialog: byId('lesson-dialog'),
    stage: byId('lesson-stage'),
    feedback: byId('lesson-feedback'),
    primary: byId('lesson-primary'),
    meter: byId('lesson-meter'),
    meterFill: byId('lesson-meter-fill'),
    exit: byId('lesson-exit'),
  };
  ui.primary.addEventListener('click', onPrimary);
  // Esc dispara "cancel": em vez de fechar direto, pergunta.
  ui.dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestClose();
  });

  registerAction('lesson-close', requestClose);
  registerAction('lesson-exit-confirm', closeLesson);
  registerAction('lesson-exit-cancel', () => {
    ui.exit.hidden = true;
    ui.primary.focus();
  });
  registerAction('open-station', (button) => openLesson(button.dataset.station));
  // "Estudar agora" e "Próximo passo": abrem a próxima lição. Se não houver,
  // o link segue normalmente para o mapa.
  registerAction('open-next-station', (_link, event) => {
    const station = nextStation(getCourseProgress(), getLevel());
    if (!station) return;
    event.preventDefault();
    openLesson(station.id);
  });
}
