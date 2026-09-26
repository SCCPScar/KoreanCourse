/**
 * Datas como "chave do dia" no formato 'AAAA-MM-DD', no fuso LOCAL do aluno.
 *
 * Por que texto e não Date? Para o streak e as revisões só importa o DIA,
 * não a hora. Uma string como '2026-09-26' compara bem ('2026-09-25' < '2026-09-26'),
 * vira chave de objeto e vai direto para uma coluna `date` do banco.
 *
 * As contas (somar dias, diferença) são feitas em UTC ao meio-dia, para que
 * a mudança de horário de verão nunca faça um dia "sumir" ou "repetir".
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const pad = (number) => String(number).padStart(2, '0');

/** Chave do dia (local) de uma data. */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toUtcNoon(key) {
  const [year, month, day] = key.split('-').map(Number);
  return Date.UTC(year, month - 1, day, 12);
}

function fromUtc(ms) {
  const date = new Date(ms);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Soma (ou subtrai, se negativo) dias a uma chave. */
export const addDays = (key, days) => fromUtc(toUtcNoon(key) + days * MS_PER_DAY);

/** Quantos dias vão de `from` até `to` (positivo se `to` for depois). */
export const daysBetween = (from, to) => Math.round((toUtcNoon(to) - toUtcNoon(from)) / MS_PER_DAY);

/** Dia da semana: 0 = domingo … 6 = sábado. */
export const weekdayOf = (key) => new Date(toUtcNoon(key)).getUTCDay();
