/**
 * Escolhe "o item do dia" (palavra do dia, curiosidade do dia…).
 *
 * É determinístico: no mesmo dia devolve sempre o mesmo item, e no dia
 * seguinte passa ao próximo. Não precisa de guardar nada nem de servidor.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Número de dias desde 1/1/1970, usando a data LOCAL do aluno. */
export function dayNumber(date) {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
}

/** Item da lista para a data indicada (ou null se a lista estiver vazia). */
export function pickDaily(list, date = new Date()) {
  if (list.length === 0) return null;
  return list[dayNumber(date) % list.length];
}
