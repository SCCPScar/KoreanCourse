/**
 * Repetição espaçada (SRS) com o algoritmo SM-2, na variação usada pelo Anki.
 *
 * A ideia: cada cartão volta um pouco ANTES de você o esquecer. Se você lembra
 * bem, o intervalo cresce (1 dia → 3 → 8 → 20…); se erra, ele volta amanhã.
 *
 * Estado de um cartão:
 *   reps      quantas revisões certas seguidas
 *   interval  dias até a próxima revisão
 *   ease      "facilidade": multiplica o intervalo (começa em 2,5; mínimo 1,3)
 *   due       dia da próxima revisão ('AAAA-MM-DD')
 *   lapses    quantas vezes você esqueceu o cartão
 *   added     dia da primeira revisão (para limitar cartões novos por dia)
 *   reviewedAt data/hora da última revisão (para juntar dois aparelhos)
 *
 * Lógica pura, sem DOM nem armazenamento: por isso é testada à parte.
 */
import { addDays } from './days.js';

/** Os quatro botões de resposta, na ordem em que aparecem. */
export const GRADES = ['again', 'hard', 'good', 'easy'];

export const START_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_EASE = 5;
export const MAX_INTERVAL = 365;

const clampEase = (ease) => Math.round(Math.min(MAX_EASE, Math.max(MIN_EASE, ease)) * 100) / 100;
const clampInterval = (days) => Math.min(MAX_INTERVAL, Math.max(1, Math.round(days)));

/** Próximo intervalo (em dias) e nova facilidade para uma resposta. */
function nextStep({ reps, interval, ease }, grade) {
  switch (grade) {
    case 'again':
      return { reps: 0, interval: 1, ease: ease - 0.2 };
    case 'hard':
      return {
        reps: reps + 1,
        interval: reps === 0 ? 1 : Math.max(interval + 1, interval * 1.2),
        ease: ease - 0.15,
      };
    case 'good':
      return {
        reps: reps + 1,
        interval: reps === 0 ? 1 : reps === 1 ? 3 : Math.max(interval + 1, interval * ease),
        ease,
      };
    case 'easy':
      return {
        reps: reps + 1,
        interval: reps === 0 ? 3 : reps === 1 ? 6 : Math.max(interval + 1, interval * ease * 1.3),
        ease: ease + 0.15,
      };
    default:
      throw new Error(`Resposta desconhecida: ${grade}`);
  }
}

/**
 * Aplica uma resposta a um cartão e devolve o NOVO estado (não altera o antigo).
 * `state` pode ser null (cartão novo, nunca revisto).
 */
export function review(state, grade, today, now = new Date()) {
  const current = state ?? { reps: 0, interval: 0, ease: START_EASE, lapses: 0, added: today };
  const step = nextStep(current, grade);
  const interval = clampInterval(step.interval);
  return {
    reps: step.reps,
    interval,
    ease: clampEase(step.ease),
    due: addDays(today, interval),
    lapses: current.lapses + (grade === 'again' && state ? 1 : 0),
    added: current.added ?? today,
    reviewedAt: now.toISOString(),
  };
}

/** Intervalo que cada botão daria (para mostrar "Bom · 3 dias" no botão). */
export function previewIntervals(state, today) {
  return Object.fromEntries(GRADES.map((grade) => [grade, review(state, grade, today).interval]));
}

/** Texto curto de um intervalo: "amanhã", "3 dias", "2 meses", "1 ano". */
export function intervalLabel(days) {
  if (days <= 1) return 'amanhã';
  if (days < 30) return `${days} dias`;
  if (days < MAX_INTERVAL) {
    const months = Math.round(days / 30);
    return months === 1 ? '1 mês' : `${months} meses`;
  }
  return '1 ano';
}

/** O cartão precisa ser revisto hoje? */
export const isDue = (state, today) => Boolean(state) && state.due <= today;
