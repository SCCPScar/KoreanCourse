/**
 * "Dias seguidos" (streak) sem culpa.
 *
 * Regras:
 *  - Um dia conta quando o aluno estudou alguma coisa (lição ou revisão).
 *  - Hoje ainda não estudou? O streak NÃO some: ele fica "à espera" até o fim do dia.
 *  - Dia de descanso: UM dia sem estudo é perdoado, no máximo uma vez a cada
 *    7 dias. Dois dias seguidos sem estudo encerram o streak.
 *  - O número mostra os dias ESTUDADOS (dias de descanso não somam).
 *
 * Lógica pura: recebe a lista de dias estudados e o dia de hoje.
 */
import { addDays, daysBetween, weekdayOf } from './days.js';

export const REST_EVERY = 7;

/**
 * @param {Iterable<string>} studiedDays chaves 'AAAA-MM-DD' dos dias com estudo
 * @param {string} today
 * @returns {{ count: number, studiedToday: boolean, restDays: string[], restAvailable: boolean }}
 */
export function computeStreak(studiedDays, today) {
  const studied = new Set(studiedDays);
  const studiedToday = studied.has(today);
  const restDays = [];
  let count = 0;
  let cursor = studiedToday ? today : addDays(today, -1);

  for (;;) {
    if (studied.has(cursor)) {
      count += 1;
      cursor = addDays(cursor, -1);
      continue;
    }
    // Dia sem estudo: só é perdoado se o dia anterior teve estudo e se o
    // último descanso usado (mais recente) está a pelo menos 7 dias.
    const before = addDays(cursor, -1);
    const lastRest = restDays[restDays.length - 1];
    const restAllowed = !lastRest || daysBetween(cursor, lastRest) >= REST_EVERY;
    if (!studied.has(before) || !restAllowed) break;
    restDays.push(cursor);
    cursor = before;
  }

  const recentRest = restDays.find((day) => daysBetween(day, today) < REST_EVERY);
  return {
    count,
    studiedToday,
    restDays: count > 0 ? restDays : [],
    restAvailable: count === 0 || !recentRest,
  };
}

const WEEKDAYS = [
  ['D', 'domingo'],
  ['S', 'segunda-feira'],
  ['T', 'terça-feira'],
  ['Q', 'quarta-feira'],
  ['Q', 'quinta-feira'],
  ['S', 'sexta-feira'],
  ['S', 'sábado'],
];

/**
 * Os últimos 7 dias (hoje por último), para a fileira de bolinhas do Início.
 * state: 'studied' | 'rest' | 'today' (ainda sem estudo) | 'missed'
 */
export function lastSevenDays(studiedDays, today, restDays = []) {
  const studied = new Set(studiedDays);
  const rests = new Set(restDays);
  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(today, index - 6);
    const [short, name] = WEEKDAYS[weekdayOf(day)];
    let state = 'missed';
    if (studied.has(day)) state = 'studied';
    else if (rests.has(day)) state = 'rest';
    else if (day === today) state = 'today';
    return { day, short, name, state };
  });
}
