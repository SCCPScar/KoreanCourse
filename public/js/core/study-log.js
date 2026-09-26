/**
 * Diário de estudo: quanto o aluno estudou em cada dia.
 * Formato salvo: { 'AAAA-MM-DD': { minutes, cards, lessons } }.
 *
 * É daqui que saem o streak (lib/streak.js) e a meta diária.
 * Os minutos são uma ESTIMATIVA simples e previsível:
 *  - lição concluída = os minutos previstos da estação;
 *  - cartão revisto  = 15 segundos (20 cartões ≈ 5 minutos).
 */
import { dayKey } from '../lib/days.js';
import { readJSON, writeJSON } from './storage.js';

const STUDY_KEY = 'study-days';
const CHANGE_EVENT = 'haru:studychange';
export const MINUTES_PER_CARD = 0.25;

export function getStudyDays() {
  const days = readJSON(STUDY_KEY, {});
  return days && typeof days === 'object' && !Array.isArray(days) ? days : {};
}

/** Soma atividade ao dia de hoje. */
export function recordStudy({ minutes = 0, cards = 0, lessons = 0 }, now = new Date()) {
  const day = dayKey(now);
  const days = getStudyDays();
  const current = days[day] ?? { minutes: 0, cards: 0, lessons: 0 };
  days[day] = {
    minutes: Math.round((current.minutes + minutes) * 100) / 100,
    cards: current.cards + cards,
    lessons: current.lessons + lessons,
  };
  writeJSON(STUDY_KEY, days);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: day }));
}

/** Dias em que houve estudo (para o streak). */
export const studiedDayKeys = (days = getStudyDays()) =>
  Object.keys(days).filter((day) => days[day].minutes > 0);

/** Troca o diário inteiro (usado ao baixar os dados da conta). */
export function replaceStudyDays(days) {
  writeJSON(STUDY_KEY, days);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

export function onStudyChange(callback) {
  document.addEventListener(CHANGE_EVENT, callback);
}
