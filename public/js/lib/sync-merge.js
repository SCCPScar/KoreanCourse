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
