/**
 * Como juntar o progresso DESTE aparelho com o que está na CONTA (nuvem).
 * Lógica pura, sem rede — por isso dá para testar tudo.
 *
 * Regras (pensadas para nunca perder progresso):
 *  - Estações: fica a união das duas listas. Se a mesma estação existe nos
 *    dois lados, fica a MELHOR pontuação; em empate, o registro mais recente.
 *    As tentativas ficam com o maior número.
 *  - Palavras aprendidas: união (uma palavra aprendida em qualquer aparelho
 *    conta como aprendida).
 *  - Nível: o da conta vence; se a conta ainda não tem nível, vale o local.
 */

const ratio = (record) => record.correct / (record.total || 1);

/** Escolhe o melhor de dois registros da mesma estação. */
export function pickBetterRecord(a, b) {
  if (!a) return b;
  if (!b) return a;
  const winner =
    ratio(a) !== ratio(b)
      ? ratio(a) > ratio(b)
        ? a
        : b
      : new Date(a.completedAt) >= new Date(b.completedAt)
        ? a
        : b;
  return { ...winner, attempts: Math.max(a.attempts ?? 1, b.attempts ?? 1) };
}

/** Junta dois mapas { idDaEstação: registro }. */
export function mergeStations(local = {}, remote = {}) {
  const ids = new Set([...Object.keys(local), ...Object.keys(remote)]);
  return Object.fromEntries([...ids].map((id) => [id, pickBetterRecord(local[id], remote[id])]));
}

/** Estações que a nuvem precisa receber (novas ou melhores do que as de lá). */
export function stationsToUpload(merged, remote = {}) {
  return Object.entries(merged)
    .filter(([id, record]) => {
      const current = remote[id];
      return (
        !current ||
        current.correct !== record.correct ||
        current.total !== record.total ||
        current.completedAt !== record.completedAt ||
        (current.attempts ?? 1) !== (record.attempts ?? 1)
      );
    })
    .map(([id]) => id);
}

export const mergeWords = (local = [], remote = []) => [...new Set([...local, ...remote])].sort();

export const wordsToUpload = (merged, remote = []) => {
  const inCloud = new Set(remote);
  return merged.filter((id) => !inCloud.has(id));
};

export const mergeLevel = (localLevel, remoteLevel) => remoteLevel ?? localLevel ?? null;

/* Conversão entre o formato do banco (linhas) e o formato local (mapa). */

export function rowsToStations(rows = []) {
  return Object.fromEntries(
    rows.map((row) => [
      row.station_id,
      {
        completedAt: new Date(row.completed_at).toISOString(),
        correct: row.correct,
        total: row.total,
        attempts: row.attempts,
      },
    ]),
  );
}

export function stationToRow(userId, stationId, record) {
  return {
    user_id: userId,
    station_id: stationId,
    completed_at: record.completedAt,
    correct: record.correct,
    total: record.total,
    attempts: record.attempts ?? 1,
  };
}

/* ───────── Flashcards ───────── */
/*
 * Cartões: se o mesmo cartão foi revisto nos dois aparelhos, vale a revisão
 * MAIS RECENTE (é ela que sabe quando o cartão deve voltar).
 */

export function mergeCardStates(local = {}, remote = {}) {
  const ids = new Set([...Object.keys(local), ...Object.keys(remote)]);
  return Object.fromEntries(
    [...ids].map((id) => {
      const a = local[id];
      const b = remote[id];
      if (!a || !b) return [id, a ?? b];
      return [id, new Date(a.reviewedAt) >= new Date(b.reviewedAt) ? a : b];
    }),
  );
}

export const cardsToUpload = (merged, remote = {}) =>
  Object.keys(merged).filter((id) => remote[id]?.reviewedAt !== merged[id].reviewedAt);

export function rowsToCards(rows = []) {
  return Object.fromEntries(
    rows.map((row) => [
      row.card_id,
      {
        reps: row.reps,
        interval: row.interval_days,
        ease: Number(row.ease),
        due: row.due_on,
        lapses: row.lapses,
        added: row.added_on,
        reviewedAt: new Date(row.reviewed_at).toISOString(),
      },
    ]),
  );
}

export function cardToRow(userId, cardId, state) {
  return {
    user_id: userId,
    card_id: cardId,
    reps: state.reps,
    interval_days: state.interval,
    ease: state.ease,
    due_on: state.due,
    lapses: state.lapses,
    added_on: state.added,
    reviewed_at: state.reviewedAt,
  };
}

/* ───────── Dias de estudo ───────── */
/*
 * Dias: fica o MAIOR valor de cada campo. Não somamos os dois lados porque,
 * depois de uma sincronização, os dois lados têm o mesmo número — somar
 * contaria o mesmo estudo duas vezes.
 */

export function mergeStudyDays(local = {}, remote = {}) {
  const days = new Set([...Object.keys(local), ...Object.keys(remote)]);
  return Object.fromEntries(
    [...days].map((day) => {
      const a = local[day] ?? { minutes: 0, cards: 0, lessons: 0 };
      const b = remote[day] ?? { minutes: 0, cards: 0, lessons: 0 };
      return [
        day,
        {
          minutes: Math.max(a.minutes, b.minutes),
          cards: Math.max(a.cards, b.cards),
          lessons: Math.max(a.lessons, b.lessons),
        },
      ];
    }),
  );
}

export const daysToUpload = (merged, remote = {}) =>
  Object.keys(merged).filter((day) => {
    const current = remote[day];
    const record = merged[day];
    return (
      !current ||
      current.minutes !== record.minutes ||
      current.cards !== record.cards ||
      current.lessons !== record.lessons
    );
  });

export function rowsToStudyDays(rows = []) {
  return Object.fromEntries(
    rows.map((row) => [
      row.day,
      { minutes: Number(row.minutes), cards: row.cards, lessons: row.lessons },
    ]),
  );
}

export const studyDayToRow = (userId, day, record) => ({
  user_id: userId,
  day,
  minutes: record.minutes,
  cards: record.cards,
  lessons: record.lessons,
});

/** Meta diária: como o nível, a da conta vence. */
export const mergeGoal = (localGoal, remoteGoal) => remoteGoal ?? localGoal ?? null;
