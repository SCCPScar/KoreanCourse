/**
 * Progresso do percurso: salva as estações concluídas.
 *
 * Formato pensado para sincronizar com a conta (Supabase) mais tarde:
 * cada estação guarda a própria data (completedAt), então dá para juntar o
 * progresso de dois aparelhos ficando com o registro mais recente de cada uma.
 */
import { readJSON, writeJSON } from './storage.js';

const COURSE_PROGRESS_KEY = 'course-progress';
const CHANGE_EVENT = 'haru:progresschange';

export function getCourseProgress() {
  const progress = readJSON(COURSE_PROGRESS_KEY, null);
  return progress && typeof progress.stations === 'object' ? progress : { stations: {} };
}

/** Marca uma estação como concluída. Guarda a MELHOR pontuação entre as tentativas. */
export function completeStation(stationId, { correct, total }, now = new Date()) {
  const progress = getCourseProgress();
  const previous = progress.stations[stationId];
  const isBetter = !previous || correct / (total || 1) >= previous.correct / (previous.total || 1);

  progress.stations[stationId] = {
    completedAt: now.toISOString(),
    correct: isBetter ? correct : previous.correct,
    total: isBetter ? total : previous.total,
    attempts: (previous?.attempts ?? 0) + 1,
  };
  writeJSON(COURSE_PROGRESS_KEY, progress);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: stationId }));
  return progress;
}

/** Troca o progresso inteiro (usado ao baixar os dados da conta). */
export function replaceCourseProgress(stations) {
  writeJSON(COURSE_PROGRESS_KEY, { stations });
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

export function onCourseProgressChange(callback) {
  document.addEventListener(CHANGE_EVENT, callback);
}
